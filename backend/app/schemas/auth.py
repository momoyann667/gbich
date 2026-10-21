"""GBICH'APP — Authentication Pydantic Schemas.
"""

from typing import Optional
from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    identifier: str = Field(..., description="Email, Numéro de téléphone ou Nom d'utilisateur")
    password: str = Field(..., min_length=1, description="Mot de passe utilisateur")
    remember_me: bool = Field(True, description="Se souvenir de la session")


class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=2, max_length=50, description="Nom d'artiste / Blaze de vanneur")
    identifier: str = Field(..., min_length=3, description="Numéro WhatsApp/Téléphone ou Email")
    password: str = Field(..., min_length=4, description="Mot de passe utilisateur")
    country_code: str = Field("+225", description="Indicatif pays (défaut +225 Côte d'Ivoire)")
    interests: list[str] = Field(default_factory=list, description="Centres d'intérêt sélectionnés")


class UserProfileResponse(BaseModel):
    id: str
    username: str
    email: Optional[str] = None
    phone_number: Optional[str] = None
    role: str = "reader"
    avatarSlug: str = "avatar_default"
    preferredLang: str = "fr"


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfileResponse
    message: str = "Bienvenue dans le djassa !"
