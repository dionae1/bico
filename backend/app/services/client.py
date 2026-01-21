from app.db.models import Client
from sqlalchemy.orm import Session

import uuid


def create_client(
    db: Session,
    user_id: uuid.UUID,
    name: str,
    email: str,
    phone: str,
    address: str,
    status: bool = True,
) -> Client:
    
    client = Client(
        user_id=user_id,
        name=name,
        email=email,
        phone=phone,
        address=address,
        status=status,
    )
    db.add(client)
    db.commit()
    db.refresh(client)
    return client


def get_client_by_id(client_id: uuid.UUID, user_id: uuid.UUID, db: Session) -> Client | None:
    return (
        db.query(Client)
        .filter(Client.id == client_id, Client.user_id == user_id)
        .first()
    )


def get_client_by_name(name: str, user_id: uuid.UUID, db: Session) -> list[Client] | None:
    return db.query(Client).filter(Client.name == name, Client.user_id == user_id).all()


def get_client_by_email(email: str, user_id: uuid.UUID, db: Session) -> Client | None:
    return (
        db.query(Client)
        .filter(Client.email == email, Client.user_id == user_id)
        .first()
    )


def get_client_by_user(user_id: uuid.UUID, db: Session) -> list[Client]:
    return db.query(Client).filter(Client.user_id == user_id).all()


def update_client(client_id: uuid.UUID, user_id: uuid.UUID, db: Session, **kwargs) -> Client | None:
    client = (
        db.query(Client)
        .filter(Client.id == client_id, Client.user_id == user_id)
        .first()
    )

    if not client:
        return None

    for key, value in kwargs.items():
        if hasattr(client, key) and value is not None:
            setattr(client, key, value)

    db.commit()
    db.refresh(client)
    return client


def delete_client(client_id: uuid.UUID, user_id: uuid.UUID, db: Session) -> bool:
    client = (
        db.query(Client)
        .filter(Client.id == client_id, Client.user_id == user_id)
        .first()
    )
    if not client:
        return False

    db.delete(client)
    db.commit()
    return True


def toggle_client_status(client_id: uuid.UUID, user_id: uuid.UUID, db: Session) -> Client | None:
    client = (
        db.query(Client)
        .filter(Client.id == client_id, Client.user_id == user_id)
        .first()
    )

    if not client:
        return None

    client.status = not client.status
    db.commit()
    db.refresh(client)
    return client
