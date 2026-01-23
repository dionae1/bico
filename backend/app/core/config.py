from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    PROJECT_NAME: str = "Bico Dev"
    DOMAIN_NAME: str = "localhost"

    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    HOST_NAME: str = "localhost"
    DATABASE_URL: Optional[str] = None

    SECRET_KEY: str = "development-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    GOOGLE_CLIENT_ID: str
    GOOGLE_CALLBACK_URI: str
    GOOGLE_CLIENT_SECRET: str
    RESPONSE_TYPE: str
    SCOPE: str
    STATE: str

    FRONTEND_URL: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=[".env", "../.env"],
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )

    @computed_field
    @property
    def REDIRECT_URI(self) -> str:
        return (
            f"https://accounts.google.com/o/oauth2/v2/auth?"
            f"client_id={self.GOOGLE_CLIENT_ID}&"
            f"redirect_uri={self.GOOGLE_CALLBACK_URI}&"
            f"response_type={self.RESPONSE_TYPE}&"
            f"scope={self.SCOPE}&state={self.STATE}"
        )
    
    @computed_field
    @property
    def COOKIE_SECURE(self) -> bool:
        """Cookies seguros em produção (HTTPS), inseguros em desenvolvimento"""
        return self.DOMAIN_NAME != "localhost"


settings = Settings()
