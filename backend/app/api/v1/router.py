"""GBICH'APP — API v1 Root Router.
"""

from fastapi import APIRouter
from app.api.v1.endpoints import health, auth, analytics

api_v1_router = APIRouter()

# Health & Diagnostics
api_v1_router.include_router(health.router, tags=["Health"])

# Authentication & Session
api_v1_router.include_router(auth.router)

# Analytics & Cartographie des zones
api_v1_router.include_router(analytics.router)

