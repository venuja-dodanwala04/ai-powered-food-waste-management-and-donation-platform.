from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "EcoKitchen AI API"
    environment: str = "development"
    api_v1_prefix: str = "/api/v1"
    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_database: str = "ecokitchen_ai"
    jwt_secret_key: str = "change-me-before-production"
    access_token_expire_minutes: int = 1440
    cors_origins: str = "http://localhost:5173"

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False, extra="ignore")

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def is_production(self) -> bool:
        """Only the literal value "production" (any case) disables the dev bootstrap.

        Unset / empty / "development" / "staging" / "local" / anything else all count
        as non-production and trigger default-account and demo-data seeding on startup.
        """
        return self.environment.strip().lower() == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()

