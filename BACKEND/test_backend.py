#!/usr/bin/env python3
"""
Simple test script to check if the backend is working
"""

import requests
import json

def test_backend():
    base_url = "http://localhost:5000"
    
    print("Testing backend connection...")
    
    try:
        # Test basic connection
        response = requests.get(f"{base_url}/", timeout=5)
        print(f"✓ Basic connection: {response.status_code} - {response.text}")
        
        # Test if server is running
        print(f"✓ Backend server is running on {base_url}")
        
        # Test available endpoints
        endpoints = [
            "/auth/users",
            "/orders/admin/all",
            "/customers/admin/customers",
            "/api/product",
            "/categories"
        ]
        
        print("\nTesting endpoints (expecting 401/403 for protected routes):")
        for endpoint in endpoints:
            try:
                response = requests.get(f"{base_url}{endpoint}", timeout=5)
                print(f"✓ {endpoint}: {response.status_code}")
            except requests.exceptions.RequestException as e:
                print(f"✗ {endpoint}: {e}")
        
        print("\n✓ Backend is accessible!")
        return True
        
    except requests.exceptions.ConnectionError:
        print("✗ Backend server is not running or not accessible")
        print("Please start the backend server with: python app.py")
        return False
    except Exception as e:
        print(f"✗ Error testing backend: {e}")
        return False

if __name__ == "__main__":
    test_backend()
