from pydantic import BaseModel

from app.models.service import Service


class ResponseService(BaseModel):
    id: int
    supplier_id: int | None = None
    name: str
    description: str | None = None
    price: float
    cost: float | None = None
    periodicity: str
    status: bool

    @classmethod
    def from_model(cls, service: Service) -> "ResponseService":
        return cls(
            id=service.id,
            supplier_id=service.supplier_id,
            name=service.name,
            description=service.description,
            price=service.price,
            cost=service.cost,
            periodicity=service.periodicity,
            status=service.status,
        )


class CreateServiceRequest(BaseModel):
    supplier_id: int | None = None
    name: str
    description: str
    price: float
    cost: float
    periodicity: str


class UpdateServiceRequest(BaseModel):
    name: str
    description: str
    price: float
    cost: float
    periodicity: str
