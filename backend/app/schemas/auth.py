"""GBICH'APP — Authentication Pydantic Schemas.
"""

from typing import Optional
from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    identifier: str = Field(..., description="Email, Numéro de téléphone ou Nom d'utilisateur")
    password: str = Field(..., min_length=1, description="Mot de passe utilisateur")
    remember_me: bool = Field(True, description="Se souvenir de la session")


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
