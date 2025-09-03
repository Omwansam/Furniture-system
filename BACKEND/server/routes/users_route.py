from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import  jwt_required, get_jwt_identity, create_access_token, create_refresh_token
from extensions import db
from models import User

# Blueprint Configuration
users_bp = Blueprint('auth', __name__)




# Utility function to retrieve the current logged-in user based on the JWT identity. and get the jwt_identity tokens
def _extract_user_id(identity):
    """Support both int identity and dict identity with {'id': ...}."""
    if identity is None:
        return None
    if isinstance(identity, dict):
        return identity.get('id')
    return identity


def get_current_user():
    current_identity = get_jwt_identity()
    user_id = _extract_user_id(current_identity)
    if not user_id:
        return None
    return db.session.get(User, user_id)


@users_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected_route():

    user = get_current_user()
    if not user:
        # Handle case where user doesn't exist
        return jsonify({"message": "User not found"}), 404
    
    # Return a success response if user is valid
    return jsonify({
        "message": f"Welcome, {user.username}! You are authorized to access this route.",
        "is_admin": user.is_admin
        })


@users_bp.route("/refresh", methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    # Refresh token is required to generate new tokens
    current_identity = get_jwt_identity()
    user_id = _extract_user_id(current_identity)
    user = User.query.get(user_id) if user_id else None
    new_access_token = create_access_token(identity={
        "id": user_id,
        "is_admin": bool(user.is_admin) if user else False
    })
    return jsonify ({'access_token': new_access_token}), 200

@users_bp.route('/users', methods=['GET', 'OPTIONS'])
@jwt_required()
def get_users():
    """Get all users (admin only)"""
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'OK'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,OPTIONS')
        return response, 200
    
    try:
        # Check if current user is admin
        current_user = get_current_user()
        if not current_user or not current_user.is_admin:
            return jsonify({'error': 'Admin access required'}), 403
        
        # Get query parameters for pagination and filtering
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        search = request.args.get('search', '')
        
        # Build query
        query = User.query
        
        # Add search filter if provided
        if search:
            query = query.filter(
                User.username.contains(search) | 
                User.email.contains(search)
            )
        
        # Paginate results
        pagination = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        users = []
        for user in pagination.items:
            users.append({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_admin': user.is_admin,
                'created_at': user.created_at.isoformat() if user.created_at else None
            })
        
        response = jsonify({
            'users': users,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pagination.total,
                'pages': pagination.pages,
                'has_next': pagination.has_next,
                'has_prev': pagination.has_prev
            }
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#####################################################################################USER LOGIN##################################################################################################
@users_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data.get('email') or not data.get('password'):
        return jsonify({"message": "Email and password are required"}), 400

    email = data['email']
    password = data['password']

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"message": "Invalid email or password"}), 401

    # Include is_admin in the JWT identity payload
    identity_payload = {
        "id": user.id,
        "is_admin": user.is_admin
    }

    access_token = create_access_token(identity=identity_payload)
    refresh_token = create_refresh_token(identity=identity_payload)

    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "message": "Login successful",
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "is_admin": user.is_admin,
            "role": "admin" if user.is_admin else "customer "
        }
    }), 200   



#####################################################################################USER REGISTRATION##################################################################################################
@users_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Missing required fields"}), 400

    username = data['username']
    email = data['email']
    password = data['password']
    is_admin = data.get('is_admin', False)  # Optional — allow admin creation if set

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    password_hash = generate_password_hash(password)

    user = User(username=username, email=email, password_hash=password_hash, is_admin=is_admin)
    try:
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred while creating the user", "details": str(e)}), 500

