from pydantic import BaseModel
from datetime import datetime
from typing import Any, Optional

class ApiResponse(BaseModel):
    mensaje: str
    timestamp: datetime
    datos: Optional[Any] = None

class ErrorResponse(BaseModel):
    error: str
    detail: str
    timestamp: datetime