#!/usr/bin/env python3
"""
Script to create the user_shipping_information table
Run this script to add the new table to the database
"""

from app import app
from extensions import db
from models import UserShippingInformation

def create_shipping_table():
    """Create the user_shipping_information table"""
    with app.app_context():
        try:
            # Create the table
            db.create_all()
            print("✅ UserShippingInformation table created successfully!")
            
            # Verify the table was created
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            
            if 'user_shipping_information' in tables:
                print("✅ Table 'user_shipping_information' verified in database")
                
                # Show table structure
                columns = inspector.get_columns('user_shipping_information')
                print("\n📋 Table structure:")
                for column in columns:
                    print(f"  - {column['name']}: {column['type']}")
            else:
                print("❌ Table 'user_shipping_information' not found in database")
                
        except Exception as e:
            print(f"❌ Error creating table: {str(e)}")
            return False
    
    return True

if __name__ == "__main__":
    print("🚀 Creating UserShippingInformation table...")
    success = create_shipping_table()
    
    if success:
        print("\n🎉 Migration completed successfully!")
        print("You can now use the shipping information persistence feature.")
    else:
        print("\n💥 Migration failed. Please check the error messages above.")