@users_bp.route('/admin/customers', methods=['GET'])
@jwt_required()
def get_customers():
    """Admin endpoint to get all customers with filtering and pagination"""
    try:
        # Check if current user is admin
        current_user = get_current_user()
        if not current_user or not current_user.is_admin:
            return jsonify({'error': 'Admin access required'}), 403
        
        # Get query parameters for pagination and filtering
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search', '')
        status_filter = request.args.get('status', '')
        
        # Build query - only get non-admin users
        query = User.query.filter(User.is_admin == False)
        
        # Add search filter if provided
        if search:
            query = query.filter(
                db.or_(
                    User.username.contains(search),
                    User.email.contains(search)
                )
            )
        
        # Add status filter if provided
        if status_filter == 'active':
            # Users with recent activity (orders in last 30 days)
            from datetime import datetime, timedelta
            from models import Order
            thirty_days_ago = datetime.now() - timedelta(days=30)
            active_user_ids = db.session.query(Order.user_id).filter(
                Order.order_date >= thirty_days_ago
            ).distinct().subquery()
            query = query.filter(User.id.in_(active_user_ids))
        elif status_filter == 'inactive':
            # Users with no orders or old orders
            from datetime import datetime, timedelta
            from models import Order
            thirty_days_ago = datetime.now() - timedelta(days=30)
            active_user_ids = db.session.query(Order.user_id).filter(
                Order.order_date >= thirty_days_ago
            ).distinct().subquery()
            query = query.filter(~User.id.in_(active_user_ids))
        
        # Paginate results
        pagination = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        customers = []
        for user in pagination.items:
            # Get customer statistics
            from models import Order, Payment
            order_count = Order.query.filter_by(user_id=user.id).count()
            total_spent = db.session.query(db.func.sum(Order.total_amount)).filter(
                Order.user_id == user.id,
                Order.order_status == 'COMPLETED'
            ).scalar() or 0
            
            last_order = Order.query.filter_by(user_id=user.id).order_by(
                Order.order_date.desc()
            ).first()
            
            customer_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'created_at': user.created_at.isoformat() if user.created_at else None,
                'order_count': order_count,
                'total_spent': float(total_spent),
                'last_order_date': last_order.order_date.isoformat() if last_order else None,
                'status': 'active' if order_count > 0 else 'inactive'
            }
            customers.append(customer_data)
        
        return jsonify({
            'customers': customers,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pagination.total,
                'pages': pagination.pages,
                'has_next': pagination.has_next,
                'has_prev': pagination.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.route('/admin/customers/stats', methods=['GET'])
@jwt_required()
def get_customer_stats():
    """Admin endpoint to get customer statistics"""
    try:
        # Check if current user is admin
        current_user = get_current_user()
        if not current_user or not current_user.is_admin:
            return jsonify({'error': 'Admin access required'}), 403
        
        from models import Order
        from datetime import datetime, timedelta
        
        # Get date range from query params
        days = request.args.get('days', 30, type=int)
        from_date = datetime.now() - timedelta(days=days)
        
        # Get all customers (non-admin users)
        total_customers = User.query.filter(User.is_admin == False).count()
        
        # Get customers with orders in date range
        active_customers = db.session.query(Order.user_id).filter(
            Order.order_date >= from_date
        ).distinct().count()
        
        # Get new customers in date range
        new_customers = User.query.filter(
            User.is_admin == False,
            User.created_at >= from_date
        ).count()
        
        # Get top customers by spending
        top_customers = db.session.query(
            User.id,
            User.username,
            User.email,
            db.func.sum(Order.total_amount).label('total_spent'),
            db.func.count(Order.order_id).label('order_count')
        ).join(Order).filter(
            User.is_admin == False,
            Order.order_status == 'COMPLETED'
        ).group_by(User.id).order_by(
            db.func.sum(Order.total_amount).desc()
        ).limit(10).all()
        
        top_customers_data = []
        for customer in top_customers:
            top_customers_data.append({
                'id': customer.id,
                'username': customer.username,
                'email': customer.email,
                'total_spent': float(customer.total_spent),
                'order_count': customer.order_count
            })
        
        return jsonify({
            'total_customers': total_customers,
            'active_customers': active_customers,
            'new_customers': new_customers,
            'inactive_customers': total_customers - active_customers,
            'top_customers': top_customers_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.route('/admin/customers/<int:customer_id>', methods=['GET'])
@jwt_required()
def get_customer_details(customer_id):
    """Admin endpoint to get detailed customer information"""
    try:
        # Check if current user is admin
        current_user = get_current_user()
        if not current_user or not current_user.is_admin:
            return jsonify({'error': 'Admin access required'}), 403
        
        user = User.query.get(customer_id)
        if not user:
            return jsonify({'error': 'Customer not found'}), 404
        
        if user.is_admin:
            return jsonify({'error': 'Cannot view admin user details'}), 403
        
        # Get customer orders
        from models import Order, OrderItem, Product
        orders = Order.query.filter_by(user_id=user.id).order_by(
            Order.order_date.desc()
        ).all()
        
        orders_data = []
        for order in orders:
            order_items = []
            for item in order.order_items:
                product = Product.query.get(item.product_id)
                order_items.append({
                    'product_id': item.product_id,
                    'product_name': product.product_name if product else 'Unknown Product',
                    'quantity': item.quantity,
                    'price': item.price,
                    'shipping_status': item.shipping_status.value if item.shipping_status else None
                })
            
            orders_data.append({
                'order_id': order.order_id,
                'order_date': order.order_date.isoformat() if order.order_date else None,
                'total_amount': order.total_amount,
                'order_status': order.order_status.value if order.order_status else None,
                'shipping_address': order.shipping_address,
                'items': order_items
            })
        
        # Get payment methods
        payment_methods = []
        for pm in user.payment_method:
            payment_methods.append({
                'id': pm.payment_method_id,
                'card_type': pm.card_type,
                'card_number': pm.card_number[-4:],  # Only show last 4 digits
                'expiration_date': pm.expiration_date
            })
        
        customer_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'created_at': user.created_at.isoformat() if user.created_at else None,
            'total_orders': len(orders),
            'total_spent': sum(order.total_amount for order in orders if order.order_status == 'COMPLETED'),
            'orders': orders_data,
            'payment_methods': payment_methods
        }
        
        return jsonify(customer_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500