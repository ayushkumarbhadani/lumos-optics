import re
from typing import Optional, List, Tuple
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


class CRUDProduct:
    def get(self, db: Session, product_id: int) -> Optional[Product]:
        return db.query(Product).options(joinedload(Product.category)).filter(Product.id == product_id).first()

    def get_by_slug(self, db: Session, slug: str) -> Optional[Product]:
        return db.query(Product).options(joinedload(Product.category)).filter(Product.slug == slug).first()

    def get_by_sku(self, db: Session, sku: str) -> Optional[Product]:
        return db.query(Product).filter(Product.sku == sku.upper()).first()

    def get_multi(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 20,
        category_id: Optional[int] = None,
        search: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        in_stock_only: bool = False,
        active_only: bool = True,
    ) -> Tuple[List[Product], int]:
        query = db.query(Product).options(joinedload(Product.category))

        if active_only:
            query = query.filter(Product.is_active == True)
        if category_id:
            query = query.filter(Product.category_id == category_id)
        if min_price is not None:
            query = query.filter(Product.price >= min_price)
        if max_price is not None:
            query = query.filter(Product.price <= max_price)
        if in_stock_only:
            query = query.filter(Product.stock > 0)
        if search:
            search_filter = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    Product.title.ilike(search_filter),
                    Product.description.ilike(search_filter),
                    Product.sku.ilike(search_filter),
                )
            )

        total = query.count()
        items = query.order_by(Product.id.desc()).offset(skip).limit(limit).all()
        return items, total

    def create(self, db: Session, product_in: ProductCreate) -> Product:
        slug = product_in.slug
        if not slug:
            slug = re.sub(r"[^a-zA-Z0-9_-]", "-", product_in.title.strip().lower())

        base_slug = slug
        counter = 1
        while self.get_by_slug(db, slug=slug):
            slug = f"{base_slug}-{counter}"
            counter += 1

        db_product = Product(
            title=product_in.title,
            slug=slug,
            description=product_in.description,
            price=product_in.price,
            stock=product_in.stock,
            sku=product_in.sku.upper(),
            image_url=product_in.image_url,
            category_id=product_in.category_id,
            is_active=product_in.is_active,
        )
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return self.get(db, db_product.id)

    def update(self, db: Session, db_product: Product, product_in: ProductUpdate) -> Product:
        if product_in.title is not None:
            db_product.title = product_in.title
        if product_in.slug is not None:
            db_product.slug = product_in.slug
        if product_in.description is not None:
            db_product.description = product_in.description
        if product_in.price is not None:
            db_product.price = product_in.price
        if product_in.stock is not None:
            db_product.stock = product_in.stock
        if product_in.sku is not None:
            db_product.sku = product_in.sku.upper()
        if product_in.image_url is not None:
            db_product.image_url = product_in.image_url
        if product_in.category_id is not None:
            db_product.category_id = product_in.category_id
        if product_in.is_active is not None:
            db_product.is_active = product_in.is_active

        db.commit()
        db.refresh(db_product)
        return self.get(db, db_product.id)

    def delete(self, db: Session, product_id: int) -> bool:
        product = self.get(db, product_id)
        if product:
            db.delete(product)
            db.commit()
            return True
        return False


crud_product = CRUDProduct()
