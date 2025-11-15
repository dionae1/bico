from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
import os
import jwt

from app.services import user as user_service
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY") or "generic_secret_key"
ALGORITHM = os.getenv("ALGORITHM") or "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


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


def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    try:
        if not ALGORITHM or not SECRET_KEY:
            raise AssertionError("Missing JWT configuration")

        payload = jwt.decode(jwt=token, key=SECRET_KEY, algorithms=[ALGORITHM])
        user_id_str = payload.get("sub")

        if user_id_str is None:
            raise CredentialsException()

        user_id = int(user_id_str)

    except jwt.exceptions.PyJWTError:
        raise CredentialsException()

    user = user_service.get_user_by_id(user_id)

    if user is None:
        raise CredentialsException()

    return user


class CredentialsException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
