import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.main import app
from app.db.base import Base
from app.db.session import get_db
from app.core.auth import create_access_token

from factories.user import UserFactory
from factories.client import ClientFactory
from factories.service import ServiceFactory
from factories.contract import ContractFactory
from factories.auth_credentials import AuthCredentialsFactory

URL_PREFIX = "/api/v1"
TEST_DB_URL = "sqlite:///:memory:"


@pytest.fixture
def test_db():
    engine = create_engine(
        TEST_DB_URL, connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    TestingLocalSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingLocalSession()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(test_db):

    def override_get_db():
        try:
            yield test_db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c

    app.dependency_overrides.clear()


@pytest.fixture
def client_user(client: TestClient):
    user = UserFactory()
    client.__setattr__("user", user)
    access_token = create_access_token(data={"sub": str(user.id)})
    client.headers.update({"Authorization": f"Bearer {access_token}"})
    yield client
    client.headers.clear()


@pytest.fixture(autouse=True)
def set_session_for_factories(test_db):
    setattr(UserFactory._meta, "sqlalchemy_session", test_db)
    setattr(ClientFactory._meta, "sqlalchemy_session", test_db)
    setattr(ServiceFactory._meta, "sqlalchemy_session", test_db)
    setattr(ContractFactory._meta, "sqlalchemy_session", test_db)
    setattr(AuthCredentialsFactory._meta, "sqlalchemy_session", test_db)
