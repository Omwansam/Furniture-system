from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import random

analytics_bp = Blueprint('analytics', __name__)

# Mock data for analytics endpoints
def generate_mock_sales_data(days=30):
    """Generate mock sales data for the specified number of days"""
    data = []
    base_date = datetime.now() - timedelta(days=days)
    
    for i in range(days):
        date = base_date + timedelta(days=i)
        revenue = random.randint(8000, 35000)
        orders = random.randint(30, 100)
        customers = random.randint(20, 80)
        profit = int(revenue * 0.3)  # 30% profit margin
        
        data.append({
            'date': date.strftime('%Y-%m-%d'),
            'revenue': revenue,
            'orders': orders,
            'customers': customers,
            'profit': profit
        })
    
    return data

def generate_mock_category_data():
    """Generate mock category sales data"""
    categories = [
        {'name': 'Living Room', 'value': 35, 'sales': 450000, 'color': '#8884d8'},
        {'name': 'Bedroom', 'value': 25, 'sales': 320000, 'color': '#82ca9d'},
        {'name': 'Dining Room', 'value': 20, 'sales': 256000, 'color': '#ffc658'},
        {'name': 'Office', 'value': 15, 'sales': 192000, 'color': '#ff7300'},
        {'name': 'Storage', 'value': 5, 'sales': 64000, 'color': '#00ff88'}
    ]
    return categories

def generate_mock_top_products(limit=10):
    """Generate mock top products data"""
    products = [
        {'name': 'Modern Sofa Set', 'sales': 45, 'revenue': 112455, 'trend': 12.5, 'rating': 4.8},
        {'name': 'Oak Dining Table', 'sales': 32, 'revenue': 41568, 'trend': 8.3, 'rating': 4.6},
        {'name': 'Leather Recliner', 'sales': 28, 'revenue': 25172, 'trend': -2.1, 'rating': 4.9},
        {'name': 'Office Chair', 'sales': 67, 'revenue': 20033, 'trend': 15.2, 'rating': 4.4},
        {'name': 'Bookshelf Unit', 'sales': 23, 'revenue': 13777, 'trend': 6.8, 'rating': 4.7},
        {'name': 'Coffee Table', 'sales': 19, 'revenue': 9500, 'trend': 3.2, 'rating': 4.5},
        {'name': 'Bed Frame', 'sales': 34, 'revenue': 68000, 'trend': 9.1, 'rating': 4.6},
        {'name': 'Dresser', 'sales': 21, 'revenue': 42000, 'trend': 5.4, 'rating': 4.3},
        {'name': 'Nightstand', 'sales': 15, 'revenue': 22500, 'trend': 7.8, 'rating': 4.7},
        {'name': 'TV Stand', 'sales': 18, 'revenue': 16200, 'trend': 4.2, 'rating': 4.4}
    ]
    return products[:limit]

def generate_mock_customer_segments():
    """Generate mock customer segments data"""
    segments = [
        {'segment': 'High Value', 'customers': 245, 'revenue': 125000, 'percentage': 35},
        {'segment': 'Regular', 'customers': 456, 'revenue': 98000, 'percentage': 45},
        {'segment': 'Occasional', 'customers': 234, 'revenue': 45000, 'percentage': 20}
    ]
    return segments

@analytics_bp.route('/overview', methods=['GET', 'OPTIONS'])
@jwt_required()
def analytics_overview():
    """Get analytics overview data"""
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'OK'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,OPTIONS')
        return response, 200
    
    try:
        range_param = request.args.get('range', '30d')
        days = 30 if range_param == '30d' else 7 if range_param == '7d' else 90 if range_param == '90d' else 365
        
        # Generate mock overview data
        overview_data = {
            'total_revenue': 124563,
            'total_orders': 1234,
            'active_customers': 2847,
            'avg_order_value': 324,
            'growth_rate': 12.5,
            'period': range_param
        }
        
        response = jsonify(overview_data)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/sales', methods=['GET', 'OPTIONS'])
@jwt_required()
def analytics_sales():
    """Get sales analytics data"""
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'OK'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,OPTIONS')
        return response, 200
    
    try:
        range_param = request.args.get('range', '30d')
        days = 30 if range_param == '30d' else 7 if range_param == '7d' else 90 if range_param == '90d' else 365
        
        sales_data = generate_mock_sales_data(days)
        
        response = jsonify(sales_data)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/top-products', methods=['GET', 'OPTIONS'])
@jwt_required()
def analytics_top_products():
    """Get top products analytics data"""
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'OK'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,OPTIONS')
        return response, 200
    
    try:
        limit = request.args.get('limit', 10, type=int)
        top_products = generate_mock_top_products(limit)
        
        response = jsonify(top_products)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/customer-segments', methods=['GET', 'OPTIONS'])
@jwt_required()
def analytics_customer_segments():
    """Get customer segments analytics data"""
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'OK'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,OPTIONS')
        return response, 200
    
    try:
        segments_data = generate_mock_customer_segments()
        
        response = jsonify(segments_data)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/categories', methods=['GET', 'OPTIONS'])
@jwt_required()
def analytics_categories():
    """Get category analytics data"""
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'OK'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,OPTIONS')
        return response, 200
    
    try:
        category_data = generate_mock_category_data()
        
        response = jsonify(category_data)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/revenue', methods=['GET', 'OPTIONS'])
@jwt_required()
def analytics_revenue():
    """Get revenue analytics data"""
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'OK'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,OPTIONS')
        return response, 200
    
    try:
        range_param = request.args.get('range', '30d')
        days = 30 if range_param == '30d' else 7 if range_param == '7d' else 90 if range_param == '90d' else 365
        
        revenue_data = generate_mock_sales_data(days)
        
        response = jsonify(revenue_data)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/orders', methods=['GET', 'OPTIONS'])
@jwt_required()
def analytics_orders():
    """Get orders analytics data"""
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'OK'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,OPTIONS')
        return response, 200
    
    try:
        range_param = request.args.get('range', '30d')
        days = 30 if range_param == '30d' else 7 if range_param == '7d' else 90 if range_param == '90d' else 365
        
        orders_data = generate_mock_sales_data(days)
        
        response = jsonify(orders_data)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/customers', methods=['GET', 'OPTIONS'])
@jwt_required()
def analytics_customers():
    """Get customers analytics data"""
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'OK'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,OPTIONS')
        return response, 200
    
    try:
        range_param = request.args.get('range', '30d')
        days = 30 if range_param == '30d' else 7 if range_param == '7d' else 90 if range_param == '90d' else 365
        
        customers_data = generate_mock_sales_data(days)
        
        response = jsonify(customers_data)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/profit', methods=['GET', 'OPTIONS'])
@jwt_required()
def analytics_profit():
    """Get profit analytics data"""
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'OK'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,OPTIONS')
        return response, 200
    
    try:
        range_param = request.args.get('range', '30d')
        days = 30 if range_param == '30d' else 7 if range_param == '7d' else 90 if range_param == '90d' else 365
        
        profit_data = generate_mock_sales_data(days)
        
        response = jsonify(profit_data)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
