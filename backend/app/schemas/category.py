import re
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator, ConfigDict


class CategoryBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Category name")
    description: Optional[str] = Field(None, max_length=500, description="Category description")
    is_active: bool = Field(default=True, description="Whether the category is active")


class CategoryCreate(CategoryBase):
    slug: Optional[str] = Field(None, max_length=100, description="URL-friendly slug (auto-generated if omitted)")

    @field_validator("slug", mode="before")
    @classmethod
    def generate_slug_if_missing(cls, v: Optional[str], info) -> Optional[str]:
        if v:
            # Clean provided slug
            return re.sub(r"[^a-zA-Z0-9_-]", "-", v.strip().lower())
        return v


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    slug: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    is_active: Optional[bool] = None


class CategoryResponse(CategoryBase):
    id: int
    slug: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
