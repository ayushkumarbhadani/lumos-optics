from app.db.session import engine, Base
# Import all models to ensure they are registered with SQLAlchemy's Base metadata
import app.db.base


def init_db():
    Base.metadata.create_all(bind=engine)
