from datetime import datetime
from sqlalchemy.engine import Row
from app.db.models import Service, Client, Contract
from sqlalchemy.orm import Session

import uuid


def create_contract(
    user_id: uuid.UUID,
    service_id: uuid.UUID,
    client_id: uuid.UUID,
    created_at: datetime,
    end_at: datetime,
    value: float,
    db: Session,
) -> Contract:
    
    contract = Contract(
        user_id=user_id,
        service_id=service_id,
        client_id=client_id,
        created_at=created_at,
        end_at=end_at,
        value=value,
    )
    db.add(contract)
    db.commit()
    db.refresh(contract)
    return contract


def get_contract_by_id(contract_id: uuid.UUID, user_id: uuid.UUID, db: Session) -> Row[tuple[Contract, Client, Service]] | None:
    contract = (
        db.query(Contract, Client, Service)
        .filter(Contract.id == contract_id, Contract.user_id == user_id)
        .join(Client, Contract.client_id == Client.id)
        .join(Service, Contract.service_id == Service.id)
        .first()
    )
    return contract


def get_contracts_by_client(client_id: uuid.UUID, user_id: uuid.UUID, db: Session) -> list[dict]:
    contracts = (
        db.query(Contract, Client, Service)
        .filter(Contract.client_id == client_id, Contract.user_id == user_id)
        .join(Client, Contract.client_id == Client.id)
        .join(Service, Contract.service_id == Service.id)
        .all()
    )

    clients_services = []
    for contract, client, service in contracts:
        clients_services.append(
            {"contract": contract, "client": client, "service": service}
        )

    return clients_services


def get_contracts_by_user(user_id: uuid.UUID, db: Session) -> list[dict]:
    contracts = (
        db.query(Contract, Client, Service)
        .filter(Contract.user_id == user_id)
        .join(Client, Contract.client_id == Client.id)
        .join(Service, Contract.service_id == Service.id)
        .all()
    )

    clients_services = []
    for contract, client, service in contracts:
        clients_services.append(
            {"contract": contract, "client": client, "service": service}
        )

    return clients_services


def update_contract(contract_id: uuid.UUID, user_id: uuid.UUID, db: Session, **kwargs) -> Contract | None:
    contract = (
        db.query(Contract)
        .filter(Contract.id == contract_id, Contract.user_id == user_id)
        .first()
    )

    if contract:
        for key, value in kwargs.items():
            if hasattr(contract, key) and value is not None:
                setattr(contract, key, value)

        db.commit()
        db.refresh(contract)
        return contract
    
    return None


def delete_contract(contract_id: uuid.UUID, user_id: uuid.UUID, db: Session) -> bool:
    contract = (
        db.query(Contract)
        .filter(Contract.id == contract_id, Contract.user_id == user_id)
        .first()
    )

    if contract:
        db.delete(contract)
        db.commit()
        return True
    return False


def toggle_contract_status(contract_id: uuid.UUID, user_id: uuid.UUID, db: Session) -> Contract | None:
    contract = (
        db.query(Contract)
        .filter(Contract.id == contract_id, Contract.user_id == user_id)
        .first()
    )

    if contract:
        contract.status = not contract.status
        db.commit()
        db.refresh(contract)
        return contract
    return None
