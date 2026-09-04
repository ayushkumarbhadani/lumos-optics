from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class CartItemCreate(BaseModel):
    product_id: int = Field(..., gt=0, description="Product ID to add to cart")
    quantity: int = Field(default=1, gt=0, description="Quantity to add (must be at least 1)")


class CartItemUpdate(BaseModel):
    quantity: int = Field(..., gt=0, description="New quantity (must be at least 1)")


class CartProductSummary(BaseModel):
    id: int
    title: str
    price: float
    stock: int
    sku: str
    image_url: Optional[str] = None
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class CartItemResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    quantity: int
    subtotal: float
    product: CartProductSummary
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CartResponse(BaseModel):
    items: List[CartItemResponse]
    total_items: int
    total_amount: float
