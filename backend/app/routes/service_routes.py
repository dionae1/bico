from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.user import User
from app.services import service as services_
from app.core.auth import get_current_user
from app.db.session import get_db

from app.schemas.service import (
    ResponseService,
    CreateServiceRequest,
    UpdateServiceRequest,
)

router = APIRouter(prefix="/services", tags=["services"])


@router.post("/", response_model=ResponseService, status_code=status.HTTP_201_CREATED)
def create_service(
    service: CreateServiceRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ResponseService:

    created_service = services_.create_service(
        user_id=current_user.id,
        name=service.name,
        description=service.description,
        price=service.price,
        cost=service.cost,
        periodicity=service.periodicity,
        supplier_id=service.supplier_id,
        db=db,
    )
    if not created_service:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Service creation failed"
        )

    response = ResponseService.from_model(created_service)
    return response


@router.get("/", response_model=list[ResponseService], status_code=status.HTTP_200_OK)
def get_services(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> list[ResponseService]:

    services = services_.get_services_by_user(user_id=current_user.id, db=db)
    if not services:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No services found"
        )

    response = [ResponseService.from_model(service) for service in services]
    return response


@router.get(
    "/{service_id}", response_model=ResponseService, status_code=status.HTTP_200_OK
)
def get_service(
    service_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ResponseService:

    service = services_.get_service_by_id(
        service_id=service_id, user_id=current_user.id, db=db
    )
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Service not found"
        )

    response = ResponseService.from_model(service)
    return response


@router.put(
    "/{service_id}", response_model=ResponseService, status_code=status.HTTP_200_OK
)
def update_service(
    service_id: int,
    service: UpdateServiceRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ResponseService:

    updated_service = services_.update_service(
        service_id=service_id,
        user_id=current_user.id,
        name=service.name,
        description=service.description,
        price=service.price,
        cost=service.cost,
        periodicity=service.periodicity,
        db=db,
    )
    if not updated_service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Service not found"
        )

    response = ResponseService.from_model(updated_service)
    return response


@router.patch(
    "/{service_id}/toggle-status",
    response_model=ResponseService,
    status_code=status.HTTP_200_OK,
)
def toggle_service_status(
    service_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ResponseService:

    toggled_service = services_.toggle_service_status(
        service_id=service_id, user_id=current_user.id, db=db
    )
    if not toggled_service:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to toggle service status",
        )

    response = ResponseService.from_model(toggled_service)
    return response


@router.delete(
    "/{service_id}", response_model=None, status_code=status.HTTP_204_NO_CONTENT
)
def delete_service(
    service_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:

    try:
        success = services_.delete_service(
            service_id=service_id, user_id=current_user.id, db=db
        )

    except IntegrityError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete service due to existing dependencies",
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Service deletion failed",
        )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Service not found"
        )

    return None
