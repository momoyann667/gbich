"""GBICH'APP — Authentication Endpoints (Login & Session).
"""

from datetime import timedelta
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.core.logging import logger
from app.core.security import verify_password, hash_password, create_access_token
from app.models.entities import User
from app.schemas.auth import LoginRequest, TokenResponse, UserProfileResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

# In-memory backup seed users for local development / offline resilience
MOCK_USERS = [
    {
        "id": "11111111-2222-3333-4444-555555555555",
        "username": "Zokou",
        "email": "zokou@gbich.ci",
        "phone_number": "0707070707",
        "password_hash": hash_password("gbich2026"),
        "role": "reader",
        "avatar_slug": "avatar_zokou",
        "preferred_lang": "fr",
        "is_active": True,
    },
    {
        "id": "22222222-3333-4444-5555-666666666666",
        "username": "CauphyGombo",
        "email": "cauphy@gbich.ci",
        "phone_number": "0101010101",
        "password_hash": hash_password("gombo2026"),
        "role": "editor",
        "avatar_slug": "avatar_cauphy",
        "preferred_lang": "fr",
        "is_active": True,
    },
]


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Connexion utilisateur (Email, Téléphone ou Username)",
)
async def login(
    login_data: LoginRequest,
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    """Authentifie un utilisateur avec son email, téléphone ou nom d'utilisateur.
    
    Vérifie l'existence en base de données PostgreSQL avec fallback transparent.
    """
    clean_identifier = login_data.identifier.strip()
    matched_user: Optional[User] = None
    db_available = False

    # 1. Tentative d'interrogation de la base de données PostgreSQL
    try:
        query = select(User).where(
            or_(
                User.email == clean_identifier,
                User.phone_number == clean_identifier,
                User.username == clean_identifier,
            )
        )
        result = await db.execute(query)
        matched_user = result.scalar_one_or_none()
        db_available = True
    except Exception as exc:
        logger.warning(
            f"DB query inaccessible ({exc}). Fallback sur le registre de développement."
        )

    # 2. Si l'utilisateur est trouvé dans PostgreSQL
    if matched_user is not None:
        if not matched_user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Ce compte est actuellement suspendu. Y'a drap !",
            )

        # Vérification du mot de passe
        if not verify_password(login_data.password, matched_user.password_hash or ""):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Mot de passe incorrect ! La chicotte n'est pas loin, réessaye !",
            )

        expires_delta = (
            timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
            if login_data.remember_me
            else timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )

        token = create_access_token(
            data={
                "sub": str(matched_user.id),
                "username": matched_user.username,
                "role": matched_user.role,
            },
            expires_delta=expires_delta,
        )

        return TokenResponse(
            access_token=token,
            token_type="bearer",
            user=UserProfileResponse(
                id=str(matched_user.id),
                username=matched_user.username,
                email=matched_user.email,
                phone_number=matched_user.phone_number,
                role=matched_user.role,
                avatarSlug=matched_user.avatar_slug or "avatar_default",
                preferredLang=matched_user.preferred_lang or "fr",
            ),
            message="BIENVENUE DANS LE DJASSA ! 🎉",
        )

    # 3. Fallback registre de développement / mock si DB absente ou utilisateur seed
    for mock_u in MOCK_USERS:
        if clean_identifier in (
            mock_u["email"],
            mock_u["phone_number"],
            mock_u["username"],
        ):
            if verify_password(login_data.password, mock_u["password_hash"]):
                token = create_access_token(
                    data={
                        "sub": mock_u["id"],
                        "username": mock_u["username"],
                        "role": mock_u["role"],
                    }
                )
                return TokenResponse(
                    access_token=token,
                    token_type="bearer",
                    user=UserProfileResponse(
                        id=mock_u["id"],
                        username=mock_u["username"],
                        email=mock_u["email"],
                        phone_number=mock_u["phone_number"],
                        role=mock_u["role"],
                        avatarSlug=mock_u["avatar_slug"],
                        preferredLang=mock_u["preferred_lang"],
                    ),
                    message="BIENVENUE DANS LE DJASSA ! 🎉",
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Mot de passe incorrect pour ce compte ! Vérifie ton mot de passe !",
                )

    # 4. Si non trouvé nulle part
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=(
            f"Gaou détecté ! L'identifiant « {clean_identifier} » n'existe pas encore en base. "
            "Vérifie tes coordonnées ou inscris-toi !"
        ),
    )
