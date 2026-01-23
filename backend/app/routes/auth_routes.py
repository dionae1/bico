from app.services import user as user_service
from app.schemas.user import ResponseUser, CreateUserRequest, LoginUserRequest
from app.core import auth
from app.db.session import get_db
from app.core.config import settings

from fastapi import APIRouter, HTTPException, Request, Depends, Response, status
from fastapi.responses import JSONResponse, RedirectResponse
from sqlalchemy.orm import Session


router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/generate-url")
async def generate_oauth_url():
    oauth_url = settings.REDIRECT_URI
    return {"oauth_url": oauth_url}


@router.get("/oauth/google/callback")
async def google_oauth_callback(code: str, state: str, db: Session = Depends(get_db)):
    try:
        token_response = await auth.exchange_code_for_token(
            code=code,
            google_client_id=settings.GOOGLE_CLIENT_ID,
            google_client_secret=settings.GOOGLE_CLIENT_SECRET,
            google_redirect_uri=settings.GOOGLE_CALLBACK_URI,
        )

        id_token = token_response.get("id_token")
        if not id_token:
            return RedirectResponse(
                url=f"{settings.FRONTEND_URL}/auth/callback?error=no_token"
            )

        external_user_info = auth.verify_google_id_token(
            id_token_str=id_token,
            google_client_id=settings.GOOGLE_CLIENT_ID,
        )

        name = external_user_info.get("name")
        email = external_user_info.get("email")
        provider_user_id = external_user_info.get("sub")
        if not name or not email or not provider_user_id:
            return RedirectResponse(
                url=f"{settings.FRONTEND_URL}/auth/callback?error=incomplete_info"
            )

        user = auth.get_user_from_google_token(
            name=name,
            email=email,
            provider_user_id=provider_user_id,
            db=db,
        )

        if not user:
            return RedirectResponse(
                url=f"{settings.FRONTEND_URL}/auth/callback?error=user_creation_failed"
            )

        access_token = auth.create_access_token(data={"sub": str(user.id)})
        refresh_token = auth.create_refresh_token(data={"sub": str(user.id)})

        redirect_url = f"{settings.FRONTEND_URL}/auth/callback?token={access_token}"
        response = RedirectResponse(url=redirect_url)
        
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=settings.COOKIE_SECURE,
            samesite="lax",
            max_age=24 * 60 * 60 * 7,
            path="/",
        )

        return response
    
    except Exception as e:
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/auth/callback?error=authentication_failed"
        )


@router.post("/login", status_code=status.HTTP_200_OK)
def login(response: Response, user_in: LoginUserRequest, db: Session = Depends(get_db)):
    user = user_service.authenticate_user(user_in.email, user_in.password, db=db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    access_token = auth.create_access_token(data={"sub": str(user.id)})
    refresh_token = auth.create_refresh_token(data={"sub": str(user.id)})

    json_res = JSONResponse(
        {
            "access_token": access_token,
            "token_type": "bearer",
        }
    )

    json_res.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        max_age=24 * 60 * 60 * 7,
        path="/",
    )

    return json_res


@router.post("/logout", status_code=status.HTTP_200_OK)
def logout(response: Response):
    response.delete_cookie(
        key="refresh_token",
        path="/",
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
    )
    return {"detail": "Successfully logged out"}


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_in: CreateUserRequest, db: Session = Depends(get_db)) -> ResponseUser:
    user_exists = user_service.get_user_by_email(user_in.email, db=db)
    if user_exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="User already exists"
        )

    user = user_service.create_user(
        email=user_in.email, name=user_in.name, password=user_in.password, db=db
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
def refresh_token(request: Request, response: Response, db: Session = Depends(get_db)):
    refresh_token = request.cookies.get("refresh_token")

    if not refresh_token or not auth.verify_refresh_token(refresh_token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token"
        )
    user = auth.get_current_user(token=refresh_token, db=db)
    access_token = auth.create_access_token(data={"sub": str(user.id)})
    refresh_token = auth.create_refresh_token(data={"sub": str(user.id)})

    json_res = JSONResponse(
        {
            "access_token": access_token,
            "token_type": "bearer",
        }
    )

    json_res.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        max_age=24 * 60 * 60 * 7,
        path="/",
    )

    return json_res
