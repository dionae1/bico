from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.utils import get_number_or_default

def revenue_data(user_id: int, db: Session):
    query = text(
        """
        SELECT 
            COALESCE(SUM(c.value), 0) AS total_revenue,
            COALESCE(SUM(s.cost), 0) AS total_cost,
            COALESCE(SUM(s.price), 0) AS total_expected_revenue
        FROM contracts c
        JOIN services s ON c.service_id = s.id
        WHERE c.status = true AND c.user_id = :user_id
        """
    )

    result = db.execute(query, {"user_id": user_id}).fetchone()

    if not result:
        return {
            "total_revenue": 0.0,
            "total_expected_revenue": 0.0,
            "total_cost": 0.0,
            "revenue": 0.0,
            "profit_margin": 0.0,
        }

    total_revenue = float(result.total_revenue or 0)
    total_expected_revenue = float(result.total_expected_revenue or 0)
    total_cost = float(result.total_cost or 0)
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
    query = text(
        """
        SELECT 
            to_char(c.created_at, 'YYYY-MM') AS month,
            COALESCE(SUM(c.value), 0) AS revenue,
            COALESCE(SUM(s.cost), 0) AS cost,
            (COALESCE(SUM(c.value), 0) - COALESCE(SUM(s.cost), 0)) AS profit
        FROM contracts c
        JOIN services s ON c.service_id = s.id
        WHERE c.user_id = :user_id
        GROUP BY month
        ORDER BY month
        """
    )

    results = db.execute(query, {"user_id": user_id}).fetchall()

    if not results:
        return []

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
    clients_query = text(
        """
        SELECT 
            COUNT(*) AS total_clients,
            SUM(CASE WHEN EXISTS (SELECT 1 FROM contracts c WHERE c.client_id = cl.id) THEN 1 ELSE 0 END) AS clients_with_contracts,
            SUM(CASE WHEN NOT EXISTS (SELECT 1 FROM contracts c WHERE c.client_id = cl.id) THEN 1 ELSE 0 END) AS clients_without_contracts,
            SUM(CASE WHEN cl.created_at >= date_trunc('month', CURRENT_DATE) THEN 1 ELSE 0 END) AS monthly_new_clients
        FROM clients cl
        WHERE cl.user_id = :user_id
        """
    )
    clients_results = db.execute(clients_query, {"user_id": user_id}).fetchone()

    most_contracts_query = text(
        """
        SELECT cl.name
        FROM clients cl
        JOIN contracts c ON c.client_id = cl.id
        WHERE cl.user_id = :user_id
        GROUP BY cl.id
        ORDER BY COUNT(c.id) DESC
        LIMIT 1
        """
    )
    most_contracts_result = db.execute(
        most_contracts_query, {"user_id": user_id}
    ).fetchone()

    most_valuable_query = text(
        """
        SELECT cl.name
        FROM clients cl
        JOIN contracts c ON c.client_id = cl.id
        WHERE cl.user_id = :user_id
        GROUP BY cl.id
        ORDER BY SUM(c.value) DESC
        LIMIT 1
        """
    )
    most_valuable_result = db.execute(
        most_valuable_query, {"user_id": user_id}
    ).fetchone()

    new_clients = get_number_or_default(clients_results.monthly_new_clients) if clients_results else 0
    total_clients = get_number_or_default(clients_results.total_clients) if clients_results else 0

    new_clients_percentage: float = (
        ((new_clients / (total_clients - new_clients) * 100) if (total_clients - new_clients) > 0 else 100)
        if clients_results else 0
    )

    with_contracts = get_number_or_default(clients_results.clients_with_contracts) if clients_results else 0
    without_contracts = get_number_or_default(clients_results.clients_without_contracts) if clients_results else 0

    return {
        "total_clients": total_clients,
        "clients_with_contracts": with_contracts,
        "clients_without_contracts": without_contracts,
        "monthly_new_clients": new_clients,
        "new_clients_percentage": round(new_clients_percentage, 2),
        "most_contracts": most_contracts_result.name if most_contracts_result else None,
        "most_valuable": most_valuable_result.name if most_valuable_result else None,
    }


def clients_history(user_id: int, db: Session):
    query = text(
        """
        SELECT 
            to_char(created_at, 'YYYY-MM') AS month,
            COUNT(id) AS count
        FROM clients
        WHERE user_id = :user_id
        GROUP BY month
        ORDER BY month
        """
    )

    results = db.execute(query, {"user_id": user_id}).fetchall()

    if not results:
        return []

    history = [
        {
            "month": row.month,
            "count": row.count,
        }
        for row in results
    ]

    return history


