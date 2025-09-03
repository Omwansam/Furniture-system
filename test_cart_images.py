#!/usr/bin/env python3
"""
Test script to verify cart image URLs are working correctly
"""

import requests
import json

def test_cart_images():
    """Test the cart endpoint to see what image URLs are returned"""
    
    # Test the cart endpoint (you'll need to be logged in)
    base_url = "http://localhost:5000"
    
    try:
        # First, let's test the debug endpoint that doesn't require authentication
        debug_response = requests.get(f"{base_url}/cart/debug")
        if debug_response.status_code == 200:
            debug_data = debug_response.json()
            print("🔍 Debug cart data:")
            for item in debug_data.get('debug_info', []):
                print(f"  Product: {item['product_name']}")
                print(f"  Primary Image URL: {item['primary_image_url']}")
                print(f"  All Images: {item['all_images']}")
                print()
        
        print("✅ Debug endpoint working")
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to backend server. Make sure it's running on localhost:5000")
    except Exception as e:
        print(f"❌ Error testing cart images: {e}")

if __name__ == "__main__":
    test_cart_images()
