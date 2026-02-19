#!/usr/bin/env python3
"""
Reset database and start fresh
This script removes the existing database and recreates it with proper migrations
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def backup_database():
    """Create a backup of the existing database"""
    db_path = Path("instance/vitraxlimited.db")
    if db_path.exists():
        backup_path = Path("instance/vitraxlimited.db.backup")
        try:
            shutil.copy2(db_path, backup_path)
            print(f"✅ Database backed up to {backup_path}")
            return True
        except Exception as e:
            print(f"⚠️  Could not backup database: {e}")
            return False
    return True

def remove_database():
    """Remove the existing database file"""
    db_path = Path("instance/vitraxlimited.db")
    if db_path.exists():
        try:
            db_path.unlink()
            print("✅ Existing database removed")
            return True
        except Exception as e:
            print(f"❌ Could not remove database: {e}")
            return False
    else:
        print("✅ No existing database found")
        return True

def reset_migrations():
    """Reset migration state"""
    print("\n🔄 Resetting migration state...")
    
    # Remove all migration files except the initial ones
    migration_dir = Path("migrations/versions")
    for file in migration_dir.glob("*"):
        if not file.name.startswith(('94eb00c70e61', '05cffdba7f98')):
            try:
                file.unlink()
                print(f"   Removed: {file.name}")
            except Exception as e:
                print(f"   Warning: Could not remove {file.name}: {e}")
    
    return True

def create_fresh_migrations():
    """Create fresh migrations for the current models"""
    print("\n🔄 Creating fresh migrations...")
    
    if not run_command("python -m flask db revision --autogenerate -m 'recreate all tables'", "Creating fresh migration"):
        return False
    
    return True

def apply_migrations():
    """Apply all migrations"""
    print("\n🔄 Applying migrations...")
    
    if not run_command("python -m flask db upgrade head", "Applying migrations"):
        return False
    
    return True

def seed_database():
    """Seed the database with initial data"""
    print("\n🔄 Seeding database...")
    
    # Seed settings
    if Path("seed_settings.py").exists():
        if not run_command("python seed_settings.py", "Seeding settings"):
            print("   Warning: Settings seeding failed")
    
    # Seed other data if available
    if Path("seed_data.py").exists():
        if not run_command("python seed_data.py", "Seeding data"):
            print("   Warning: Data seeding failed")
    
    return True

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

def main():
    """Main function"""
    print("🚀 Database Reset and Recreation")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not Path("app.py").exists():
        print("❌ Please run this script from the BACKEND/server directory")
        return False
    
    print("✅ Directory structure verified")
    
    # Confirm with user
    print("\n⚠️  WARNING: This will remove the existing database and all data!")
    print("   A backup will be created, but this is a destructive operation.")
    
    response = input("\nDo you want to continue? (yes/no): ").lower().strip()
    if response not in ['yes', 'y']:
        print("❌ Operation cancelled by user")
        return False
    
    # Backup database
    if not backup_database():
        print("❌ Database backup failed")
        return False
    
    # Remove database
    if not remove_database():
        print("❌ Database removal failed")
        return False
    
    # Reset migrations
    if not reset_migrations():
        print("❌ Migration reset failed")
        return False
    
    # Create fresh migrations
    if not create_fresh_migrations():
        print("❌ Fresh migration creation failed")
        return False
    
    # Apply migrations
    if not apply_migrations():
        print("❌ Migration application failed")
        return False
    
    # Seed database
    if not seed_database():
        print("❌ Database seeding failed")
        return False
    
    print("\n✨ Database reset completed successfully!")
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
