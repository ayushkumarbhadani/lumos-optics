from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.crud.crud_cart import crud_cart
from app.models.user import User
from app.schemas.cart import (
    CartItemCreate,
    CartItemUpdate,
    CartItemResponse,
    CartResponse,
)
from app.schemas.common import MessageResponse

router = APIRouter()


@router.get("/", response_model=CartResponse)
def get_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get the authenticated user's current shopping cart with calculated subtotals.
    """
    items = crud_cart.get_user_cart(db, user_id=current_user.id)
    cart_items_response = []
    total_amount = 0.0
    total_items = 0

    for item in items:
        subtotal = round(item.product.price * item.quantity, 2)
        total_amount += subtotal
        total_items += item.quantity
        cart_items_response.append(
            {
                "id": item.id,
                "user_id": item.user_id,
                "product_id": item.product_id,
                "quantity": item.quantity,
                "subtotal": subtotal,
                "product": item.product,
                "created_at": item.created_at,
                "updated_at": item.updated_at,
            }
        )

    return {
        "items": cart_items_response,
        "total_items": total_items,
        "total_amount": round(total_amount, 2),
    }


@router.post("/items", response_model=CartItemResponse, status_code=status.HTTP_201_CREATED)
def add_to_cart(
    item_in: CartItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Add a product to the shopping cart or increment quantity if already present.
    Validates stock availability.
    """
    cart_item, error = crud_cart.add_to_cart(
        db,
        user_id=current_user.id,
        product_id=item_in.product_id,
        quantity=item_in.quantity,
    )
    if error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)

    subtotal = round(cart_item.product.price * cart_item.quantity, 2)
    return {
        "id": cart_item.id,
        "user_id": cart_item.user_id,
        "product_id": cart_item.product_id,
        "quantity": cart_item.quantity,
        "subtotal": subtotal,
        "product": cart_item.product,
        "created_at": cart_item.created_at,
        "updated_at": cart_item.updated_at,
    }


@router.put("/items/{product_id}", response_model=CartItemResponse)
def update_cart_item_quantity(
    product_id: int,
    item_in: CartItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update the quantity of a specific product in the cart.
    Validates stock availability.
    """
    cart_item, error = crud_cart.update_quantity(
        db,
        user_id=current_user.id,
        product_id=product_id,
        quantity=item_in.quantity,
    )
    if error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)

    subtotal = round(cart_item.product.price * cart_item.quantity, 2)
    return {
        "id": cart_item.id,
        "user_id": cart_item.user_id,
        "product_id": cart_item.product_id,
        "quantity": cart_item.quantity,
        "subtotal": subtotal,
        "product": cart_item.product,
        "created_at": cart_item.created_at,
        "updated_at": cart_item.updated_at,
    }


@router.delete("/items/{product_id}", response_model=MessageResponse)
def remove_from_cart(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Remove an item completely from the shopping cart.
    """
    removed = crud_cart.remove_from_cart(db, user_id=current_user.id, product_id=product_id)
    if not removed:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} was not in your shopping cart.",
        )
    return {"message": "Item successfully removed from cart"}


@router.delete("/", response_model=MessageResponse)
def clear_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Remove all items from the current user's shopping cart.
    """
    count = crud_cart.clear_user_cart(db, user_id=current_user.id)
    return {"message": f"Cart cleared. Removed {count} item(s)."}
