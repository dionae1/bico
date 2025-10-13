from fastapi import APIRouter, Depends, HTTPException, status
from app.db.models import Contract
from app.models.user import User
from app.services import contract as contract_service
from app.schemas.contract import (
    CompleteResponseContract,
    ResponseContract,
    CreateContract,
    UpdateContract,
)
from app.schemas.response import ResponseSchema
from app.core.auth import get_current_user
from sqlalchemy.exc import IntegrityError

router = APIRouter(prefix="/contracts", tags=["contracts"])


@router.post("/", response_model=ResponseSchema)
def create_contract(
    contract: CreateContract,
    current_user: User = Depends(get_current_user),
) -> ResponseSchema:
    try:
        created_contract = contract_service.create_contract(
            user_id=current_user.id,
            client_id=contract.client_id,
            service_id=contract.service_id,
            created_at=contract.created_at,
            end_at=contract.end_at,
            value=contract.value,
        )

    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Client or Service not found",
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the contract",
        )

    if not created_contract:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Contract creation failed",
        )

    response = ResponseContract.from_model(created_contract)
    return ResponseSchema(
        success=True,
        message="Contract created successfully",
        data=response,
    )


@router.get("/user", response_model=ResponseSchema)
def get_contracts(current_user: User = Depends(get_current_user)) -> ResponseSchema:
    contracts = contract_service.get_contracts_by_user(current_user.id)

    if not contracts:
        raise HTTPException(status_code=404, detail="No contracts found")

    response = [
        CompleteResponseContract.from_model(
            item["contract"], item["client"], item["service"]
        )
        for item in contracts
    ]

    return ResponseSchema(
        success=True,
        message="Contracts retrieved successfully",
        data=response,
    )


@router.get("/client/{client_id}", response_model=ResponseSchema)
def get_contracts_by_client(
    client_id: int, current_user: User = Depends(get_current_user)
) -> ResponseSchema:
    contracts = contract_service.get_contracts_by_client(client_id)

    if not contracts:
        raise HTTPException(status_code=404, detail="No contracts found")

    response = [ResponseContract.from_model(contract) for contract in contracts]
    return ResponseSchema(
        success=True,
        message="Contracts retrieved successfully",
        data=response,
    )


@router.get("/{contract_id}", response_model=ResponseSchema)
def get_contract(
    contract_id: int, current_user: User = Depends(get_current_user)
) -> ResponseSchema:
    contract = contract_service.get_contract_by_id(contract_id)

    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")

    response = ResponseContract.from_model(contract)
    return ResponseSchema(
        success=True,
        message="Contract retrieved successfully",
        data=response,
    )


@router.delete("/{contract_id}")
def delete_contract(
    contract_id: int, current_user: User = Depends(get_current_user)
) -> ResponseSchema:
    success = contract_service.delete_contract(contract_id)

    if not success:
        raise HTTPException(status_code=404, detail="Contract not found")

    return ResponseSchema(
        success=True,
        message="Contract deleted successfully",
    )


@router.put("/{contract_id}", response_model=ResponseSchema)
def update_contract(
    contract_id: int,
    contract: UpdateContract,
    current_user: User = Depends(get_current_user),
) -> ResponseSchema:
    updated_contract = contract_service.update_contract(
        contract_id,
        end_at=contract.end_at,
        value=contract.value,
    )

    if not updated_contract:
        raise HTTPException(status_code=404, detail="Contract not found")

    response = ResponseContract.from_model(updated_contract)
    return ResponseSchema(
        success=True,
        message="Contract updated successfully",
        data=response,
    )


@router.patch("/{contract_id}/toggle-status", response_model=ResponseSchema)
def toggle_contract_status(
    contract_id: int, current_user: User = Depends(get_current_user)
) -> ResponseSchema:
    contract = contract_service.toggle_contract_status(contract_id)

    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")

    response = ResponseContract.from_model(contract)
    return ResponseSchema(
        success=True,
        message="Contract status toggled successfully",
        data=response,
    )
