import re
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, field_validator, ConfigDict
from app.schemas.category import CategoryResponse


class ProductBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=200, description="Product title")
    description: Optional[str] = Field(None, description="Detailed product description")
    price: float = Field(..., gt=0, description="Product unit price in currency units (must be > 0)")
    stock: int = Field(default=0, ge=0, description="Available inventory count (must be >= 0)")
    sku: str = Field(..., min_length=3, max_length=50, description="Stock Keeping Unit (unique code)")
    image_url: Optional[str] = Field(None, max_length=500, description="Product image URL")
    category_id: int = Field(..., gt=0, description="Foreign key of category")
    is_active: bool = Field(default=True, description="Whether the product is visible and available for purchase")


class ProductCreate(ProductBase):
    slug: Optional[str] = Field(None, max_length=200, description="URL-friendly slug (auto-generated if omitted)")

    @field_validator("slug", mode="before")
    @classmethod
    def clean_slug(cls, v: Optional[str]) -> Optional[str]:
        if v:
            return re.sub(r"[^a-zA-Z0-9_-]", "-", v.strip().lower())
        return v


class ProductUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=200)
    slug: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    stock: Optional[int] = Field(None, ge=0)
    sku: Optional[str] = Field(None, min_length=3, max_length=50)
    image_url: Optional[str] = Field(None, max_length=500)
    category_id: Optional[int] = Field(None, gt=0)
    is_active: Optional[bool] = None


class ProductResponse(ProductBase):
    id: int
    slug: str
    created_at: datetime
    updated_at: datetime
    category: Optional[CategoryResponse] = None

    model_config = ConfigDict(from_attributes=True)


class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    limit: int
    total_pages: int
