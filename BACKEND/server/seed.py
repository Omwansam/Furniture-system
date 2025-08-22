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
                username="admin_user",
                email="admin@furniture.com",
                password_hash=generate_password_hash("admin123"),
                is_admin=True
            )
            users.append(admin_user)
            
            # Regular users
            user1 = User(
                username="john_doe",
                email="john@example.com",
                password_hash=generate_password_hash("password123"),
                is_admin=False
            )
            users.append(user1)
            
            user2 = User(
                username="jane_smith",
                email="jane@example.com",
                password_hash=generate_password_hash("password123"),
                is_admin=False
            )
            users.append(user2)
            
            user3 = User(
                username="bob_wilson",
                email="bob@example.com",
                password_hash=generate_password_hash("password123"),
                is_admin=False
            )
            users.append(user3)
            
            for user in users:
                db.session.add(user)
            db.session.commit()
            print(f"✅ Created {len(users)} users")
        else:
            print("✅ Users already exist, skipping user creation")
            user1 = User.query.filter_by(email="john@example.com").first()
            user2 = User.query.filter_by(email="jane@example.com").first()
            user3 = User.query.filter_by(email="bob@example.com").first()
            users = [user1, user2, user3] if all([user1, user2, user3]) else []
        
        # Create sample categories if they don't exist
        existing_categories = Category.query.count()
        if existing_categories == 0:
            print("📂 Creating sample categories...")
            categories = []
            
            category_data = [
                {"name": "Living Room", "description": "Comfortable furniture for your living space"},
                {"name": "Dining Room", "description": "Elegant dining furniture and accessories"},
                {"name": "Bedroom", "description": "Cozy bedroom furniture and bedding"},
                {"name": "Office", "description": "Professional office furniture and accessories"},
                {"name": "Outdoor", "description": "Durable outdoor furniture and garden accessories"}
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
                {
                    "name": "Trenton Modular Sofa",
                    "description": "Comfortable modular sofa perfect for modern living rooms. Features premium fabric and ergonomic design.",
                    "price": 25000.00,
                    "stock": 15,
                    "category": "Living Room",
                    "image_files": ["product_1_Product1.jpg", "product_1_Product1.1.jpg", "product_1_Product1.2.jpg", "product_1_Product1.3.jpg", "product_1_Product1.4.jpg"]
                },
                {
                    "name": "Granite Dining Table with Chairs",
                    "description": "Elegant granite dining table with 6 matching chairs. Perfect for family gatherings.",
                    "price": 35000.00,
                    "stock": 8,
                    "category": "Dining Room",
                    "image_files": ["product_2_Mona1.jpg", "product_2_Mona2.jpg", "product_2_Mona3.jpg", "product_2_Mona4.jpg", "product_2_Mona5.jpg"]
                },
                {
                    "name": "Outdoor Bar Table and Stools",
                    "description": "Weather-resistant outdoor bar table with 4 matching stools. Perfect for outdoor entertaining.",
                    "price": 18000.00,
                    "stock": 12,
                    "category": "Outdoor",
                    "image_files": ["product_1_Product1.jpg"]
                },
                {
                    "name": "Plain Console with Teak Mirror",
                    "description": "Classic console table with teak mirror. Adds elegance to any entryway.",
                    "price": 12000.00,
                    "stock": 20,
                    "category": "Living Room",
                    "image_files": ["product_2_Mona1.jpg"]
                },
                {
                    "name": "Queen Size Bed Frame",
                    "description": "Modern queen size bed frame with upholstered headboard. Available in multiple colors.",
                    "price": 28000.00,
                    "stock": 10,
                    "category": "Bedroom",
                    "image_files": ["product_1_Product1.1.jpg"]
                },
                {
                    "name": "Ergonomic Office Chair",
                    "description": "Premium ergonomic office chair with adjustable features. Perfect for long work hours.",
                    "price": 15000.00,
                    "stock": 25,
                    "category": "Office",
                    "image_files": ["product_2_Mona2.jpg"]
                },
                {
                    "name": "Coffee Table with Storage",
                    "description": "Versatile coffee table with hidden storage compartment. Perfect for small spaces.",
                    "price": 8500.00,
                    "stock": 18,
                    "category": "Living Room",
                    "image_files": ["product_1_Product1.2.jpg"]
                },
                {
                    "name": "Bookshelf with Drawers",
                    "description": "Multi-functional bookshelf with built-in drawers. Great for organizing books and accessories.",
                    "price": 9500.00,
                    "stock": 14,
                    "category": "Office",
                    "image_files": ["product_2_Mona3.jpg"]
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
                # Use actual image files from uploads folder
                image_files = [
                    "product_1_Product1.jpg", "product_1_Product1.1.jpg", "product_1_Product1.2.jpg", 
                    "product_1_Product1.3.jpg", "product_1_Product1.4.jpg",
                    "product_2_Mona1.jpg", "product_2_Mona2.jpg", "product_2_Mona3.jpg", 
                    "product_2_Mona4.jpg", "product_2_Mona5.jpg"
                ]
                
                # Assign images based on product index
                product_images = image_files[i % len(image_files):(i % len(image_files)) + 3]
                if len(product_images) < 3:
                    product_images.extend(image_files[:3 - len(product_images)])
                
                for j, image_file in enumerate(product_images[:3]):  # Limit to 3 images per product
                    image = ProductImage(
                        image_url=f"uploads/{image_file}",
                        is_primary=(j == 0),  # First image is primary
                        product_id=product.product_id
                    )
                    db.session.add(image)
                
                print(f"   Added {len(product_images[:3])} images to {product.product_name}")
        
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
        
        print("\n🔗 Test the BestSellers API:")
        print("   curl http://localhost:5000/api/bestsellers")
        
        print("\n👤 Login Credentials:")
        print("   Admin: admin@furniture.com / admin123")
        print("   User: john@example.com / password123")

if __name__ == "__main__":
    create_sample_data()