def top_clients(user_id: int, db: Session, limit: int = 5):
    query = text(
        """
        SELECT
            cl.id,
            cl.name,
            COUNT(c.id) AS contracts_count,
            SUM(c.value) AS total_spent
        FROM clients cl
        JOIN contracts c ON c.client_id = cl.id
        WHERE cl.user_id = :user_id
        GROUP BY cl.id, cl.name
        ORDER BY total_spent DESC
        LIMIT :limit
        """
    )

    results = db.execute(query, {"user_id": user_id, "limit": limit}).fetchall()
    if not results:
        return []

    return [
        {
            "id": row.id,
            "name": row.name,
            "contracts_count": row.contracts_count,
            "total_spent": row.total_spent,
        }
        for row in results
    ]


def contracts_data(user_id: int, db: Session, limit: int = 3):
    query = text(
        """
        SELECT 
            COUNT(*) AS total_contracts,
            SUM(CASE WHEN status = true THEN 1 ELSE 0 END) AS active_contracts,
            SUM(CASE WHEN status = false THEN 1 ELSE 0 END) AS inactive_contracts,
            SUM(CASE WHEN created_at >= date_trunc('month', CURRENT_DATE) THEN 1 ELSE 0 END) AS monthly_new_contracts,
            SUM(CASE WHEN end_at >= CURRENT_DATE AND end_at < (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month') THEN 1 ELSE 0 END) AS end_this_month_contracts,
            SUM(CASE WHEN end_at < CURRENT_DATE THEN 1 ELSE 0 END) AS finished_contracts
        FROM contracts
        WHERE user_id = :user_id
        """
    )
    results = db.execute(query, {"user_id": user_id}).fetchone()

    total_contracts = get_number_or_default(results.total_contracts) if results else 0
    new_contracts = get_number_or_default(results.monthly_new_contracts) if results else 0

    new_contracts_percentage: float = (
        ((new_contracts / (total_contracts - new_contracts) * 100) if (total_contracts - new_contracts) > 0 else 100)
        if results else 0
    ) if total_contracts > 0 else 0

    most_profitable_query = text(
        """
        SELECT c.id, s.name, (c.value - s.cost) AS profit
        FROM contracts c
        JOIN services s ON c.service_id = s.id
        WHERE c.user_id = :user_id
        ORDER BY profit DESC
        LIMIT 1
        """
    )
    most_profitable = db.execute(most_profitable_query, {"user_id": user_id}).fetchone()

    expiring_contracts_query = text(
        """
        SELECT c.id, cl.name AS client_name, cl.id as client_id, s.name AS service_name, s.price AS service_price, c.end_at, c.value
        FROM contracts c
        JOIN clients cl ON c.client_id = cl.id
        JOIN services s ON c.service_id = s.id
        WHERE c.user_id = :user_id AND c.status = true AND c.end_at > CURRENT_DATE
        ORDER BY c.end_at
        LIMIT :limit
        """
    )
    expiring_contracts_results = db.execute(
        expiring_contracts_query, {"user_id": user_id, "limit": limit}
    ).fetchall()

    expiring_contracts = (
        [
            {
                "id": row.id,
                "client": {"id": row.client_id, "name": row.client_name},
                "service": {
                    "name": row.service_name,
                    "price": round(float(row.service_price), 2),
                    "status": "true",
                },
                "end_at": row.end_at,
                "value": row.value,
            }
            for row in expiring_contracts_results
        ]
        if expiring_contracts_results
        else []
    )

    active_contracts = get_number_or_default(results.active_contracts) if results else 0
    inactive_contracts = get_number_or_default(results.inactive_contracts) if results else 0
    monthly_new_contracts = get_number_or_default(results.monthly_new_contracts) if results else 0
    end_this_month_contracts = get_number_or_default(results.end_this_month_contracts) if results else 0
    finished_contracts = get_number_or_default(results.finished_contracts) if results else 0

    return {
        "total_contracts": total_contracts,
        "active_contracts": active_contracts,
        "inactive_contracts": inactive_contracts,
        "monthly_new_contracts": monthly_new_contracts,
        "new_contracts_percentage": round(new_contracts_percentage, 2),
        "most_profitable": most_profitable.name if most_profitable else None,
        "end_this_month_contracts": end_this_month_contracts,
        "finished_contracts": finished_contracts,
        "expiring_contracts": expiring_contracts,
    }


