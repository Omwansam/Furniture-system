#!/usr/bin/env python3
"""
Quick fix for the 'table settings already exists' error
This script stamps the migration as applied and seeds the database
"""

import subprocess
import sqlite3
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        if e.stdout:
            print(f"   Output: {e.stdout}")
        if e.stderr:
            print(f"   Error: {e.stderr}")
        return False

def main():
    """Main function"""
    print("🚀 Quick Migration Fix")
    print("=" * 30)
    
    # Check if we're in the right directory
    if not Path("app.py").exists():
        print("❌ Please run this script from the BACKEND/server directory")
        return False
    
    print("✅ Directory structure verified")
    
    # Step 1: Stamp the migration as applied
    print("\n📊 Step 1: Stamping migration as applied...")
    if not run_command("python -m flask db stamp add_settings_table_clean", "Stamping migration"):
        print("❌ Failed to stamp migration")
        return False
    
    # Step 2: Check migration status
    print("\n🔍 Step 2: Checking migration status...")
    try:
        result = subprocess.run(
            ["python", "-m", "flask", "db", "current"],
            capture_output=True, text=True, check=True
        )
        current_revision = result.stdout.strip()
        print(f"✅ Current migration: {current_revision}")
    except Exception as e:
        print(f"⚠️  Could not check migration status: {e}")
    
    # Step 3: Seed settings if needed
    print("\n🌱 Step 3: Checking if settings need seeding...")
    db_path = Path("instance/vitraxlimited.db")
    if db_path.exists():
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM settings;")
            count = cursor.fetchone()[0]
            conn.close()
            
            if count == 0:
                print("   Settings table is empty, seeding default settings...")
                if not run_command("python seed_settings.py", "Seeding settings"):
                    print("❌ Failed to seed settings")
                    return False
            else:
                print(f"   Settings table already has {count} records")
        except Exception as e:
            print(f"⚠️  Could not check settings count: {e}")
    
    # Step 4: Verify the setup
    print("\n🧪 Step 4: Verifying setup...")
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if settings table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='settings';")
        if cursor.fetchone():
            # Check table structure
            cursor.execute("PRAGMA table_info(settings);")
            columns = cursor.fetchall()
            print(f"✅ Settings table verified with {len(columns)} columns")
            
            # Check record count
            cursor.execute("SELECT COUNT(*) FROM settings;")
            count = cursor.fetchone()[0]
            print(f"✅ Settings table has {count} records")
        else:
            print("❌ Settings table not found")
            conn.close()
            return False
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Verification failed: {e}")
        return False
    
    print("\n✨ Quick fix completed successfully!")
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
    
    return True

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
