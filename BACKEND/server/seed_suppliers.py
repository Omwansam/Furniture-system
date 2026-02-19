#!/usr/bin/env python3
"""
Seed file for suppliers table
This script populates the suppliers table with sample data for testing and development.
"""

from app import app, db
from models import Supplier
from datetime import datetime, timedelta
import random

def seed_suppliers():
    """Seed the suppliers table with sample data"""
    
    # Sample supplier data
    suppliers_data = [
        {
            'name': 'Premium Woodcraft Ltd',
            'category': 'Furniture Manufacturing',
            'contact_person': 'John Smith',
            'email': 'john.smith@premiumwoodcraft.com',
            'phone': '+1-555-0101',
            'address': '123 Industrial Blvd, Woodville, CA 90210',
            'website': 'https://www.premiumwoodcraft.com',
            'rating': 4.8,
            'status': 'Active',
            'notes': 'High-quality hardwood furniture manufacturer with 20+ years experience'
        },
        {
            'name': 'Modern Metals Co',
            'category': 'Metal Fabrication',
            'contact_person': 'Sarah Johnson',
            'email': 'sarah.j@modernmetals.com',
            'phone': '+1-555-0102',
            'address': '456 Steel Street, Metal City, TX 75001',
            'website': 'https://www.modernmetals.com',
            'rating': 4.6,
            'status': 'Active',
            'notes': 'Specializes in modern metal furniture frames and accessories'
        },
        {
            'name': 'EcoFabrics International',
            'category': 'Textiles & Upholstery',
            'contact_person': 'Michael Chen',
            'email': 'michael.chen@ecofabrics.com',
            'phone': '+1-555-0103',
            'address': '789 Fabric Lane, Textile Town, NY 10001',
            'website': 'https://www.ecofabrics.com',
            'rating': 4.9,
            'status': 'Active',
            'notes': 'Sustainable and eco-friendly fabric supplier for furniture upholstery'
        },
        {
            'name': 'Classic Leather Works',
            'category': 'Leather & Upholstery',
            'contact_person': 'Emma Rodriguez',
            'email': 'emma.r@classicleather.com',
            'phone': '+1-555-0104',
            'address': '321 Leather Road, Craft District, FL 33101',
            'website': 'https://www.classicleather.com',
            'rating': 4.7,
            'status': 'Active',
            'notes': 'Premium leather supplier with custom dyeing services'
        },
        {
            'name': 'Glass & Mirror Solutions',
            'category': 'Glass & Mirrors',
            'contact_person': 'David Wilson',
            'email': 'david.w@glassmirror.com',
            'phone': '+1-555-0105',
            'address': '654 Glass Avenue, Crystal City, AZ 85001',
            'website': 'https://www.glassmirror.com',
            'rating': 4.5,
            'status': 'Active',
            'notes': 'Custom glass cutting and mirror manufacturing for furniture'
        },
        {
            'name': 'Hardware Plus',
            'category': 'Hardware & Fasteners',
            'contact_person': 'Lisa Thompson',
            'email': 'lisa.t@hardwareplus.com',
            'phone': '+1-555-0106',
            'address': '987 Hardware Street, Tool Town, OH 43201',
            'website': 'https://www.hardwareplus.com',
            'rating': 4.4,
            'status': 'Active',
            'notes': 'Complete hardware solutions including hinges, knobs, and fasteners'
        },
        {
            'name': 'Foam & Cushion Supply',
            'category': 'Foam & Cushions',
            'contact_person': 'Robert Davis',
            'email': 'robert.d@foamcushion.com',
            'phone': '+1-555-0107',
            'address': '147 Cushion Court, Comfort City, NC 28201',
            'website': 'https://www.foamcushion.com',
            'rating': 4.3,
            'status': 'Active',
            'notes': 'High-density foam and cushion materials for furniture'
        },
        {
            'name': 'Vintage Hardware Co',
            'category': 'Vintage Hardware',
            'contact_person': 'Amanda Foster',
            'email': 'amanda.f@vintagehardware.com',
            'phone': '+1-555-0108',
            'address': '258 Vintage Lane, Heritage District, PA 19101',
            'website': 'https://www.vintagehardware.com',
            'rating': 4.8,
            'status': 'Active',
            'notes': 'Authentic vintage hardware reproductions and antique pieces'
        },
        {
            'name': 'Sustainable Materials Inc',
            'category': 'Sustainable Materials',
            'contact_person': 'James Brown',
            'email': 'james.b@sustainablematerials.com',
            'phone': '+1-555-0109',
            'address': '369 Green Street, Eco City, OR 97201',
            'website': 'https://www.sustainablematerials.com',
            'rating': 4.9,
            'status': 'Active',
            'notes': 'Bamboo, reclaimed wood, and other sustainable furniture materials'
        },
        {
            'name': 'Luxury Finishes Ltd',
            'category': 'Finishes & Coatings',
            'contact_person': 'Jennifer Lee',
            'email': 'jennifer.l@luxuryfinishes.com',
            'phone': '+1-555-0110',
            'address': '741 Finish Avenue, Artisan District, CA 90211',
            'website': 'https://www.luxuryfinishes.com',
            'rating': 4.7,
            'status': 'Active',
            'notes': 'Premium wood stains, varnishes, and specialty finishes'
        },
        {
            'name': 'Industrial Lighting Co',
            'category': 'Lighting & Electrical',
            'contact_person': 'Christopher Garcia',
            'email': 'chris.g@industriallighting.com',
            'phone': '+1-555-0111',
            'address': '852 Light Street, Bright City, NV 89101',
            'website': 'https://www.industriallighting.com',
            'rating': 4.6,
            'status': 'Active',
            'notes': 'LED lighting solutions and electrical components for furniture'
        },
        {
            'name': 'Artisan Tools Supply',
            'category': 'Tools & Equipment',
            'contact_person': 'Maria Hernandez',
            'email': 'maria.h@artisantools.com',
            'phone': '+1-555-0112',
            'address': '963 Tool Boulevard, Workshop City, WA 98101',
            'website': 'https://www.artisantools.com',
            'rating': 4.5,
            'status': 'Active',
            'notes': 'Professional woodworking tools and equipment for furniture makers'
        }
    ]
    
    try:
        with app.app_context():
            print("Starting suppliers seeding process...")
            
            # Check if suppliers already exist
            existing_count = Supplier.query.count()
            if existing_count > 0:
                print(f"Found {existing_count} existing suppliers. Skipping seeding.")
                return
            
            # Create suppliers
            suppliers_created = 0
            for supplier_data in suppliers_data:
                # Generate random dates for last_order_date
                days_ago = random.randint(0, 90)
                last_order_date = datetime.utcnow() - timedelta(days=days_ago)
                
                supplier = Supplier(
                    name=supplier_data['name'],
                    category=supplier_data['category'],
                    contact_person=supplier_data['contact_person'],
                    email=supplier_data['email'],
                    phone=supplier_data['phone'],
                    address=supplier_data['address'],
                    website=supplier_data['website'],
                    rating=supplier_data['rating'],
                    status=supplier_data['status'],
                    notes=supplier_data['notes'],
                    last_order_date=last_order_date,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
                
                db.session.add(supplier)
                suppliers_created += 1
                print(f"Added supplier: {supplier.name}")
            
            # Commit all changes
            db.session.commit()
            print(f"\n✅ Successfully seeded {suppliers_created} suppliers!")
            print("Suppliers table is now populated with sample data.")
            
            # Display summary
            print("\n📊 Suppliers Summary:")
            print(f"Total suppliers: {Supplier.query.count()}")
            
            # Show categories
            categories = db.session.query(Supplier.category, db.func.count(Supplier.supplier_id)).group_by(Supplier.category).all()
            print("\nCategories:")
            for category, count in categories:
                print(f"  - {category}: {count} suppliers")
            
            # Show ratings
            avg_rating = db.session.query(db.func.avg(Supplier.rating)).scalar()
            print(f"\nAverage rating: {avg_rating:.1f}/5.0")
            
    except Exception as e:
        print(f"❌ Error seeding suppliers: {e}")
        db.session.rollback()
        import traceback
        traceback.print_exc()

def clear_suppliers():
    """Clear all suppliers from the table (for testing purposes)"""
    try:
        with app.app_context():
            count = Supplier.query.count()
            Supplier.query.delete()
            db.session.commit()
            print(f"✅ Cleared {count} suppliers from the table.")
    except Exception as e:
        print(f"❌ Error clearing suppliers: {e}")
        db.session.rollback()

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == '--clear':
        print("Clearing suppliers table...")
        clear_suppliers()
    else:
        print("Seeding suppliers table...")
        seed_suppliers()
    
    print("\nScript completed.")