def contracts_history(user_id: int, db: Session):
    query = text(
        """
        SELECT 
            to_char(created_at, 'YYYY-MM') AS month,
            COUNT(id) AS count,
            SUM(value) AS value_at_risk
        FROM contracts
        WHERE user_id = :user_id
        GROUP BY month
        ORDER BY month
        """
    )

    results = db.execute(query, {"user_id": user_id}).fetchall()
    if not results:
        return []

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
    query = text(
        """
        SELECT 
            COUNT(s.id) AS total_services,
            SUM(CASE WHEN EXISTS (SELECT 1 FROM contracts c WHERE c.service_id = s.id) THEN 1 ELSE 0 END) AS services_with_contracts,
            SUM(CASE WHEN NOT EXISTS (SELECT 1 FROM contracts c WHERE c.service_id = s.id) THEN 1 ELSE 0 END) AS services_without_contracts
        FROM services s
        WHERE s.user_id = :user_id
        """
    )
    results = db.execute(query, {"user_id": user_id}).fetchone()

    most_sold_query = text(
        """
        SELECT s.name
        FROM services s
        JOIN contracts c ON c.service_id = s.id
        WHERE s.user_id = :user_id
        GROUP BY s.id
        ORDER BY COUNT(c.id) DESC
        LIMIT 1
        """
    )
    most_sold = db.execute(most_sold_query, {"user_id": user_id}).fetchone()

    most_profitable_query = text(
        """
        SELECT s.name
        FROM services s
        JOIN contracts c ON c.service_id = s.id
        WHERE s.user_id = :user_id
        GROUP BY s.id
        ORDER BY SUM(c.value) - SUM(s.cost) DESC
        LIMIT 1
        """
    )
    most_profitable = db.execute(most_profitable_query, {"user_id": user_id}).fetchone()

    most_sold_monthly_query = text(
        """
        SELECT 
            s.name,
            COUNT(c.id) AS monthly_count,
            to_char(c.created_at, 'YYYY-MM') AS month
        FROM services s
        JOIN contracts c ON c.service_id = s.id
        WHERE s.user_id = :user_id
        GROUP BY s.id, month
        ORDER BY month
        """
    )
    most_sold_monthly = db.execute(
        most_sold_monthly_query, {"user_id": user_id}
    ).fetchall()

    return {
        "total_services": results.total_services if results else 0,
        "with_contracts": results.services_with_contracts if results else 0,
        "without_contracts": results.services_without_contracts if results else 0,
        "most_sold": most_sold.name if most_sold else None,
        "most_profitable": most_profitable.name if most_profitable else None,
        "most_sold_monthly": (
            [
                {
                    "service_name": row.name,
                    "monthly_count": row.monthly_count,
                    "month": row.month,
                }
                for row in most_sold_monthly
            ]
            if most_sold_monthly
            else []
        ),
    }


def top_services(user_id: int, db: Session, limit: int = 5):
    query = text(
        """
        SELECT
            s.id,
            s.name,
            s.cost,
            s.price,
            COUNT(c.id) AS contracts_count,
            SUM(c.value) AS revenue
        FROM services s
        JOIN contracts c ON c.service_id = s.id
        WHERE s.user_id = :user_id
        GROUP BY s.id, s.name, s.cost, s.price
        ORDER BY contracts_count DESC
        LIMIT :limit
        """
    )

    rows = db.execute(query, {"user_id": user_id, "limit": limit}).fetchall()

    total_contracts_query = text(
        """
        SELECT
            COUNT(c.id) AS total_contracts
        FROM contracts c
        WHERE c.user_id = :user_id
        """
    )
    total_contracts_result = db.execute(
        total_contracts_query, {"user_id": user_id}
    ).fetchone()
    total_contracts = (
        total_contracts_result.total_contracts if total_contracts_result else 0
    )

    return [
        {
            "id": row.id,
            "name": row.name,
            "price": round(row.price, 2),
            "revenue": round(row.revenue, 2) if row.revenue else 0,
            "cost": round(row.cost * row.contracts_count, 2),
            "profit": (
                round((row.revenue - (row.cost * row.contracts_count)), 2)
                if row.revenue
                else 0
            ),
            "contracts_count": row.contracts_count,
            "popularity_percentage": round(
                (
                    (row.contracts_count / total_contracts * 100)
                    if total_contracts > 0
                    else 0
                ),
                2,
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
