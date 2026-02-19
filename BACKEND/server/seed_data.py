"""
Seed Data for Furniture System
This file contains mock data to populate the database for development and testing.
"""

from datetime import datetime, timedelta
import random

# Mock Suppliers Data
MOCK_SUPPLIERS = [
    {
        "name": "Premium Furniture Co.",
        "category": "Furniture",
        "contact_person": "John Smith",
        "email": "john@premiumfurniture.com",
        "phone": "+1 (555) 123-4567",
        "address": "123 Main St, New York, NY 10001",
        "website": "www.premiumfurniture.com",
        "rating": 4.8,
        "status": "active",
        "notes": "Reliable supplier with high-quality products"
    },
    {
        "name": "Modern Design Solutions",
        "category": "Design",
        "contact_person": "Sarah Johnson",
        "email": "sarah@moderndesign.com",
        "phone": "+1 (555) 234-5678",
        "address": "456 Oak Ave, Los Angeles, CA 90210",
        "website": "www.moderndesign.com",
        "rating": 4.6,
        "status": "active",
        "notes": "Great for modern furniture designs"
    },
    {
        "name": "Classic Woodworks",
        "category": "Wood",
        "contact_person": "Mike Wilson",
        "email": "mike@classicwood.com",
        "phone": "+1 (555) 345-6789",
        "address": "789 Pine Rd, Chicago, IL 60601",
        "website": "www.classicwood.com",
        "rating": 4.9,
        "status": "active",
        "notes": "Premium wood materials and craftsmanship"
    },
    {
        "name": "Eco-Friendly Materials",
        "category": "Sustainable",
        "contact_person": "Lisa Brown",
        "email": "lisa@ecofriendly.com",
        "phone": "+1 (555) 456-7890",
        "address": "321 Green St, Portland, OR 97201",
        "website": "www.ecofriendly.com",
        "rating": 4.7,
        "status": "active",
        "notes": "Environmentally conscious materials"
    },
    {
        "name": "Luxury Fabrics Inc.",
        "category": "Textiles",
        "contact_person": "David Lee",
        "email": "david@luxuryfabrics.com",
        "phone": "+1 (555) 567-8901",
        "address": "654 Velvet Ave, Miami, FL 33101",
        "website": "www.luxuryfabrics.com",
        "rating": 4.5,
        "status": "active",
        "notes": "High-end fabric supplier"
    },
    {
        "name": "Metal Craft Industries",
        "category": "Metal",
        "contact_person": "Emma Davis",
        "email": "emma@metalcraft.com",
        "phone": "+1 (555) 678-9012",
        "address": "987 Steel Blvd, Detroit, MI 48201",
        "website": "www.metalcraft.com",
        "rating": 4.4,
        "status": "active",
        "notes": "Specialized in metal furniture frames"
    },
    {
        "name": "Glass & Mirror Co.",
        "category": "Glass",
        "contact_person": "Alex Chen",
        "email": "alex@glassmirror.com",
        "phone": "+1 (555) 789-0123",
        "address": "456 Crystal Way, Las Vegas, NV 89101",
        "website": "www.glassmirror.com",
        "rating": 4.3,
        "status": "active",
        "notes": "Premium glass and mirror products"
    },
    {
        "name": "Leather & Upholstery",
        "category": "Leather",
        "contact_person": "Maria Garcia",
        "email": "maria@leatherupholstery.com",
        "phone": "+1 (555) 890-1234",
        "address": "789 Leather Lane, Dallas, TX 75201",
        "website": "www.leatherupholstery.com",
        "rating": 4.6,
        "status": "active",
        "notes": "High-quality leather and upholstery materials"
    }
]

