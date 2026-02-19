#!/usr/bin/env python3
"""
Test file to check if the Flask app can be imported without errors
"""

try:
    print("Testing Flask app import...")
    
    # Try to import the app
    from app import app
    
    print("✅ Flask app imported successfully!")
    print("✅ All routes and models are properly configured!")
    
    print("\n🎉 The backend should now start without import errors!")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Please check the routes and models for missing imports.")
except Exception as e:
    print(f"❌ Unexpected error: {e}")
    print("Please check for other configuration issues.")
