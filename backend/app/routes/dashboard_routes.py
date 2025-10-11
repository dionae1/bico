from fastapi import APIRouter, Depends
import app.services.dashboard as ds
from app.services.dashboard import revenue_data, client_data

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/")
def get_dashboard():
    return {"data": ds.overview()}


@router.get("/top-services/")
def get_top_services(limit: int = 5):
    return {"data": ds.top_services(limit=limit)}
