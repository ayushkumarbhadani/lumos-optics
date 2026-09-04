from typing import List, Optional, Tuple
from sqlalchemy.orm import Session, joinedload
from app.models.cart import CartItem
from app.models.product import Product


class CRUDCart:
    def get_user_cart(self, db: Session, user_id: int) -> List[CartItem]:
        return (
            db.query(CartItem)
            .options(joinedload(CartItem.product))
            .filter(CartItem.user_id == user_id)
            .all()
        )

    def get_cart_item(self, db: Session, user_id: int, product_id: int) -> Optional[CartItem]:
        return (
            db.query(CartItem)
            .options(joinedload(CartItem.product))
            .filter(CartItem.user_id == user_id, CartItem.product_id == product_id)
            .first()
        )

    def add_to_cart(
        self, db: Session, user_id: int, product_id: int, quantity: int
    ) -> Tuple[CartItem, Optional[str]]:
        """
        Adds product to cart or increments quantity if already present.
        Returns (cart_item, error_message).
        """
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            return None, f"Product with ID {product_id} not found"
        if not product.is_active:
            return None, f"Product '{product.title}' is currently inactive"
        if product.stock < 1:
            return None, f"Product '{product.title}' is currently out of stock"

        existing_item = self.get_cart_item(db, user_id, product_id)
        if existing_item:
            new_qty = existing_item.quantity + quantity
            if new_qty > product.stock:
                return (
                    None,
                    f"Cannot add {quantity} more. Current stock is {product.stock}, and you already have {existing_item.quantity} in cart.",
                )
            existing_item.quantity = new_qty
            db.commit()
            db.refresh(existing_item)
            return existing_item, None

        if quantity > product.stock:
            return (
                None,
                f"Requested quantity {quantity} exceeds available stock of {product.stock}.",
            )

        cart_item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
        db.add(cart_item)
        db.commit()
        db.refresh(cart_item)
        return cart_item, None

    def update_quantity(
        self, db: Session, user_id: int, product_id: int, quantity: int
    ) -> Tuple[Optional[CartItem], Optional[str]]:
        cart_item = self.get_cart_item(db, user_id, product_id)
        if not cart_item:
            return None, f"Product with ID {product_id} is not in your cart"

        product = db.query(Product).filter(Product.id == product_id).first()
        if not product or not product.is_active:
            return None, "Product is no longer available"

        if quantity > product.stock:
            return (
                None,
                f"Requested quantity {quantity} exceeds available stock of {product.stock}",
            )

        cart_item.quantity = quantity
        db.commit()
        db.refresh(cart_item)
        return cart_item, None

    def remove_from_cart(self, db: Session, user_id: int, product_id: int) -> bool:
        cart_item = (
            db.query(CartItem)
            .filter(CartItem.user_id == user_id, CartItem.product_id == product_id)
            .first()
        )
        if not cart_item:
            return False
        db.delete(cart_item)
        db.commit()
        return True

    def clear_cart(self, db: Session, user_id: int) -> int:
        deleted = (
            db.query(CartItem)
            .filter(CartItem.user_id == user_id)
            .delete(synchronize_session=False)
        )
        db.commit()
        return deleted


crud_cart = CRUDCart()
