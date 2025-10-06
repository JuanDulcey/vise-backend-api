from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    
    app_name: str = "API Clientes"
    app_description: str = "API para manejo de clientes"
    app_version: str = "1.0.0"
    
    host: str = "0.0.0.0"
    port: int = 443
    debug: bool = False
    
    allow_origins: list[str] = ["*"]
    allow_credentials: bool = True
    allow_methods: list[str] = ["*"]
    allow_headers: list[str] = ["*"]
    
    database_url: Optional[str] = None
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
