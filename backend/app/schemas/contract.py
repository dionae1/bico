from datetime import datetime
from pydantic import BaseModel

from app.models.contract import Contract
from app.schemas.service import ResponseService
from app.schemas.client import ResponseClient

from app.models.client import Client
from app.models.service import Service


class ResponseContract(BaseModel):
    id: int
    user_id: int
    client_id: int
    service_id: int
    created_at: datetime
    end_at: datetime
    value: float
    status: bool

    @classmethod
    def from_model(cls, contract: Contract) -> "ResponseContract":
        return cls(
            id=contract.id,
            user_id=contract.user_id,
            client_id=contract.client_id,
            service_id=contract.service_id,
            created_at=contract.created_at,
            end_at=contract.end_at,
            value=contract.value,
            status=contract.status,
        )


class CompleteResponseContract(BaseModel):
    id: int
    user_id: int
    created_at: datetime
    end_at: datetime
    value: float
    status: bool
    client: ResponseClient
    service: ResponseService

    @classmethod
    def from_model(
        cls, contract: Contract, client: Client, service: Service
    ) -> "CompleteResponseContract":
        return cls(
            id=contract.id,
            user_id=contract.user_id,
            created_at=contract.created_at,
            end_at=contract.end_at,
            value=contract.value,
            status=contract.status,
            client=ResponseClient.from_model(client),
            service=ResponseService.from_model(service),
        )


class CreateContract(BaseModel):
    client_id: int
    service_id: int
    created_at: datetime
    end_at: datetime
    value: float


class UpdateContract(BaseModel):
    end_at: datetime
    value: float