# Mock Users Data (Additional Admin/Staff users)
MOCK_USERS = [
    {
        "username": "admin_john",
        "email": "john.admin@furniture.com",
        "first_name": "John",
        "last_name": "Smith",
        "role": "admin",
        "phone": "+1 (555) 123-4567",
        "address": "123 Admin St, New York, NY 10001",
        "department": "IT",
        "manager": "System Admin",
        "status": "active"
    },
    {
        "username": "manager_sarah",
        "email": "sarah.manager@furniture.com",
        "first_name": "Sarah",
        "last_name": "Johnson",
        "role": "manager",
        "phone": "+1 (555) 234-5678",
        "address": "456 Manager Ave, Los Angeles, CA 90210",
        "department": "Sales",
        "manager": "John Smith",
        "status": "active"
    },
    {
        "username": "staff_mike",
        "email": "mike.staff@furniture.com",
        "first_name": "Mike",
        "last_name": "Wilson",
        "role": "staff",
        "phone": "+1 (555) 345-6789",
        "address": "789 Staff Rd, Chicago, IL 60601",
        "department": "Inventory",
        "manager": "Sarah Johnson",
        "status": "active"
    },
    {
        "username": "viewer_lisa",
        "email": "lisa.viewer@furniture.com",
        "first_name": "Lisa",
        "last_name": "Brown",
        "role": "viewer",
        "phone": "+1 (555) 456-7890",
        "address": "321 Viewer St, Portland, OR 97201",
        "department": "Marketing",
        "manager": "Sarah Johnson",
        "status": "active"
    },
    {
        "username": "guest_david",
        "email": "david.guest@furniture.com",
        "first_name": "David",
        "last_name": "Lee",
        "role": "guest",
        "phone": "+1 (555) 567-8901",
        "address": "654 Guest Ave, Miami, FL 33101",
        "department": "Support",
        "manager": "Mike Wilson",
        "status": "active"
    }
]

# Mock Dashboard Data
MOCK_DASHBOARD_DATA = {
    "stats": [
        {
            "title": "Total Revenue",
            "value": "$125,000",
            "change": "+12.5%",
            "trend": "up",
            "target": "$150,000",
            "progress": 83,
            "icon": "FiDollarSign"
        },
        {
            "title": "Total Orders",
            "value": "1,245",
            "change": "+8.3%",
            "trend": "up",
            "target": "1,500",
            "progress": 83,
            "icon": "FiShoppingCart"
        },
        {
            "title": "Active Customers",
            "value": "892",
            "change": "+15.2%",
            "trend": "up",
            "target": "1,000",
            "progress": 89,
            "icon": "FiUsers"
        },
        {
            "title": "Products Sold",
            "value": "3,456",
            "change": "+6.8%",
            "trend": "up",
            "target": "4,000",
            "progress": 86,
            "icon": "FiTarget"
        }
    ],
    "salesData": [
        {"date": "Jan 01", "revenue": 12000, "orders": 45, "customers": 38, "profit": 3600},
        {"date": "Jan 02", "revenue": 15000, "orders": 52, "customers": 45, "profit": 4500},
        {"date": "Jan 03", "revenue": 18000, "orders": 61, "customers": 52, "profit": 5400},
        {"date": "Jan 04", "revenue": 14000, "orders": 48, "customers": 41, "profit": 4200},
        {"date": "Jan 05", "revenue": 22000, "orders": 73, "customers": 62, "profit": 6600},
        {"date": "Jan 06", "revenue": 19000, "orders": 65, "customers": 55, "profit": 5700},
        {"date": "Jan 07", "revenue": 25000, "orders": 82, "customers": 68, "profit": 7500}
    ],
    "categoryData": [
        {"name": "Living Room", "value": 35, "sales": 87500, "color": "#8884d8"},
        {"name": "Bedroom", "value": 28, "sales": 70000, "color": "#82ca9d"},
        {"name": "Dining", "value": 22, "sales": 55000, "color": "#ffc658"},
        {"name": "Office", "value": 15, "sales": 37500, "color": "#ff7300"}
    ],
    "hourlyData": [
        {"hour": "9 AM", "orders": 12, "revenue": 4800},
        {"hour": "10 AM", "orders": 18, "revenue": 7200},
        {"hour": "11 AM", "orders": 25, "revenue": 10000},
        {"hour": "12 PM", "orders": 32, "revenue": 12800},
        {"hour": "1 PM", "orders": 28, "revenue": 11200},
        {"hour": "2 PM", "orders": 22, "revenue": 8800},
        {"hour": "3 PM", "orders": 19, "revenue": 7600},
        {"hour": "4 PM", "orders": 15, "revenue": 6000},
        {"hour": "5 PM", "orders": 8, "revenue": 3200}
    ],
    "recentOrders": [
        {"id": "ORD-001", "customer": "John Doe", "product": "Premium Sofa", "amount": "$1,200", "status": "Completed", "time": "2 hours ago"},
        {"id": "ORD-002", "customer": "Jane Smith", "product": "Dining Table", "amount": "$800", "status": "Processing", "time": "4 hours ago"},
        {"id": "ORD-003", "customer": "Mike Johnson", "product": "Bed Frame", "amount": "$600", "status": "Shipped", "time": "6 hours ago"},
        {"id": "ORD-004", "customer": "Sarah Wilson", "product": "Office Chair", "amount": "$300", "status": "Completed", "time": "8 hours ago"},
        {"id": "ORD-005", "customer": "David Brown", "product": "Coffee Table", "amount": "$450", "status": "Processing", "time": "10 hours ago"}
    ],
    "topProducts": [
        {"name": "Premium Sofa", "sales": 45, "rating": 4.8, "revenue": 45000, "trend": 12.5},
        {"name": "Dining Table", "sales": 38, "rating": 4.6, "revenue": 38000, "trend": 8.3},
        {"name": "Bed Frame", "sales": 32, "rating": 4.7, "revenue": 32000, "trend": 15.2},
        {"name": "Office Chair", "sales": 28, "rating": 4.5, "revenue": 28000, "trend": 6.8},
        {"name": "Coffee Table", "sales": 25, "rating": 4.4, "revenue": 25000, "trend": 10.1}
    ],
    "regionalData": [
        {"region": "California", "sales": 125000, "orders": 245, "growth": 12.5},
        {"region": "New York", "sales": 98000, "orders": 189, "growth": 8.3},
        {"region": "Texas", "sales": 87000, "orders": 167, "growth": 15.2},
        {"region": "Florida", "sales": 76000, "orders": 145, "growth": -2.1},
        {"region": "Illinois", "sales": 65000, "orders": 123, "growth": 6.8}
    ],
    "alerts": [
        {"type": "warning", "message": "Low stock: Premium Sofa (5 remaining)", "time": "5 min ago"},
        {"type": "info", "message": "New customer registration spike (+25%)", "time": "1 hour ago"},
        {"type": "success", "message": "Monthly sales target achieved", "time": "2 hours ago"},
        {"type": "error", "message": "Payment failed for 3 order(s)", "time": "3 hours ago"}
    ]
}

