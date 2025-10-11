from datetime import timedelta
from datetime import datetime

from sqlalchemy import func
from app.db.models import Service, Client, Contract
from app.db.session import SessionLocal


def revenue_data(user_id: int):
    with SessionLocal() as db:
        contracts: list[Contract] = (
            db.query(Contract)
            .filter(Contract.status == True, Contract.user_id == user_id)
            .all()
        )

        services: list[Service] = (
            db.query(Service)
            .filter(Service.status == True, Service.user_id == user_id)
            .all()
        )

        services_with_contracts = [contract.service_id for contract in contracts]
        total_revenue: float = sum(contract.value for contract in contracts)
        total_expected_revenue: float = sum(
            service.price
            for service in services
            if service.id in services_with_contracts
        )
        total_cost: float = sum(
            service.cost
            for service in services
            if service.id in services_with_contracts
        )
        revenue: float = total_revenue - total_cost
        profit_margin: float = (
            (revenue / total_revenue * 100) if total_revenue > 0 else 0
        )

        return {
            "total_revenue": round(total_revenue, 2),
            "total_expected_revenue": round(total_expected_revenue, 2),
            "total_cost": round(total_cost, 2),
            "revenue": round(revenue, 2),
            "profit_margin": round(profit_margin, 2),
        }


def client_data(user_id: int):
    with SessionLocal() as db:
        clients = db.query(Client).filter(Client.user_id == user_id).all()
        total_clients = len(clients)
        active_clients = sum(1 for client in clients if client.status)
        inactive_clients = sum(1 for client in clients if not client.status)
        clients_with_contracts = sum(1 for client in clients if client.contracts)
        monthly_new_clients = sum(
            1
            for client in clients
            if client.created_at >= datetime.now().replace(day=1) - timedelta(days=30)
        )

        new_clients_percentage: float = (
            (monthly_new_clients / (total_clients - monthly_new_clients) * 100)
            if (total_clients - monthly_new_clients) > 0
            else 100
        )

        return {
            "total_clients": total_clients,
            "active_clients": active_clients,
            "inactive_clients": inactive_clients,
            "clients_with_contracts": clients_with_contracts,
            "monthly_new_clients": monthly_new_clients,
            "new_clients_percentage": round(new_clients_percentage, 2),
        }


def contracts_data(user_id: int, limit: int = 3):
    with SessionLocal() as db:
        contracts: list[Contract] = (
            db.query(Contract)
            .filter(Contract.user_id == user_id)
            .order_by(Contract.end_at)
            .all()
        )

        total_contracts = len(contracts)
        active_contracts = sum(1 for contract in contracts if contract.status)
        inactive_contracts = sum(1 for contract in contracts if not contract.status)

        monthly_new_contracts = sum(
            1
            for contract in contracts
            if contract.created_at >= datetime.now().replace(day=1) - timedelta(days=30)
        )
        new_contracts_percentage: float = (
            (monthly_new_contracts / (total_contracts - monthly_new_contracts) * 100)
            if (total_contracts - monthly_new_contracts) > 0
            else 100
        )

        expiring_contracts = [
            {
                "id": contract.id,
                "client": contract.client,
                "service": contract.service,
                "end_at": contract.end_at,
                "value": contract.value,
            }
            for contract in contracts
            if contract.status and contract.end_at > datetime.now()
        ][:limit]

        return {
            "total_contracts": total_contracts,
            "active_contracts": active_contracts,
            "inactive_contracts": inactive_contracts,
            "monthly_new_contracts": monthly_new_contracts,
            "new_contracts_percentage": round(new_contracts_percentage, 2),
            "next_to_expire": expiring_contracts,
        }


def top_services(user_id: int, limit: int = 5):
    with SessionLocal() as db:
        rows = (
            db.query(
                Service.id,
                Service.name,
                func.count(Contract.id).label("contracts_count"),
                func.sum(Contract.value).label("revenue"),
            )
            .filter(Service.user_id == user_id)
            .join(Contract, Contract.service_id == Service.id)
            .group_by(Service.id, Service.name)
            .order_by(func.sum(Contract.value).desc())
            .limit(limit)
            .all()
        )

        return [
            {
                "id": row.id,
                "name": row.name,
                "contracts_count": row.contracts_count,
                "revenue": row.revenue,
            }
            for row in rows
        ]


def overview(user_id: int):
    return {
        "revenue": revenue_data(user_id=user_id),
        "clients": client_data(user_id=user_id),
        "contracts": contracts_data(user_id=user_id),
    }
