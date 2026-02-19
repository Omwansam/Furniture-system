#!/usr/bin/env python3
"""
Test script for dashboard routes
"""

import requests
import json

# Test the dashboard endpoints
BASE_URL = "http://localhost:5000"

def test_dashboard_endpoints():
    """Test all dashboard endpoints"""
    
    # Test endpoints that should work (but return 401 without auth)
    endpoints = [
        "/dashboard/admin/overview?timeRange=30d",
        "/dashboard/admin/overview?timeRange=7d",
        "/dashboard/admin/overview?timeRange=90d",
        "/dashboard/admin/overview?timeRange=1y"
    ]
    
    print("Testing dashboard endpoints...")
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

    # Test export endpoint
    print("Testing dashboard export endpoint...")
    print("=" * 50)
    
    try:
        response = requests.post(f"{BASE_URL}/dashboard/admin/overview/export", 
                               json={"format": "csv", "timeRange": "30d"})
        print(f"POST /dashboard/admin/overview/export: {response.status_code}")
        
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
        print("POST /dashboard/admin/overview/export: ❌ Connection Error (server not running)")
    except Exception as e:
        print(f"POST /dashboard/admin/overview/export: ❌ Error: {str(e)}")

if __name__ == "__main__":
    test_dashboard_endpoints()
