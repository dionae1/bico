from fastapi import status
from conftest import URL_PREFIX


def test_get_user_me(client_user):
    response = client_user.get(f"{URL_PREFIX}/users/me")
    print(response.json())
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == client_user.user.email
    assert data["name"] == client_user.user.name


def test_delete_user(client_user):
    user_id = client_user.user.id
    response = client_user.delete(f"{URL_PREFIX}/users/{user_id}")
    assert response.status_code == status.HTTP_204_NO_CONTENT

    response = client_user.get(f"{URL_PREFIX}/users/me")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_update_user(client_user):
    user_id = client_user.user.id
    new_data = {"name": "Updated Name", "email": "updated@example.com"}
    response = client_user.put(f"{URL_PREFIX}/users/{user_id}", json=new_data)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["name"] == new_data["name"]
    assert data["email"] == new_data["email"]
