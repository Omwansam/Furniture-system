#!/usr/bin/env python3
"""
Product Restoration Script
This script restores products with their actual images from the uploads folder.
"""

import os
import sys
from datetime import datetime

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app
from extensions import db
from models import User, Category, Product, ProductImage

def restore_products_with_images():
    """Restore products with their actual images from the uploads folder."""
    
    with app.app_context():
        print("🔄 Starting product restoration...")
        
        # Check if we have categories
        categories = Category.query.all()
        if not categories:
            print("❌ No categories found. Please run the seed script first.")
            return
        
        # Check if we have products
        existing_products = Product.query.all()
        if existing_products:
            print(f"✅ Found {len(existing_products)} existing products")
            
            # Add images to existing products if they don't have images
            for product in existing_products:
                existing_images = ProductImage.query.filter_by(product_id=product.product_id).count()
                if existing_images == 0:
                    print(f"📸 Adding images to {product.product_name}...")
                    add_images_to_product(product)
        else:
            print("📦 Creating products with images...")
            create_products_with_images(categories)
        
        print("\n🎉 Product restoration completed!")
        
        # Show final summary
        final_products = Product.query.count()
        final_images = ProductImage.query.count()
        print(f"\n📊 Final Summary:")
        print(f"   - Products: {final_products}")
        print(f"   - Product Images: {final_images}")

def create_products_with_images(categories):
    """Create products with their actual images."""
    
    # Define products with their image mappings
    product_data = [
        {
            "name": "Trenton Modular Sofa",
            "description": "Comfortable modular sofa perfect for modern living rooms. Features premium fabric and ergonomic design.",
            "price": 25000.00,
            "stock": 15,
            "category": "Living Room",
            "images": [
                {"file": "product_1_Product1.jpg", "primary": True},
                {"file": "product_1_Product1.1.jpg", "primary": False},
                {"file": "product_1_Product1.2.jpg", "primary": False},
                {"file": "product_1_Product1.3.jpg", "primary": False},
                {"file": "product_1_Product1.4.jpg", "primary": False}
            ]
        },
        {
            "name": "Granite Dining Table with Chairs",
            "description": "Elegant granite dining table with 6 matching chairs. Perfect for family gatherings.",
            "price": 35000.00,
            "stock": 8,
            "category": "Dining Room",
            "images": [
                {"file": "product_2_Mona1.jpg", "primary": True},
                {"file": "product_2_Mona2.jpg", "primary": False},
                {"file": "product_2_Mona3.jpg", "primary": False},
                {"file": "product_2_Mona4.jpg", "primary": False},
                {"file": "product_2_Mona5.jpg", "primary": False}
            ]
        },
        {
            "name": "Outdoor Bar Table and Stools",
            "description": "Weather-resistant outdoor bar table with 4 matching stools. Perfect for outdoor entertaining.",
            "price": 18000.00,
            "stock": 12,
            "category": "Outdoor",
            "images": [
                {"file": "product_1_Product1.jpg", "primary": True},
                {"file": "product_1_Product1.1.jpg", "primary": False}
            ]
        },
        {
            "name": "Plain Console with Teak Mirror",
            "description": "Classic console table with teak mirror. Adds elegance to any entryway.",
            "price": 12000.00,
            "stock": 20,
            "category": "Living Room",
            "images": [
                {"file": "product_2_Mona1.jpg", "primary": True},
                {"file": "product_2_Mona2.jpg", "primary": False}
            ]
        },
        {
            "name": "Queen Size Bed Frame",
            "description": "Modern queen size bed frame with upholstered headboard. Available in multiple colors.",
            "price": 28000.00,
            "stock": 10,
            "category": "Bedroom",
            "images": [
                {"file": "product_1_Product1.1.jpg", "primary": True},
                {"file": "product_1_Product1.2.jpg", "primary": False}
            ]
        },
        {
            "name": "Ergonomic Office Chair",
            "description": "Premium ergonomic office chair with adjustable features. Perfect for long work hours.",
            "price": 15000.00,
            "stock": 25,
            "category": "Office",
            "images": [
                {"file": "product_2_Mona2.jpg", "primary": True},
                {"file": "product_2_Mona3.jpg", "primary": False}
            ]
        },
        {
            "name": "Coffee Table with Storage",
            "description": "Versatile coffee table with hidden storage compartment. Perfect for small spaces.",
            "price": 8500.00,
            "stock": 18,
            "category": "Living Room",
            "images": [
                {"file": "product_1_Product1.2.jpg", "primary": True},
                {"file": "product_1_Product1.3.jpg", "primary": False}
            ]
        },
        {
            "name": "Bookshelf with Drawers",
            "description": "Multi-functional bookshelf with built-in drawers. Great for organizing books and accessories.",
            "price": 9500.00,
            "stock": 14,
            "category": "Office",
            "images": [
                {"file": "product_2_Mona3.jpg", "primary": True},
                {"file": "product_2_Mona4.jpg", "primary": False}
            ]
        }
    ]
    
    for prod_data in product_data:
        # Find category
        category = Category.query.filter_by(category_name=prod_data["category"]).first()
        if not category:
            print(f"⚠️  Category '{prod_data['category']}' not found, skipping {prod_data['name']}")
            continue
        
        # Create product
        product = Product(
            product_name=prod_data["name"],
            product_description=prod_data["description"],
            product_price=prod_data["price"],
            stock_quantity=prod_data["stock"],
            category_id=category.category_id
        )
        db.session.add(product)
        db.session.commit()
        
        print(f"✅ Created product: {product.product_name}")
        
        # Add images to the product
        add_images_to_product(product, prod_data["images"])

def add_images_to_product(product, image_list=None):
    """Add images to a specific product."""
    
    if image_list is None:
        # Use default image mapping based on product name
        if "Sofa" in product.product_name:
            image_list = [
                {"file": "product_1_Product1.jpg", "primary": True},
                {"file": "product_1_Product1.1.jpg", "primary": False},
                {"file": "product_1_Product1.2.jpg", "primary": False}
            ]
        elif "Dining" in product.product_name:
            image_list = [
                {"file": "product_2_Mona1.jpg", "primary": True},
                {"file": "product_2_Mona2.jpg", "primary": False},
                {"file": "product_2_Mona3.jpg", "primary": False}
            ]
        else:
            # Use a mix of images
            image_files = [
                "product_1_Product1.jpg", "product_1_Product1.1.jpg", "product_1_Product1.2.jpg",
                "product_2_Mona1.jpg", "product_2_Mona2.jpg", "product_2_Mona3.jpg"
            ]
            image_list = [
                {"file": image_files[hash(product.product_name) % len(image_files)], "primary": True}
            ]
    
    # Check if images exist in uploads folder
    uploads_path = os.path.join(os.path.dirname(__file__), 'static', 'uploads')
    
    for img_data in image_list:
        image_file = img_data["file"]
        image_path = os.path.join(uploads_path, image_file)
        
        if os.path.exists(image_path):
            # Create product image record
            product_image = ProductImage(
                image_url=f"uploads/{image_file}",
                is_primary=img_data["primary"],
                product_id=product.product_id
            )
            db.session.add(product_image)
            print(f"   📸 Added image: {image_file} (primary: {img_data['primary']})")
        else:
            print(f"   ⚠️  Image file not found: {image_file}")
    
    db.session.commit()

if __name__ == "__main__":
    restore_products_with_images()
