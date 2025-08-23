#!/usr/bin/env python3
"""
Test script to verify seed data works correctly
"""

import sys
import os

# Add the server directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'server'))

from server.app import app
from server.extensions import db
from server.models import User, Category, Product, Order, Review, OrderStatus

def test_seed_data():
    """Test that seed data was created correctly"""
    
    with app.app_context():
        print("🧪 Testing seed data...")
        
        # Test users
        print("\n1️⃣ Testing Users:")
        users = User.query.all()
        admin_users = [u for u in users if u.is_admin]
        regular_users = [u for u in users if not u.is_admin]
        
        print(f"   Total users: {len(users)}")
        print(f"   Admin users: {len(admin_users)}")
        print(f"   Regular users: {len(regular_users)}")
        
        if admin_users:
            admin = admin_users[0]
            print(f"   Admin username: {admin.username}")
            print(f"   Admin email: {admin.email}")
        
        # Test categories
        print("\n2️⃣ Testing Categories:")
        categories = Category.query.all()
        print(f"   Total categories: {len(categories)}")
        for cat in categories:
            print(f"   - {cat.category_name}: {cat.category_description[:50]}...")
        
        # Test products
        print("\n3️⃣ Testing Products:")
        products = Product.query.all()
        print(f"   Total products: {len(products)}")
        
        # Group by category
        for category in categories:
            cat_products = [p for p in products if p.category_id == category.category_id]
            print(f"   {category.category_name}: {len(cat_products)} products")
        
        # Test stock levels
        active_products = [p for p in products if p.stock_quantity > 5]
        low_stock_products = [p for p in products if 0 < p.stock_quantity <= 5]
        out_of_stock_products = [p for p in products if p.stock_quantity == 0]
        
        print(f"\n   Stock Status:")
        print(f"   - Active (stock > 5): {len(active_products)}")
        print(f"   - Low stock (1-5): {len(low_stock_products)}")
        print(f"   - Out of stock (0): {len(out_of_stock_products)}")
        
        # Test orders
        print("\n4️⃣ Testing Orders:")
        orders = Order.query.all()
        print(f"   Total orders: {len(orders)}")
        
        # Test order statuses
        statuses = {}
        for order in orders:
            status = order.order_status.value
            statuses[status] = statuses.get(status, 0) + 1
        
        for status, count in statuses.items():
            print(f"   - {status}: {count} orders")
        
        # Test reviews
        print("\n5️⃣ Testing Reviews:")
        reviews = Review.query.all()
        print(f"   Total reviews: {len(reviews)}")
        
        if reviews:
            avg_rating = sum(r.rating for r in reviews) / len(reviews)
            print(f"   Average rating: {avg_rating:.2f}")
        
        # Test product prices
        print("\n6️⃣ Testing Product Prices:")
        if products:
            min_price = min(p.product_price for p in products)
            max_price = max(p.product_price for p in products)
            avg_price = sum(p.product_price for p in products) / len(products)
            total_value = sum(p.product_price * p.stock_quantity for p in products)
            
            print(f"   Price range: ${min_price:.2f} - ${max_price:.2f}")
            print(f"   Average price: ${avg_price:.2f}")
            print(f"   Total inventory value: ${total_value:.2f}")
        
        print("\n✅ Seed data test completed!")
        
        # Summary
        print("\n📊 Summary:")
        print(f"   👥 Users: {len(users)}")
        print(f"   📂 Categories: {len(categories)}")
        print(f"   🛋️  Products: {len(products)}")
        print(f"   📦 Orders: {len(orders)}")
        print(f"   ⭐ Reviews: {len(reviews)}")
        
        if products:
            print(f"   💰 Total Value: ${total_value:.2f}")
        
        print("\n🎯 Ready for admin testing!")

if __name__ == "__main__":
    test_seed_data()
