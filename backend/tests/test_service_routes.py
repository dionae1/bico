from factories.service import ServiceFactory
from conftest import URL_PREFIX
from fastapi import status
import uuid


def test_create_service(client_user):
    service = ServiceFactory.build()
    payload = {
        "name": service.name,
        "description": service.description,
        "price": float(service.price),
        "cost": float(service.cost),
        "periodicity": service.periodicity,
    }
    response = client_user.post(f"{URL_PREFIX}/services/", json=payload)
    assert response.status_code == status.HTTP_201_CREATED


def test_get_services(client_user):
    service = ServiceFactory.build()
    payload = {
        "name": service.name,
        "description": service.description,
        "price": float(service.price),
        "cost": float(service.cost),
        "periodicity": service.periodicity,
    }
    client_user.post(f"{URL_PREFIX}/services/", json=payload)
    response = client_user.get(f"{URL_PREFIX}/services/")
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), list)


def test_get_service_by_id(client_user):
    service = ServiceFactory.build()
    payload = {
        "name": service.name,
        "description": service.description,
        "price": float(service.price),
        "cost": float(service.cost),
        "periodicity": service.periodicity,
    }
    create_response = client_user.post(f"{URL_PREFIX}/services/", json=payload)
    service_id = create_response.json()["id"]
    response = client_user.get(f"{URL_PREFIX}/services/{service_id}")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["id"] == service_id


def test_get_service_by_invalid_id(client_user):
    response = client_user.get(f"{URL_PREFIX}/services/{uuid.uuid4()}")
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_update_service(client_user):
    service = ServiceFactory.build()
    payload = {
        "name": service.name,
        "description": service.description,
        "price": float(service.price),
        "cost": float(service.cost),
        "periodicity": service.periodicity,
    }
    create_response = client_user.post(f"{URL_PREFIX}/services/", json=payload)
    service_id = create_response.json()["id"]

    update_payload = {
        "name": f"Updated {service.name}",
        "description": f"Updated {service.description}",
        "price": float(service.price) + 10,
        "cost": float(service.cost) + 5,
        "periodicity": "monthly",
    }
    response = client_user.put(
        f"{URL_PREFIX}/services/{service_id}", json=update_payload
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["name"] == update_payload["name"]
    assert response.json()["description"] == update_payload["description"]
    assert response.json()["price"] == update_payload["price"]
    assert response.json()["cost"] == update_payload["cost"]
    assert response.json()["periodicity"] == update_payload["periodicity"]


def test_toggle_service_status(client_user):
    service = ServiceFactory.build()
    payload = {
        "name": service.name,
        "description": service.description,
        "price": float(service.price),
        "cost": float(service.cost),
        "periodicity": service.periodicity,
    }
    create_response = client_user.post(f"{URL_PREFIX}/services/", json=payload)
    service_id = create_response.json()["id"]

    response = client_user.patch(f"{URL_PREFIX}/services/{service_id}/toggle-status")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["status"] is False

    response = client_user.patch(f"{URL_PREFIX}/services/{service_id}/toggle-status")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["status"] is True


def test_delete_service(client_user):
    service = ServiceFactory.build()
    payload = {
        "name": service.name,
        "description": service.description,
        "price": float(service.price),
        "cost": float(service.cost),
        "periodicity": service.periodicity,
    }
    create_response = client_user.post(f"{URL_PREFIX}/services/", json=payload)
    service_id = create_response.json()["id"]

    response = client_user.delete(f"{URL_PREFIX}/services/{service_id}")
    assert response.status_code == status.HTTP_204_NO_CONTENT

    response = client_user.get(f"{URL_PREFIX}/services/{service_id}")
    assert response.status_code == status.HTTP_404_NOT_FOUND
