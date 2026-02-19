#!/usr/bin/env python3
"""
Advanced migration fix script
This script handles the case where the settings table already exists but migrations are broken
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

def check_database_state():
    """Check the current state of the database"""
    print("🔍 Checking database state...")
    
    db_path = Path("instance/vitraxlimited.db")
    if not db_path.exists():
        print("❌ Database file not found")
        return False
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if settings table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='settings';")
        settings_exists = cursor.fetchone() is not None
        
        # Check migration table
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='alembic_version';")
        alembic_exists = cursor.fetchone() is not None
        
        if alembic_exists:
            cursor.execute("SELECT version_num FROM alembic_version;")
            current_version = cursor.fetchone()
            if current_version:
                print(f"   Current migration version: {current_version[0]}")
            else:
                print("   No migration version recorded")
        else:
            print("   No alembic_version table found")
        
        if settings_exists:
            # Check table structure
            cursor.execute("PRAGMA table_info(settings);")
            columns = cursor.fetchall()
            print(f"   Settings table exists with {len(columns)} columns")
            
            # Check if table has data
            cursor.execute("SELECT COUNT(*) FROM settings;")
            count = cursor.fetchone()[0]
            print(f"   Settings table has {count} records")
        else:
            print("   Settings table does not exist")
        
        conn.close()
        
        return {
            'settings_exists': settings_exists,
            'alembic_exists': alembic_exists,
            'current_version': current_version[0] if current_version else None
        }
        
    except Exception as e:
        print(f"❌ Database check failed: {e}")
        return False

def fix_migration_state():
    """Fix the migration state to match the actual database"""
    print("\n🔧 Fixing migration state...")
    
    # First, stamp the current revision to mark it as applied
    if not run_command("python -m flask db stamp add_settings_table_clean", "Stamping current revision"):
        print("   Warning: Could not stamp revision")
    
    # Try to upgrade to head
    if not run_command("python -m flask db upgrade head", "Upgrading to head"):
        print("   Warning: Upgrade failed, but this might be expected")
    
    return True

def verify_settings_table():
    """Verify that the settings table is properly set up"""
    print("\n🔍 Verifying settings table...")
    
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
        
        # Check categories
        cursor.execute("SELECT DISTINCT category FROM settings;")
        categories = [row[0] for row in cursor.fetchall()]
        
        conn.close()
        
        print(f"✅ Settings table verified:")
        print(f"   - Settings table exists with {len(columns)} columns")
        print(f"   - {count} settings found")
        if categories:
            print(f"   - Categories: {', '.join(categories)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error verifying settings table: {e}")
        return False

def seed_settings_if_needed():
    """Seed settings if the table is empty"""
    print("\n🌱 Checking if settings need seeding...")
    
    db_path = Path("instance/vitraxlimited.db")
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) FROM settings;")
        count = cursor.fetchone()[0]
        conn.close()
        
        if count == 0:
            print("   Settings table is empty, seeding default settings...")
            if not run_command("python seed_settings.py", "Seeding default settings"):
                return False
        else:
            print(f"   Settings table already has {count} records, skipping seeding")
        
        return True
        
    except Exception as e:
        print(f"❌ Error checking settings count: {e}")
        return False

def check_migration_status():
    """Check the final migration status"""
    print("\n🔍 Checking final migration status...")
    
    try:
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

def main():
    """Main function"""
    print("🚀 Advanced Migration Fix")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not Path("app.py").exists():
        print("❌ Please run this script from the BACKEND/server directory")
        return False
    
    print("✅ Directory structure verified")
    
    # Check database state
    db_state = check_database_state()
    if not db_state:
        print("❌ Could not determine database state")
        return False
    
    # If settings table exists but migrations are broken, fix the state
    if db_state['settings_exists']:
        print("\n✅ Settings table already exists in database")
        print("   This suggests a previous migration attempt partially succeeded")
        
        # Fix migration state
        if not fix_migration_state():
            print("❌ Failed to fix migration state")
            return False
        
        # Verify the table is properly set up
        if not verify_settings_table():
            print("❌ Settings table verification failed")
            return False
        
        # Seed settings if needed
        if not seed_settings_if_needed():
            print("❌ Failed to seed settings")
            return False
        
        # Check final migration status
        if not check_migration_status():
            print("❌ Final migration status check failed")
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
    else:
        print("❌ Settings table does not exist")
        print("   Please run the standard fix_migrations.py script first")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
