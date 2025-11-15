from fastapi import APIRouter, Depends, status
from app.core.auth import get_current_user
import app.services.dashboard as ds

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/", status_code=status.HTTP_200_OK)
def get_dashboard(current_user=Depends(get_current_user)):
    response = ds.overview(current_user.id)
    return response


@router.get("/top-services/", status_code=status.HTTP_200_OK)
def get_top_services(limit: int = 5, current_user=Depends(get_current_user)):
    response = ds.top_services(limit=limit, user_id=current_user.id)
    return response
