from app.db.base import Base

from datetime import datetime
from sqlalchemy import Float, DateTime, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid


class Contract(Base):
    __tablename__ = "contracts"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, index=True, default=uuid.uuid4)
    service_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("services.id"), index=True)
    client_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("clients.id"), index=True)
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    end_at: Mapped[datetime] = mapped_column(DateTime)
    status: Mapped[bool] = mapped_column(default=True)
    value: Mapped[float] = mapped_column(Float)

    # Relationships
    service: Mapped["Service"] = relationship("Service", back_populates="contracts")
    client: Mapped["Client"] = relationship("Client", back_populates="contracts")
    user: Mapped["User"] = relationship("User", back_populates="contracts")
