from pydantic import BaseModel, Field

class PurchaseRequest(BaseModel):
    clientId: int
    amount: float = Field(..., ge=0)
    currency: str = Field(..., min_length=1)
    purchaseDate: str  # YYYY-MM-DD
    purchaseCountry: str = Field(..., min_length=2)

class PurchaseResponse(BaseModel):
    status: str
    purchase: dict