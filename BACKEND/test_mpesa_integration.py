#!/usr/bin/env python3
"""
M-Pesa STK Push Integration Test Script
Tests the complete M-Pesa payment flow with Safaricom Daraja API
"""

import os
import sys
import json
import requests
from datetime import datetime
from dotenv import load_dotenv

# Add the server directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'server'))

# Load environment variables
load_dotenv()

def test_mpesa_config():
    """Test M-Pesa configuration"""
    print("🔧 Testing M-Pesa Configuration...")
    print("=" * 50)
    
    required_vars = [
        'MPESA_CONSUMER_KEY',
        'MPESA_CONSUMER_SECRET',
        'MPESA_SHORTCODE',
        'MPESA_PASSKEY',
        'MPESA_CALLBACK_URL',
        'MPESA_ENVIRONMENT'
    ]
    
    missing_vars = []
    for var in required_vars:
        value = os.getenv(var)
        if not value:
            missing_vars.append(var)
        else:
            # Mask sensitive values
            if 'KEY' in var or 'SECRET' in var or 'PASSKEY' in var:
                print(f"✅ {var}: {value[:10]}...")
            else:
                print(f"✅ {var}: {value}")
    
    if missing_vars:
        print(f"❌ Missing variables: {', '.join(missing_vars)}")
        return False
    
    print("✅ All M-Pesa configuration variables are set!")
    return True

def test_access_token():
    """Test M-Pesa access token generation"""
    print("\n🔑 Testing M-Pesa Access Token Generation...")
    print("=" * 50)
    
    try:
        # Import Flask app and create application context
        from server.app import app
        from utils.daraja_client import get_mpesa_access_token
        with app.app_context():
            access_token = get_mpesa_access_token()
            if access_token:
                print(f"✅ Access token generated successfully: {access_token[:20]}...")
                return access_token
            else:
                print("❌ Failed to generate access token")
                return None
            
    except Exception as e:
        print(f"❌ Error generating access token: {str(e)}")
        return None

def test_phone_sanitization():
    """Test phone number sanitization"""
    print("\n📱 Testing Phone Number Sanitization...")
    print("=" * 50)
    
    try:
        from utils.daraja_client import sanitize_phone_number
        
        test_phones = [
            "0712345678",
            "+254712345678", 
            "254712345678",
            "712345678",
            "07123456789"
        ]
        
        for phone in test_phones:
            sanitized = sanitize_phone_number(phone)
            print(f"📞 {phone} → {sanitized}")
            
        return True
        
    except Exception as e:
        print(f"❌ Error testing phone sanitization: {str(e)}")
        return False

def test_stk_push_mock():
    """Test STK Push with mock data"""
    print("\n💳 Testing STK Push (Mock)...")
    print("=" * 50)
    
    try:
        # Import Flask app and create application context
        from server.app import app
        from utils.daraja_client import initiate_stk_push
        with app.app_context():
            # Test with mock data
            response, status_code = initiate_stk_push(
                phone_number="254712345678",
                amount=100,
                order_id=12345,
                description="Test Payment"
            )
            
            print(f"📊 Response Status: {status_code}")
            print(f"📊 Response Data: {json.dumps(response, indent=2)}")
            
            if status_code == 200:
                print("✅ STK Push initiated successfully!")
                return response
            else:
                print(f"❌ STK Push failed with status {status_code}")
                return None
            
    except Exception as e:
        print(f"❌ Error testing STK push: {str(e)}")
        return None

def test_backend_endpoints():
    """Test backend endpoints"""
    print("\n🌐 Testing Backend Endpoints...")
    print("=" * 50)
    
    base_url = "http://localhost:5000"
    
    # Test config endpoint
    try:
        response = requests.get(f"{base_url}/payments/test-mpesa-config", timeout=10)
        print(f"📊 Config Test Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Config test passed: {data.get('message', 'Unknown')}")
        else:
            print(f"❌ Config test failed: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"⚠️  Backend not running or config endpoint failed: {str(e)}")
    
    # Test status endpoint
    try:
        response = requests.get(f"{base_url}/payments/mpesa/status/ws_CO_test123", timeout=10)
        print(f"📊 Status Test Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Status endpoint working: {data.get('status', 'Unknown')}")
        else:
            print(f"❌ Status endpoint failed: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"⚠️  Backend not running or status endpoint failed: {str(e)}")

def main():
    """Run all tests"""
    print("🚀 M-Pesa STK Push Integration Test")
    print("=" * 60)
    print(f"⏰ Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Test configuration
    config_ok = test_mpesa_config()
    if not config_ok:
        print("\n❌ Configuration test failed. Please check your .env file.")
        return
    
    # Test access token
    token = test_access_token()
    if not token:
        print("\n❌ Access token test failed. Check your M-Pesa credentials.")
        return
    
    # Test phone sanitization
    phone_ok = test_phone_sanitization()
    if not phone_ok:
        print("\n❌ Phone sanitization test failed.")
        return
    
    # Test STK push
    stk_response = test_stk_push_mock()
    if not stk_response:
        print("\n❌ STK push test failed.")
        return
    
    # Test backend endpoints
    test_backend_endpoints()
    
    print("\n" + "=" * 60)
    print("🎉 M-Pesa Integration Test Complete!")
    print("=" * 60)
    
    if config_ok and token and phone_ok and stk_response:
        print("✅ All tests passed! M-Pesa integration is working correctly.")
        print("\n📋 Next Steps:")
        print("1. Start your Flask backend: python start_server.py")
        print("2. Use ngrok to expose callback URL: ngrok http 5000")
        print("3. Update MPESA_CALLBACK_URL in .env with ngrok URL")
        print("4. Test real STK push from your frontend")
    else:
        print("❌ Some tests failed. Please check the errors above.")

if __name__ == "__main__":
    main()
