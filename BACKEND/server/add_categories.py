#!/usr/bin/env python3
"""
Add missing categories to the database
"""

import os
import sys

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app
from extensions import db
from models import Category

def add_missing_categories():
    """Add missing categories to the database."""
    
    with app.app_context():
        print("🌱 Adding missing categories...")
        
        # Define the categories we need
        required_categories = [
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
        
        added_count = 0
        for cat_data in required_categories:
            # Check if category already exists
            existing = Category.query.filter_by(category_name=cat_data["name"]).first()
            if not existing:
                category = Category(
                    category_name=cat_data["name"],
                    category_description=cat_data["description"]
                )
                db.session.add(category)
                added_count += 1
                print(f"✅ Added category: {cat_data['name']}")
            else:
                print(f"⏭️  Category already exists: {cat_data['name']}")
        
        if added_count > 0:
            db.session.commit()
            print(f"✅ Successfully added {added_count} new categories")
        else:
            print("✅ All required categories already exist")
        
        # Show all categories
        print("\n📋 All categories in database:")
        categories = Category.query.all()
        for cat in categories:
            print(f"   - {cat.category_name}")

if __name__ == "__main__":
    add_missing_categories()
