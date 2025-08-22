#!/usr/bin/env python3
"""
Simple test script to verify the BestSellers API endpoint
"""

import requests
import json

def test_best_sellers_api():
    """Test the best sellers API endpoint"""
    
    url = "http://localhost:5000/api/bestsellers"
    
    try:
        print("🧪 Testing BestSellers API...")
        print(f"URL: {url}")
        
        response = requests.get(url, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success! Found {len(data)} best selling products")
            
            if data:
                print("\n📋 Sample Products:")
                for i, product in enumerate(data[:3]):
                    print(f"\n{i+1}. {product.get('product_name', 'N/A')}")
                    print(f"   Price: Rs. {product.get('product_price', 0):,.2f}")
                    print(f"   Orders: {product.get('order_count', 0)}")
                    print(f"   Rating: {product.get('avg_rating', 0):.1f} ⭐")
                    print(f"   Image: {product.get('primary_image', 'N/A')}")
            else:
                print("⚠️  No products found")
                
        elif response.status_code == 404:
            print("❌ 404 Error: Endpoint not found")
            print("   Make sure the backend server is running and the route is properly registered")
            
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Backend server is not running")
        print("   Start the backend with: cd BACKEND && pipenv run python server/app.py")
        
    except requests.exceptions.Timeout:
        print("❌ Timeout Error: Request took too long")
        
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")

if __name__ == "__main__":
    test_best_sellers_api()
