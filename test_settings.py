#!/usr/bin/env python3
"""
Test script for the settings system
Run this to verify that the settings API is working correctly
"""

import requests
import json
import sys

# Configuration
BASE_URL = 'http://localhost:5000'
ADMIN_EMAIL = 'admin@vitrax.com'  # Update with actual admin credentials
ADMIN_PASSWORD = 'admin123'       # Update with actual admin password

def get_auth_token():
    """Get authentication token for admin user"""
    try:
        response = requests.post(f'{BASE_URL}/auth/login', json={
            'email': ADMIN_EMAIL,
            'password': ADMIN_PASSWORD
        })
        
        if response.status_code == 200:
            data = response.json()
            return data.get('access_token')
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"❌ Error during login: {e}")
        return None

def test_settings_endpoints(token):
    """Test all settings endpoints"""
    headers = {'Authorization': f'Bearer {token}'}
    
    print("🔍 Testing Settings Endpoints...")
    
    # Test 1: Get all settings
    print("\n1. Testing GET /settings/admin/settings")
    try:
        response = requests.get(f'{BASE_URL}/settings/admin/settings', headers=headers)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success! Found {len(data.get('settings', {}))} categories")
            for category in data.get('settings', {}):
                print(f"   - {category}: {len(data['settings'][category])} settings")
        else:
            print(f"❌ Failed: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 2: Get general settings
    print("\n2. Testing GET /settings/admin/settings/general")
    try:
        response = requests.get(f'{BASE_URL}/settings/admin/settings/general', headers=headers)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success! Found {len(data.get('settings', {}))} general settings")
        else:
            print(f"❌ Failed: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 3: Update a setting
    print("\n3. Testing PUT /settings/admin/settings/general/store_name")
    try:
        response = requests.put(
            f'{BASE_URL}/settings/admin/settings/general/store_name',
            headers=headers,
            json={'value': 'Vitrax Limited (Updated)'}
        )
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success! Updated store name to: {data.get('setting', {}).get('value')}")
        else:
            print(f"❌ Failed: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 4: Bulk update settings
    print("\n4. Testing PUT /settings/admin/settings/bulk-update")
    try:
        updates = [
            {'category': 'general', 'setting_key': 'store_name', 'value': 'Vitrax Limited'},
            {'category': 'general', 'setting_key': 'currency', 'value': 'KES'}
        ]
        
        response = requests.put(
            f'{BASE_URL}/settings/admin/settings/bulk-update',
            headers=headers,
            json={'updates': updates}
        )
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success! Updated {data.get('updated_count', 0)} settings")
        else:
            print(f"❌ Failed: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 5: Export settings
    print("\n5. Testing GET /settings/admin/settings/export")
    try:
        response = requests.get(f'{BASE_URL}/settings/admin/settings/export', headers=headers)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success! Exported {len(data.get('export_data', {}))} categories")
        else:
            print(f"❌ Failed: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    """Main test function"""
    print("🚀 Settings System Test")
    print("=" * 50)
    
    # Check if backend is running
    try:
        response = requests.get(f'{BASE_URL}/')
        if response.status_code != 200:
            print(f"❌ Backend not responding: {response.status_code}")
            return
        print("✅ Backend is running")
    except Exception as e:
        print(f"❌ Cannot connect to backend: {e}")
        print("Make sure the backend server is running on http://localhost:5000")
        return
    
    # Get authentication token
    print("\n🔐 Authenticating...")
    token = get_auth_token()
    if not token:
        print("❌ Authentication failed. Please check admin credentials.")
        return
    
    print("✅ Authentication successful")
    
    # Test settings endpoints
    test_settings_endpoints(token)
    
    print("\n✨ Testing completed!")

if __name__ == '__main__':
    main()
