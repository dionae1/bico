from app.models.client import Client

from pydantic import BaseModel
import uuid


class ResponseClient(BaseModel):
    id: uuid.UUID
    name: str
    email: str | None = None
    phone: str | None = None
    address: str | None = None
    status: bool

    @classmethod
    def from_model(cls, client: Client):
        return cls(
            id=client.id,
            name=client.name,
            email=client.email,
            phone=client.phone,
            address=client.address,
            status=client.status,
        )


class CreateClientRequest(BaseModel):
    name: str
    email: str
    phone: str
    address: str


class UpdateClientRequest(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    address: str | None = None
