#!/usr/bin/env python3
"""
Test script to verify backend functionality and create test users
"""
import requests
import json

BASE_URL = "http://localhost:5000"

def test_backend():
    """Test basic backend functionality"""
    print("Testing backend connectivity...")
    
    # Test home endpoint
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print("✅ Backend is running")
        else:
            print("❌ Backend responded with error")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Backend is not running")
        return False
    
    # Test products endpoint
    try:
        response = requests.get(f"{BASE_URL}/api/product")
        if response.status_code == 200:
            print("✅ Products API is working")
        else:
            print("⚠️ Products API returned:", response.status_code)
    except Exception as e:
        print("❌ Products API error:", str(e))
    
    return True

def create_test_users():
    """Create test users for login testing"""
    print("\nCreating test users...")
    
    # Test regular user
    user_data = {
        "username": "testuser",
        "email": "user@test.com",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=user_data)
        if response.status_code == 201:
            print("✅ Test user created")
        else:
            print("⚠️ Test user creation:", response.status_code, response.text)
    except Exception as e:
        print("❌ Test user creation error:", str(e))
    
    # Test admin user
    admin_data = {
        "username": "admin",
        "email": "admin@test.com", 
        "password": "admin123",
        "is_admin": True
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=admin_data)
        if response.status_code == 201:
            print("✅ Admin user created")
        else:
            print("⚠️ Admin user creation:", response.status_code, response.text)
    except Exception as e:
        print("❌ Admin user creation error:", str(e))

def test_login():
    """Test login functionality"""
    print("\nTesting login...")
    
    # Test regular user login
    login_data = {
        "email": "user@test.com",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        if response.status_code == 200:
            data = response.json()
            print("✅ Regular user login successful")
            print(f"   User role: {data['user']['role']}")
            print(f"   Is admin: {data['user']['is_admin']}")
        else:
            print("❌ Regular user login failed:", response.status_code, response.text)
    except Exception as e:
        print("❌ Login test error:", str(e))
    
    # Test admin login
    admin_login_data = {
        "email": "admin@test.com",
        "password": "admin123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=admin_login_data)
        if response.status_code == 200:
            data = response.json()
            print("✅ Admin login successful")
            print(f"   User role: {data['user']['role']}")
            print(f"   Is admin: {data['user']['is_admin']}")
        else:
            print("❌ Admin login failed:", response.status_code, response.text)
    except Exception as e:
        print("❌ Admin login test error:", str(e))

if __name__ == "__main__":
    print("=== Furniture System Backend Test ===\n")
    
    if test_backend():
        create_test_users()
        test_login()
        
        print("\n=== Test Summary ===")
        print("Backend endpoints to test:")
        print("- Frontend: http://localhost:5173")
        print("- Backend: http://localhost:5000")
        print("- Login: http://localhost:5173/login")
        print("- Admin: http://localhost:5173/admin")
        print("\nTest credentials:")
        print("- Regular user: user@test.com / password123")
        print("- Admin user: admin@test.com / admin123")
    else:
        print("Backend is not running. Please start the backend first.")
