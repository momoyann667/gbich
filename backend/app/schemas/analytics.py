"""GBICH'APP — Analytics & Geolocation Schemas.
"""

from datetime import datetime
from typing import Optional
import uuid
from pydantic import BaseModel, Field


class LocationPingRequest(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Latitude décimale")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Longitude décimale")
    accuracy: Optional[float] = Field(None, description="Précision estimée en mètres")
    device_type: Optional[str] = Field("mobile_pwa", description="Type d'appareil (mobile_pwa, ios, android, desktop)")
    city: Optional[str] = Field(None, description="Ville ou quartier détecté")
    country: Optional[str] = Field(None, description="Pays détecté (ex: Côte d'Ivoire)")


class LocationPointResponse(BaseModel):
    id: uuid.UUID
    latitude: float
    longitude: float
    accuracy: Optional[float] = None
    device_type: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class LocationPingResponse(BaseModel):
    success: bool = True
    message: str = "Position enregistrée avec succès pour la carte du djassa !"
    point_id: Optional[uuid.UUID] = None
