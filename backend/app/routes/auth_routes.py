from fastapi import APIRouter, HTTPException, status
from app.services import user as user_service
from app.schemas.user import ResponseUser, CreateUserRequest, LoginUserRequest
from app.core.auth import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
def login(user_in: LoginUserRequest):

    user = user_service.authenticate_user(user_in.email, user_in.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register")
def register(user_in: CreateUserRequest):

    user_exists = user_service.get_user_by_email(user_in.email)
    if user_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists"
        )

    user = user_service.create_user(user_in.email, user_in.name, user_in.password)
    response = ResponseUser.from_model(user)

    return {
        "success": True,
        "message": "User registered successfully",
        "data": response,
    }
