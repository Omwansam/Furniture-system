from flask import Blueprint, request, jsonify
from models import Category, Product
from extensions import db
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError

# Blueprint Configuration
category_bp = Blueprint('categories', __name__)

# --------------------------
# ADMIN CATEGORY MANAGEMENT
# --------------------------

@category_bp.route('', methods=['POST'])
@jwt_required()
def create_category():
    """Create a new category (Admin Only)"""

    data = request.get_json()

    # Validation in category
    if not data.get('category_name'):
        return jsonify({'message': 'Category name is required'}), 400
    if len(data['category_name']) > 100:
        return jsonify({'message': 'Category name too long (max 100 chars)'}), 400
    
    try:
        
        new_category = Category(
            category_name = data['category_name'].strip(),
            category_description = data.get('category_description', '').strip()
        )
        db.session.add(new_category)
        db.session.commit()

        return jsonify({
            'success' : True,
            'category': {
                'category_id': new_category.category_id,
                'category_name': new_category.category_name,
                'category_description': new_category.category_description
            },
            'message' : 'Category created successfully'
        }), 200
    
    except IntegrityError:
        db.session.rollback()
    return jsonify({'message': 'Category name already exists'}), 409

##############################################################################################################################################

# --------------------------
# PUBLIC CATEGORY ENDPOINTS 
# --------------------------

########################################################################################################################################
# Get all categories
@category_bp.route('', methods=['GET'])
def get_all_categories():
    """Get all categories for navigation menu"""
    categories = Category.query.order_by(Category.category_name).all()

    return jsonify([{
        'category_id': category.category_id,
        'category_name': category.category_name,
        'category_description': category.category_description,
        'products': [{
            'product_id': product.product_id,
            'product_name': product.product_name,
            'product_description': product.product_description,
            'product_price': float(product.product_price),
            'stock_quantity': product.stock_quantity,
            'images': [img.image_url for img in product.images] if product.images else []
        } for product in category.products]
    } for category in categories]), 200


###################################################################################################################################################################

# Get a specific category by ID
@category_bp.route('/<int:category_id>', methods=['GET'])
def get_category_details(category_id):
    """Get category details with paginated products"""

    # Get the category or 404
    category = Category.query.get_or_404(category_id)

    # Base query for products in this category
    products_query = Product.query.filter_by(category_id=category_id)

    # Pagination and filtering
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 12, type=int)
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    sort_by = request.args.get('sort_by', 'name')

    

    # Apply price filters
    if min_price is not None:
        products_query = products_query.filter(Product.product_price >= min_price)
    if max_price is not None:
        products_query = products_query.filter(Product.product_price <= max_price)

    # Apply sorting
    if sort_by == 'price_asc':
        products_query = products_query.order_by(Product.product_price.asc())
    elif sort_by == 'price_desc':
        products_query = products_query.order_by(Product.product_price.desc())
    else:
        products_query = products_query.order_by(Product.product_name.asc())

    # Apply pagination
    paginated_products = products_query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'success': True,
        'category': {
            'category_id': category.category_id,
            'category_name': category.category_name,
            'category_description': category.category_description
        },
        'products': [{
            'product_id': product.product_id,
            'product_name': product.product_name,
            'product_description': product.product_description,
            'product_price': float(product.product_price),
            'stock_quantity': product.stock_quantity,
            'images': [img.image_url for img in product.images] if product.images else []
        } for product in paginated_products.items],
        'pagination': {
            'total': paginated_products.total,
            'pages': paginated_products.pages,
            'current_page': paginated_products.page,
            'per_page': paginated_products.per_page
        },
        'filters': {
            'min_price': min_price,
            'max_price': max_price,
            'sort_by': sort_by
        }
    }), 200

######################################################################################################################################################





# Delete a category
@category_bp.route('/<int:category_id>', methods=['DELETE'])
@jwt_required()
def delete_category(category_id):
    category = Category.query.get_or_404(category_id)
    db.session.delete(category)
    db.session.commit()
    return jsonify({'message': 'Category deleted successfully'}), 200

