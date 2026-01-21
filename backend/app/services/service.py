from app.db.models import Service
from sqlalchemy.orm import Session

import uuid


def create_service(
    db: Session,
    user_id: uuid.UUID,
    name: str,
    cost: float,
    price: float,
    description: str,
    periodicity: str,
    status: bool = True,
) -> Service:

    service = Service(
        user_id=user_id,
        name=name,
        cost=cost,
        price=price,
        description=description,
        periodicity=periodicity,
        status=status,
    )

    db.add(service)
    db.commit()
    db.refresh(service)
    return service


def get_service_by_id(service_id: uuid.UUID, user_id: uuid.UUID, db: Session) -> Service | None:
    return (
        db.query(Service)
        .filter(Service.id == service_id, Service.user_id == user_id)
        .first()
    )


def get_service_by_name(name: str, user_id: uuid.UUID, db: Session) -> Service | None:
    return (
        db.query(Service)
        .filter(Service.name == name, Service.user_id == user_id)
        .first()
    )


def get_services_by_user(user_id: uuid.UUID, db: Session) -> list[Service]:
    return db.query(Service).filter(Service.user_id == user_id).all()


def update_service(service_id: uuid.UUID, user_id: uuid.UUID, db: Session, **kwargs) -> Service | None:
    service = (
        db.query(Service)
        .filter(Service.id == service_id, Service.user_id == user_id)
        .first()
    )

    if not service:
        return None

    for key, value in kwargs.items():
        if hasattr(service, key) and value is not None:
            setattr(service, key, value)

    db.commit()
    db.refresh(service)
    return service


def delete_service(service_id: uuid.UUID, user_id: uuid.UUID, db: Session) -> bool:
    service = (
        db.query(Service)
        .filter(Service.id == service_id, Service.user_id == user_id)
        .first()
    )

    if not service:
        return False

    db.delete(service)
    db.commit()
    return True


def toggle_service_status(service_id: uuid.UUID, user_id: uuid.UUID, db: Session) -> Service | None:
    service = (
        db.query(Service)
        .filter(Service.id == service_id, Service.user_id == user_id)
        .first()
    )

    if not service:
        return None

    service.status = not service.status
    db.commit()
    db.refresh(service)
    return service
