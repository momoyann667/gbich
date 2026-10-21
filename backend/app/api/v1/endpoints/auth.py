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
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserProfileResponse

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


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Inscription nouvel utilisateur (Blaze, Téléphone/Email & Mot de passe)",
)
async def register(
    register_data: RegisterRequest,
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    """Crée un nouveau compte utilisateur GBICH! avec ses centres d'intérêt."""
    clean_username = register_data.username.strip()
    clean_identifier = register_data.identifier.strip()
    clean_password = register_data.password.strip()

    is_email = "@" in clean_identifier
    email_val = clean_identifier if is_email else None
    phone_val = clean_identifier if not is_email else None

    # Si c'est un numéro de téléphone sans indicatif et qu'un indicatif est fourni
    if phone_val and not phone_val.startswith("+"):
        if register_data.country_code:
            phone_val = f"{register_data.country_code}{phone_val}"

    # 1. Tentative d'insertion en base PostgreSQL
    try:
        # Vérification d'unicité dans PostgreSQL
        existing_filters = [User.username.ilike(clean_username)]
        if email_val:
            existing_filters.append(User.email.ilike(email_val))
        if phone_val:
            existing_filters.append(User.phone_number == phone_val)

        query = select(User).where(or_(*existing_filters))
        result = await db.execute(query)
        existing = result.scalar_one_or_none()
        if existing:
            if existing.username.lower() == clean_username.lower():
                detail = "Ce blaze de vanneur est déjà réservé ! Trouve un autre blaze plus chicot !"
            elif email_val and existing.email and existing.email.lower() == email_val.lower():
                detail = "Cet email est déjà associé à un compte. Connecte-toi directement !"
            else:
                detail = "Ce numéro de téléphone est déjà enregistré dans le djassa !"
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=detail,
            )

        new_user = User(
            id=uuid.uuid4(),
            username=clean_username,
            email=email_val,
            phone_number=phone_val,
            password_hash=hash_password(clean_password),
            role="reader",
            avatar_slug="avatar_zokou",
            preferred_lang="fr",
            is_active=True,
            country_code=register_data.country_code or "+225",
            interests=register_data.interests or [],
        )
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)

        token = create_access_token(
            data={"sub": str(new_user.id), "username": new_user.username, "role": new_user.role}
        )
        return TokenResponse(
            access_token=token,
            token_type="bearer",
            user=UserProfileResponse(
                id=str(new_user.id),
                username=new_user.username,
                email=new_user.email,
                phone_number=new_user.phone_number,
                role=new_user.role,
                avatarSlug=new_user.avatar_slug or "avatar_zokou",
                preferredLang=new_user.preferred_lang or "fr",
            ),
            message="COMPTE CRÉÉ AVEC SUCCÈS ! BIENVENUE DANS LA BANDE ! 🎉",
        )
    except HTTPException:
        raise
    except Exception as exc:
        logger.warning(f"DB inaccessible pour l'inscription ({exc}). Fallback sur registre de dev.")

    # 2. Fallback registre mock pour développement / offline
    # Vérification d'unicité dans MOCK_USERS
    for m in MOCK_USERS:
        if m["username"].lower() == clean_username.lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ce blaze de vanneur est déjà réservé ! Trouve un autre blaze plus chicot !",
            )
        if email_val and m["email"] and m["email"].lower() == email_val.lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cet email a déjà un compte. Connecte-toi directement !",
            )
        if phone_val and m["phone_number"] and m["phone_number"] == phone_val:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ce numéro de téléphone est déjà enregistré dans le djassa !",
            )

    new_mock_id = str(uuid.uuid4())
    new_mock_user = {
        "id": new_mock_id,
        "username": clean_username,
        "email": email_val or f"{clean_username.lower().replace(' ', '')}@gbich.ci",
        "phone_number": phone_val or "0700000000",
        "password_hash": hash_password(clean_password),
        "role": "reader",
        "avatar_slug": "avatar_zokou",
        "preferred_lang": "fr",
        "is_active": True,
    }
    MOCK_USERS.append(new_mock_user)

    token = create_access_token(
        data={"sub": new_mock_id, "username": clean_username, "role": "reader"}
    )
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserProfileResponse(
            id=new_mock_id,
            username=clean_username,
            email=new_mock_user["email"],
            phone_number=new_mock_user["phone_number"],
            role="reader",
            avatarSlug="avatar_zokou",
            preferredLang="fr",
        ),
        message="COMPTE CRÉÉ AVEC SUCCÈS ! BIENVENUE DANS LA BANDE ! 🎉",
    )
