#!/usr/bin/env python3
"""
Test script to verify the Admin Product Management API endpoints
"""

import requests
import json
import time

BASE_URL = "http://localhost:5000"

def test_admin_product_endpoints():
    """Test the admin product management endpoints"""
    
    print("🧪 Testing Admin Product Management API...")
    print(f"Base URL: {BASE_URL}")
    
    # Test 1: Get all products
    print("\n1️⃣ Testing GET /products/product...")
    try:
        response = requests.get(f"{BASE_URL}/products/product", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, dict) and 'products' in data:
                products = data['products']
                pagination = data.get('pagination', {})
                print(f"✅ Success! Found {len(products)} products")
                print(f"   Total: {pagination.get('total', 'N/A')}")
                print(f"   Pages: {pagination.get('pages', 'N/A')}")
                print(f"   Current Page: {pagination.get('current_page', 'N/A')}")
                
                if products:
                    print("\n📋 Sample Product:")
                    product = products[0]
                    print(f"   ID: {product.get('product_id')}")
                    print(f"   Name: {product.get('product_name')}")
                    print(f"   Price: ${product.get('product_price', 0):.2f}")
                    print(f"   Stock: {product.get('stock_quantity', 0)}")
                    print(f"   Category: {product.get('category_name', 'N/A')}")
            else:
                print(f"✅ Success! Found {len(data)} products (legacy format)")
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    # Test 2: Get products with filters
    print("\n2️⃣ Testing GET /products/product with filters...")
    try:
        params = {
            'page': 1,
            'per_page': 5,
            'sort_by': 'product_name',
            'sort_order': 'asc'
        }
        response = requests.get(f"{BASE_URL}/products/product", params=params, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, dict) and 'products' in data:
                products = data['products']
                print(f"✅ Success! Found {len(products)} products with filters")
            else:
                print(f"✅ Success! Found {len(data)} products with filters (legacy format)")
        else:
            print(f"❌ Error: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    # Test 3: Get categories
    print("\n3️⃣ Testing GET /categories...")
    try:
        response = requests.get(f"{BASE_URL}/categories", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            categories = response.json()
            print(f"✅ Success! Found {len(categories)} categories")
            
            if categories:
                print("\n📋 Categories:")
                for cat in categories[:3]:
                    print(f"   - {cat.get('category_name')} (ID: {cat.get('category_id')})")
        else:
            print(f"❌ Error: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    # Test 4: Get category stats
    print("\n4️⃣ Testing GET /categories/stats...")
    try:
        response = requests.get(f"{BASE_URL}/categories/stats", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            stats = data.get('stats', [])
            print(f"✅ Success! Found stats for {len(stats)} categories")
            
            if stats:
                print("\n📊 Category Stats:")
                for stat in stats[:3]:
                    print(f"   - {stat.get('category_name')}: {stat.get('product_count', 0)} products")
        else:
            print(f"❌ Error: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    # Test 5: Test admin stats endpoint (will fail without auth, but should return 401)
    print("\n5️⃣ Testing GET /products/admin/stats (requires auth)...")
    try:
        response = requests.get(f"{BASE_URL}/products/admin/stats", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 401:
            print("✅ Expected: Authentication required")
        elif response.status_code == 200:
            data = response.json()
            print("✅ Success! Got admin stats")
            print(f"   Total Products: {data.get('total_products', 0)}")
            print(f"   Out of Stock: {data.get('out_of_stock', 0)}")
            print(f"   Low Stock: {data.get('low_stock', 0)}")
            print(f"   Total Value: ${data.get('total_value', 0):.2f}")
        else:
            print(f"❌ Unexpected status: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

def test_product_creation():
    """Test product creation (requires auth)"""
    print("\n6️⃣ Testing POST /products/product (requires auth)...")
    
    # Sample product data
    product_data = {
        'product_name': 'Test Product',
        'product_description': 'This is a test product',
        'product_price': 99.99,
        'stock_quantity': 10,
        'category_id': 1
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/products/product",
            json=product_data,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 401:
            print("✅ Expected: Authentication required")
        elif response.status_code == 201:
            data = response.json()
            print("✅ Success! Product created")
            print(f"   Product ID: {data.get('product_id')}")
        else:
            print(f"❌ Unexpected status: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    print("🚀 Starting Admin API Tests...")
    print("=" * 50)
    
    test_admin_product_endpoints()
    test_product_creation()
    
    print("\n" + "=" * 50)
    print("✅ Admin API Tests Completed!")
    print("\n📝 Notes:")
    print("   - Some endpoints require authentication (JWT token)")
    print("   - To test authenticated endpoints, you need to:")
    print("     1. Login as admin user")
    print("     2. Get the JWT token")
    print("     3. Include it in the Authorization header")
    print("   - The frontend handles authentication automatically")
