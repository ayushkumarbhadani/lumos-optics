from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password


class CRUDUser:
    def get(self, db: Session, user_id: int) -> Optional[User]:
        return db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email.lower()).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100) -> List[User]:
        return db.query(User).offset(skip).limit(limit).all()

    def create(self, db: Session, user_in: UserCreate) -> User:
        db_user = User(
            email=user_in.email.lower(),
            hashed_password=get_password_hash(user_in.password),
            full_name=user_in.full_name,
            role=user_in.role or "customer",
            is_active=True,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    def update(self, db: Session, db_user: User, user_in: UserUpdate) -> User:
        if user_in.full_name is not None:
            db_user.full_name = user_in.full_name
        if user_in.password is not None:
            db_user.hashed_password = get_password_hash(user_in.password)
        if user_in.is_active is not None:
            db_user.is_active = user_in.is_active
        if user_in.role is not None:
            db_user.role = user_in.role

        db.commit()
        db.refresh(db_user)
        return db_user

    def authenticate(self, db: Session, email: str, password: str) -> Optional[User]:
        user = self.get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user


crud_user = CRUDUser()
