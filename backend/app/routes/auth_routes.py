from fastapi import APIRouter, HTTPException, Request, status, Depends
from fastapi.responses import JSONResponse
from app.services import user as user_service
from app.schemas.user import ResponseUser, CreateUserRequest, LoginUserRequest
from app.core import auth
from app.db.session import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", status_code=status.HTTP_200_OK)
def login(user_in: LoginUserRequest, db: Session = Depends(get_db)):

    user = user_service.authenticate_user(user_in.email, user_in.password, db=db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    access_token = auth.create_access_token(data={"sub": str(user.id)})
    refresh_token = auth.create_refresh_token(data={"sub": str(user.id)})

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
        secure=True,
        samesite="Lax",
        max_age=24 * 60 * 60,
        path="/api/v1/auth/refresh",
    )
    return response


@router.post("/logout", status_code=status.HTTP_200_OK)
def logout():
    response = JSONResponse({"detail": "Successfully logged out"})
    response.delete_cookie(key="refresh_token", path="/api/v1/auth/refresh")
    return response


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_in: CreateUserRequest, db: Session = Depends(get_db)) -> ResponseUser:

    user_exists = user_service.get_user_by_email(user_in.email, db=db)
    if user_exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="User already exists"
        )

    user = user_service.create_user(
        user_in.email, user_in.name, user_in.password, db=db
    )
    response = ResponseUser.from_model(user)

    return response


@router.post("/demo", status_code=status.HTTP_200_OK)
def demo_login(db: Session = Depends(get_db)):
    demo_user = user_service.get_demo_user(db=db)
    if not demo_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Unable to generate a demo account",
        )

    access_token = auth.create_access_token(data={"sub": str(demo_user.id)})

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.post("/refresh", status_code=status.HTTP_200_OK)
def refresh_token(request: Request, db: Session = Depends(get_db)):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token or not auth.verify_refresh_token(refresh_token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token"
        )
    user = auth.get_current_user(token=refresh_token, db=db)
    access_token = auth.create_access_token(data={"sub": str(user.id)})
    refresh_token = auth.create_refresh_token(data={"sub": str(user.id)})

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
        secure=True,
        samesite="Lax",
        max_age=24 * 60 * 60,
        path="/api/v1/auth/refresh",
    )
    return response
