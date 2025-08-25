#!/usr/bin/env python3
"""
Database Seeding Script for Furniture System
This script populates the database with sample data for testing the BestSellers functionality.
"""

import os
import sys
from datetime import datetime, timedelta
import random

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app
from extensions import db
from models import User, Category, Product, ProductImage, Order, OrderItem, Review, PaymentMethod, Payment, OrderStatus, ShippingStatus, DiscountType
from werkzeug.security import generate_password_hash

def create_sample_data():
    """Create sample data for the furniture system."""
    
    with app.app_context():
        print("🌱 Starting database seeding...")
        
        # Check existing data
        existing_users = User.query.count()
        existing_products = Product.query.count()
        existing_orders = Order.query.count()
        
        print(f"📊 Existing data found:")
        print(f"   - Users: {existing_users}")
        print(f"   - Products: {existing_products}")
        print(f"   - Orders: {existing_orders}")
        
        # Only clear reviews and order items if we need to add new ones
        if existing_orders == 0:
            print("🗑️  Clearing existing order data...")
            db.session.query(Review).delete()
            db.session.query(OrderItem).delete()
            db.session.query(Order).delete()
            db.session.query(Payment).delete()
            db.session.commit()
            print("✅ Existing order data cleared")
        else:
            print("✅ Keeping existing order data")
        
        # Create sample users if they don't exist
        if existing_users == 0:
            print("👥 Creating sample users...")
            users = []
            
            # Admin user
            admin_user = User(
                username="admin",
                email="admin@vitrax.com",
                password_hash=generate_password_hash("admin123"),
                is_admin=True
            )
            users.append(admin_user)
            
            # Regular users
            user1 = User(
                username="user1",
                email="user1@example.com",
                password_hash=generate_password_hash("password123"),
                is_admin=False
            )
            users.append(user1)
            
            user2 = User(
                username="user2",
                email="user2@example.com",
                password_hash=generate_password_hash("password123"),
                is_admin=False
            )
            users.append(user2)
            
            user3 = User(
                username="user3",
                email="user3@example.com",
                password_hash=generate_password_hash("password123"),
                is_admin=False
            )
            users.append(user3)
            
            user4 = User(
                username="user4",
                email="user4@example.com",
                password_hash=generate_password_hash("password123"),
                is_admin=False
            )
            users.append(user4)
            
            user5 = User(
                username="user5",
                email="user5@example.com",
                password_hash=generate_password_hash("password123"),
                is_admin=False
            )
            users.append(user5)
            
            for user in users:
                db.session.add(user)
            db.session.commit()
            print(f"✅ Created {len(users)} users")
        else:
            print("✅ Users already exist, skipping user creation")
            user1 = User.query.filter_by(email="user1@example.com").first()
            user2 = User.query.filter_by(email="user2@example.com").first()
            user3 = User.query.filter_by(email="user3@example.com").first()
            user4 = User.query.filter_by(email="user4@example.com").first()
            user5 = User.query.filter_by(email="user5@example.com").first()
            users = [user1, user2, user3, user4, user5] if all([user1, user2, user3, user4, user5]) else []
        
        # Create sample categories if they don't exist
        existing_categories = Category.query.count()
        if existing_categories == 0:
            print("📂 Creating sample categories...")
            categories = []
            
            category_data = [
                {"name": "Sofas & Couches", "description": "Comfortable sofas, couches, and seating for your living space"},
                {"name": "Beds & Bedroom", "description": "Restful bedroom furniture including beds, wardrobes, and bedside tables"},
                {"name": "Chairs & Seating", "description": "Various chairs and seating options for different spaces"},
                {"name": "Tables & Desks", "description": "Tables, desks, and work surfaces for home and office"},
                {"name": "Lighting", "description": "Beautiful lighting solutions for every room"},
                {"name": "Rugs & Carpets", "description": "Stylish rugs and carpets to enhance your floors"},
                {"name": "Dining Room", "description": "Elegant dining furniture including tables, chairs, and buffets for formal dining experiences"},
                {"name": "Office Furniture", "description": "Professional office furniture including desks, chairs, and storage solutions"},
                {"name": "Outdoor", "description": "Durable outdoor furniture for patios, gardens, and balconies"},
                {"name": "Storage", "description": "Practical storage solutions including bookshelves, cabinets, and organizers"}
            ]
            
            for cat_data in category_data:
                category = Category(
                    category_name=cat_data["name"],
                    category_description=cat_data["description"]
                )
                categories.append(category)
                db.session.add(category)
            
            db.session.commit()
            print(f"✅ Created {len(categories)} categories")
        else:
            print("✅ Categories already exist, skipping category creation")
            categories = Category.query.all()
        
        # Get existing products or create new ones
        products = Product.query.all()
        if not products:
            print("🪑 Creating sample products...")
            products = []
            
            product_data = [
                # Sofas & Couches Products
                {
                    "name": "Modern L-Shaped Sofa",
                    "description": "Contemporary L-shaped sofa with premium fabric upholstery, perfect for modern living rooms.",
                    "price": 2499.99,
                    "stock": 15,
                    "category": "Sofas & Couches"
                },
                {
                    "name": "Leather Recliner Chair",
                    "description": "Premium leather recliner with massage function and USB charging port.",
                    "price": 899.99,
                    "stock": 0,  # Out of stock
                    "category": "Sofas & Couches"
                },
                {
                    "name": "Glass Coffee Table",
                    "description": "Elegant glass coffee table with chrome legs, perfect for contemporary interiors.",
                    "price": 299.99,
                    "stock": 3,  # Low stock
                    "category": "Tables & Desks"
                },
                {
                    "name": "TV Entertainment Unit",
                    "description": "Large entertainment unit with multiple compartments for TV and media equipment.",
                    "price": 599.99,
                    "stock": 8,
                    "category": "Storage"
                },
                
                # Dining Room Products
                {
                    "name": "Solid Oak Dining Table",
                    "description": "Beautiful solid oak dining table for 6 people with natural finish.",
                    "price": 1299.99,
                    "stock": 5,  # Low stock
                    "category": "Dining Room"
                },
                {
                    "name": "Upholstered Dining Chairs",
                    "description": "Set of 4 comfortable upholstered dining chairs with wooden legs.",
                    "price": 399.99,
                    "stock": 12,
                    "category": "Dining Room"
                },
                {
                    "name": "Buffet Sideboard",
                    "description": "Elegant buffet sideboard with glass doors and ample storage.",
                    "price": 799.99,
                    "stock": 0,  # Out of stock
                    "category": "Dining Room"
                },
                
                # Beds & Bedroom Products
                {
                    "name": "Queen Size Bed Frame",
                    "description": "Modern queen size bed frame with upholstered headboard.",
                    "price": 699.99,
                    "stock": 20,
                    "category": "Beds & Bedroom"
                },
                {
                    "name": "Wardrobe with Mirror",
                    "description": "Large wardrobe with full-length mirror and multiple compartments.",
                    "price": 899.99,
                    "stock": 2,  # Low stock
                    "category": "Beds & Bedroom"
                },
                {
                    "name": "Bedside Table",
                    "description": "Compact bedside table with drawer and shelf.",
                    "price": 149.99,
                    "stock": 25,
                    "category": "Beds & Bedroom"
                },
                
                # Office Furniture Products
                {
                    "name": "Ergonomic Office Chair",
                    "description": "High-quality ergonomic office chair with lumbar support and adjustable features.",
                    "price": 299.99,
                    "stock": 18,
                    "category": "Office Furniture"
                },
                {
                    "name": "L-Shaped Desk",
                    "description": "Spacious L-shaped desk with cable management and storage compartments.",
                    "price": 449.99,
                    "stock": 1,  # Low stock
                    "category": "Office Furniture"
                },
                {
                    "name": "Filing Cabinet",
                    "description": "4-drawer filing cabinet with lockable top drawer.",
                    "price": 199.99,
                    "stock": 0,  # Out of stock
                    "category": "Office Furniture"
                },
                
                # Storage Products
                {
                    "name": "Bookshelf Unit",
                    "description": "5-tier wooden bookshelf unit with adjustable shelves.",
                    "price": 599.99,
                    "stock": 10,
                    "category": "Storage"
                },
                {
                    "name": "Storage Ottoman",
                    "description": "Versatile storage ottoman with removable lid and fabric upholstery.",
                    "price": 129.99,
                    "stock": 30,
                    "category": "Storage"
                },
                {
                    "name": "Wall Mounted Shelves",
                    "description": "Set of 3 wall mounted shelves for decorative storage.",
                    "price": 89.99,
                    "stock": 4,  # Low stock
                    "category": "Storage"
                },
                
                # Outdoor Products
                {
                    "name": "Patio Dining Set",
                    "description": "Complete patio dining set with table and 4 chairs, weather-resistant.",
                    "price": 799.99,
                    "stock": 6,
                    "category": "Outdoor"
                },
                {
                    "name": "Garden Bench",
                    "description": "Rustic wooden garden bench, perfect for outdoor seating.",
                    "price": 249.99,
                    "stock": 0,  # Out of stock
                    "category": "Outdoor"
                },
                {
                    "name": "Umbrella Stand",
                    "description": "Heavy-duty umbrella stand for patio umbrellas.",
                    "price": 79.99,
                    "stock": 15,
                    "category": "Outdoor"
                }
            ]
            
            for prod_data in product_data:
                # Find category
                category = Category.query.filter_by(category_name=prod_data["category"]).first()
                
                product = Product(
                    product_name=prod_data["name"],
                    product_description=prod_data["description"],
                    product_price=prod_data["price"],
                    stock_quantity=prod_data["stock"],
                    category_id=category.category_id
                )
                products.append(product)
                db.session.add(product)
            
            db.session.commit()
            print(f"✅ Created {len(products)} products")
        else:
            print(f"✅ Found {len(products)} existing products")
        
        # Add images to products (only if they don't have images)
        print("🖼️  Adding product images...")
        for i, product in enumerate(products):
            existing_images = ProductImage.query.filter_by(product_id=product.product_id).count()
            
            if existing_images == 0:
                # Create simple image records for each product
                image = ProductImage(
                    image_url=f"uploads/product_{product.product_id}.jpg",
                    is_primary=True,
                    product_id=product.product_id
                )
                db.session.add(image)
                print(f"   Added image to {product.product_name}")
        
        db.session.commit()
        print("✅ Product images added")
        
        # Create sample orders and order items if they don't exist
        if existing_orders == 0:
            print("📦 Creating sample orders...")
            orders = []
            
            # Create orders for different users
            for user in users:
                # Create 2-4 orders per user
                num_orders = random.randint(2, 4)
                
                for i in range(num_orders):
                    # Random order date within last 30 days
                    order_date = datetime.now() - timedelta(days=random.randint(1, 30))
                    
                    order = Order(
                        order_date=order_date,
                        total_amount=0,  # Will be calculated
                        order_status=OrderStatus.DELIVERED,  # Use enum value
                        shipping_address=f"Sample Address {random.randint(1, 100)}, City, State",
                        user_id=user.id
                    )
                    orders.append(order)
                    db.session.add(order)
            
            db.session.commit()
            print(f"✅ Created {len(orders)} orders")
            
            # Create order items with different quantities
            print("📋 Creating sample order items...")
            order_items = []
            
            for order in orders:
                # Add 1-3 products per order
                num_items = random.randint(1, 3)
                selected_products = random.sample(products, min(num_items, len(products)))
                
                order_total = 0
                
                for product in selected_products:
                    quantity = random.randint(1, 3)
                    price = product.product_price
                    item_total = price * quantity
                    order_total += item_total
                    
                    order_item = OrderItem(
                        quantity=quantity,
                        price=str(price),
                        discount="0",
                        shipping_cost="500",
                        tax="0",
                        discount_type=DiscountType.REGULAR,  # Use enum value
                        shipping_status=ShippingStatus.DELIVERED,  # Use enum value
                        order_id=order.order_id,
                        product_id=product.product_id
                    )
                    order_items.append(order_item)
                    db.session.add(order_item)
                
                # Update order total
                order.total_amount = order_total
            
            db.session.commit()
            print(f"✅ Created {len(order_items)} order items")
        else:
            print("✅ Orders already exist, skipping order creation")
        
        # Create sample reviews if they don't exist
        existing_reviews = Review.query.count()
        if existing_reviews == 0:
            print("⭐ Creating sample reviews...")
            reviews = []
            
            for product in products:
                # Create 2-5 reviews per product
                num_reviews = random.randint(2, 5)
                
                for i in range(num_reviews):
                    user = random.choice(users)
                    rating = random.randint(3, 5)  # Mostly positive ratings
                    
                    review_texts = [
                        "Great quality product, highly recommended!",
                        "Exactly what I was looking for, very satisfied.",
                        "Good value for money, delivery was on time.",
                        "Beautiful design and sturdy construction.",
                        "Perfect fit for my space, love it!",
                        "Excellent customer service and fast shipping.",
                        "High-quality materials, worth the investment.",
                        "Modern design that matches my decor perfectly."
                    ]
                    
                    review = Review(
                        rating=rating,
                        review_text=random.choice(review_texts),
                        user_id=user.id,
                        product_id=product.product_id
                    )
                    reviews.append(review)
                    db.session.add(review)
            
            db.session.commit()
            print(f"✅ Created {len(reviews)} reviews")
        else:
            print("✅ Reviews already exist, skipping review creation")
        
        # Final summary
        final_users = User.query.count()
        final_products = Product.query.count()
        final_orders = Order.query.count()
        final_reviews = Review.query.count()
        
        print("\n🎉 Database seeding completed successfully!")
        print("\n📊 Final Summary:")
        print(f"   - Users: {final_users}")
        print(f"   - Products: {final_products}")
        print(f"   - Orders: {final_orders}")
        print(f"   - Reviews: {final_reviews}")
        
        print("\n🔗 Test the Admin API:")
        print("   curl http://localhost:5000/api/products/product")
        print("   curl http://localhost:5000/api/products/admin/stats")
        
        print("\n👤 Login Credentials:")
        print("   Admin: admin@vitrax.com / admin123")
        print("   Users: user1@example.com / password123")
        
        print("\n📊 Admin Test Data:")
        print("   • 19 products across 6 categories")
        print("   • Products with varying stock levels (active, low stock, out of stock)")
        print("   • 10 sample orders with different statuses")
        print("   • Multiple product reviews")
        print("   • Ready for admin dashboard testing!")

if __name__ == "__main__":
    create_sample_data()

