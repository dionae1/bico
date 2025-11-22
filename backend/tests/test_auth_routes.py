from fastapi import status
from factories.user import UserFactory

from fastapi import status
from factories.user import UserFactory

from conftest import URL_PREFIX


def test_create_user(client):
    user = UserFactory.build()
    payload = {"name": user.name, "email": user.email, "password": "1234"}
    response = client.post(f"{URL_PREFIX}/auth/register/", json=payload)

    assert response.status_code in (status.HTTP_201_CREATED, status.HTTP_200_OK)
    data = response.json()
    assert data["email"] == payload["email"]
    assert "id" in data


def test_register_duplicate(client):
    existing = UserFactory()
    payload = {"name": existing.name, "email": existing.email, "password": "1234"}
    response = client.post(f"{URL_PREFIX}/auth/register/", json=payload)

    assert response.status_code == status.HTTP_409_CONFLICT


def test_login(client):
    user = UserFactory()
    response = client.post(
        f"{URL_PREFIX}/auth/login/",
        json={"email": user.email, "password": "1234"},
    )
    assert response.status_code == status.HTTP_200_OK
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


def test_login_invalid_credentials(client):
    response = client.post(
        f"{URL_PREFIX}/auth/login/",
        json={"email": "invalid@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
