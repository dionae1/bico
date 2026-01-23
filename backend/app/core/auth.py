from app.core.config import settings
from app.services import user as user_service
from app.db.session import get_db
from app.models.user import User

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests
import bcrypt
import httpx
import uuid
import jwt


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM


def hash_password(password: str) -> str:
    password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode(
        "utf-8"
    )
    return password_hash


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=60))
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(days=1))
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_refresh_token(token: str) -> bool:
    try:
        payload = jwt.decode(jwt=token, key=SECRET_KEY, algorithms=ALGORITHM)
        if payload.get("type") != "refresh":
            return False
        return True
    except jwt.exceptions.PyJWTError:
        return False


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> User:
    try:
        if not ALGORITHM or not SECRET_KEY:
            raise AssertionError("Missing JWT configuration")

        payload = jwt.decode(jwt=token, key=SECRET_KEY, algorithms=[ALGORITHM])
        user_id_str = payload.get("sub")

        if user_id_str is None:
            raise CredentialsException()

        user_id = uuid.UUID(user_id_str)

    except jwt.exceptions.PyJWTError:
        raise CredentialsException()

    user = user_service.get_user_by_id(user_id, db=db)

    if user is None:
        raise CredentialsException()

    return user


async def exchange_code_for_token(
    code: str,
    google_client_id: str,
    google_client_secret: str,
    google_redirect_uri: str,
) -> dict:
    token_url = "https://oauth2.googleapis.com/token"
    token_data = {
        "code": code,
        "client_id": google_client_id,
        "client_secret": google_client_secret,
        "redirect_uri": google_redirect_uri,
        "grant_type": "authorization_code",
    }

    async with httpx.AsyncClient() as client:
        token_response = await client.post(token_url, data=token_data)
        token_response.raise_for_status()
        return token_response.json()


def verify_google_id_token(id_token_str: str, google_client_id: str):
    return id_token.verify_oauth2_token(
        id_token_str, requests.Request(), google_client_id
    )


def get_user_from_google_token(name: str, email: str, provider_user_id: str, db: Session) -> User | None:
    user = user_service.get_user_by_email(email, db=db)
    if user:
        return user
    
    user = user_service.create_user(
        db=db,
        email=email,
        name=name,
        provider="google",
        provider_user_id=provider_user_id,
    )
    
    return user


class CredentialsException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
