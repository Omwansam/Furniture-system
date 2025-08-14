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
            "role": "admin" if user.is_admin else "user"
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