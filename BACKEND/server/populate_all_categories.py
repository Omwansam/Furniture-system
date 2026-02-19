#!/usr/bin/env python3
"""
Populate all categories with products to fix "No products found" issue
"""

import os
import sys

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app
from extensions import db
from models import Category, Product, ProductImage

def populate_all_categories():
    """Populate all categories with products."""
    
    with app.app_context():
        print("🌱 Populating all categories with products...")
        
        # Define all categories and their products
        category_products = {
            "Sofas & Couches": [
                {
                    "name": "Modern L-Shaped Sofa",
                    "description": "Contemporary L-shaped sofa with premium fabric upholstery, perfect for modern living rooms.",
                    "price": 2499.99,
                    "stock": 15
                },
                {
                    "name": "Leather Recliner Chair",
                    "description": "Premium leather recliner with massage function and USB charging port.",
                    "price": 899.99,
                    "stock": 8
                },
                {
                    "name": "Fabric Sectional Sofa",
                    "description": "Comfortable fabric sectional sofa with removable covers for easy cleaning.",
                    "price": 1899.99,
                    "stock": 12
                },
                {
                    "name": "Velvet Chesterfield Sofa",
                    "description": "Elegant velvet Chesterfield sofa with tufted back and rolled arms.",
                    "price": 3299.99,
                    "stock": 5
                }
            ],
            
            "Beds & Bedroom": [
                {
                    "name": "Queen Size Bed Frame",
                    "description": "Modern queen size bed frame with upholstered headboard.",
                    "price": 699.99,
                    "stock": 20
                },
                {
                    "name": "Wardrobe with Mirror",
                    "description": "Large wardrobe with full-length mirror and multiple compartments.",
                    "price": 899.99,
                    "stock": 8
                },
                {
                    "name": "Bedside Table",
                    "description": "Compact bedside table with drawer and shelf.",
                    "price": 149.99,
                    "stock": 25
                },
                {
                    "name": "King Size Platform Bed",
                    "description": "Contemporary king size platform bed with built-in storage.",
                    "price": 1299.99,
                    "stock": 10
                }
            ],
            
            "Chairs & Seating": [
                {
                    "name": "Ergonomic Office Chair",
                    "description": "High-quality ergonomic office chair with lumbar support and adjustable features.",
                    "price": 299.99,
                    "stock": 18
                },
                {
                    "name": "Accent Armchair",
                    "description": "Stylish accent armchair with velvet upholstery, perfect for living rooms.",
                    "price": 399.99,
                    "stock": 12
                },
                {
                    "name": "Dining Chair Set",
                    "description": "Set of 4 modern dining chairs with comfortable padding.",
                    "price": 249.99,
                    "stock": 8
                },
                {
                    "name": "Rocking Chair",
                    "description": "Classic wooden rocking chair with comfortable cushion.",
                    "price": 199.99,
                    "stock": 15
                }
            ],
            
            "Tables & Desks": [
                {
                    "name": "Modern Coffee Table",
                    "description": "Contemporary coffee table with clean lines and durable finish.",
                    "price": 199.99,
                    "stock": 15
                },
                {
                    "name": "L-Shaped Desk",
                    "description": "Spacious L-shaped desk with cable management and storage compartments.",
                    "price": 449.99,
                    "stock": 5
                },
                {
                    "name": "Dining Table Set",
                    "description": "Beautiful dining table with 4 chairs, perfect for family meals.",
                    "price": 599.99,
                    "stock": 10
                },
                {
                    "name": "Console Table",
                    "description": "Elegant console table for entryways and hallways.",
                    "price": 299.99,
                    "stock": 12
                }
            ],
            
            "Lighting": [
                {
                    "name": "Modern Floor Lamp",
                    "description": "Contemporary floor lamp with adjustable head and LED lighting.",
                    "price": 129.99,
                    "stock": 20
                },
                {
                    "name": "Pendant Light",
                    "description": "Elegant pendant light with glass shade, perfect for dining areas.",
                    "price": 89.99,
                    "stock": 25
                },
                {
                    "name": "Table Lamp",
                    "description": "Classic table lamp with fabric shade and brass base.",
                    "price": 79.99,
                    "stock": 30
                },
                {
                    "name": "Chandelier",
                    "description": "Beautiful crystal chandelier for formal dining rooms.",
                    "price": 599.99,
                    "stock": 8
                }
            ],
            
            "Rugs & Carpets": [
                {
                    "name": "Persian Style Rug",
                    "description": "Beautiful Persian-style rug with intricate patterns and soft texture.",
                    "price": 299.99,
                    "stock": 8
                },
                {
                    "name": "Modern Area Rug",
                    "description": "Contemporary area rug with geometric patterns and durable construction.",
                    "price": 199.99,
                    "stock": 12
                },
                {
                    "name": "Runner Rug",
                    "description": "Long runner rug perfect for hallways and entryways.",
                    "price": 89.99,
                    "stock": 15
                },
                {
                    "name": "Shag Rug",
                    "description": "Soft shag rug with plush texture for bedrooms.",
                    "price": 159.99,
                    "stock": 18
                }
            ],
            
            "Dining Room": [
                {
                    "name": "Solid Oak Dining Table",
                    "description": "Beautiful solid oak dining table for 6 people with natural finish.",
                    "price": 1299.99,
                    "stock": 5
                },
                {
                    "name": "Upholstered Dining Chairs",
                    "description": "Set of 4 comfortable upholstered dining chairs with wooden legs.",
                    "price": 399.99,
                    "stock": 12
                },
                {
                    "name": "Buffet Sideboard",
                    "description": "Elegant buffet sideboard with glass doors and ample storage.",
                    "price": 799.99,
                    "stock": 6
                },
                {
                    "name": "Wine Cabinet",
                    "description": "Stylish wine cabinet with glass doors and wine glass storage.",
                    "price": 449.99,
                    "stock": 10
                }
            ],
            
            "Office Furniture": [
                {
                    "name": "Ergonomic Office Chair",
                    "description": "High-quality ergonomic office chair with lumbar support and adjustable features.",
                    "price": 299.99,
                    "stock": 18
                },
                {
                    "name": "L-Shaped Desk",
                    "description": "Spacious L-shaped desk with cable management and storage compartments.",
                    "price": 449.99,
                    "stock": 5
                },
                {
                    "name": "Filing Cabinet",
                    "description": "4-drawer filing cabinet with lockable top drawer.",
                    "price": 199.99,
                    "stock": 12
                },
                {
                    "name": "Bookshelf",
                    "description": "Tall bookshelf with adjustable shelves for office organization.",
                    "price": 349.99,
                    "stock": 8
                }
            ],
            
            "Outdoor": [
                {
                    "name": "Patio Dining Set",
                    "description": "Complete patio dining set with table and 4 chairs, weather-resistant.",
                    "price": 799.99,
                    "stock": 6
                },
                {
                    "name": "Garden Bench",
                    "description": "Rustic wooden garden bench, perfect for outdoor seating.",
                    "price": 249.99,
                    "stock": 10
                },
                {
                    "name": "Umbrella Stand",
                    "description": "Heavy-duty umbrella stand for patio umbrellas.",
                    "price": 79.99,
                    "stock": 15
                },
                {
                    "name": "Adirondack Chairs",
                    "description": "Classic Adirondack chairs for comfortable outdoor relaxation.",
                    "price": 199.99,
                    "stock": 12
                }
            ],
            
            "Storage": [
                {
                    "name": "Bookshelf Unit",
                    "description": "5-tier wooden bookshelf unit with adjustable shelves.",
                    "price": 599.99,
                    "stock": 10
                },
                {
                    "name": "Storage Ottoman",
                    "description": "Versatile storage ottoman with removable lid and fabric upholstery.",
                    "price": 129.99,
                    "stock": 30
                },
                {
                    "name": "Wall Mounted Shelves",
                    "description": "Set of 3 wall mounted shelves for decorative storage.",
                    "price": 89.99,
                    "stock": 4
                },
                {
                    "name": "Chest of Drawers",
                    "description": "Traditional chest of drawers with 6 spacious drawers.",
                    "price": 399.99,
                    "stock": 8
                }
            ]
        }
        
        total_added = 0
        
        for category_name, products in category_products.items():
            print(f"\n📂 Processing category: {category_name}")
            
            # Find or create category
            category = Category.query.filter_by(category_name=category_name).first()
            if not category:
                category = Category(
                    category_name=category_name,
                    category_description=f"Products for {category_name}"
                )
                db.session.add(category)
                db.session.commit()
                print(f"✅ Created category: {category_name}")
            
            # Add products to this category
            for prod_data in products:
                # Check if product already exists
                existing = Product.query.filter_by(product_name=prod_data["name"]).first()
                if not existing:
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
                    
                    total_added += 1
                    print(f"  ✅ Added: {prod_data['name']}")
                else:
                    print(f"  ⏭️  Already exists: {prod_data['name']}")
        
        print(f"\n🎉 Successfully added {total_added} new products across all categories!")
        
        # Show summary
        print("\n📊 Category Summary:")
        categories = Category.query.all()
        for cat in categories:
            product_count = Product.query.filter_by(category_id=cat.category_id).count()
            print(f"   - {cat.category_name}: {product_count} products")

if __name__ == "__main__":
    populate_all_categories()