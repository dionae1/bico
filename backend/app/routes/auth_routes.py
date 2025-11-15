from fastapi import APIRouter, HTTPException, Request, status, Response
from fastapi.responses import JSONResponse
from app.services import user as user_service
from app.schemas.user import ResponseUser, CreateUserRequest, LoginUserRequest
from app.core.auth import (
    create_access_token,
    create_refresh_token,
    verify_refresh_token,
    get_current_user,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
def login(user_in: LoginUserRequest):

    user = user_service.authenticate_user(user_in.email, user_in.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    response = JSONResponse(
        {
            "access_token": access_token,
            "token_type": "bearer",
        }
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite=None,
        max_age=24 * 60 * 60,
        path="/api/v1/auth/refresh",
    )
    print("Refresh token set in cookie")
    return response


@router.post("/register")
def register(user_in: CreateUserRequest):

    user_exists = user_service.get_user_by_email(user_in.email)
    if user_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists"
        )

    user = user_service.create_user(user_in.email, user_in.name, user_in.password)
    response = ResponseUser.from_model(user)

    return Response(
        status_code=status.HTTP_201_CREATED,
        content=response,
    )


@router.post("/refresh")
def refresh_token(request: Request):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token or not verify_refresh_token(refresh_token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token"
        )

    user = get_current_user(token=refresh_token)
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    response = JSONResponse(
        {
            "access_token": access_token,
            "token_type": "bearer",
        }
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite=None,
        max_age=24 * 60 * 60,
        path="/api/v1/auth/refresh",
    )

    print("Refresh token set in cookie")

    return response
