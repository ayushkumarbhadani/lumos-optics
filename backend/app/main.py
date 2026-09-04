from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.init_db import init_db
from app.api.v1.api import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize database tables
    init_db()
    yield
    # Shutdown events if needed


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="""
# 🛍️ High-Performance E-Commerce REST API
Built with **Python** & **FastAPI**, featuring:
* **Modular API Architecture**: Distinct separation of routers, schemas, CRUD services, and models.
* **Authentication & RBAC**: JWT Bearer token authentication with Customer and Admin roles.
* **Category & Product Management**: Catalog with search, price filtering, and pagination.
* **Shopping Cart**: Real-time stock validation, subtotal calculation, and persistence.
* **Order Management**: Atomic transactional checkout, stock decrementing, and status lifecycle.
* **Relational Database**: SQLAlchemy ORM with foreign keys and cascade rules.
    """,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 Router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Health"])
def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs",
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}
