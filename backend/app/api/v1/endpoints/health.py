"""GBICH'APP — Health Check Endpoint.

Verifies operational status of the API, PostgreSQL, Redis, and Object Storage.
"""

import asyncio
import time
from fastapi import APIRouter
from sqlalchemy import text
from app.core.config import settings
from app.core.database import AsyncSessionLocal
from app.core.redis import get_redis
from app.core.storage import get_minio_client
from app.schemas.health import HealthCheckResponse, ServiceStatus

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthCheckResponse,
    summary="Vérification de l'état de santé du système",
    description="Retourne le statut global de l'API et la connectivité aux services (PostgreSQL, Redis, MinIO).",
)
async def check_health() -> HealthCheckResponse:
    services = {}
    is_healthy = True

    # 1. PostgreSQL Check
    pg_start = time.perf_counter()
    try:
        async def _query_pg():
            async with AsyncSessionLocal() as session:
                await session.execute(text("SELECT 1"))

        await asyncio.wait_for(_query_pg(), timeout=3.0)
        latency = round((time.perf_counter() - pg_start) * 1000, 2)
        services["postgresql"] = ServiceStatus(
            status="healthy",
            latency_ms=latency,
            details="Connected to PostgreSQL 16 via asyncpg",
        )
    except Exception as exc:
        latency = round((time.perf_counter() - pg_start) * 1000, 2)
        services["postgresql"] = ServiceStatus(
            status="unreachable",
            latency_ms=latency,
            details=f"PostgreSQL connection failed: {str(exc)}",
        )
        is_healthy = False

    # 2. Redis Check
    redis_start = time.perf_counter()
    try:
        redis_client = await get_redis()
        if redis_client is not None:
            await redis_client.ping()
            latency = round((time.perf_counter() - redis_start) * 1000, 2)
            services["redis"] = ServiceStatus(
                status="healthy",
                latency_ms=latency,
                details="Connected to Redis 7.2",
            )
        else:
            services["redis"] = ServiceStatus(
                status="unreachable",
                latency_ms=round((time.perf_counter() - redis_start) * 1000, 2),
                details="Redis client is not initialized",
            )
            is_healthy = False
    except Exception as exc:
        latency = round((time.perf_counter() - redis_start) * 1000, 2)
        services["redis"] = ServiceStatus(
            status="unreachable",
            latency_ms=latency,
            details=f"Redis connection failed: {str(exc)}",
        )
        is_healthy = False

    # 3. MinIO / S3 Check
    minio_start = time.perf_counter()
    try:
        client = get_minio_client()
        if client is not None:
            # Check if bucket exists or list buckets to test connectivity
            client.bucket_exists(settings.MINIO_BUCKET_NAME)
            latency = round((time.perf_counter() - minio_start) * 1000, 2)
            services["minio"] = ServiceStatus(
                status="healthy",
                latency_ms=latency,
                details=f"Bucket '{settings.MINIO_BUCKET_NAME}' verified",
            )
        else:
            services["minio"] = ServiceStatus(
                status="unreachable",
                latency_ms=round((time.perf_counter() - minio_start) * 1000, 2),
                details="MinIO client is not initialized",
            )
    except Exception as exc:
        latency = round((time.perf_counter() - minio_start) * 1000, 2)
        services["minio"] = ServiceStatus(
            status="degraded",
            latency_ms=latency,
            details=f"MinIO check warning: {str(exc)}",
        )

    return HealthCheckResponse(
        status="ok" if is_healthy else "degraded",
        project=settings.PROJECT_NAME,
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        services=services,
    )
