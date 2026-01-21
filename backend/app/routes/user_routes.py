from app.db.models import User
from app.services import user as user_service
from app.schemas.user import ResponseUser, CreateUserRequest, UpdateUserRequest
from app.core.auth import get_current_user
from app.db.session import get_db

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid


router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=ResponseUser, status_code=status.HTTP_201_CREATED)
def create_user(
    user: CreateUserRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ResponseUser:

    created_user = user_service.create_user(user.email, user.name, user.password, db=db)

    if not created_user:
        raise HTTPException(status_code=400, detail="User creation failed")

    response = ResponseUser.from_model(created_user)
    return response


@router.get("/me", response_model=ResponseUser, status_code=status.HTTP_200_OK)
def get_user_me(current_user: User = Depends(get_current_user)) -> ResponseUser:
    response = ResponseUser.from_model(current_user)
    return response


@router.delete(
    "/{user_id}", response_model=None, status_code=status.HTTP_204_NO_CONTENT
)
def delete_user(
    user_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    success = user_service.delete_user(user_id, db=db)

    if not success:
        raise HTTPException(status_code=404, detail="User not found")

    return None


@router.put("/{user_id}", response_model=ResponseUser, status_code=status.HTTP_200_OK)
def update_user(
    user_id: uuid.UUID,
    user: UpdateUserRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ResponseUser:

    if current_user.id != user_id:
        raise HTTPException(
            status_code=403, detail="Not authorized to update this user"
        )

    updated_user = user_service.update_user(
        user_id,
        **user.model_dump(exclude_unset=True),
        db=db,
    )

    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")

    response = ResponseUser.from_model(updated_user)
    return response
