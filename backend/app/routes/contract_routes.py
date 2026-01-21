from app.schemas.contract import (
    CompleteResponseContract,
    ResponseContract,
    CreateContract,
    UpdateContract,
)

from app.models.user import User
from app.services import contract as contract_service
from app.core.auth import get_current_user

from fastapi import APIRouter, Depends, HTTPException, status
from app.db.session import get_db
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
import uuid


router = APIRouter(prefix="/contracts", tags=["contracts"])


@router.post("/", response_model=ResponseContract, status_code=status.HTTP_201_CREATED)
def create_contract(
    contract: CreateContract,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ResponseContract:

    try:
        created_contract = contract_service.create_contract(
            user_id=current_user.id,
            client_id=contract.client_id,
            service_id=contract.service_id,
            created_at=contract.created_at,
            end_at=contract.end_at,
            value=contract.value,
            db=db,
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
    return response


@router.get(
    "/user",
    response_model=list[CompleteResponseContract],
    status_code=status.HTTP_200_OK,
)
def get_contracts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[CompleteResponseContract]:

    contracts = contract_service.get_contracts_by_user(current_user.id, db=db)

    if not contracts:
        raise HTTPException(status_code=404, detail="No contracts found")

    response = [
        CompleteResponseContract.from_model(
            item["contract"], item["client"], item["service"]
        )
        for item in contracts
    ]

    return response


@router.get(
    "/client/{client_id}",
    response_model=list[CompleteResponseContract],
    status_code=status.HTTP_200_OK,
)
def get_contracts_by_client(
    client_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[CompleteResponseContract]:

    contracts = contract_service.get_contracts_by_client(
        client_id=client_id, user_id=current_user.id, db=db
    )

    if not contracts:
        raise HTTPException(status_code=404, detail="No contracts found")

    response = [
        CompleteResponseContract.from_model(
            item["contract"], item["client"], item["service"]
        )
        for item in contracts
    ]

    return response


@router.get(
    "/{contract_id}",
    response_model=CompleteResponseContract,
    status_code=status.HTTP_200_OK,
)
def get_contract(
    contract_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> CompleteResponseContract:

    contract = contract_service.get_contract_by_id(
        contract_id=contract_id, user_id=current_user.id, db=db
    )

    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")

    response = CompleteResponseContract.from_model(
        contract[0], contract[1], contract[2]
    )
    return response


@router.delete(
    "/{contract_id}",
    response_model=None,
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_contract(
    contract_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:

    success = contract_service.delete_contract(
        contract_id=contract_id, user_id=current_user.id, db=db
    )

    if not success:
        raise HTTPException(status_code=404, detail="Contract not found")

    return None


@router.put(
    "/{contract_id}",
    response_model=ResponseContract,
    status_code=status.HTTP_200_OK,
)
def update_contract(
    contract_id: uuid.UUID,
    contract: UpdateContract,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ResponseContract:

    updated_contract = contract_service.update_contract(
        contract_id=contract_id,
        user_id=current_user.id,
        **contract.model_dump(exclude_unset=True),
        db=db,
    )

    if not updated_contract:
        raise HTTPException(status_code=404, detail="Contract not found")

    response = ResponseContract.from_model(updated_contract)
    return response


@router.patch(
    "/{contract_id}/toggle-status",
    response_model=ResponseContract,
    status_code=status.HTTP_200_OK,
)
def toggle_contract_status(
    contract_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ResponseContract:

    contract = contract_service.toggle_contract_status(
        contract_id=contract_id, user_id=current_user.id, db=db
    )

    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")

    response = ResponseContract.from_model(contract)
    return response
