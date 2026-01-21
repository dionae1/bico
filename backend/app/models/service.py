from app.db.base import Base

from sqlalchemy import String, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid

class Service(Base):
    __tablename__ = "services"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, index=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    name: Mapped[str] = mapped_column(String(100))
    cost: Mapped[float] = mapped_column(Float, nullable=True, default=0.0)
    price: Mapped[float] = mapped_column(Float)
    description: Mapped[str] = mapped_column(String(200), nullable=True)
    periodicity: Mapped[str] = mapped_column(String(50))
    status: Mapped[bool] = mapped_column(default=True)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="services")
    contracts: Mapped[list["Contract"]] = relationship(
        "Contract", back_populates="service"
    )
