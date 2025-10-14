from app.db.models import User, Service, Client, Supplier, Contract
from app.db.session import SessionLocal
from app.core.auth import hash_password, verify_password


def create_client(
    user_id: int, name: str, email: str, phone: str, address: str, status: bool = True
) -> Client:
    with SessionLocal() as db:
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


def get_client_by_id(client_id: int, user_id: int) -> Client | None:
    with SessionLocal() as db:
        return (
            db.query(Client)
            .filter(Client.id == client_id, Client.user_id == user_id)
            .first()
        )


def get_client_by_name(name: str, user_id: int) -> list[Client] | None:
    with SessionLocal() as db:
        return (
            db.query(Client)
            .filter(Client.name == name, Client.user_id == user_id)
            .all()
        )


def get_client_by_email(email: str, user_id: int) -> Client | None:
    with SessionLocal() as db:
        return (
            db.query(Client)
            .filter(Client.email == email, Client.user_id == user_id)
            .first()
        )


def get_client_by_user(user_id: int) -> list[Client]:
    with SessionLocal() as db:
        return db.query(Client).filter(Client.user_id == user_id).all()


def update_client(client_id: int, user_id: int, **kwargs) -> Client | None:
    with SessionLocal() as db:
        client = (
            db.query(Client)
            .filter(Client.id == client_id, Client.user_id == user_id)
            .first()
        )

        if not client:
            return None

        for key, value in kwargs.items():
            setattr(client, key, value)

        db.commit()
        db.refresh(client)
        return client


def delete_client(client_id: int, user_id: int) -> bool:
    with SessionLocal() as db:
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


def toggle_client_status(client_id: int, user_id: int) -> Client | None:
    with SessionLocal() as db:
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
