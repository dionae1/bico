from datetime import timedelta, timezone, datetime

from sqlalchemy import func
from app.db.models import Service, Client, Contract
from sqlalchemy.orm import Session

from collections import Counter


def revenue_data(user_id: int, db: Session):
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
    total_revenue = sum(contract.value for contract in contracts)

    service_counts = Counter(contract.service_id for contract in contracts)

    total_expected_revenue = sum(
        service.price * service_counts[service.id] for service in services
    )
    total_cost = sum(service.cost * service_counts[service.id] for service in services)
    revenue = total_revenue - total_cost
    profit_margin = (revenue / total_revenue * 100) if total_revenue > 0 else 0

    return {
        "total_revenue": round(total_revenue, 2),
        "total_expected_revenue": round(total_expected_revenue, 2),
        "total_cost": round(total_cost, 2),
        "revenue": round(revenue, 2),
        "profit_margin": round(profit_margin, 2),
    }


def revenue_history(user_id: int, db: Session):
    results = (
        db.query(
            func.to_char(Contract.created_at, "YYYY-MM").label("month"),
            func.sum(Contract.value).label("revenue"),
            func.sum(Service.cost).label("cost"),
            (func.sum(Contract.value) - func.sum(Service.cost)).label("profit"),
        )
        .join(Service, Service.id == Contract.service_id)
        .filter(Contract.user_id == user_id)
        .group_by("month")
        .order_by("month")
        .all()
    )

    history = [
        {
            "month": row.month,
            "revenue": round(row.revenue or 0, 2),
            "cost": round(row.cost or 0, 2),
            "profit": round(row.profit or 0, 2),
        }
        for row in results
    ]

    return history


def clients_data(user_id: int, db: Session):
    clients = db.query(Client).filter(Client.user_id == user_id).all()
    total_clients = len(clients)
    clients_with_contracts = sum(1 for client in clients if client.contracts)
    clients_without_contracts = total_clients - clients_with_contracts

    monthly_new_clients = sum(
        1 for client in clients if client.created_at >= datetime.now().replace(day=1)
    )

    new_clients_percentage: float = (
        (monthly_new_clients / (total_clients - monthly_new_clients) * 100)
        if (total_clients - monthly_new_clients) > 0
        else 100
    )

    most_contracts = (
        db.query(Client)
        .join(Contract, Contract.client_id == Client.id)
        .filter(Client.user_id == user_id)
        .group_by(Client.id)
        .order_by(func.count(Contract.id).desc())
        .first()
    )

    most_valuable = (
        db.query(
            Client,
        )
        .join(Contract, Contract.client_id == Client.id)
        .filter(Client.user_id == user_id)
        .group_by(Client.id)
        .order_by(func.sum(Contract.value).desc())
        .first()
    )

    return {
        "total_clients": total_clients,
        "clients_with_contracts": clients_with_contracts,
        "clients_without_contracts": clients_without_contracts,
        "monthly_new_clients": monthly_new_clients,
        "new_clients_percentage": round(new_clients_percentage, 2),
        "most_contracts": most_contracts.name if most_contracts else None,
        "most_valuable": most_valuable.name if most_valuable else None,
    }


def clients_history(user_id: int, db: Session):
    results = (
        db.query(
            func.to_char(Client.created_at, "YYYY-MM").label("month"),
            func.count(Client.id).label("count"),
        )
        .filter(Client.user_id == user_id)
        .group_by("month")
        .order_by("month")
        .all()
    )

    history = [{"month": row.month, "count": row.count} for row in results]

    return history


def top_clients(user_id: int, db: Session, limit: int = 5):
    rows = (
        db.query(
            Client.id,
            Client.name,
            func.count(Contract.id).label("contracts_count"),
            func.sum(Contract.value).label("total_spent"),
        )
        .filter(Client.user_id == user_id)
        .join(Contract, Contract.client_id == Client.id)
        .group_by(Client.id, Client.name)
        .order_by(func.sum(Contract.value).desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "id": row.id,
            "name": row.name,
            "contracts_count": row.contracts_count,
            "total_spent": row.total_spent,
        }
        for row in rows
    ]


