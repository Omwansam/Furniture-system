#!/usr/bin/env python3
"""
Fix migrations and setup settings system
This script resolves migration issues and properly sets up the settings system
"""

import os
import sys
import subprocess
import sqlite3
from pathlib import Path

def run_command(command, description, check=True):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=check, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ {description} completed successfully")
            return True
        else:
            print(f"⚠️  {description} completed with warnings")
            if result.stdout:
                print(f"   Output: {result.stdout}")
            if result.stderr:
                print(f"   Errors: {result.stderr}")
            return True if not check else False
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        print(f"   Error: {e}")
        if e.stdout:
            print(f"   Output: {e.stdout}")
        if e.stderr:
            print(f"   Error: {e.stderr}")
        return False

def check_database_connection():
    """Check if database is accessible"""
    db_path = Path("instance/vitraxlimited.db")
    if not db_path.exists():
        print("❌ Database file not found")
        return False
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        conn.close()
        print(f"✅ Database accessible, found {len(tables)} tables")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def reset_migrations():
    """Reset migration state and start fresh"""
    print("\n🔄 Resetting migration state...")
    
    # Remove problematic migration files
    migration_dir = Path("migrations/versions")
    for file in migration_dir.glob("*add_settings_table*"):
        try:
            file.unlink()
            print(f"   Removed: {file.name}")
        except Exception as e:
            print(f"   Warning: Could not remove {file.name}: {e}")
    
    # Create clean migration
    if not run_command("python -m flask db revision -m 'add settings table clean'", "Creating clean migration"):
        return False
    
    return True

def apply_migrations():
    """Apply all migrations"""
    print("\n🔄 Applying migrations...")
    
    # First, try to stamp the current revision
    if not run_command("python -m flask db stamp head", "Stamping current revision"):
        print("   Warning: Could not stamp current revision")
    
    # Then upgrade to head
    if not run_command("python -m flask db upgrade head", "Upgrading to head"):
        return False
    
    return True

def seed_settings():
    """Seed the database with default settings"""
    print("\n🔄 Seeding default settings...")
    
    if not Path("seed_settings.py").exists():
        print("❌ seed_settings.py not found")
        return False
    
    if not run_command("python seed_settings.py", "Seeding settings"):
        return False
    
    return True

def verify_settings_table():
    """Verify that the settings table was created correctly"""
    print("\n🔄 Verifying settings table...")
    
    db_path = Path("instance/vitraxlimited.db")
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
        
        conn.close()
        
        if count == 0:
            print("⚠️  Settings table is empty - no default settings found")
        else:
            print(f"✅ Settings table verified with {count} settings")
        
        return True
        
    except Exception as e:
        print(f"❌ Error verifying settings table: {e}")
        return False

def main():
    """Main function"""
    print("🚀 Settings System Migration Fix")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not Path("app.py").exists():
        print("❌ Please run this script from the BACKEND/server directory")
        return False
    
    print("✅ Directory structure verified")
    
    # Check database connection
    if not check_database_connection():
        print("❌ Database connection failed")
        return False
    
    # Reset migrations
    if not reset_migrations():
        print("❌ Failed to reset migrations")
        return False
    
    # Apply migrations
    if not apply_migrations():
        print("❌ Failed to apply migrations")
        return False
    
    # Seed settings
    if not seed_settings():
        print("❌ Failed to seed settings")
        return False
    
    # Verify settings table
    if not verify_settings_table():
        print("❌ Settings table verification failed")
        return False
    
    print("\n✨ Migration fix completed successfully!")
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
    sys.exit(0 if success else 1)
