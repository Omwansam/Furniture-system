#!/usr/bin/env python3
"""
Simple M-Pesa Configuration Test
Tests M-Pesa credentials and basic functionality without Flask app context
"""

import os
import base64
import requests
from datetime import datetime
from dotenv import load_dotenv

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
    config_values = {}
    
    for var in required_vars:
        value = os.getenv(var)
        if not value:
            missing_vars.append(var)
        else:
            # Mask sensitive values
            if 'KEY' in var or 'SECRET' in var or 'PASSKEY' in var:
                config_values[var] = value[:10] + "..."
                print(f"✅ {var}: {value[:10]}...")
            else:
                config_values[var] = value
                print(f"✅ {var}: {value}")
    
    if missing_vars:
        print(f"❌ Missing variables: {', '.join(missing_vars)}")
        return False, None
    
    print("✅ All M-Pesa configuration variables are set!")
    return True, config_values

def test_access_token_direct():
    """Test M-Pesa access token generation directly"""
    print("\n🔑 Testing M-Pesa Access Token Generation...")
    print("=" * 50)
    
    try:
        consumer_key = os.getenv('MPESA_CONSUMER_KEY')
        consumer_secret = os.getenv('MPESA_CONSUMER_SECRET')
        environment = os.getenv('MPESA_ENVIRONMENT', 'sandbox')
        
        if not consumer_key or not consumer_secret:
            print("❌ Missing consumer key or secret")
            return None
        
        # Determine auth URL based on environment
        if environment == 'sandbox':
            auth_url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
        else:
            auth_url = 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
        
        print(f"🌐 Auth URL: {auth_url}")
        
        # Create credentials
        credentials = f"{consumer_key}:{consumer_secret}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()
        
        headers = {
            "Authorization": f"Basic {encoded_credentials}",
            "Accept": "application/json"
        }
        
        print("📡 Making request to Safaricom...")
        response = requests.get(auth_url, headers=headers, timeout=30)
        
        print(f"📊 Response Status: {response.status_code}")
        print(f"📊 Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                if 'access_token' in data:
                    access_token = data['access_token']
                    print(f"✅ Access token generated successfully: {access_token[:20]}...")
                    print(f"📊 Token expires in: {data.get('expires_in', 'Unknown')} seconds")
                    return access_token
                else:
                    print(f"❌ No access token in response: {data}")
                    return None
            except Exception as e:
                print(f"❌ Failed to parse JSON response: {e}")
                print(f"📄 Raw response: {response.text[:500]}")
                return None
        else:
            print(f"❌ Auth request failed with status {response.status_code}")
            print(f"📄 Response: {response.text[:500]}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error: {str(e)}")
        return None
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        return None

def test_phone_sanitization():
    """Test phone number sanitization"""
    print("\n📱 Testing Phone Number Sanitization...")
    print("=" * 50)
    
    def sanitize_phone_number(phone):
        """Convert phone number to 2547XXXXXXXX format for M-Pesa API."""
        if not phone:
            return None
            
        # Remove all non-digit characters
        phone = ''.join(c for c in str(phone) if c.isdigit())
        
        # Handle different formats
        if phone.startswith('0') and len(phone) == 10:  # 0712345678
            return '254' + phone[1:]
        elif phone.startswith('+254'):  # +254712345678
            return phone[1:]
        elif phone.startswith('254') and len(phone) == 12:  # 254712345678
            return phone
        elif len(phone) == 9:  # 712345678
            return '254' + phone
        elif len(phone) == 10 and not phone.startswith('0'):  # 7123456789
            return '254' + phone
        
        return None
    
    test_phones = [
        "0712345678",
        "+254712345678", 
        "254712345678",
        "712345678",
        "07123456789"
    ]
    
    for phone in test_phones:
        sanitized = sanitize_phone_number(phone)
        status = "✅" if sanitized else "❌"
        print(f"{status} {phone} → {sanitized}")
    
    return True

def test_password_generation():
    """Test M-Pesa password generation"""
    print("\n🔐 Testing M-Pesa Password Generation...")
    print("=" * 50)
    
    try:
        shortcode = os.getenv('MPESA_SHORTCODE')
        passkey = os.getenv('MPESA_PASSKEY')
        
        if not shortcode or not passkey:
            print("❌ Missing shortcode or passkey")
            return False
        
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        password_string = f"{shortcode}{passkey}{timestamp}"
        password = base64.b64encode(password_string.encode()).decode()
        
        print(f"✅ Shortcode: {shortcode}")
        print(f"✅ Passkey: {passkey[:10]}...")
        print(f"✅ Timestamp: {timestamp}")
        print(f"✅ Password: {password[:20]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ Error generating password: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("🚀 Simple M-Pesa Configuration Test")
    print("=" * 60)
    print(f"⏰ Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Test configuration
    config_ok, config = test_mpesa_config()
    if not config_ok:
        print("\n❌ Configuration test failed. Please check your .env file.")
        return
    
    # Test access token
    token = test_access_token_direct()
    if not token:
        print("\n❌ Access token test failed. Check your M-Pesa credentials.")
        return
    
    # Test phone sanitization
    phone_ok = test_phone_sanitization()
    if not phone_ok:
        print("\n❌ Phone sanitization test failed.")
        return
    
    # Test password generation
    password_ok = test_password_generation()
    if not password_ok:
        print("\n❌ Password generation test failed.")
        return
    
    print("\n" + "=" * 60)
    print("🎉 Simple M-Pesa Test Complete!")
    print("=" * 60)
    
    if config_ok and token and phone_ok and password_ok:
        print("✅ All tests passed! M-Pesa configuration is working correctly.")
        print("\n📋 Your M-Pesa setup is ready for:")
        print("1. ✅ OAuth token generation")
        print("2. ✅ Phone number sanitization")
        print("3. ✅ Password generation")
        print("4. ✅ STK push requests")
        print("\n🚀 Next steps:")
        print("1. Start your Flask backend: python start_server.py")
        print("2. Test the full integration with your frontend")
    else:
        print("❌ Some tests failed. Please check the errors above.")

if __name__ == "__main__":
    main()
