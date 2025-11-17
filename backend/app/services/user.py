from app.db.models import User, Service, Client, Supplier, Contract
from app.core.auth import hash_password, verify_password
from sqlalchemy.orm import Session
import uuid
from datetime import datetime, timedelta, timezone


def get_user_by_email(email: str, db: Session) -> User | None:
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(user_id: int, db: Session) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def create_user(email: str, name: str, password: str, db: Session) -> User:
    hashed_password = hash_password(password)
    user = User(email=email, name=name, hashed_password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_demo_user(db: Session) -> User:
    demo_email = f"demo_{uuid.uuid4().hex}@demoemail.com"
    demo_user = User(
        email=demo_email,
        name="Demo Guest",
        hashed_password=hash_password("demo_password"),
        is_demo=True,
        demo_expiration=datetime.now(timezone.utc) + timedelta(seconds=20),
    )
    db.add(demo_user)
    db.commit()
    db.refresh(demo_user)
    return demo_user


def authenticate_user(email: str, password: str, db: Session) -> User | None:
    user = get_user_by_email(email, db=db)
    if user and verify_password(password, user.hashed_password):
        return user
    return None


def delete_user(user_id: int, db: Session) -> bool:
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
        return True
    return False


def update_user(user_id: int, db: Session, **kwargs) -> User | None:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None

    if "password" in kwargs:
        kwargs["hashed_password"] = hash_password(kwargs.pop("password"))

    for key, value in kwargs.items():
        if hasattr(user, key) and value is not None:
            setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user
