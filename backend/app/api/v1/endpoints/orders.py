import math
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, get_current_admin
from app.crud.crud_order import crud_order
from app.models.user import User, UserRole
from app.models.order import OrderStatus
from app.schemas.order import (
    CheckoutRequest,
    OrderResponse,
    OrderStatusUpdate,
    OrderListResponse,
)

router = APIRouter()


@router.post("/checkout", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def checkout_cart(
    checkout_in: CheckoutRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Checkout shopping cart:
    - Atomically validates inventory and decrements stock.
    - Creates order and order item records preserving historical purchase prices.
    - Clears shopping cart.
    """
    order, error = crud_order.checkout_cart(
        db, user_id=current_user.id, shipping_address=checkout_in.shipping_address
    )
    if error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)
    return order


@router.get("/", response_model=OrderListResponse)
def list_orders(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    status: Optional[OrderStatus] = Query(None, description="Filter by order status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    List orders.
    - Customers see only their own orders.
    - Admins see all orders across the platform (optional status filter).
    """
    skip = (page - 1) * limit
    if current_user.role == UserRole.ADMIN:
        items, total = crud_order.get_all_orders(db, skip=skip, limit=limit, status=status)
    else:
        items, total = crud_order.get_user_orders(db, user_id=current_user.id, skip=skip, limit=limit)

    total_pages = math.ceil(total / limit) if total > 0 else 1
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": total_pages,
    }


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get order details.
    Customers can only view their own orders; admins can view any order.
    """
    user_id_filter = None if current_user.role == UserRole.ADMIN else current_user.id
    order = crud_order.get(db, order_id=order_id, user_id=user_id_filter)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found or you lack permission to view it.",
        )
    return order


@router.put("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    status_in: OrderStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """
    Update order status or payment status (Admin only).
    """
    order = crud_order.get(db, order_id=order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    return crud_order.update_status(
        db, db_order=order, status=status_in.status, payment_status=status_in.payment_status
    )


@router.post("/{order_id}/cancel", response_model=OrderResponse)
def cancel_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Cancel an order.
    Allowed only if the order has not yet shipped. Restores inventory automatically.
    """
    user_id_filter = None if current_user.role == UserRole.ADMIN else current_user.id
    order = crud_order.get(db, order_id=order_id, user_id=user_id_filter)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found or you lack permission to cancel it.",
        )

    cancelled_order, error = crud_order.cancel_order(db, db_order=order)
    if error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)
    return cancelled_order
