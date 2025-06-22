from flask import Blueprint, request, jsonify,url_for, current_app
from utils.images import save_product_image, delete_image_file
from models import Product, ProductImage
from flask_jwt_extended import jwt_required
import os

from extensions import db

# Blueprint Configuration
product_bp = Blueprint('products', __name__)

MAX_IMAGES_PER_PRODUCT = 10 

# Create a new product with images
@product_bp.route('/product', methods=['POST'])
@jwt_required()
def create_product():
    """Create a product and upload images via product_images route."""

    
    if not request.content_type.startswith('multipart/form-data'):
        return jsonify({'error': 'Content-Type must be multipart/form-data'}), 400
    

    data = request.form
    files = request.files.getlist('images')
    
    new_product = Product(
        product_name=data.get('product_name'),
        product_description=data.get('product_description'),
        product_price=float(data.get('product_price', 0)),  # Convert to float
        stock_quantity=int(data.get('stock_quantity', 0)),  # Convert to int
        category_id=int(data.get('category_id', 0))
    )
    db.session.add(new_product)
    db.session.commit()
    
    # Process images
    if files:
        for idx, img in enumerate(files[:MAX_IMAGES_PER_PRODUCT]):  # Limit number of images
            if img.filename == '':
                continue
                
            image_path = save_product_image(img, new_product.product_id)
            if image_path:
                is_primary = (idx == 0)  # First image becomes primary
                new_image = ProductImage(
                    image_url=image_path,
                    is_primary=is_primary,
                    product_id=new_product.product_id
                )
                db.session.add(new_image)
        
        db.session.commit()

    return jsonify({
        'message': 'Product created successfully',
        'product_id': new_product.product_id,
        'image_count': min(len(files), MAX_IMAGES_PER_PRODUCT)
    }), 201

# Get all products
# Get all products
@product_bp.route('/product', methods=['GET'])
def get_products():
    """Retrieve all products along with their images."""
    products = Product.query.all()
    return jsonify([{
        'product_id': product.product_id,
        'product_name': product.product_name,
        'product_description': product.product_description,
        'product_price': product.product_price,
        'stock_quantity': product.stock_quantity,
        'category_id': product.category_id,
        'images': [{
            'image_id': img.image_id, 
            'image_url': url_for('static', filename=img.image_url, _external=True), 
            'is_primary': img.is_primary
            } for img in product.images]
    } for product in products]), 200

# Get a specific product by ID
@product_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Retrieve a specific product by ID and its images."""
    
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({"error": "Product not found"}), 404

    return jsonify({
        'product_id': product.product_id,
        'product_name': product.product_name,
        'product_description': product.product_description,
        'product_price': product.product_price,
        'stock_quantity': product.stock_quantity,
        'category_id': product.category_id,
        'images': [
            {
                'image_id': img.image_id,
                'image_url': url_for('static', filename=img.image_url, _external=True),
                'is_primary': img.is_primary
            } for img in product.images
        ]
    }), 200

# Update a product
@product_bp.route('/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    """Update a product's details."""
    data = request.get_json()
    product = Product.query.get_or_404(product_id)
    
    product.product_name = data.get('product_name', product.product_name)
    product.product_description = data.get('product_description', product.product_description)
    product.product_price = data.get('product_price', product.product_price)
    product.stock_quantity = data.get('stock_quantity', product.stock_quantity)
    product.category_id = data.get('category_id', product.category_id)
    
    db.session.commit()
    return jsonify({'message': 'Product updated successfully'}), 200

# Delete a product and its images
@product_bp.route('/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    """Delete a product and all its images."""
    product = Product.query.get_or_404(product_id)

    # Delete associated images from database
    images = ProductImage.query.filter_by(product_id=product_id).all()
    for img in images:
        
        try:
            delete_image_file(img.image_url)
        except Exception as e:
            current_app.logger.error(f"Failed to delete image {img.image_url}: {str(e)}")

    # Delete db records
    ProductImage.query.filter_by(product_id=product_id).delete()
    db.session.delete(product)
    db.session.commit()

    return jsonify({
        'message': 'Product and all associated images deleted',
        'deleted_images': len(images)
    }), 200


# Upload Multiple product images

@product_bp.route('/<int:product_id>/images', methods=['POST'])
@jwt_required()
def add_product_images(product_id):
    """Upload multiple images for a product."""
    product = Product.query.get_or_404(product_id)

    current_count = ProductImage.query.filter_by(product_id=product_id).count()
    if current_count >= MAX_IMAGES_PER_PRODUCT:
        return jsonify({'error': f'Maximum {MAX_IMAGES_PER_PRODUCT} images per product reached'}), 400

    if 'images' not in request.files:
        return jsonify({'message': 'No images provided'}), 400
    
    images = request.files.getlist('images')
    if not images or all(img.filename == '' for img in images):
        return jsonify({'error': 'No valid images selected'}), 400
    
    primary_image_id = request.form.get('primary_image_id')
    new_primary_set =False

    

    # Process new images
    uploaded_count = 0
    for img in images[:MAX_IMAGES_PER_PRODUCT - current_count]:  # Stay within limit
        if img.filename == '':
            continue 

        # Save image to file and update database record
        image_path = save_product_image(img, product_id)
        if not image_path:
            continue

        # Check if this should be the new primary image
        is_primary = False
        if primary_image_id == 'new' and not new_primary_set:
            is_primary = True
            new_primary_set = True
            
        # Create image record
        new_image = ProductImage(
            image_url=image_path,
            is_primary=is_primary,
            product_id=product_id
        )
        db.session.add(new_image)
        uploaded_count += 1
        
        # If setting as primary, unset any existing primary
        if is_primary:
            ProductImage.query.filter(
                ProductImage.product_id == product_id,
                ProductImage.is_primary == True
            ).update({'is_primary': False})
            
    db.session.commit()
    
    return jsonify({
        'message': f'{len(images)} images added to product',
        'product_id': product_id,
        'new_image_count': uploaded_count,
        'total_images': current_count + uploaded_count
    }), 201

