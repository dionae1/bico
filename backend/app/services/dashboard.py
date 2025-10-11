from datetime import timedelta
from datetime import datetime

from sqlalchemy import func
from app.db.models import User, Service, Client, Supplier, Contract
from app.db.session import SessionLocal


def revenue_data():
    with SessionLocal() as db:
        contracts: list[Contract] = (
            db.query(Contract).filter(Contract.status == True).all()
        )
        services: list[Service] = db.query(Service).filter(Service.status == True).all()

        total_revenue: float = sum(contract.value for contract in contracts)
        total_expected_revenue: float = sum(service.price for service in services)
        total_cost: float = sum(service.cost for service in services)
        net_revenue: float = total_revenue - total_cost
        profit_margin: float = (
            (net_revenue / total_revenue * 100) if total_revenue > 0 else 0
        )

        return {
            "total_revenue": round(total_revenue, 2),
            "total_expected_revenue": round(total_expected_revenue, 2),
            "total_cost": round(total_cost, 2),
            "net_revenue": round(net_revenue, 2),
            "profit_margin": round(profit_margin, 2),
        }


def client_data():
    with SessionLocal() as db:
        total_clients: int = db.query(Client).count()
        active_clients: int = db.query(Client).filter(Client.status == True).count()
        inactive_clients: int = db.query(Client).filter(Client.status == False).count()
        consumer_clients: int = db.query(Client).filter(Client.contracts.any()).count()
        monthly_new_clients: int = (
            db.query(Client)
            .filter(
                Client.created_at >= datetime.now().replace(day=1) - timedelta(days=30)
            )
            .count()
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
            "consumer_clients": consumer_clients,
            "monthly_new_clients": monthly_new_clients,
            "new_clients_percentage": round(new_clients_percentage, 2),
        }


def contracts_data(limit: int = 3):
    with SessionLocal() as db:
        total_contracts: int = db.query(Contract).count()
        active_contracts: int = (
            db.query(Contract).filter(Contract.status == True).count()
        )
        inactive_contracts: int = (
            db.query(Contract).filter(Contract.status == False).count()
        )

        next_to_expire: list[Contract] = (
            db.query(Contract)
            .filter(Contract.status == True)
            .order_by(Contract.end_at.asc())
            .limit(limit)
            .all()
        )

        monthly_new_contracts: int = (
            db.query(Contract)
            .filter(
                Contract.created_at
                >= datetime.now().replace(day=1) - timedelta(days=30)
            )
            .count()
        )

        new_contracts_percentage: float = (
            (monthly_new_contracts / (total_contracts - monthly_new_contracts) * 100)
            if (total_contracts - monthly_new_contracts) > 0
            else 100
        )

        expiring_contracts: list[dict] = [
            {
                "id": contract.id,
                "client": contract.client,
                "service": contract.service,
                "end_at": contract.end_at,
                "value": contract.value,
            }
            for contract in next_to_expire
        ]

        return {
            "total_contracts": total_contracts,
            "active_contracts": active_contracts,
            "inactive_contracts": inactive_contracts,
            "monthly_new_contracts": monthly_new_contracts,
            "new_contracts_percentage": round(new_contracts_percentage, 2),
            "next_to_expire": expiring_contracts,
        }


def top_services(limit: int = 5):
    with SessionLocal() as db:
        rows = (
            db.query(
                Service.id,
                Service.name,
                func.count(Contract.id).label("contracts_count"),
                func.sum(Contract.value).label("revenue"),
            )
            .join(Contract, Contract.service_id == Service.id)
            .group_by(Service.id)
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


def overview():
    return {
        "revenue": revenue_data(),
        "clients": client_data(),
        "contracts": contracts_data(),
    }
