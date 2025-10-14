from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from app.db.models import Service
from app.models.user import User
from app.services import service as services_
from app.schemas.service import (
    ResponseService,
    CreateServiceRequest,
    UpdateServiceRequest,
)
from app.schemas.response import ResponseSchema
from app.core.auth import get_current_user

router = APIRouter(prefix="/services", tags=["services"])


@router.post("/", response_model=ResponseSchema)
def create_service(
    service: CreateServiceRequest, current_user: User = Depends(get_current_user)
) -> ResponseSchema:

    created_service = services_.create_service(
        user_id=current_user.id,
        name=service.name,
        description=service.description,
        price=service.price,
        cost=service.cost,
        periodicity=service.periodicity,
        supplier_id=service.supplier_id,
    )
    if not created_service:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Service creation failed"
        )

    response = ResponseService.from_model(created_service)
    return ResponseSchema(
        success=True,
        message="Service created successfully",
        data=response,
    )


@router.get("/", response_model=ResponseSchema)
def get_services(current_user: User = Depends(get_current_user)) -> ResponseSchema:

    services = services_.get_services_by_user(user_id=current_user.id)
    if not services:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No services found"
        )

    response = [ResponseService.from_model(service) for service in services]
    return ResponseSchema(
        success=True,
        message="Services retrieved successfully",
        data=response,
    )


@router.get("/{service_id}", response_model=ResponseSchema)
def get_service(
    service_id: int, current_user: User = Depends(get_current_user)
) -> ResponseSchema:

    service = services_.get_service_by_id(
        service_id=service_id, user_id=current_user.id
    )
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Service not found"
        )

    response = ResponseService.from_model(service)
    return ResponseSchema(
        success=True,
        message="Service retrieved successfully",
        data=response,
    )


@router.put("/{service_id}", response_model=ResponseSchema)
def update_service(
    service_id: int,
    service: UpdateServiceRequest,
    current_user: User = Depends(get_current_user),
) -> ResponseSchema:

    updated_service = services_.update_service(
        service_id=service_id,
        user_id=current_user.id,
        name=service.name,
        description=service.description,
        price=service.price,
        cost=service.cost,
        periodicity=service.periodicity,
    )
    if not updated_service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Service not found"
        )

    response = ResponseService.from_model(updated_service)
    return ResponseSchema(
        success=True,
        message="Service updated successfully",
        data=response,
    )


@router.patch("/{service_id}/toggle-status", response_model=ResponseSchema)
def toggle_service_status(
    service_id: int, current_user: User = Depends(get_current_user)
) -> ResponseSchema:

    toggled_service = services_.toggle_service_status(
        service_id=service_id, user_id=current_user.id
    )
    if not toggled_service:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to toggle service status",
        )

    response = ResponseService.from_model(toggled_service)
    return ResponseSchema(
        success=True,
        message="Service status toggled successfully",
        data=response,
    )


@router.delete("/{service_id}", response_model=ResponseSchema)
def delete_service(
    service_id: int, current_user: User = Depends(get_current_user)
) -> ResponseSchema:

    try:
        success = services_.delete_service(
            service_id=service_id, user_id=current_user.id
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

    return ResponseSchema(
        success=True,
        message="Service deleted successfully",
    )
