# 👓 Lumos Optics — Next.js 16 Luxury Eyewear Frontend

A modern, high-performance luxury e-commerce frontend built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Base UI** for **Lumos Optics** (*"Haute Eyewear & Bespoke Optical Frames"*).

---

## 🎨 Design Philosophy & Features

- **Haute Editorial Aesthetic**: Deep obsidian, champagne gold accents, balanced serif typography, and generous spacing inspired by luxury European and Indian optical houses.
- **Pure Indian Rupee (₹) Presentation**: All catalog prices, cart totals, and orders are formatted strictly in INR (`formatINR`).
- **Indian Maison Story**: Complete editorial brand heritage pages highlighting the Mehrauli (New Delhi) atelier, Bengaluru lens surfacing lab, and **IndoFit™ Ergonomics** designed for South Asian facial profiles.
- **Center-Aligned Desktop Navigation**: Elegant luxury navigation bar with center-aligned links, responsive mobile sheet drawer, and role-based links.
- **Cart Drawer with Responsive Toasting**: Slide-out shopping bag (`CartSheet`) with dynamic notification toast offset (`ResponsiveToaster`) that prevents notifications from obscuring cart actions.
- **Admin Inventory & Fulfillment Portal (`/admin`)**:
  - Small-screen responsive tabs with smooth horizontal scrolling.
  - **Cloudinary Image Uploader**: Drag-and-drop / file selection for eyewear photographs with automated Cloudinary hosting, thumbnail previews, and replacement controls.
  - Order status management and category creation.
- **Client Orders Tracker (`/orders`)**: Dedicated client tracking page with timeline badges, snapshot order items, and cancellation support.
- **Comprehensive Informational Pages**: Dedicated routes for `/try-on` (14-Day Home Try-On), `/about` (Atelier Heritage), `/shipping` (Express Transit & Returns), `/privacy` (Optical Data Protocol), `/terms` (Terms of Atelier), and `/cookies`.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16** | App Router, static generation, partial prerendering |
| **React 19** | Component rendering, hooks, Suspense streaming |
| **TypeScript** | Type safety across API responses and components |
| **Tailwind CSS v4** | Utility-first styling with modern CSS variables |
| **@base-ui/react** | Accessible UI primitives (Dialog, Sheet, Tabs) |
| **Lucide React** | Clean vector iconography |
| **Sonner** | Toast notifications with responsive position transitions |
| **Zod** | Client-side form validation matching backend Pydantic models |

---

## 📁 Directory Structure

```
ecom-frontend/
├── app/
│   ├── layout.tsx         # Root layout with Navbar, Footer, and Global Providers
│   ├── page.tsx           # Home page, spotlight hero, category filter, catalog
│   ├── about/page.tsx     # Atelier Heritage & Indian Roots story
│   ├── admin/page.tsx     # Staff Inventory & Operations Portal
│   ├── orders/page.tsx    # Customer order history & tracking
│   ├── try-on/page.tsx    # 14-Day Complimentary Home Try-On concierge
│   ├── shipping/page.tsx  # Express dispatch across 19,000+ Indian pincodes
│   ├── privacy/page.tsx   # Prescription & optical data privacy protocol
│   ├── terms/page.tsx     # Terms of Atelier & 1-year anti-scratch warranty
│   └── cookies/page.tsx   # Cookie preferences & session data
│
├── components/
│   ├── Navbar.tsx         # Center-aligned nav, brand logo, mobile sheet drawer
│   ├── Footer.tsx         # Streaming footer with Indian headquarters details
│   ├── ProductCard.tsx    # Flush luxury eyewear card with stock & category pills
│   ├── CartSheet.tsx      # Slide-out shopping bag with real-time quantity controls
│   ├── CheckoutModal.tsx  # Multi-step express checkout dialog
│   ├── AuthModal.tsx      # Sign in / Register modal
│   ├── AdminDashboard.tsx # Responsive tabs, Cloudinary image upload, order fulfillment
│   └── Providers.tsx      # Context providers & ResponsiveToaster
│
├── context/
│   ├── AuthContext.tsx    # JWT storage, user session, role identification
│   └── CartContext.tsx    # Real-time backend cart sync & total calculations
│
├── lib/
│   ├── api.ts            # Type-safe Fetch wrapper with Bearer token injection
│   ├── format.ts         # Currency formatting utility (formatINR)
│   └── validations/      # Zod validation schemas (product, category)
│
└── public/
    └── images/
        ├── products/     # Studio product photographs of eyewear frames
        └── editorial/    # Atelier craftsmanship editorial visuals
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Verify Backend is Running
Ensure the FastAPI backend is running at `http://127.0.0.1:8000`:
```bash
# In the backend directory:
uvicorn app.main:app --reload --port 8000
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the storefront.

---

## 🔑 Authentication Roles

- **Sign In** using the user button in the top right:
  - **Staff Admin:** `admin@ecommerce.com` / `adminpassword123` → Accesses **Admin Portal** link in navbar.
  - **Client Member:** `customer@ecommerce.com` / `customerpassword123` → Accesses **My Orders** in navbar.

---

## 🧪 Verification & Building

Run type checks:
```bash
npx tsc --noEmit
```

Build for production:
```bash
npx next build --webpack
```
All routes (`/`, `/about`, `/admin`, `/orders`, `/try-on`, `/shipping`, `/privacy`, `/terms`, `/cookies`) will be compiled and prerendered.
