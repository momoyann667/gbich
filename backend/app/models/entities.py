"""GBICH'APP — Core Data Models according to Architecture Specification.
"""

import uuid
from datetime import date, datetime
from typing import Optional, List, Any
from sqlalchemy import (
    String,
    Text,
    Boolean,
    Integer,
    ForeignKey,
    Date,
    DateTime,
    UniqueConstraint,
    Index,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    email: Mapped[Optional[str]] = mapped_column(
        String(255), unique=True, nullable=True
    )
    phone_number: Mapped[Optional[str]] = mapped_column(
        String(20), unique=True, nullable=True
    )
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    password_hash: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True
    )
    avatar_slug: Mapped[str] = mapped_column(
        String(50), default="avatar_default", nullable=False
    )
    preferred_lang: Mapped[str] = mapped_column(
        String(5), default="fr", nullable=False
    )
    role: Mapped[str] = mapped_column(
        String(20), default="reader", nullable=False
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False
    )
    country_code: Mapped[Optional[str]] = mapped_column(
        String(10), default="+225", nullable=True
    )
    interests: Mapped[Any] = mapped_column(
        JSONB, default=list, nullable=True
    )


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    name_fr: Mapped[str] = mapped_column(String(100), nullable=False)
    name_en: Mapped[str] = mapped_column(String(100), nullable=False)


class Content(Base, TimestampMixin):
    __tablename__ = "contents"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    category_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("categories.id", ondelete="RESTRICT"), nullable=False
    )
    content_type: Mapped[str] = mapped_column(String(30), nullable=False)
    title_fr: Mapped[str] = mapped_column(String(255), nullable=False)
    title_en: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    body_text_fr: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    body_text_en: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    author_artist: Mapped[str] = mapped_column(String(100), nullable=False)
    media_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    media_thumbnail_url: Mapped[Optional[str]] = mapped_column(
        String(500), nullable=True
    )
    media_width: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    media_height: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    is_published: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )
    published_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    __table_args__ = (
        Index("idx_contents_feed", "is_published", "published_at"),
    )


class FactCheck(Base):
    __tablename__ = "fact_checks"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    content_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("contents.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    claim_evaluated: Mapped[str] = mapped_column(Text, nullable=False)
    verdict: Mapped[str] = mapped_column(String(30), nullable=False)
    explanation_fr: Mapped[str] = mapped_column(Text, nullable=False)
    explanation_en: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    sources_json: Mapped[Any] = mapped_column(JSONB, default=list)


class GameSession(Base):
    __tablename__ = "game_sessions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    game_type: Mapped[str] = mapped_column(String(30), nullable=False)
    target_date: Mapped[date] = mapped_column(Date, nullable=False)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    public_payload: Mapped[Any] = mapped_column(JSONB, nullable=False)
    secret_solutions: Mapped[Any] = mapped_column(JSONB, nullable=False)
    is_active: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False
    )

    __table_args__ = (
        UniqueConstraint("game_type", "target_date", name="unique_game_per_day"),
        Index("idx_game_sessions_date", "target_date", "game_type"),
    )


class UserGameScore(Base):
    __tablename__ = "user_game_scores"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    game_session_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("game_sessions.id", ondelete="CASCADE"),
        nullable=False,
    )
    score: Mapped[int] = mapped_column(Integer, nullable=False)
    duration_seconds: Mapped[int] = mapped_column(Integer, nullable=False)
    completed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )

    __table_args__ = (
        UniqueConstraint(
            "user_id", "game_session_id", name="unique_user_game_session"
        ),
    )
