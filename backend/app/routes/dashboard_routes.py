from fastapi import APIRouter, Depends
from app.core.auth import get_current_user
import app.services.dashboard as ds

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/")
def get_dashboard(current_user=Depends(get_current_user)):
    return {"data": ds.overview(current_user.id)}


@router.get("/top-services/")
def get_top_services(limit: int = 5, current_user=Depends(get_current_user)):
    return {"data": ds.top_services(limit=limit, user_id=current_user.id)}
