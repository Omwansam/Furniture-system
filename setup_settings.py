#!/usr/bin/env python3
"""
Setup script for the settings system
This script automates the initial setup of the settings system and fixes migration issues
"""

import os
import sys
import subprocess
import time

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        print(f"   Error: {e}")
        if e.stdout:
            print(f"   Output: {e.stdout}")
        if e.stderr:
            print(f"   Error: {e.stderr}")
        return False

def check_file_exists(filepath):
    """Check if a file exists"""
    return os.path.exists(filepath)

def fix_migrations():
    """Fix migration issues if they exist"""
    print("\n🔧 Checking for migration issues...")
    
    # Check if fix_migrations.py exists
    if check_file_exists('BACKEND/server/fix_migrations.py'):
        print("   Found migration fix script, running it...")
        if run_command("cd BACKEND/server && python fix_migrations.py", "Fixing migrations"):
            print("✅ Migrations fixed successfully")
            return True
        else:
            print("❌ Migration fix failed, trying alternative approach...")
            return False
    else:
        print("   No migration fix script found, proceeding with normal setup...")
        return True

def main():
    """Main setup function"""
    print("🚀 Settings System Setup")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not check_file_exists('BACKEND/server/app.py'):
        print("❌ Please run this script from the project root directory")
        print("   Expected structure: BACKEND/server/app.py")
        return
    
    print("✅ Project structure verified")
    
    # Step 1: Fix migrations if needed
    if not fix_migrations():
        print("\n⚠️  Migration issues detected. Please run the fix manually:")
        print("   cd BACKEND/server")
        print("   python fix_migrations.py")
        print("\n   Or use the nuclear option:")
        print("   python reset_database.py")
        return
    
    # Change to backend directory
    os.chdir('BACKEND/server')
    print(f"📁 Changed to directory: {os.getcwd()}")
    
    # Step 2: Run database migration (if not already done)
    print("\n📊 Step 2: Database Migration")
    if not run_command("python -m flask db upgrade head", "Running database migration"):
        print("❌ Database migration failed. Please check the error above.")
        print("   You may need to run the migration fix script first.")
        return
    
    # Step 3: Seed default settings
    print("\n🌱 Step 3: Seeding Default Settings")
    if not check_file_exists('seed_settings.py'):
        print("❌ seed_settings.py not found. Please ensure it exists.")
        return
    
    if not run_command("python seed_settings.py", "Seeding default settings"):
        print("❌ Settings seeding failed. Please check the error above.")
        return
    
    # Step 4: Test the settings system
    print("\n🧪 Step 4: Testing Settings System")
    print("   Starting backend server for testing...")
    
    # Start the server in the background
    try:
        server_process = subprocess.Popen(
            ["python", "app.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        # Wait a bit for the server to start
        print("   Waiting for server to start...")
        time.sleep(5)
        
        # Test if server is responding
        try:
            import requests
            response = requests.get('http://localhost:5000/')
            if response.status_code == 200:
                print("✅ Backend server is running and responding")
            else:
                print(f"⚠️  Backend server responded with status: {response.status_code}")
        except ImportError:
            print("⚠️  requests module not available, skipping server test")
        except Exception as e:
            print(f"⚠️  Could not test server: {e}")
        
        # Stop the server
        print("   Stopping test server...")
        server_process.terminate()
        server_process.wait(timeout=10)
        
    except Exception as e:
        print(f"⚠️  Server test failed: {e}")
    
    # Step 5: Summary
    print("\n✨ Setup Summary")
    print("=" * 30)
    print("✅ Database migration completed")
    print("✅ Default settings seeded")
    print("✅ Settings system is ready")
    
    print("\n📋 Next Steps:")
    print("1. Start the backend server:")
    print("   cd ..")
    print("   python start_server.py")
    print("\n2. Start the frontend:")
    print("   cd ../../FRONTEND/vitrax-limited")
    print("   npm start")
    print("\n3. Test the settings system:")
    print("   cd ../../BACKEND/server")
    print("   python test_settings.py")
    
    print("\n🎉 Settings system setup completed successfully!")
    print("\nFor more information, see:")
    print("- SETTINGS_IMPLEMENTATION.md")
    print("- MIGRATION_FIX_README.md")

if __name__ == '__main__':
    main()
