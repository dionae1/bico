from app.db.models import User, AuthCredentials, Service, Client, Contract
from app.core.auth import hash_password, verify_password
from sqlalchemy.orm import Session
import uuid
from datetime import datetime, timedelta, timezone
from faker import Faker
import random

import uuid


def get_user_by_email(email: str, db: Session) -> User | None:
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(user_id: uuid.UUID, db: Session) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def create_user(
    db: Session,
    email: str,
    name: str,
    password: str | None = None,
    provider: str | None = None,
    provider_user_id: str | None = None,
) -> User:
    hashed_password = hash_password(password) if password else None

    user = User(email=email, name=name)
    db.add(user)
    db.flush()

    auth_credentials = AuthCredentials(
        user_id=user.id,
        provider=provider,
        provider_user_id=provider_user_id,
        hashed_password=hashed_password,
    )

    db.add(auth_credentials)
    db.commit()
    db.refresh(user)
    return user


def get_demo_user(db: Session) -> User:
    demo_email = f"demo_{uuid.uuid4().hex}@email.com"
    demo_user = User(
        email=demo_email,
        name="Guest Account",
        is_demo=True,
        demo_expiration=datetime.now(timezone.utc) + timedelta(seconds=20),
    )
    db.add(demo_user)
    db.commit()
    db.refresh(demo_user)

    demo_clients = []
    for i in range(7):
        client = Client(
            name=Faker().name(),
            email=Faker().email(),
            created_at=datetime.now(timezone.utc) - timedelta(days=30 * (i + 1)),
            phone=random.randint(1000000000, 9999999999),
            address=Faker().address(),
            user_id=demo_user.id,
        )
        demo_clients.append(client)
    db.add_all(demo_clients)

    demo_services = []
    for i in range(5):
        service = Service(
            name=Faker().word().capitalize() + " Service",
            user_id=demo_user.id,
            price=random.uniform(20.0, 120.0),
            cost=random.uniform(20.0, 90.0),
            periodicity=random.choice(["monthly", "yearly", "one-time"]),
        )
        demo_services.append(service)
    db.add_all(demo_services)
    db.commit()

    demo_contracts = []
    for i in range(5):
        contract = Contract(
            client=demo_clients[i % 7],
            service=demo_services[i % 5],
            end_at=datetime.now(timezone.utc) + timedelta(days=15 * (i + 1)),
            created_at=datetime.now(timezone.utc) - timedelta(days=15 * (i + 1)),
            user_id=demo_user.id,
            value=round(demo_services[i].price * random.uniform(1.0, 1.2), 2),
        )
        demo_contracts.append(contract)
    db.add_all(demo_contracts)
    db.commit()
    return demo_user


def get_auth_credentials_by_user_id(
    user_id: uuid.UUID, db: Session
) -> AuthCredentials | None:
    return db.query(AuthCredentials).filter(AuthCredentials.user_id == user_id).first()


def authenticate_user(email: str, password: str, db: Session) -> User | None:
    user = get_user_by_email(email, db=db)
    if not user:
        return None

    auth_credentials = get_auth_credentials_by_user_id(user.id, db=db)
    if not auth_credentials:
        return None

    if verify_password(password, auth_credentials.hashed_password):
        return user

    return None


def authenticate_user_oauth(
    provider: str, provider_user_id: str, db: Session
) -> User | None:
    auth_credentials = (
        db.query(AuthCredentials)
        .filter(
            AuthCredentials.provider == provider,
            AuthCredentials.provider_user_id == provider_user_id,
        )
        .first()
    )

    if not auth_credentials:
        return None

    user = get_user_by_id(auth_credentials.user_id, db=db)
    return user


def delete_user(user_id: uuid.UUID, db: Session) -> bool:
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
        return True
    return False


def update_user(user_id: uuid.UUID, db: Session, **kwargs) -> User | None:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None

    auth_credentials = get_auth_credentials_by_user_id(user.id, db=db)

    if "password" in kwargs:
        kwargs["hashed_password"] = hash_password(kwargs.pop("password"))

    for key, value in kwargs.items():
        if hasattr(user, key) and value is not None:
            setattr(user, key, value)
        elif hasattr(auth_credentials, key) and value is not None:
            setattr(auth_credentials, key, value)

    db.commit()
    db.refresh(user)
    return user
