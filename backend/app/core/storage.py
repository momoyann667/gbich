"""GBICH'APP — MinIO / S3 Storage Client.
"""

from typing import Optional
import urllib3
from minio import Minio
from app.core.config import settings
from app.core.logging import logger

minio_client: Optional[Minio] = None


def get_minio_client() -> Optional[Minio]:
    """Get or initialize synchronous Minio client for media upload / access."""
    global minio_client
    if minio_client is None:
        try:
            http_client = urllib3.PoolManager(
                timeout=urllib3.Timeout(connect=2.0, read=2.0),
                retries=urllib3.Retry(total=1, connect=1),
            )
            minio_client = Minio(
                endpoint=settings.MINIO_ENDPOINT,
                access_key=settings.MINIO_ACCESS_KEY,
                secret_key=settings.MINIO_SECRET_KEY,
                secure=settings.MINIO_SECURE,
                http_client=http_client,
            )
            logger.info("MinIO client configured successfully.")
        except Exception as exc:
            logger.warning(f"MinIO client initialization error: {exc}")
    return minio_client
