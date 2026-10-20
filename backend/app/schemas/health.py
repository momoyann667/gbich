"""GBICH'APP — Health Check Response Schemas.
"""

from typing import Dict, Any, Optional
from pydantic import BaseModel, Field


class ServiceStatus(BaseModel):
    status: str = Field(..., description="Status string: 'healthy', 'degraded', or 'unreachable'")
    latency_ms: Optional[float] = Field(None, description="Response latency in milliseconds")
    details: Optional[str] = Field(None, description="Diagnostic details or error message")


class HealthCheckResponse(BaseModel):
    status: str = Field(..., description="'ok' when fully operational, 'degraded' otherwise")
    project: str = Field(..., description="Project name")
    version: str = Field(..., description="API Version")
    environment: str = Field(..., description="Current environment")
    services: Dict[str, ServiceStatus] = Field(
        ..., description="Status breakdown of external services (PostgreSQL, Redis, Storage)"
    )
