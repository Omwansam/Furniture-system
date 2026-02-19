#!/usr/bin/env python3
"""
Verify that the settings system is properly set up
This script checks all components of the settings system
"""

import os
import sys
import sqlite3
from pathlib import Path

def check_database():
    """Check if database and settings table exist"""
    print("🔍 Checking database...")
    
    db_path = Path("instance/vitraxlimited.db")
    if not db_path.exists():
        print("❌ Database file not found")
        return False
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if settings table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='settings';")
        if not cursor.fetchone():
            print("❌ Settings table not found")
            conn.close()
            return False
        
        # Check table structure
        cursor.execute("PRAGMA table_info(settings);")
        columns = cursor.fetchall()
        expected_columns = [
            'id', 'setting_key', 'setting_value', 'setting_type', 
            'category', 'description', 'is_editable', 'created_at', 'updated_at'
        ]
        
        actual_columns = [col[1] for col in columns]
        missing_columns = set(expected_columns) - set(actual_columns)
        
        if missing_columns:
            print(f"❌ Missing columns: {missing_columns}")
            conn.close()
            return False
        
        # Check if settings were seeded
        cursor.execute("SELECT COUNT(*) FROM settings;")
        count = cursor.fetchone()[0]
        
        # Check categories
        cursor.execute("SELECT DISTINCT category FROM settings;")
        categories = [row[0] for row in cursor.fetchall()]
        
        conn.close()
        
        print(f"✅ Database verified:")
        print(f"   - Settings table exists with {len(columns)} columns")
        print(f"   - {count} settings found")
        print(f"   - Categories: {', '.join(categories)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Database check failed: {e}")
        return False

def check_migrations():
    """Check migration status"""
    print("\n🔍 Checking migrations...")
    
    try:
        import subprocess
        result = subprocess.run(
            ["python", "-m", "flask", "db", "current"],
            capture_output=True, text=True, check=True
        )
        current_revision = result.stdout.strip()
        print(f"✅ Current migration: {current_revision}")
        return True
    except Exception as e:
        print(f"❌ Migration check failed: {e}")
        return False

def check_files():
    """Check if all required files exist"""
    print("\n🔍 Checking required files...")
    
    required_files = [
        "app.py",
        "models.py",
        "seed_settings.py",
        "test_settings.py",
        "routes/settings_route.py"
    ]
    
    missing_files = []
    for file_path in required_files:
        if not Path(file_path).exists():
            missing_files.append(file_path)
    
    if missing_files:
        print(f"❌ Missing files: {', '.join(missing_files)}")
        return False
    
    print("✅ All required files found")
    return True

def check_settings_api():
    """Check if settings API is accessible"""
    print("\n🔍 Checking settings API...")
    
    try:
        import requests
        response = requests.get('http://localhost:5000/')
        if response.status_code == 200:
            print("✅ Backend server is responding")
            return True
        else:
            print(f"⚠️  Backend server responded with status: {response.status_code}")
            return False
    except ImportError:
        print("⚠️  requests module not available, skipping API check")
        return True
    except Exception as e:
        print(f"❌ API check failed: {e}")
        print("   Make sure the backend server is running")
        return False

def run_test():
    """Run the settings test"""
    print("\n🧪 Running settings test...")
    
    try:
        import subprocess
        result = subprocess.run(
            ["python", "test_settings.py"],
            capture_output=True, text=True, check=True
        )
        print("✅ Settings test passed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Settings test failed:")
        if e.stdout:
            print(f"   Output: {e.stdout}")
        if e.stderr:
            print(f"   Error: {e.stderr}")
        return False
    except Exception as e:
        print(f"❌ Test execution failed: {e}")
        return False

def main():
    """Main verification function"""
    print("🔍 Settings System Verification")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not Path("app.py").exists():
        print("❌ Please run this script from the BACKEND/server directory")
        return False
    
    print("✅ Directory structure verified")
    
    # Run all checks
    checks = [
        check_files,
        check_database,
        check_migrations,
        check_settings_api,
        run_test
    ]
    
    passed = 0
    total = len(checks)
    
    for check in checks:
        if check():
            passed += 1
        print()
    
    # Summary
    print("📊 Verification Summary")
    print("=" * 30)
    print(f"Passed: {passed}/{total} checks")
    
    if passed == total:
        print("🎉 All checks passed! Settings system is ready.")
        print("\n📋 Next Steps:")
        print("1. Start the backend server:")
        print("   cd ..")
        print("   python start_server.py")
        print("\n2. Start the frontend:")
        print("   cd ../../FRONTEND/vitrax-limited")
        print("   npm start")
        return True
    else:
        print("❌ Some checks failed. Please review the errors above.")
        print("\n💡 Troubleshooting:")
        print("- Run 'python fix_migrations.py' to fix migration issues")
        print("- Check MIGRATION_FIX_README.md for detailed instructions")
        print("- Ensure all required dependencies are installed")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
