
from pydantic import BaseModel, Field

class ClientRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    country: str = Field(..., min_length=2, max_length=50)
    monthlyIncome: int = Field(..., ge=0)
    viseClub: bool
    cardType: str = Field(..., min_length=2, max_length=50)

class ClientResponse(BaseModel):
    clientId: int
    name: str
    cardType: str
    status: str
    message: str