def contracts_data(user_id: int, db: Session, limit: int = 3):
    contracts: list[Contract] = (
        db.query(Contract)
        .filter(Contract.user_id == user_id)
        .order_by(Contract.end_at)
        .all()
    )

    now = datetime.now()
    total_contracts = len(contracts)
    active_contracts = sum(1 for contract in contracts if contract.status)
    inactive_contracts = sum(1 for contract in contracts if not contract.status)
    finished_contracts = sum(1 for contract in contracts if contract.end_at < now)

    monthly_new_contracts = sum(
        1 for contract in contracts if contract.created_at >= now.replace(day=1)
    )
    end_this_month_contracts = sum(
        1
        for contract in contracts
        if contract.end_at >= now
        and contract.end_at < (now.replace(day=1) + timedelta(days=30))
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
        if contract.status and contract.end_at > now
    ][:limit]

    most_profitable = (
        db.query(
            Contract,
            (Contract.value - Service.cost).label("profit"),
        )
        .join(Service, Service.id == Contract.service_id)
        .filter(Contract.user_id == user_id)
        .order_by((Contract.value - Service.cost).desc())
        .first()
    )

    return {
        "total_contracts": total_contracts,
        "active_contracts": active_contracts,
        "inactive_contracts": inactive_contracts,
        "monthly_new_contracts": monthly_new_contracts,
        "new_contracts_percentage": round(new_contracts_percentage, 2),
        "most_profitable": (
            most_profitable.Contract.service.name if most_profitable else None
        ),
        "expiring_contracts": expiring_contracts,
        "end_this_month_contracts": end_this_month_contracts,
        "finished_contracts": finished_contracts,
    }


def contracts_history(user_id: int, db: Session):
    results = (
        db.query(
            func.to_char(Contract.created_at, "YYYY-MM").label("month"),
            func.count(Contract.id).label("count"),
            func.sum(Contract.value).label("value_at_risk"),
        )
        .filter(Contract.user_id == user_id)
        .group_by("month")
        .order_by("month")
        .all()
    )

    history = [
        {
            "month": row.month,
            "count": row.count,
            "value_at_risk": round(row.value_at_risk or 0, 2),
        }
        for row in results
    ]

    return history


def services_data(user_id: int, db: Session):
    services = db.query(Service).filter(Service.user_id == user_id).all()
    total_services = len(services)
    services_with_contracts = sum(1 for service in services if service.contracts)
    services_without_contracts = total_services - services_with_contracts
    most_sold = (
        db.query(Service)
        .join(Contract, Contract.service_id == Service.id)
        .filter(Service.user_id == user_id)
        .group_by(Service.id)
        .order_by(func.count(Contract.id).desc())
        .first()
    )
    most_profitable = (
        db.query(
            Service,
        )
        .join(Contract, Contract.service_id == Service.id)
        .filter(Service.user_id == user_id)
        .group_by(Service.id)
        .order_by(func.sum(Contract.value) - func.sum(Service.cost).desc())
        .first()
    )
    most_sold_monthly = (
        db.query(
            Service,
            func.count(Contract.id).label("monthly_count"),
            func.to_char(Contract.created_at, "YYYY-MM").label("month"),
        )
        .join(Contract, Contract.service_id == Service.id)
        .filter(Service.user_id == user_id)
        .group_by(Service.id, "month")
        .order_by("month")
        .all()
    )

    return {
        "total_services": total_services,
        "with_contracts": services_with_contracts,
        "without_contracts": services_without_contracts,
        "most_sold": most_sold.name if most_sold else None,
        "most_profitable": most_profitable.name if most_profitable else None,
        "most_sold_monthly": [
            {
                "service_name": row.Service.name,
                "monthly_count": row.monthly_count,
                "month": row.month,
            }
            for row in most_sold_monthly
        ],
    }


def top_services(user_id: int, db: Session, limit: int = 5):
    rows = (
        db.query(
            Service.id,
            Service.name,
            Service.cost,
            func.count(Contract.id).label("contracts_count"),
            func.sum(Contract.value).label("revenue"),
        )
        .filter(Service.user_id == user_id)
        .join(Contract, Contract.service_id == Service.id)
        .group_by(Service.id, Service.name, Service.cost)
        .order_by(func.count(Contract.id).desc())
        .limit(limit)
        .all()
    )

    total_contracts = sum(row.contracts_count for row in rows)

    return [
        {
            "id": row.id,
            "name": row.name,
            "revenue": round(row.revenue, 2) if row.revenue else 0,
            "cost": round(row.cost * row.contracts_count, 2),
            "profit": (
                round((row.revenue - (row.cost * row.contracts_count)), 2)
                if row.revenue
                else 0
            ),
            "contracts_count": row.contracts_count,
            "popularity_percentage": (
                round((row.contracts_count / total_contracts * 100), 2)
                if total_contracts > 0
                else 0
            ),
        }
        for row in rows
    ]


def overview(user_id: int, db: Session):
    return {
        "revenue": revenue_data(user_id=user_id, db=db),
        "clients": clients_data(user_id=user_id, db=db),
        "contracts": contracts_data(user_id=user_id, db=db),
    }
