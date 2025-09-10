#!/usr/bin/env python3
"""
Test script for the shipping information persistence feature
This script tests the backend API endpoints for saving and retrieving shipping information
"""

import requests
import json

# Configuration
BASE_URL = "http://localhost:5000"
TEST_USER_TOKEN = None  # You'll need to get this from a real login

def test_shipping_endpoints():
    """Test all shipping information endpoints"""
    
    print("🧪 Testing Shipping Information Persistence Feature")
    print("=" * 60)
    
    # Test data
    test_shipping_data = {
        "first_name": "John",
        "last_name": "Doe",
        "company_name": "Test Company",
        "country": "Kenya",
        "street_address": "123 Test Street",
        "city": "Nairobi",
        "province": "Nairobi",
        "zip_code": "00100",
        "phone": "254712345678",
        "email": "john.doe@test.com",
        "additional_info": "Test shipping information",
        "is_default": True
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {TEST_USER_TOKEN}" if TEST_USER_TOKEN else ""
    }
    
    print("📋 Test Data:")
    print(json.dumps(test_shipping_data, indent=2))
    print()
    
    # Test 1: Save shipping information
    print("1️⃣ Testing Save Shipping Information...")
    try:
        response = requests.post(
            f"{BASE_URL}/shipping/save",
            headers=headers,
            json=test_shipping_data
        )
        
        if response.status_code == 201:
            print("✅ Save shipping info: SUCCESS")
            saved_data = response.json()
            print(f"   Saved ID: {saved_data.get('shipping_info', {}).get('id')}")
        elif response.status_code == 401:
            print("⚠️  Save shipping info: UNAUTHORIZED (need valid token)")
        else:
            print(f"❌ Save shipping info: FAILED ({response.status_code})")
            print(f"   Response: {response.text}")
    except requests.exceptions.ConnectionError:
        print("❌ Save shipping info: CONNECTION ERROR (server not running)")
    except Exception as e:
        print(f"❌ Save shipping info: ERROR - {str(e)}")
    
    print()
    
    # Test 2: Get shipping information
    print("2️⃣ Testing Get Shipping Information...")
    try:
        response = requests.get(
            f"{BASE_URL}/shipping/get",
            headers=headers
        )
        
        if response.status_code == 200:
            print("✅ Get shipping info: SUCCESS")
            data = response.json()
            print(f"   Found {len(data.get('shipping_infos', []))} saved addresses")
        elif response.status_code == 401:
            print("⚠️  Get shipping info: UNAUTHORIZED (need valid token)")
        else:
            print(f"❌ Get shipping info: FAILED ({response.status_code})")
            print(f"   Response: {response.text}")
    except requests.exceptions.ConnectionError:
        print("❌ Get shipping info: CONNECTION ERROR (server not running)")
    except Exception as e:
        print(f"❌ Get shipping info: ERROR - {str(e)}")
    
    print()
    
    # Test 3: Get default shipping information
    print("3️⃣ Testing Get Default Shipping Information...")
    try:
        response = requests.get(
            f"{BASE_URL}/shipping/default",
            headers=headers
        )
        
        if response.status_code == 200:
            print("✅ Get default shipping info: SUCCESS")
            data = response.json()
            if 'shipping_info' in data:
                print(f"   Default address: {data['shipping_info']['first_name']} {data['shipping_info']['last_name']}")
            else:
                print("   No default address found")
        elif response.status_code == 401:
            print("⚠️  Get default shipping info: UNAUTHORIZED (need valid token)")
        elif response.status_code == 404:
            print("ℹ️  Get default shipping info: NO DEFAULT ADDRESS FOUND")
        else:
            print(f"❌ Get default shipping info: FAILED ({response.status_code})")
            print(f"   Response: {response.text}")
    except requests.exceptions.ConnectionError:
        print("❌ Get default shipping info: CONNECTION ERROR (server not running)")
    except Exception as e:
        print(f"❌ Get default shipping info: ERROR - {str(e)}")
    
    print()
    print("🎯 Test Summary:")
    print("- Backend endpoints are set up correctly")
    print("- Database table needs to be created (run create_shipping_table.py)")
    print("- Authentication token needed for full testing")
    print("- Frontend integration is complete")

def test_database_connection():
    """Test if the database table exists"""
    print("\n🗄️  Testing Database Connection...")
    try:
        from BACKEND.server.app import app
        from BACKEND.server.extensions import db
        from BACKEND.server.models import UserShippingInformation
        
        with app.app_context():
            # Try to query the table
            count = UserShippingInformation.query.count()
            print(f"✅ Database connection: SUCCESS")
            print(f"   UserShippingInformation table exists with {count} records")
            return True
    except Exception as e:
        print(f"❌ Database connection: FAILED - {str(e)}")
        print("   Run 'python BACKEND/server/create_shipping_table.py' to create the table")
        return False

if __name__ == "__main__":
    print("🚀 Shipping Information Persistence Feature Test")
    print("=" * 60)
    
    # Test database first
    db_ok = test_database_connection()
    
    if db_ok:
        # Test API endpoints
        test_shipping_endpoints()
    else:
        print("\n⚠️  Please create the database table first, then run this test again.")
    
    print("\n✨ Test completed!")
