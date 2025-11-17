from datetime import datetime
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(100), unique=True)
    name: Mapped[str] = mapped_column(String(100))
    hashed_password: Mapped[str] = mapped_column(String(100))
    is_demo: Mapped[bool] = mapped_column(
        Boolean, default=False, server_default="false"
    )
    demo_expiration: Mapped[datetime | None] = mapped_column(nullable=True)

    # Relationships
    services: Mapped[list["Service"]] = relationship("Service", back_populates="user")
    contracts: Mapped[list["Contract"]] = relationship(
        "Contract", back_populates="user"
    )

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', name='{self.name}')>"
