# 👓 Lumos Optics — Luxury Eyewear E-Commerce Platform

A production-grade, full-stack luxury eyewear e-commerce platform built with **FastAPI** (Python 3.15, SQLAlchemy, Pydantic v2, SQLite) on the backend and **Next.js 16** (App Router, React 19, TypeScript, Tailwind CSS, Base UI) on the frontend.

Designed with an editorial luxury aesthetic for an Indian optical maison (*"Haute Eyewear & Bespoke Optical Frames"*), priced exclusively in Indian Rupees (**₹**), featuring atomic inventory transactions, role-based access control, Cloudinary image hosting, and an admin management portal.

---

## 🏗️ Architecture Overview

```
                      ┌─────────────────────────────────────────┐
                      │          Lumos Optics Web UI            │
                      │     Next.js 16 (React 19 App Router)     │
                      │   Tailwind CSS • Base UI • Sonner Toast │
                      └────────────────────┬────────────────────┘
                                           │
                                  REST API (JSON / JWT)
                                           │
                      ┌────────────────────▼────────────────────┐
                      │           FastAPI Backend               │
                      │  OAuth2 / JWT Auth • RBAC • Pydantic v2 │
                      │   Atomic Checkout • Cloudinary Upload   │
                      └──────────────┬──────────────────┬───────┘
                                     │                  │
                 ┌───────────────────▼──┐   ┌───────────▼───────────┐
                 │    SQLite Database   │   │  Cloudinary / Media   │
                 │   (SQLAlchemy ORM)   │   │ (Product Photographs) │
                 └──────────────────────┘   └───────────────────────┘
```

---

## ✨ Key Features

### 👑 Storefront & Luxury Brand Identity
- **Indian Maison Heritage**: Editorial brand story celebrating Indian optical craftsmanship, Delhi atelier heritage, and proprietary **IndoFit™ Ergonomics** calibrated for South Asian facial contours.
- **Pure ₹ (INR) Pricing**: Transparent, zero-hidden-markup pricing with standard Indian currency formatting (e.g. `₹2,999.00`).
- **Curated Optical Portfolio**: Filterable catalog by category (*Polarized Sunglasses*, *Prescription Eyeglasses*, *Titanium & Luxury Frames*, *Reading & Computer Glasses*) and in-stock availability.
- **14-Day Complimentary Home Try-On**: Curated box of 4 frames delivered to patrons across 19,000+ Indian pin codes.
- **Dynamic Cart Drawer**: Real-time slide-over shopping bag with responsive toast positioning that glides out of the way when the cart opens.
- **Multi-Page App Router**: Clean multi-page architecture (`/`, `/about`, `/try-on`, `/orders`, `/admin`, `/shipping`, `/privacy`, `/terms`, `/cookies`).

### 🛡️ Admin Portal & Operations
- **Protected Staff Access**: Dedicated `/admin` route strictly accessible to staff accounts with Role-Based Access Control.
- **Responsive Small-Screen Tabs**: Horizontally scrollable segmented controls that never overflow on mobile viewports.
- **Cloudinary Image Hosting & Upload**:
  - Drag-and-drop / file upload for frame photographs with automated Cloudinary CDN hosting.
  - Live thumbnail preview, image replacement, and fallback to direct image URLs.
  - Graceful local file storage fallback during offline development.
- **Order Fulfillment Pipeline**: Real-time status progression (`pending` → `confirmed` → `processing` → `shipped` → `delivered` / `cancelled`).
- **Category & Frame Creation**: Strict Zod schema validation on the client coupled with Pydantic v2 validation on the backend.

### ⚡ Backend Engineering & Reliability
- **Atomic Checkout Transactions**: Guarantees zero overselling; validates stock, locks purchase prices in snapshot order items, decrements inventory, and empties the cart within a single database transaction.
- **Inventory Restoration**: Cancelling an unfulfilled order atomically restores item quantities to live inventory.
- **JWT & Role-Based Access Control (RBAC)**: Distinct permissions for `admin` and `customer` roles.
- **Automated Test Suite**: 17 comprehensive unit & integration tests covering auth, categories, products, cart operations, atomic orders, and image uploads.

---

## 📂 Repository Structure

```
.
├── backend/                  # FastAPI REST API Backend
│   ├── app/
│   │   ├── api/              # Route endpoints & dependency injection (deps.py)
│   │   ├── core/             # JWT security, config settings, & environment
│   │   ├── crud/             # Data access layer (User, Category, Product, Cart, Order)
│   │   ├── db/               # SQLAlchemy engine, session maker, & init_db
│   │   ├── models/           # Declarative database models
│   │   └── schemas/          # Pydantic v2 schemas & validators
│   ├── tests/                # Pytest automated test suite (17 tests)
│   ├── seed.py               # Seed script with 8 luxury eyewear frames & accounts
│   ├── requirements.txt      # Python dependencies
│   └── README.md             # Backend detailed documentation
│
├── ecom-frontend/            # Next.js 16 Luxury Storefront
│   ├── app/                  # App Router pages (/, /about, /admin, /orders, etc.)
│   ├── components/           # UI components (Navbar, CartSheet, ProductCard, etc.)
│   ├── context/              # AuthContext & CartContext React providers
│   ├── lib/                  # API client, INR formatter, & Zod schemas
│   ├── public/               # Local static image assets (/images/products, /images/editorial)
│   └── README.md             # Frontend detailed documentation
│
└── README.md                 # Master full-stack project documentation
```

---

## 🚀 Quickstart

### Prerequisites
- **Python 3.10+** (tested on Python 3.15)
- **Node.js 18+** & **npm**

---

### Step 1: Start the FastAPI Backend

```bash
cd backend

# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Seed the database with sample products & users
python seed.py

# Start the API server
uvicorn app.main:app --reload --port 8000
```
- API Base URL: `http://127.0.0.1:8000`
- Interactive OpenAPI Docs: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

---

### Step 2: Start the Next.js Frontend

In a separate terminal window:

```bash
cd ecom-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
- Storefront URL: `http://localhost:3000`

---

## 🔑 Pre-Seeded Accounts

The database comes pre-seeded with two accounts:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Staff Admin** | `admin@ecommerce.com` | `adminpassword123` | Full access to `/admin`, image uploads, frame publishing, orders fulfillment |
| **Client Member** | `customer@ecommerce.com` | `customerpassword123` | Storefront browsing, cart management, checkout, `/orders` tracking |

---

## ☁️ Cloudinary Configuration (Optional)

To enable automatic Cloudinary CDN image uploads for frames added via the Admin Portal, add your credentials in `backend/.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
# Or use an unsigned preset:
# CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

> **Note:** If Cloudinary credentials are not provided, image uploads automatically save to `ecom-frontend/public/images/products/` and serve seamlessly from local assets.

---

## 🧪 Running Automated Tests

Run the full pytest suite for the backend:

```bash
cd backend
.venv/bin/pytest -v
```

```text
============================== 17 passed in ~6.5s ==============================
```

Verify frontend TypeScript compilation:

```bash
cd ecom-frontend
npx tsc --noEmit
```

Build production frontend:

```bash
cd ecom-frontend
npx next build --webpack
```

---

## 📜 License

Engineered for demonstration and portfolio showcase. All rights reserved.
