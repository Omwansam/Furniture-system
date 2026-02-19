#!/usr/bin/env python3
"""
Test script for analytics routes
"""

import requests
import json

# Test the analytics endpoints
BASE_URL = "http://localhost:5000"

def test_analytics_endpoints():
    """Test all analytics endpoints"""
    
    # Test endpoints that should work (but return 401 without auth)
    endpoints = [
        "/analytics/admin/dashboard?days=30",
        "/analytics/admin/sales-analytics?days=30",
        "/analytics/admin/customer-analytics?days=30",
        "/analytics/admin/product-analytics?days=30",
        "/analytics/admin/financial-analytics?days=30",
        "/analytics/admin/real-time"
    ]
    
    print("Testing analytics endpoints...")
    print("=" * 50)
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{BASE_URL}{endpoint}")
            print(f"{endpoint}: {response.status_code}")
            
            if response.status_code == 401:
                print("  ✅ Expected: Unauthorized (no JWT token)")
            elif response.status_code == 500:
                print("  ❌ Error: Internal Server Error")
                print(f"  Response: {response.text[:200]}...")
            elif response.status_code == 200:
                print("  ✅ Success!")
            else:
                print(f"  ⚠️  Unexpected status: {response.status_code}")
                
        except requests.exceptions.ConnectionError:
            print(f"{endpoint}: ❌ Connection Error (server not running)")
        except Exception as e:
            print(f"{endpoint}: ❌ Error: {str(e)}")
        
        print()

if __name__ == "__main__":
    test_analytics_endpoints()
