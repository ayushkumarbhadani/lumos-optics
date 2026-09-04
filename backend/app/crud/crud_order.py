import uuid
from datetime import datetime, timezone
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session, joinedload
from app.models.order import Order, OrderItem, OrderStatus, PaymentStatus
from app.models.cart import CartItem
from app.models.product import Product


class CRUDOrder:
    def checkout_cart(
        self, db: Session, user_id: int, shipping_address: str
    ) -> Tuple[Optional[Order], Optional[str]]:
        """
        Atomically checks out a user's cart:
        1. Verifies cart has items.
        2. Validates availability and inventory for each item.
        3. Creates Order and OrderItem records (locking in historical purchase prices).
        4. Decrements product inventory.
        5. Empties the user's cart.
        """
        cart_items = (
            db.query(CartItem)
            .options(joinedload(CartItem.product))
            .filter(CartItem.user_id == user_id)
            .all()
        )

        if not cart_items:
            return None, "Shopping cart is empty. Add items before checking out."

        # Verify stock for every item before making any modifications
        for item in cart_items:
            product = item.product
            if not product or not product.is_active:
                return None, f"Product '{product.title if product else item.product_id}' is no longer active."
            if product.stock < item.quantity:
                return (
                    None,
                    f"Insufficient stock for '{product.title}'. Requested: {item.quantity}, Available: {product.stock}.",
                )

        # Generate unique order number
        today_str = datetime.now(timezone.utc).strftime("%Y%m%d")
        order_uuid = uuid.uuid4().hex[:8].upper()
        order_number = f"ORD-{today_str}-{order_uuid}"

        # Calculate total and build order items
        total_amount = 0.0
        order_items: List[OrderItem] = []

        for item in cart_items:
            product = item.product
            subtotal = round(product.price * item.quantity, 2)
            total_amount += subtotal

            order_item = OrderItem(
                product_id=product.id,
                product_title=product.title,
                unit_price=product.price,
                quantity=item.quantity,
                subtotal=subtotal,
            )
            order_items.append(order_item)

            # Decrement inventory
            product.stock -= item.quantity

        total_amount = round(total_amount, 2)

        # Create Order
        db_order = Order(
            order_number=order_number,
            user_id=user_id,
            status=OrderStatus.PENDING,
            payment_status=PaymentStatus.PENDING,
            total_amount=total_amount,
            shipping_address=shipping_address,
            items=order_items,
        )
        db.add(db_order)

        # Empty cart
        db.query(CartItem).filter(CartItem.user_id == user_id).delete(synchronize_session=False)

        # Commit atomic transaction
        db.commit()
        db.refresh(db_order)

        return self.get(db, db_order.id), None

    def get(self, db: Session, order_id: int, user_id: Optional[int] = None) -> Optional[Order]:
        query = (
            db.query(Order)
            .options(joinedload(Order.items).joinedload(OrderItem.product))
            .filter(Order.id == order_id)
        )
        if user_id is not None:
            query = query.filter(Order.user_id == user_id)
        return query.first()

    def get_by_order_number(self, db: Session, order_number: str) -> Optional[Order]:
        return (
            db.query(Order)
            .options(joinedload(Order.items).joinedload(OrderItem.product))
            .filter(Order.order_number == order_number)
            .first()
        )

    def get_user_orders(
        self, db: Session, user_id: int, skip: int = 0, limit: int = 20
    ) -> Tuple[List[Order], int]:
        query = (
            db.query(Order)
            .options(joinedload(Order.items))
            .filter(Order.user_id == user_id)
        )
        total = query.count()
        items = query.order_by(Order.id.desc()).offset(skip).limit(limit).all()
        return items, total

    def get_all_orders(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 20,
        status: Optional[OrderStatus] = None,
    ) -> Tuple[List[Order], int]:
        query = db.query(Order).options(joinedload(Order.items))
        if status:
            query = query.filter(Order.status == status)
        total = query.count()
        items = query.order_by(Order.id.desc()).offset(skip).limit(limit).all()
        return items, total

    def update_status(
        self,
        db: Session,
        db_order: Order,
        status: Optional[OrderStatus] = None,
        payment_status: Optional[PaymentStatus] = None,
    ) -> Order:
        if status is not None:
            db_order.status = status
        if payment_status is not None:
            db_order.payment_status = payment_status

        db.commit()
        db.refresh(db_order)
        return db_order

    def cancel_order(self, db: Session, db_order: Order) -> Tuple[Optional[Order], Optional[str]]:
        if db_order.status in [OrderStatus.SHIPPED, OrderStatus.DELIVERED]:
            return None, f"Order cannot be cancelled because it is already {db_order.status.value}."
        if db_order.status == OrderStatus.CANCELLED:
            return None, "Order is already cancelled."

        # Restore inventory
        for item in db_order.items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            if product:
                product.stock += item.quantity

        db_order.status = OrderStatus.CANCELLED
        db.commit()
        db.refresh(db_order)
        return db_order, None


crud_order = CRUDOrder()
