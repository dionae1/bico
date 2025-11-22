from fastapi import APIRouter, Depends, status
from app.core.auth import get_current_user
from app.db.session import get_db
from sqlalchemy.orm import Session
import app.services.dashboard as ds

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/", status_code=status.HTTP_200_OK)
def get_dashboard(
    current_user=Depends(get_current_user), db: Session = Depends(get_db)
):
    response = ds.overview(current_user.id, db=db)
    return response


@router.get("/top-services/", status_code=status.HTTP_200_OK)
def get_top_services(
    limit: int = 5,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    response = ds.top_services(limit=limit, user_id=current_user.id, db=db)
    return response


@router.get("/clients", status_code=status.HTTP_200_OK)
def get_clients_data(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    response = ds.clients_data(user_id=current_user.id, db=db)
    return response


@router.get("/top-clients/", status_code=status.HTTP_200_OK)
def get_top_clients(
    limit: int = 5,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    response = ds.top_clients(limit=limit, user_id=current_user.id, db=db)
    return response


@router.get("/revenue-history/", status_code=status.HTTP_200_OK)
def get_revenue_history(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    response = ds.revenue_history(user_id=current_user.id, db=db)
    return response


@router.get("/clients-history/", status_code=status.HTTP_200_OK)
def get_clients_history(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    response = ds.clients_history(user_id=current_user.id, db=db)
    return response


@router.get("/contracts-history/", status_code=status.HTTP_200_OK)
def get_contracts_history(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    response = ds.contracts_history(user_id=current_user.id, db=db)
    return response


@router.get("/contracts", status_code=status.HTTP_200_OK)
def get_contracts_data(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    response = ds.contracts_data(user_id=current_user.id, db=db)
    return response


@router.get("/services", status_code=status.HTTP_200_OK)
def get_services_data(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    response = ds.services_data(user_id=current_user.id, db=db)
    return response
