#!/usr/bin/env python3
"""
Simple script to fix admin user role
"""
import requests
import json

def fix_admin_role():
    url = "http://localhost:5000/auth/admin/update-role"
    data = {
        "email": "admin@furniture.com",
        "role": "ADMIN"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✓ Admin role updated successfully!")
        else:
            print("❌ Failed to update admin role")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Make sure the backend is running.")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("Fixing admin user role...")
    fix_admin_role()
