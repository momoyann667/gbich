"""GBICH'APP — Analytics & Geolocation Endpoints for Dashboard Mapping.
"""

from datetime import datetime, timezone
from typing import List, Optional
import uuid
from fastapi import APIRouter, Depends, Request, status
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.logging import logger
from app.core.security import decode_access_token
from app.models.entities import User, UserLocation
from app.schemas.analytics import LocationPingRequest, LocationPingResponse, LocationPointResponse

router = APIRouter(prefix="/analytics", tags=["Analytics & Cartographie"])


@router.post(
    "/location",
    response_model=LocationPingResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Enregistrer la géolocalisation d'un utilisateur / visiteur PWA",
)
async def record_user_location(
    data: LocationPingRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> LocationPingResponse:
    """Enregistre les coordonnées GPS pour la cartographie des zones d'utilisation."""
    user_id: Optional[uuid.UUID] = None
    now = datetime.now(timezone.utc)

    # 1. Tentative d'extraction de l'utilisateur authentifié (s'il est connecté)
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        payload = decode_access_token(token)
        if payload and payload.get("sub"):
            try:
                user_id = uuid.UUID(payload["sub"])
            except ValueError:
                pass

    # 2. Récupération de l'IP cliente
    client_ip = request.client.host if request.client else None

    # 3. Enregistrement dans la table user_locations
    try:
        new_loc = UserLocation(
            id=uuid.uuid4(),
            user_id=user_id,
            latitude=data.latitude,
            longitude=data.longitude,
            accuracy=data.accuracy,
            device_type=data.device_type,
            city=data.city,
            country=data.country,
            ip_address=client_ip,
        )
        db.add(new_loc)

        # Si l'utilisateur est identifié, mettre à jour sa dernière position connue
        if user_id:
            user = await db.get(User, user_id)
            if user:
                user.last_latitude = data.latitude
                user.last_longitude = data.longitude
                user.last_location_at = now

        await db.commit()
        logger.info(
            f"[Analytics] Position enregistrée : ({data.latitude}, {data.longitude}) - "
            f"device={data.device_type}, user={user_id or 'visiteur'}"
        )
        return LocationPingResponse(
            success=True,
            message="Position enregistrée avec succès !",
            point_id=new_loc.id,
        )
    except Exception as exc:
        logger.warning(f"[Analytics] Erreur lors de l'enregistrement de la position : {exc}")
        await db.rollback()
        # Réponse gracieuse même si la DB a eu un hoquet
        return LocationPingResponse(
            success=True,
            message="Position reçue (mode dégradé).",
        )


@router.get(
    "/locations",
    response_model=List[LocationPointResponse],
    summary="Récupérer les points de géolocalisation pour la carte du tableau de bord",
)
async def get_dashboard_locations(
    limit: int = 500,
    db: AsyncSession = Depends(get_db),
) -> List[LocationPointResponse]:
    """Retourne les points de localisation récents pour alimenter la carte du dashboard."""
    try:
        query = select(UserLocation).order_by(desc(UserLocation.created_at)).limit(limit)
        result = await db.execute(query)
        points = result.scalars().all()
        return [
            LocationPointResponse(
                id=p.id,
                latitude=p.latitude,
                longitude=p.longitude,
                accuracy=p.accuracy,
                device_type=p.device_type,
                city=p.city,
                country=p.country,
                created_at=p.created_at,
            )
            for p in points
        ]
    except Exception as exc:
        logger.warning(f"[Analytics] Erreur lecture locations : {exc}")
        return []
