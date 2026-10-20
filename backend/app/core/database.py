"""GBICH'APP — Database Connection and Async Session Management.

SQLAlchemy 2.0 async engine and sessionmaker using asyncpg driver.
"""

from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from app.core.config import settings
from app.core.logging import logger

# Initialize async engine with connection pooling and fast connection timeout
engine = create_async_engine(
    settings.ASYNC_DATABASE_URL,
    echo=settings.POSTGRES_ECHO_SQL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    connect_args={
        "command_timeout": 3.0,
        "timeout": 3.0,
    },
)

# Async session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for obtaining an asynchronous database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception as exc:
            await session.rollback()
            logger.error(f"Database session error: {exc}")
            raise
        finally:
            await session.close()
