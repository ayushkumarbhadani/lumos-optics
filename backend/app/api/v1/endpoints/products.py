import hashlib
import json
import math
import os
from pathlib import Path
import time
from typing import Optional
import urllib.error
import urllib.request
import uuid
from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_admin
from app.core.config import settings
from app.crud.crud_product import crud_product
from app.crud.crud_category import crud_category
from app.models.user import User
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductListResponse,
)
from app.schemas.common import MessageResponse

router = APIRouter()


@router.get("/", response_model=ProductListResponse)
def list_products(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    category_id: Optional[int] = Query(None, description="Filter by category ID"),
    search: Optional[str] = Query(None, description="Search keyword in title, description, or SKU"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price filter"),
    in_stock_only: bool = Query(False, description="Filter for products with stock > 0"),
    db: Session = Depends(get_db),
):
    """
    Search and filter products catalog with pagination (Public).
    Supports keyword search, category filtering, price range, and stock availability.
    """
    skip = (page - 1) * limit
    items, total = crud_product.get_multi(
        db,
        skip=skip,
        limit=limit,
        category_id=category_id,
        search=search,
        min_price=min_price,
        max_price=max_price,
        in_stock_only=in_stock_only,
        active_only=True,
    )

    total_pages = math.ceil(total / limit) if total > 0 else 1
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": total_pages,
    }


def _upload_to_cloudinary(file_bytes: bytes, filename: str, mime_type: str) -> Optional[str]:
    """Uploads file bytes to Cloudinary using either upload_preset or api_key/api_secret."""
    cloud_name = settings.CLOUDINARY_CLOUD_NAME.strip()
    if not cloud_name:
        return None

    api_url = f"https://api.cloudinary.com/v1_1/{cloud_name}/image/upload"
    boundary = f"----CloudinaryBoundary{uuid.uuid4().hex}"
    body = bytearray()

    def add_param(name: str, value: str):
        body.extend(f"--{boundary}\r\nContent-Disposition: form-data; name=\"{name}\"\r\n\r\n{value}\r\n".encode())

    if settings.CLOUDINARY_UPLOAD_PRESET.strip():
        add_param("upload_preset", settings.CLOUDINARY_UPLOAD_PRESET.strip())
    elif settings.CLOUDINARY_API_KEY.strip() and settings.CLOUDINARY_API_SECRET.strip():
        timestamp = str(int(time.time()))
        to_sign = f"timestamp={timestamp}{settings.CLOUDINARY_API_SECRET.strip()}"
        signature = hashlib.sha1(to_sign.encode()).hexdigest()
        add_param("timestamp", timestamp)
        add_param("api_key", settings.CLOUDINARY_API_KEY.strip())
        add_param("signature", signature)
    else:
        return None

    body.extend(f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"{filename}\"\r\nContent-Type: {mime_type}\r\n\r\n".encode())
    body.extend(file_bytes)
    body.extend(f"\r\n--{boundary}--\r\n".encode())

    req = urllib.request.Request(
        api_url,
        data=bytes(body),
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode())
            return data.get("secure_url") or data.get("url")
    except Exception as e:
        print(f"[Cloudinary Upload Error]: {e}")
        return None


@router.post("/upload-image")
async def upload_product_image(
    file: UploadFile = File(...),
    admin: User = Depends(get_current_admin),
):
    """
    Upload an eyewear product photograph (Admin only).
    Uploads directly to Cloudinary if credentials are configured.
    Otherwise saves to local ecom-frontend assets and returns relative image path.
    """
    allowed_types = {"image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"}
    content_type = file.content_type or "image/jpeg"
    if content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported image type '{content_type}'. Allowed types: JPEG, PNG, WebP, GIF, SVG.",
        )

    file_bytes = await file.read()
    if len(file_bytes) > 10 * 1024 * 1024:  # 10 MB limit
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image size exceeds maximum allowed limit of 10 MB.",
        )

    clean_filename = Path(file.filename or "image.jpg").name.replace(" ", "-")
    # Try Cloudinary first
    cloudinary_url = _upload_to_cloudinary(file_bytes, clean_filename, content_type)
    if cloudinary_url:
        return {
            "url": cloudinary_url,
            "provider": "cloudinary",
            "filename": clean_filename,
            "message": "Image successfully uploaded and hosted on Cloudinary CDN.",
        }

    # Fallback to local frontend assets directory
    ext = Path(clean_filename).suffix or ".jpg"
    unique_name = f"{uuid.uuid4().hex[:8]}-{clean_filename}"
    frontend_dir = Path(__file__).resolve().parents[5] / "ecom-frontend" / "public" / "images" / "products"
    frontend_dir.mkdir(parents=True, exist_ok=True)
    target_path = frontend_dir / unique_name

    with open(target_path, "wb") as f:
        f.write(file_bytes)

    local_url = f"/images/products/{unique_name}"
    return {
        "url": local_url,
        "provider": "local",
        "filename": unique_name,
        "message": "Image saved to local store repository.",
    }


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """
    Get detailed product information by ID (Public).
    """
    product = crud_product.get(db, product_id=product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product


@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_in: ProductCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """
    Create a new product (Admin only).
    Validates category existence and SKU uniqueness.
    """
    # Verify category exists
    category = crud_category.get(db, category_id=product_in.category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with ID {product_in.category_id} does not exist.",
        )

    # Verify SKU is unique
    existing_sku = crud_product.get_by_sku(db, sku=product_in.sku)
    if existing_sku:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Product with SKU '{product_in.sku}' already exists.",
        )

    return crud_product.create(db, product_in=product_in)


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_in: ProductUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """
    Update an existing product (Admin only).
    """
    product = crud_product.get(db, product_id=product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    if product_in.category_id is not None:
        category = crud_category.get(db, category_id=product_in.category_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with ID {product_in.category_id} does not exist.",
            )

    if product_in.sku is not None:
        existing_sku = crud_product.get_by_sku(db, sku=product_in.sku)
        if existing_sku and existing_sku.id != product_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Product with SKU '{product_in.sku}' already exists.",
            )

    return crud_product.update(db, db_product=product, product_in=product_in)


@router.delete("/{product_id}", response_model=MessageResponse)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """
    Delete a product (Admin only).
    """
    success = crud_product.delete(db, product_id=product_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return {"message": "Product successfully deleted"}
