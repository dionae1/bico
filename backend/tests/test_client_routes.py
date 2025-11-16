from fastapi import status
from conftest import URL_PREFIX
from factories.client import ClientFactory


def test_create_client(client_user):
    client = ClientFactory.build()
    payload = {
        "name": client.name,
        "email": client.email,
        "phone": client.phone,
        "address": client.address,
    }
    response = client_user.post(f"{URL_PREFIX}/clients/", json=payload)
    assert response.status_code == status.HTTP_201_CREATED


def test_duplicate_client_creation(client_user):
    client = ClientFactory()
    payload = {
        "name": client.name,
        "email": client.email,
        "phone": client.phone,
        "address": client.address,
    }
    response = client_user.post(f"{URL_PREFIX}/clients/", json=payload)
    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_get_all_clients(client_user):
    client = ClientFactory.build()
    client_2 = ClientFactory.build()

    payload_1 = {
        "name": client.name,
        "email": client.email,
        "phone": client.phone,
        "address": client.address,
    }
    payload_2 = {
        "name": client_2.name,
        "email": client_2.email,
        "phone": client_2.phone,
        "address": client_2.address,
    }

    client_user.post(f"{URL_PREFIX}/clients/", json=payload_1)
    client_user.post(f"{URL_PREFIX}/clients/", json=payload_2)
    response = client_user.get(f"{URL_PREFIX}/clients/")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 2


def test_get_all_clients_no_clients(client_user):
    response = client_user.get(f"{URL_PREFIX}/clients/")
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_get_client_by_id(client_user):
    client = ClientFactory.build()
    payload = {
        "name": client.name,
        "email": client.email,
        "phone": client.phone,
        "address": client.address,
    }
    create_response = client_user.post(f"{URL_PREFIX}/clients/", json=payload)
    client_id = create_response.json()["id"]

    response = client_user.get(f"{URL_PREFIX}/clients/{client_id}")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == client_id
    assert data["name"] == client.name


def test_get_client_by_id_not_found(client_user):
    response = client_user.get(f"{URL_PREFIX}/clients/9999")
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_delete_client(client_user):
    client = ClientFactory.build()
    payload = {
        "name": client.name,
        "email": client.email,
        "phone": client.phone,
        "address": client.address,
    }
    create_response = client_user.post(f"{URL_PREFIX}/clients/", json=payload)
    client_id = create_response.json()["id"]

    delete_response = client_user.delete(f"{URL_PREFIX}/clients/{client_id}")
    assert delete_response.status_code == status.HTTP_204_NO_CONTENT

    get_response = client_user.get(f"{URL_PREFIX}/clients/{client_id}")
    assert get_response.status_code == status.HTTP_404_NOT_FOUND


def test_delete_client_not_found(client_user):
    response = client_user.delete(f"{URL_PREFIX}/clients/9999")
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_update_client(client_user):
    client = ClientFactory.build()
    payload = {
        "name": client.name,
        "email": client.email,
        "phone": client.phone,
        "address": client.address,
    }
    create_response = client_user.post(f"{URL_PREFIX}/clients/", json=payload)
    client_id = create_response.json()["id"]

    updated_payload = {
        "name": "Updated Name",
        "email": "updated_email@example.com",
    }
    update_response = client_user.put(
        f"{URL_PREFIX}/clients/{client_id}", json=updated_payload
    )
    assert update_response.status_code == status.HTTP_200_OK
    data = update_response.json()
    assert data["id"] == client_id
    assert data["name"] == "Updated Name"
    assert data["email"] == "updated_email@example.com"


def test_toggle_client_status(client_user):
    client = ClientFactory.build()
    payload = {
        "name": client.name,
        "email": client.email,
        "phone": client.phone,
        "address": client.address,
    }
    create_response = client_user.post(f"{URL_PREFIX}/clients/", json=payload)
    client_id = create_response.json()["id"]

    response = client_user.patch(f"{URL_PREFIX}/clients/{client_id}/toggle-status")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["status"] is False

    response = client_user.patch(f"{URL_PREFIX}/clients/{client_id}/toggle-status")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["status"] is True
