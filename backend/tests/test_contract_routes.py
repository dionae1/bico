from fastapi import status
from conftest import URL_PREFIX
from factories.contract import ContractFactory
from factories.service import ServiceFactory
from factories.client import ClientFactory


def test_create_contract(client_user):
    client = ClientFactory()
    contract = ContractFactory.build()
    service = ServiceFactory.build()
    service_response = client_user.post(
        f"{URL_PREFIX}/services/",
        json={
            "name": service.name,
            "description": service.description,
            "price": float(service.price),
            "cost": float(service.cost),
            "periodicity": service.periodicity,
        },
    )

    contract.client_id = client.id
    contract.service_id = service_response.json()["id"]

    payload = {
        "client_id": contract.client_id,
        "service_id": contract.service_id,
        "created_at": contract.created_at.isoformat(),
        "end_at": contract.end_at.isoformat(),
        "value": float(contract.value),
    }

    response = client_user.post(
        f"{URL_PREFIX}/contracts/",
        json=payload,
    )
    assert response.status_code == status.HTTP_201_CREATED


def test_get_contracts(client_user):
    client = ClientFactory()
    contract = ContractFactory.build()
    service = ServiceFactory.build()
    service_response = client_user.post(
        f"{URL_PREFIX}/services/",
        json={
            "name": service.name,
            "description": service.description,
            "price": float(service.price),
            "cost": float(service.cost),
            "periodicity": service.periodicity,
        },
    )

    contract.client_id = client.id
    contract.service_id = service_response.json()["id"]
    client_user.post(
        f"{URL_PREFIX}/contracts/",
        json={
            "client_id": contract.client_id,
            "service_id": contract.service_id,
            "created_at": contract.created_at.isoformat(),
            "end_at": contract.end_at.isoformat(),
            "value": float(contract.value),
        },
    )
    response = client_user.get(f"{URL_PREFIX}/contracts/user")
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), list)


def test_get_empty_contracts(client_user):
    response = client_user.get(f"{URL_PREFIX}/contracts/user")
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_get_contracts_by_id(client_user):
    client = ClientFactory()
    contract = ContractFactory.build()
    service = ServiceFactory.build()
    service_response = client_user.post(
        f"{URL_PREFIX}/services/",
        json={
            "name": service.name,
            "description": service.description,
            "price": float(service.price),
            "cost": float(service.cost),
            "periodicity": service.periodicity,
        },
    )

    contract.client_id = client.id
    contract.service_id = service_response.json()["id"]
    client_user.post(
        f"{URL_PREFIX}/contracts/",
        json={
            "client_id": contract.client_id,
            "service_id": contract.service_id,
            "created_at": contract.created_at.isoformat(),
            "end_at": contract.end_at.isoformat(),
            "value": float(contract.value),
        },
    )
    response = client_user.get(f"{URL_PREFIX}/contracts/client/{client.id}")
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), list)


def test_update_contract(client_user):
    client = ClientFactory()
    contract = ContractFactory.build()
    service = ServiceFactory.build()
    service_response = client_user.post(
        f"{URL_PREFIX}/services/",
        json={
            "name": service.name,
            "description": service.description,
            "price": float(service.price),
            "cost": float(service.cost),
            "periodicity": service.periodicity,
        },
    )

    contract.client_id = client.id
    contract.service_id = service_response.json()["id"]
    create_response = client_user.post(
        f"{URL_PREFIX}/contracts/",
        json={
            "client_id": contract.client_id,
            "service_id": contract.service_id,
            "created_at": contract.created_at.isoformat(),
            "end_at": contract.end_at.isoformat(),
            "value": float(contract.value),
        },
    )
    contract_id = create_response.json()["id"]

    new_end_at = "2025-12-31T00:00:00"
    new_value = 9999.99
    update_payload = {
        "end_at": new_end_at,
        "value": new_value,
    }

    response = client_user.put(
        f"{URL_PREFIX}/contracts/{contract_id}",
        json=update_payload,
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["end_at"] == new_end_at
    assert response.json()["value"] == new_value


def test_toggle_contract_status(client_user):
    client = ClientFactory()
    contract = ContractFactory.build()
    service = ServiceFactory.build()
    service_response = client_user.post(
        f"{URL_PREFIX}/services/",
        json={
            "name": service.name,
            "description": service.description,
            "price": float(service.price),
            "cost": float(service.cost),
            "periodicity": service.periodicity,
        },
    )

    contract.client_id = client.id
    contract.service_id = service_response.json()["id"]
    create_response = client_user.post(
        f"{URL_PREFIX}/contracts/",
        json={
            "client_id": contract.client_id,
            "service_id": contract.service_id,
            "created_at": contract.created_at.isoformat(),
            "end_at": contract.end_at.isoformat(),
            "value": float(contract.value),
        },
    )
    contract_id = create_response.json()["id"]

    response = client_user.patch(f"{URL_PREFIX}/contracts/{contract_id}/toggle-status")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["status"] is False

    response = client_user.patch(f"{URL_PREFIX}/contracts/{contract_id}/toggle-status")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["status"] is True


def test_delete_contract(client_user):
    client = ClientFactory()
    contract = ContractFactory.build()
    service = ServiceFactory.build()
    service_response = client_user.post(
        f"{URL_PREFIX}/services/",
        json={
            "name": service.name,
            "description": service.description,
            "price": float(service.price),
            "cost": float(service.cost),
            "periodicity": service.periodicity,
        },
    )

    contract.client_id = client.id
    contract.service_id = service_response.json()["id"]
    create_response = client_user.post(
        f"{URL_PREFIX}/contracts/",
        json={
            "client_id": contract.client_id,
            "service_id": contract.service_id,
            "created_at": contract.created_at.isoformat(),
            "end_at": contract.end_at.isoformat(),
            "value": float(contract.value),
        },
    )
    contract_id = create_response.json()["id"]

    response = client_user.delete(f"{URL_PREFIX}/contracts/{contract_id}")
    assert response.status_code == status.HTTP_204_NO_CONTENT

    get_response = client_user.get(f"{URL_PREFIX}/contracts/{contract_id}")
    assert get_response.status_code == status.HTTP_404_NOT_FOUND
