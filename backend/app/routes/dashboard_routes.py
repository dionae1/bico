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
