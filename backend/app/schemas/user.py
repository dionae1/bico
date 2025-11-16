from pydantic import BaseModel

from app.models.user import User


class ResponseUser(BaseModel):
    id: int
    email: str
    name: str

    @classmethod
    def from_model(cls, user: User) -> "ResponseUser":
        return cls(id=user.id, email=user.email, name=user.name)


class CreateUserRequest(BaseModel):
    email: str
    name: str
    password: str


class LoginUserRequest(BaseModel):
    email: str
    password: str


class UpdateUserRequest(BaseModel):
    email: str | None = None
    name: str | None = None
    password: str | None = None
