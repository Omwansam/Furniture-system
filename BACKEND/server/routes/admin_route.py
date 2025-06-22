from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import  jwt_required, get_jwt_identity, create_access_token, create_refresh_token
from extensions import db
from models import  Admin

# Blueprint Configuration
admin_bp = Blueprint('super', __name__)




# Utility function to retrieve the current logged-in user based on the JWT identity. and get the jwt_identity tokens
def get_current_admin():
    current_admin_id = get_jwt_identity()
    
    if not current_admin_id:
        return None
    return db.session.get(Admin, current_admin_id )


@admin_bp.route('/admin/protected', methods=['GET'])
@jwt_required()
def protected_route():

    admin = get_current_admin()
    if not admin:
        # Handle case where user doesn't exist
        return jsonify({"message": "Admin not found"}), 404
    
    # Return a success response if user is valid
    return jsonify({"message": f"Welcome, {admin.username}! You are authorized to access this route."})


@admin_bp.route("/admin/refresh", methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    # Refresh token is required to generate new tokens
    
    current_admin_id = get_jwt_identity()
    new_access_token = create_access_token(identity=current_admin_id)
    return jsonify ({'access_token': new_access_token}), 200

#####################################################################################USER LOGIN##################################################################################################
@admin_bp.route('/admin/login', methods=['POST'])
def login():
    data = request.get_json()

    # Check if email and password are provided
    if not data.get('email') or not data.get('password'):
        return jsonify({"message": "Email and password are required"}), 400

    email = data['email']
    password = data['password']

    # Fetch the user from the database
    admin = Admin.query.filter_by(email=email).first()

    if not admin or not check_password_hash(admin.password_hash, password):
        return jsonify({"message": "Invalid email or password"}), 401

    access_token = create_access_token(identity=f"admin:{admin.id}")
    refresh_token = create_refresh_token(identity=f"admin:{admin.id}")

    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "message": "Admin  successful",
        "user": {
            "id": admin.id,
            "email": admin.email,
            "username": admin.username,
            "role": "admin"
        }

    }), 200   



#####################################################################################USER REGISTRATION##################################################################################################
@admin_bp.route('/admin/register', methods=['POST'])
def register():
    data = request.get_json()
    # Validate input
    if not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Missing required fields"}), 400
    
    username = data['username']
    email = data['email']
    password = data['password']
    
    # Check if the email already exists
    if Admin.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400
    
    #hash passwords before storing them in the database
    password_hash = generate_password_hash(password)

    
    # Create a new user
    new_admin = Admin(username=username, email=email, password_hash=password_hash)
    try:    
        db.session.add(new_admin)
        db.session.commit()
        return jsonify({"message": "Admin account created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred while creating the admin", "details": str(e)}), 500
    


@admin_bp.route('/admin/dashboard', methods=['GET'])
@jwt_required()
def admin_dashboard():
    admin = get_current_admin()
    if not admin:
        return jsonify({"message": "Admins only"}), 403
    return jsonify({"message": f"Welcome, Admin {admin.username}!"})