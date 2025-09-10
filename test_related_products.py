#!/usr/bin/env python3
"""
Test script to verify the related products functionality
"""

import requests
import json

def test_related_products():
    """Test the related products API endpoint"""
    base_url = "http://localhost:5000/api"
    
    print("🧪 Testing Related Products API...")
    
    # First, get all products to find a valid product ID
    try:
        print("\n1. Fetching all products...")
        response = requests.get(f"{base_url}/product")
        if response.status_code == 200:
            products = response.json()
            if products.get('products') and len(products['products']) > 0:
                product_id = products['products'][0]['product_id']
                print(f"✅ Found product with ID: {product_id}")
                
                # Test related products endpoint
                print(f"\n2. Testing related products for product ID: {product_id}")
                related_response = requests.get(f"{base_url}/{product_id}/related")
                
                if related_response.status_code == 200:
                    related_data = related_response.json()
                    print(f"✅ Related products fetched successfully!")
                    print(f"   - Found {related_data.get('total_related', 0)} related products")
                    
                    for i, product in enumerate(related_data.get('related_products', []), 1):
                        print(f"   {i}. {product.get('product_name', 'N/A')} - KSh {product.get('product_price', 0):,}")
                    
                    return True
                else:
                    print(f"❌ Failed to fetch related products: {related_response.status_code}")
                    print(f"   Response: {related_response.text}")
                    return False
            else:
                print("❌ No products found in the database")
                return False
        else:
            print(f"❌ Failed to fetch products: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to the server. Make sure the backend is running on http://localhost:5000")
        return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_single_product():
    """Test the single product API endpoint"""
    base_url = "http://localhost:5000/api"
    
    print("\n🧪 Testing Single Product API...")
    
    try:
        # Get a product ID first
        response = requests.get(f"{base_url}/product")
        if response.status_code == 200:
            products = response.json()
            if products.get('products') and len(products['products']) > 0:
                product_id = products['products'][0]['product_id']
                
                # Test single product endpoint
                print(f"\n3. Testing single product for ID: {product_id}")
                single_response = requests.get(f"{base_url}/{product_id}")
                
                if single_response.status_code == 200:
                    product_data = single_response.json()
                    print(f"✅ Single product fetched successfully!")
                    print(f"   - Name: {product_data.get('product_name', 'N/A')}")
                    print(f"   - Price: KSh {product_data.get('product_price', 0):,}")
                    print(f"   - Images: {len(product_data.get('images', []))}")
                    return True
                else:
                    print(f"❌ Failed to fetch single product: {single_response.status_code}")
                    return False
            else:
                print("❌ No products found")
                return False
        else:
            print(f"❌ Failed to fetch products: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 Starting API Tests for Single Product Page Integration")
    print("=" * 60)
    
    # Test related products
    related_success = test_related_products()
    
    # Test single product
    single_success = test_single_product()
    
    print("\n" + "=" * 60)
    print("📊 Test Results:")
    print(f"   Related Products API: {'✅ PASS' if related_success else '❌ FAIL'}")
    print(f"   Single Product API: {'✅ PASS' if single_success else '❌ FAIL'}")
    
    if related_success and single_success:
        print("\n🎉 All tests passed! The Single Product page integration is working correctly.")
    else:
        print("\n⚠️  Some tests failed. Please check the backend server and database.")
    
    print("\n💡 Next steps:")
    print("   1. Start the backend server: cd BACKEND/server && python app.py")
    print("   2. Start the frontend: cd FRONTEND/vitrax-limited && npm run dev")
    print("   3. Visit a product page to see the integration in action")