# Mock Reports Data
MOCK_REPORTS_DATA = {
    "sales_report": {
        "period": "Last 30 days",
        "total_revenue": 125000,
        "total_orders": 1245,
        "completed_orders": 1180,
        "completion_rate": 94.8,
        "average_order_value": 105.93
    },
    "inventory_report": {
        "total_products": 156,
        "low_stock_products": 12,
        "out_of_stock_products": 3,
        "total_stock_value": 450000
    },
    "customer_report": {
        "total_customers": 892,
        "new_customers": 45,
        "repeat_customers": 234,
        "retention_rate": 26.2
    },
    "financial_report": {
        "total_revenue": 125000,
        "total_orders": 1245,
        "payment_success_rate": 96.5
    }
}

def generate_mock_data():
    """Generate comprehensive mock data for the system"""
    return {
        "suppliers": MOCK_SUPPLIERS,
        "users": MOCK_USERS,
        "dashboard": MOCK_DASHBOARD_DATA,
        "reports": MOCK_REPORTS_DATA
    }

def get_supplier_data():
    """Get mock supplier data"""
    return MOCK_SUPPLIERS

def get_user_data():
    """Get mock user data"""
    return MOCK_USERS

def get_dashboard_data():
    """Get mock dashboard data"""
    return MOCK_DASHBOARD_DATA

def get_reports_data():
    """Get mock reports data"""
    return MOCK_REPORTS_DATA

if __name__ == "__main__":
    # Test the mock data generation
    data = generate_mock_data()
    print("Mock data generated successfully!")
    print(f"Suppliers: {len(data['suppliers'])}")
    print(f"Users: {len(data['users'])}")
    print(f"Dashboard stats: {len(data['dashboard']['stats'])}")
    print(f"Reports: {len(data['reports'])}")
