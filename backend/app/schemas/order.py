from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict
from app.models.order import OrderStatus, PaymentStatus


class CheckoutRequest(BaseModel):
    shipping_address: str = Field(..., min_length=5, max_length=500, description="Full delivery address")


class OrderItemResponse(BaseModel):
    id: int
    order_id: int
    product_id: int
    product_title: str
    unit_price: float
    quantity: int
    subtotal: float

    model_config = ConfigDict(from_attributes=True)


class OrderResponse(BaseModel):
    id: int
    order_number: str
    user_id: int
    status: OrderStatus
    payment_status: PaymentStatus
    total_amount: float
    shipping_address: str
    items: List[OrderItemResponse]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OrderStatusUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    payment_status: Optional[PaymentStatus] = None


class OrderListResponse(BaseModel):
    items: List[OrderResponse]
    total: int
    page: int
    limit: int
    total_pages: int
