#!/usr/bin/env python3
"""
Add sample products to new categories
"""

import os
import sys

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app
from extensions import db
from models import Category, Product, ProductImage

def add_sample_products():
    """Add sample products to new categories."""
    
    with app.app_context():
        print("🪑 Adding sample products to new categories...")
        
        # Sample products for new categories
        sample_products = [
            # Chairs & Seating
            {
                "name": "Ergonomic Office Chair",
                "description": "High-quality ergonomic office chair with lumbar support and adjustable features.",
                "price": 299.99,
                "stock": 18,
                "category": "Chairs & Seating"
            },
            {
                "name": "Accent Armchair",
                "description": "Stylish accent armchair with velvet upholstery, perfect for living rooms.",
                "price": 399.99,
                "stock": 12,
                "category": "Chairs & Seating"
            },
            {
                "name": "Dining Chair Set",
                "description": "Set of 4 modern dining chairs with comfortable padding.",
                "price": 249.99,
                "stock": 8,
                "category": "Chairs & Seating"
            },
            
            # Tables & Desks
            {
                "name": "Modern Coffee Table",
                "description": "Contemporary coffee table with clean lines and durable finish.",
                "price": 199.99,
                "stock": 15,
                "category": "Tables & Desks"
            },
            {
                "name": "L-Shaped Desk",
                "description": "Spacious L-shaped desk with cable management and storage compartments.",
                "price": 449.99,
                "stock": 5,
                "category": "Tables & Desks"
            },
            {
                "name": "Dining Table Set",
                "description": "Beautiful dining table with 4 chairs, perfect for family meals.",
                "price": 599.99,
                "stock": 10,
                "category": "Tables & Desks"
            },
            
            # Lighting
            {
                "name": "Modern Floor Lamp",
                "description": "Contemporary floor lamp with adjustable head and LED lighting.",
                "price": 129.99,
                "stock": 20,
                "category": "Lighting"
            },
            {
                "name": "Pendant Light",
                "description": "Elegant pendant light with glass shade, perfect for dining areas.",
                "price": 89.99,
                "stock": 25,
                "category": "Lighting"
            },
            {
                "name": "Table Lamp",
                "description": "Classic table lamp with fabric shade and brass base.",
                "price": 79.99,
                "stock": 30,
                "category": "Lighting"
            },
            
            # Rugs & Carpets
            {
                "name": "Persian Style Rug",
                "description": "Beautiful Persian-style rug with intricate patterns and soft texture.",
                "price": 299.99,
                "stock": 8,
                "category": "Rugs & Carpets"
            },
            {
                "name": "Modern Area Rug",
                "description": "Contemporary area rug with geometric patterns and durable construction.",
                "price": 199.99,
                "stock": 12,
                "category": "Rugs & Carpets"
            },
            {
                "name": "Runner Rug",
                "description": "Long runner rug perfect for hallways and entryways.",
                "price": 89.99,
                "stock": 15,
                "category": "Rugs & Carpets"
            }
        ]
        
        added_count = 0
        for prod_data in sample_products:
            # Check if product already exists
            existing = Product.query.filter_by(product_name=prod_data["name"]).first()
            if not existing:
                # Find category
                category = Category.query.filter_by(category_name=prod_data["category"]).first()
                if category:
                    product = Product(
                        product_name=prod_data["name"],
                        product_description=prod_data["description"],
                        product_price=prod_data["price"],
                        stock_quantity=prod_data["stock"],
                        category_id=category.category_id
                    )
                    db.session.add(product)
                    db.session.commit()  # Commit to get product_id
                    
                    # Add a placeholder image
                    image = ProductImage(
                        image_url=f"uploads/product_{product.product_id}.jpg",
                        is_primary=True,
                        product_id=product.product_id
                    )
                    db.session.add(image)
                    db.session.commit()
                    
                    added_count += 1
                    print(f"✅ Added product: {prod_data['name']} to {prod_data['category']}")
                else:
                    print(f"⚠️  Category not found: {prod_data['category']}")
            else:
                print(f"⏭️  Product already exists: {prod_data['name']}")
        
        print(f"✅ Successfully added {added_count} new products")

if __name__ == "__main__":
    add_sample_products()
