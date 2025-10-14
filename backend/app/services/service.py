from app.db.models import User, Service, Client, Supplier, Contract
from app.db.session import SessionLocal
from app.core.auth import hash_password, verify_password


def create_service(
    user_id: int,
    name: str,
    cost: float,
    price: float,
    description: str,
    periodicity: str,
    supplier_id: int | None = None,
    status: bool = True,
) -> Service:
    with SessionLocal() as db:
        service = Service(
            user_id=user_id,
            supplier_id=supplier_id,
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


def get_service_by_id(service_id: int, user_id: int) -> Service | None:
    with SessionLocal() as db:
        return (
            db.query(Service)
            .filter(Service.id == service_id, Service.user_id == user_id)
            .first()
        )


def get_service_by_name(name: str, user_id: int) -> Service | None:
    with SessionLocal() as db:
        return (
            db.query(Service)
            .filter(Service.name == name, Service.user_id == user_id)
            .first()
        )


def get_services_by_user(user_id: int) -> list[Service]:
    with SessionLocal() as db:
        return db.query(Service).filter(Service.user_id == user_id).all()


def update_service(service_id: int, user_id: int, **kwargs) -> Service | None:
    with SessionLocal() as db:
        service = (
            db.query(Service)
            .filter(Service.id == service_id, Service.user_id == user_id)
            .first()
        )

        if not service:
            return None

        for key, value in kwargs.items():
            setattr(service, key, value)

        db.commit()
        db.refresh(service)
        return service


def delete_service(service_id: int, user_id: int) -> bool:
    with SessionLocal() as db:
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


def toggle_service_status(service_id: int, user_id: int) -> Service | None:
    with SessionLocal() as db:
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
