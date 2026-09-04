import re
from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate


class CRUDCategory:
    def get(self, db: Session, category_id: int) -> Optional[Category]:
        return db.query(Category).filter(Category.id == category_id).first()

    def get_by_slug(self, db: Session, slug: str) -> Optional[Category]:
        return db.query(Category).filter(Category.slug == slug).first()

    def get_by_name(self, db: Session, name: str) -> Optional[Category]:
        return db.query(Category).filter(Category.name.ilike(name)).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100, active_only: bool = True) -> List[Category]:
        query = db.query(Category)
        if active_only:
            query = query.filter(Category.is_active == True)
        return query.offset(skip).limit(limit).all()

    def create(self, db: Session, category_in: CategoryCreate) -> Category:
        slug = category_in.slug
        if not slug:
            slug = re.sub(r"[^a-zA-Z0-9_-]", "-", category_in.name.strip().lower())

        # Ensure slug uniqueness
        base_slug = slug
        counter = 1
        while self.get_by_slug(db, slug=slug):
            slug = f"{base_slug}-{counter}"
            counter += 1

        db_category = Category(
            name=category_in.name,
            slug=slug,
            description=category_in.description,
            is_active=category_in.is_active,
        )
        db.add(db_category)
        db.commit()
        db.refresh(db_category)
        return db_category

    def update(self, db: Session, db_category: Category, category_in: CategoryUpdate) -> Category:
        if category_in.name is not None:
            db_category.name = category_in.name
        if category_in.slug is not None:
            db_category.slug = category_in.slug
        if category_in.description is not None:
            db_category.description = category_in.description
        if category_in.is_active is not None:
            db_category.is_active = category_in.is_active

        db.commit()
        db.refresh(db_category)
        return db_category

    def delete(self, db: Session, category_id: int) -> bool:
        category = self.get(db, category_id)
        if category:
            db.delete(category)
            db.commit()
            return True
        return False


crud_category = CRUDCategory()
