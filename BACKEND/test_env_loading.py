#!/usr/bin/env python3
"""
Test script to verify environment variables are loaded correctly
"""

import os
import sys
from dotenv import load_dotenv

# Add the server directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'server'))

def test_env_loading():
    """Test environment variable loading"""
    print("🔧 Testing Environment Variable Loading...")
    print("=" * 50)
    
    # Test loading from different locations
    locations = [
        '.env',  # Current directory
        'server/.env',  # Server directory
        os.path.join(os.path.dirname(__file__), 'server', '.env')  # Full path
    ]
    
    for location in locations:
        print(f"\n📍 Testing location: {location}")
        if os.path.exists(location):
            print(f"✅ File exists: {location}")
            load_dotenv(location)
            
            # Test M-Pesa variables
            consumer_key = os.getenv('MPESA_CONSUMER_KEY')
            consumer_secret = os.getenv('MPESA_CONSUMER_SECRET')
            
            if consumer_key and consumer_secret:
                print(f"✅ MPESA_CONSUMER_KEY: {consumer_key[:10]}...")
                print(f"✅ MPESA_CONSUMER_SECRET: {consumer_secret[:10]}...")
                return True
            else:
                print(f"❌ M-Pesa variables not found in {location}")
        else:
            print(f"❌ File not found: {location}")
    
    return False

def test_flask_config():
    """Test Flask config loading"""
    print("\n🌐 Testing Flask Config Loading...")
    print("=" * 50)
    
    try:
        from server.config import Config
        
        print(f"✅ SECRET_KEY: {Config.SECRET_KEY[:10] if Config.SECRET_KEY else 'None'}...")
        print(f"✅ MPESA_CONSUMER_KEY: {Config.MPESA_CONSUMER_KEY[:10] if Config.MPESA_CONSUMER_KEY else 'None'}...")
        print(f"✅ MPESA_CONSUMER_SECRET: {Config.MPESA_CONSUMER_SECRET[:10] if Config.MPESA_CONSUMER_SECRET else 'None'}...")
        print(f"✅ MPESA_SHORTCODE: {Config.MPESA_SHORTCODE}")
        print(f"✅ MPESA_ENVIRONMENT: {Config.MPESA_ENVIRONMENT}")
        print(f"✅ DARAJA_AUTH_URL: {Config.DARAJA_AUTH_URL}")
        
        if Config.MPESA_CONSUMER_KEY and Config.MPESA_CONSUMER_SECRET:
            print("✅ Flask config loaded successfully!")
            return True
        else:
            print("❌ Flask config missing M-Pesa credentials")
            return False
            
    except Exception as e:
        print(f"❌ Error loading Flask config: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("🚀 Environment Variable Loading Test")
    print("=" * 60)
    
    # Test direct env loading
    env_ok = test_env_loading()
    
    # Test Flask config
    config_ok = test_flask_config()
    
    print("\n" + "=" * 60)
    if env_ok and config_ok:
        print("✅ All tests passed! Environment variables are loaded correctly.")
        print("\n🚀 Your Flask app should now work with M-Pesa!")
    else:
        print("❌ Some tests failed. Check the errors above.")
        print("\n💡 Try restarting your Flask app after fixing the issues.")

if __name__ == "__main__":
    main()
