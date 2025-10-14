from fastapi import APIRouter, Depends, HTTPException, status
from app.core.auth import get_current_user
from app.models.user import User
from app.schemas.client import CreateClientRequest, ResponseClient
from app.schemas.response import ResponseSchema
from app.services import client as client_service
from sqlalchemy.exc import IntegrityError

router = APIRouter(prefix="/clients", tags=["clients"])


@router.post("/", response_model=ResponseSchema)
def create_client(
    client: CreateClientRequest, current_user: User = Depends(get_current_user)
) -> ResponseSchema:

    try:
        created_client = client_service.create_client(
            user_id=current_user.id,
            name=client.name,
            email=client.email,
            phone=client.phone,
            address=client.address,
        )
        response = ResponseClient.from_model(created_client)
    except IntegrityError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Client with this email already exists",
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Client creation failed",
        )

    return ResponseSchema(
        success=True,
        message="Client created successfully",
        data=response,
    )


@router.get("/", response_model=ResponseSchema)
def get_all_clients(current_user: User = Depends(get_current_user)) -> ResponseSchema:

    clients = client_service.get_client_by_user(user_id=current_user.id)
    if not clients:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No clients found"
        )

    response = [ResponseClient.from_model(client) for client in clients]
    return ResponseSchema(
        success=True,
        message="Clients retrieved successfully",
        data=response,
    )


@router.get("/{client_id}", response_model=ResponseSchema)
def get_client_by_id(
    client_id: int, current_user: User = Depends(get_current_user)
) -> ResponseSchema:

    client = client_service.get_client_by_id(
        client_id=client_id, user_id=current_user.id
    )

    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Client not found"
        )

    response = ResponseClient.from_model(client)
    return ResponseSchema(
        success=True,
        message="Client retrieved successfully",
        data=response,
    )


@router.get("/", response_model=ResponseSchema)
def get_client_by_email(
    email: str, current_user: User = Depends(get_current_user)
) -> ResponseSchema:

    client = client_service.get_client_by_email(email=email, user_id=current_user.id)
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Client not found"
        )

    response = ResponseClient.from_model(client)
    return ResponseSchema(
        success=True,
        message="Client retrieved successfully",
        data=response,
    )


@router.put("/{client_id}", response_model=ResponseSchema)
def update_client(
    client_id: int,
    client: CreateClientRequest,
    current_user: User = Depends(get_current_user),
) -> ResponseSchema:

    updated_client = client_service.update_client(
        client_id=client_id,
        user_id=current_user.id,
        name=client.name,
        email=client.email,
        phone=client.phone,
        address=client.address,
    )

    if not updated_client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Client not found"
        )

    response = ResponseClient.from_model(updated_client)
    return ResponseSchema(
        success=True,
        message="Client updated successfully",
        data=response,
    )


@router.patch("/{client_id}/toggle-status", response_model=ResponseSchema)
def toggle_client_status(
    client_id: int, current_user: User = Depends(get_current_user)
) -> ResponseSchema:

    updated_client = client_service.toggle_client_status(
        client_id=client_id, user_id=current_user.id
    )
    if not updated_client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Client not found"
        )

    response = ResponseClient.from_model(updated_client)
    return ResponseSchema(
        success=True,
        message="Client status toggled successfully",
        data=response,
    )


@router.delete("/{client_id}", response_model=ResponseSchema)
def delete_client(
    client_id: int, current_user: User = Depends(get_current_user)
) -> ResponseSchema:

    try:
        success = client_service.delete_client(
            client_id=client_id, user_id=current_user.id
        )

    except IntegrityError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete client due to existing dependencies",
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Client deletion failed",
        )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Client not found"
        )

    return ResponseSchema(
        success=True,
        message="Client deleted successfully",
    )
