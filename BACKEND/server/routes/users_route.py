from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import  jwt_required, get_jwt_identity, create_access_token, create_refresh_token
from extensions import db
from models import User

# Blueprint Configuration
users_bp = Blueprint('auth', __name__)




# Utility function to retrieve the current logged-in user based on the JWT identity. and get the jwt_identity tokens
def get_current_user():
    current_user_id = get_jwt_identity()
    
    if not current_user_id:
        return None
    return db.session.get(User, current_user_id )


@users_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected_route():

    user = get_current_user()
    if not user:
        # Handle case where user doesn't exist
        return jsonify({"message": "User not found"}), 404
    
    # Return a success response if user is valid
    return jsonify({"message": f"Welcome, {user.username}! You are authorized to access this route."})


@users_bp.route("/refresh", methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    # Refresh token is required to generate new tokens
    
    current_user_id = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user_id)
    return jsonify ({'access_token': new_access_token}), 200

#####################################################################################USER LOGIN##################################################################################################
@users_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Check if email and password are provided
    if not data.get('email') or not data.get('password'):
        return jsonify({"message": "Email and password are required"}), 400

    email = data['email']
    password = data['password']

    # Fetch the user from the database
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"message": "Invalid email or password"}), 401

    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)

    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "message": "Login successful",
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "role": "user"
        }
    }), 200   



#####################################################################################USER REGISTRATION##################################################################################################
@users_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    # Validate input
    if not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Missing required fields"}), 400
    
    username = data['username']
    email = data['email']
    password = data['password']
    
    # Check if the email already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400
    
    #hash passwords before storing them in the database
    password_hash = generate_password_hash(password)

    
    # Create a new user
    user = User(username=username, email=email, password_hash=password_hash)
    try:    
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred while creating the user", "details": str(e)}), 500
