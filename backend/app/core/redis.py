"""GBICH'APP — Redis Connection Management.
"""

from typing import Optional
import redis.asyncio as aioredis
from app.core.config import settings
from app.core.logging import logger

redis_client: Optional[aioredis.Redis] = None


async def init_redis() -> aioredis.Redis:
    """Initialize the Redis async client."""
    global redis_client
    try:
        redis_client = aioredis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
            socket_timeout=5.0,
            socket_connect_timeout=5.0,
        )
        await redis_client.ping()
        logger.info("Connected to Redis successfully.")
    except Exception as exc:
        logger.warning(f"Could not connect to Redis at startup: {exc}")
    return redis_client


async def close_redis() -> None:
    """Close the Redis async connection."""
    global redis_client
    if redis_client is not None:
        await redis_client.aclose()
        logger.info("Redis connection closed.")


async def get_redis() -> Optional[aioredis.Redis]:
    """Dependency / accessor for Redis client."""
    return redis_client
