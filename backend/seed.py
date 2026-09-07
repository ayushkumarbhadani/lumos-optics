import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.session import SessionLocal
from app.db.init_db import init_db
from app.models.user import UserRole
from app.models.product import Product
from app.models.category import Category
from app.models.cart import CartItem
from app.models.order import Order, OrderItem
from app.crud.crud_user import crud_user
from app.crud.crud_category import crud_category
from app.crud.crud_product import crud_product
from app.schemas.user import UserCreate
from app.schemas.category import CategoryCreate
from app.schemas.product import ProductCreate


def seed_database(reset_catalog: bool = True):
    print("🌱 Initializing database schema...")
    init_db()

    db = SessionLocal()
    try:
        print("🌱 Seeding Users...")
        # 1. Admin User
        admin = crud_user.get_by_email(db, "admin@ecommerce.com")
        if not admin:
            admin = crud_user.create(
                db,
                UserCreate(
                    email="admin@ecommerce.com",
                    password="adminpassword123",
                    full_name="Lumos Eyewear Admin",
                    role=UserRole.ADMIN,
                ),
            )
            print("  ✅ Created Admin: admin@ecommerce.com (Password: adminpassword123)")
        else:
            print("  ℹ️ Admin already exists.")

        # 2. Customer User
        customer = crud_user.get_by_email(db, "customer@ecommerce.com")
        if not customer:
            customer = crud_user.create(
                db,
                UserCreate(
                    email="customer@ecommerce.com",
                    password="customerpassword123",
                    full_name="Aarav Sharma",
                    role=UserRole.CUSTOMER,
                ),
            )
            print("  ✅ Created Customer: customer@ecommerce.com (Password: customerpassword123)")
        else:
            print("  ℹ️ Customer already exists.")

        if reset_catalog:
            print("\n🔄 Refreshing catalog to Eyewear Brand Collection...")
            # Clean up old cart items and order items referencing old products
            db.query(CartItem).delete()
            db.query(OrderItem).delete()
            db.query(Order).delete()
            db.query(Product).delete()
            db.query(Category).delete()
            db.commit()

        print("\n🌱 Seeding Eyewear Categories...")
        categories_data = [
            {
                "name": "Polarized Sunglasses",
                "description": "High-clarity UV400 polarized shades with anti-glare scratch-resistant lenses.",
            },
            {
                "name": "Prescription Eyeglasses",
                "description": "Handcrafted frames fitted with custom anti-reflective optical grade lenses.",
            },
            {
                "name": "Titanium & Luxury Frames",
                "description": "Featherlight Japanese aerospace titanium and cured Italian Mazzucchelli acetate.",
            },
            {
                "name": "Reading & Computer Glasses",
                "description": "Advanced blue-light filter optics designed to eliminate screen glare and eye fatigue.",
            },
        ]

        created_categories = {}
        for cat in categories_data:
            existing = crud_category.get_by_name(db, cat["name"])
            if not existing:
                created = crud_category.create(db, CategoryCreate(**cat))
                created_categories[cat["name"]] = created
                print(f"  ✅ Created Category: {created.name}")
            else:
                created_categories[cat["name"]] = existing
                print(f"  ℹ️ Category {cat['name']} already exists.")

        print("\n🌱 Seeding Eyewear Products...")
        products_data = [
            {
                "title": "Aura Aviator Polarized Gold",
                "description": "Timeless teardrop aviator crafted in 18K brushed gold stainless steel with polarized emerald-tint lenses and custom acetate temple tips.",
                "price": 3499.00,
                "stock": 35,
                "sku": "EYE-AV-001",
                "image_url": "/images/products/aura-aviator.jpg",
                "category_id": created_categories["Polarized Sunglasses"].id,
            },
            {
                "title": "Vertex Acetate Wayfarer Noir",
                "description": "Iconic square silhouette sculpted from hand-polished Italian acetate with 100% UV400 grey gradient polarized lenses and 5-barrel hinges.",
                "price": 2899.00,
                "stock": 50,
                "sku": "EYE-WF-002",
                "image_url": "/images/products/vertex-wayfarer.jpg",
                "category_id": created_categories["Polarized Sunglasses"].id,
            },
            {
                "title": "Titanium Airframe Round",
                "description": "Aerospace-grade featherlight titanium rimless round frames with ultra-durable memory flex temples. Weighs only 12 grams.",
                "price": 4999.00,
                "stock": 20,
                "sku": "EYE-TI-003",
                "image_url": "/images/products/titanium-airframe.jpg",
                "category_id": created_categories["Titanium & Luxury Frames"].id,
            },
            {
                "title": "BlueShield Digital Screen Glasses",
                "description": "Zero-power computer glasses engineered with dual-coat blue-violet filter to eliminate screen fatigue, headaches, and sleep disruption.",
                "price": 1799.00,
                "stock": 80,
                "sku": "EYE-BL-004",
                "image_url": "/images/products/blueshield-screen.jpg",
                "category_id": created_categories["Reading & Computer Glasses"].id,
            },
            {
                "title": "Komorebi Tortoiseshell Clubmaster",
                "description": "Vintage browline silhouette featuring handcrafted amber tortoiseshell acetate and polished gold-tone metal alloy rims.",
                "price": 3299.00,
                "stock": 25,
                "sku": "EYE-CM-005",
                "image_url": "/images/products/komorebi-clubmaster.jpg",
                "category_id": created_categories["Prescription Eyeglasses"].id,
            },
            {
                "title": "Apex Sport Hydrophobic Shades",
                "description": "Wraparound aerodynamic sports sunglasses with anti-slip rubber bridge, hydrophobic water-repellent coating, and shatterproof lenses.",
                "price": 2499.00,
                "stock": 40,
                "sku": "EYE-SP-006",
                "image_url": "/images/products/apex-sport.jpg",
                "category_id": created_categories["Polarized Sunglasses"].id,
            },
            {
                "title": "Lumina Cat-Eye Emerald Edition",
                "description": "Modern sculpted cat-eye silhouette in translucent emerald crystal acetate with warm amber gradient UV400 lenses.",
                "price": 3199.00,
                "stock": 15,
                "sku": "EYE-CE-007",
                "image_url": "/images/products/lumina-cat-eye.jpg",
                "category_id": created_categories["Polarized Sunglasses"].id,
            },
            {
                "title": "Minimalist Steel Flex Readers",
                "description": "Sleek stainless steel folding reading glasses with compact magnetic carry case and precision anti-reflective reading lenses.",
                "price": 1499.00,
                "stock": 60,
                "sku": "EYE-RD-008",
                "image_url": "/images/products/minimalist-steel.jpg",
                "category_id": created_categories["Reading & Computer Glasses"].id,
            },
        ]

        for prod in products_data:
            existing = crud_product.get_by_sku(db, prod["sku"])
            if not existing:
                created = crud_product.create(db, ProductCreate(**prod))
                print(f"  ✅ Created Product: {created.title} (₹{created.price:,.2f}, Stock: {created.stock})")
            else:
                print(f"  ℹ️ Product {prod['sku']} already exists.")

        print("\n✨ Eyewear database successfully seeded with 4 categories and 8 premium models in INR (₹)!")

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
