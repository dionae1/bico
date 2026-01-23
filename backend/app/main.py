from fastapi import APIRouter, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware
from fastapi.responses import JSONResponse
from app.routes import (
    auth_routes,
    user_routes,
    client_routes,
    service_routes,
    contract_routes,
    dashboard_routes,
)

from app.scheduler import scheduler, cleanup_demo_accounts
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler.add_job(cleanup_demo_accounts, "interval", hours=1)
    scheduler.start()
    print("Scheduler started")
    yield
    scheduler.shutdown()
    print("Scheduler stopped")


from app.core.config import settings

domain_name = settings.DOMAIN_NAME

origins = [
    "http://localhost:5173",
    "http://localhost",
    "https://localhost",
    "http://127.0.0.1:5173",
    "https://127.0.0.1",
    f"https://{domain_name}",
    f"http://{domain_name}",
]
app = FastAPI(title="CSManager API", version="1.0.0", lifespan=lifespan)

app.add_middleware(ProxyHeadersMiddleware, trusted_hosts="*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


v1_router = APIRouter(prefix="/api/v1")

v1_router.include_router(user_routes.router, tags=["users"])
v1_router.include_router(auth_routes.router, tags=["auth"])
v1_router.include_router(client_routes.router, tags=["clients"])
v1_router.include_router(service_routes.router, tags=["services"])
v1_router.include_router(contract_routes.router, tags=["contracts"])
v1_router.include_router(dashboard_routes.router, tags=["dashboard"])

app.include_router(v1_router)


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail if exc.detail else "An error occurred",
            "data": None,
            "error": str(exc),
        },
    )
