from app.db.base import Base

from datetime import datetime
from sqlalchemy import ForeignKey, String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, index=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(100), unique=True)
    name: Mapped[str] = mapped_column(String(100))
    is_demo: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    demo_expiration: Mapped[datetime | None] = mapped_column(nullable=True)

    # Relationships
    services: Mapped[list["Service"]] = relationship("Service", back_populates="user")
    contracts: Mapped[list["Contract"]] = relationship("Contract", back_populates="user")
    auth_credentials: Mapped[list["AuthCredentials"]] = relationship("AuthCredentials", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', name='{self.name}')>"


class AuthCredentials(Base):
    __tablename__ = "auth_credentials"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, index=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    provider: Mapped[str] = mapped_column(String(50), nullable=True)
    provider_user_id: Mapped[str] = mapped_column(String(100), nullable=True)
    hashed_password: Mapped[str] = mapped_column(String(100), nullable=True)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="auth_credentials")

    def __repr__(self):
        return f"<AuthCredentials(id={self.id}, user_id={self.user_id}, provider='{self.provider}')>"