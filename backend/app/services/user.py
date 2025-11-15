from app.db.models import User, Service, Client, Supplier, Contract
from app.db.session import SessionLocal
from app.core.auth import hash_password, verify_password


def get_user_by_email(email: str) -> User | None:
    with SessionLocal() as db:
        return db.query(User).filter(User.email == email).first()


def get_user_by_id(user_id: int) -> User | None:
    with SessionLocal() as db:
        return db.query(User).filter(User.id == user_id).first()


def create_user(email: str, name: str, password: str) -> User:
    with SessionLocal() as db:
        hashed_password = hash_password(password)
        user = User(email=email, name=name, hashed_password=hashed_password)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user


def authenticate_user(email: str, password: str) -> User | None:
    user = get_user_by_email(email)
    if user and verify_password(password, user.hashed_password):
        return user
    return None


def delete_user(user_id: int) -> bool:
    with SessionLocal() as db:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            db.delete(user)
            db.commit()
            return True
        return False


def update_user(user_id: int, **kwargs) -> User | None:
    with SessionLocal() as db:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return None

        # Handle password hashing specially
        if "password" in kwargs:
            kwargs["hashed_password"] = hash_password(kwargs.pop("password"))

        for key, value in kwargs.items():
            if hasattr(user, key) and value is not None:
                setattr(user, key, value)

        db.commit()
        db.refresh(user)
        return user
