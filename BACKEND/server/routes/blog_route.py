from flask import Blueprint, jsonify, request, url_for, current_app
from models import BlogPost, BlogImage, db
from sqlalchemy import desc, func
from werkzeug.utils import secure_filename
import os
import re
from datetime import datetime

blog_bp = Blueprint('blogs', __name__)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.',1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

def generate_unique_filename(filename, post_id):
    """Generate a unique filename using the post ID."""
    basename = secure_filename(filename.rsplit('.',1)[0])
    extension = filename.rsplit('.',1)[1].lower()
    return f"blog_{post_id}_{basename}.{extension}"

def save_blog_media(file, post_id, file_type='post_image'):
    """Save the uploaded image and return the relative path"""
    if not file or not allowed_file(file.filename):
        return None
    
    filename = generate_unique_filename(file.filename, post_id)
    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)

    try:
        file.save(file_path)
        return f"uploads/{filename}"
    except Exception as e:
        current_app.logger.error(f"Error saving blog image: {str(e)}")
        return None

def create_slug(title):
    """Create a URL-friendly slug from the title"""
    slug = re.sub(r'[^\w\s-]', '', title.lower())
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug.strip('-')

# Get all blog posts with pagination
@blog_bp.route('/posts', methods=['GET'])
def get_blog_posts():
    """Get all published blog posts with pagination"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 6, type=int)
        category = request.args.get('category')
        search = request.args.get('search')
        
        # Base query
        query = BlogPost.query.filter_by(is_published=True)
        
        # Apply filters
        if category:
            query = query.filter(BlogPost.category == category)
        
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                (BlogPost.title.ilike(search_term)) |
                (BlogPost.excerpt.ilike(search_term)) |
                (BlogPost.content.ilike(search_term))
            )
        
        # Order by date and paginate
        posts = query.order_by(desc(BlogPost.date_posted)).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        result = []
        for post in posts.items:
            # Get primary image
            primary_image = BlogImage.query.filter_by(
                blog_post_id=post.id, 
                is_primary=True
            ).first()
            
            post_data = {
                'id': post.id,
                'title': post.title,
                'slug': post.slug,
                'excerpt': post.excerpt,
                'author': post.author,
                'category': post.category,
                'tags': post.tags.split(',') if post.tags else [],
                'featured_image': url_for('static', filename=primary_image.image_url, _external=True) if primary_image else None,
                'is_featured': post.is_featured,
                'view_count': post.view_count,
                'date_posted': post.date_posted.isoformat() if post.date_posted else None,
                'read_time': len(post.content.split()) // 200 + 1  # Rough estimate
            }
            result.append(post_data)
        
        return jsonify({
            'posts': result,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': posts.total,
                'pages': posts.pages,
                'has_next': posts.has_next,
                'has_prev': posts.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Error fetching blog posts: {str(e)}'}), 500

# Get featured blog posts
@blog_bp.route('/posts/featured', methods=['GET'])
def get_featured_posts():
    """Get featured blog posts"""
    try:
        limit = request.args.get('limit', 3, type=int)
        
        posts = BlogPost.query.filter_by(
            is_published=True,
            is_featured=True
        ).order_by(desc(BlogPost.date_posted)).limit(limit).all()
        
        result = []
        for post in posts:
            primary_image = BlogImage.query.filter_by(
                blog_post_id=post.id, 
                is_primary=True
            ).first()
            
            post_data = {
                'id': post.id,
                'title': post.title,
                'slug': post.slug,
                'excerpt': post.excerpt,
                'author': post.author,
                'category': post.category,
                'featured_image': url_for('static', filename=primary_image.image_url, _external=True) if primary_image else None,
                'date_posted': post.date_posted.isoformat() if post.date_posted else None
            }
            result.append(post_data)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': f'Error fetching featured posts: {str(e)}'}), 500

# Get single blog post by slug
@blog_bp.route('/posts/<slug>', methods=['GET'])
def get_blog_post(slug):
    """Get a single blog post by slug"""
    try:
        post = BlogPost.query.filter_by(slug=slug, is_published=True).first()
        
        if not post:
            return jsonify({'error': 'Blog post not found'}), 404
        
        # Increment view count
        post.view_count += 1
        db.session.commit()
        
        # Get all images for this post
        images = BlogImage.query.filter_by(blog_post_id=post.id).all()
        
        post_data = {
            'id': post.id,
            'title': post.title,
            'slug': post.slug,
            'excerpt': post.excerpt,
            'content': post.content,
            'author': post.author,
            'category': post.category,
            'tags': post.tags.split(',') if post.tags else [],
            'featured_image': url_for('static', filename=post.featured_image, _external=True) if post.featured_image else None,
            'is_featured': post.is_featured,
            'view_count': post.view_count,
            'date_posted': post.date_posted.isoformat() if post.date_posted else None,
            'updated_at': post.updated_at.isoformat() if post.updated_at else None,
            'read_time': len(post.content.split()) // 200 + 1,
            'images': [{
                'image_id': img.image_id,
                'image_url': url_for('static', filename=img.image_url, _external=True),
                'is_primary': img.is_primary,
                'alt_text': img.alt_text
            } for img in images]
        }
        
        return jsonify(post_data), 200
        
    except Exception as e:
        return jsonify({'error': f'Error fetching blog post: {str(e)}'}), 500

# Get blog categories
@blog_bp.route('/categories', methods=['GET'])
def get_blog_categories():
    """Get all blog categories with post counts"""
    try:
        categories = db.session.query(
            BlogPost.category,
            func.count(BlogPost.id).label('count')
        ).filter_by(is_published=True).group_by(BlogPost.category).all()
        
        result = [{'name': cat.category, 'count': cat.count} for cat in categories]
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': f'Error fetching categories: {str(e)}'}), 500

# Get recent blog posts
@blog_bp.route('/posts/recent', methods=['GET'])
def get_recent_posts():
    """Get recent blog posts"""
    try:
        limit = request.args.get('limit', 4, type=int)
        
        posts = BlogPost.query.filter_by(
            is_published=True
        ).order_by(desc(BlogPost.date_posted)).limit(limit).all()
        
        result = []
        for post in posts:
            primary_image = BlogImage.query.filter_by(
                blog_post_id=post.id, 
                is_primary=True
            ).first()
            
            post_data = {
                'id': post.id,
                'title': post.title,
                'slug': post.slug,
                'excerpt': post.excerpt,
                'author': post.author,
                'category': post.category,
                'featured_image': url_for('static', filename=primary_image.image_url, _external=True) if primary_image else None,
                'date_posted': post.date_posted.isoformat() if post.date_posted else None
            }
            result.append(post_data)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': f'Error fetching recent posts: {str(e)}'}), 500

# Create new blog post (Admin only)
@blog_bp.route('/posts', methods=['POST'])
def create_blog_post():
    """Create a new blog post"""
    try:
        data = request.form
        files = request.files.getlist('images')
        
        # Validate required fields
        required_fields = ['title', 'excerpt', 'content', 'category']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Create slug from title
        slug = create_slug(data['title'])
        
        # Check if slug already exists
        existing_post = BlogPost.query.filter_by(slug=slug).first()
        if existing_post:
            slug = f"{slug}-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
        
        new_post = BlogPost(
            title=data['title'],
            slug=slug,
            excerpt=data['excerpt'],
            content=data['content'],
            author=data.get('author', 'Admin'),
            category=data['category'],
            tags=data.get('tags', ''),
            is_published=data.get('is_published', True),
            is_featured=data.get('is_featured', False)
        )
        
        db.session.add(new_post)
        db.session.commit()
        
        # Process images
        if files:
            for idx, img in enumerate(files):
                if img.filename == '':
                    continue
                    
                image_path = save_blog_media(img, new_post.id)
                if image_path:
                    is_primary = (idx == 0)  # First image becomes primary
                    new_image = BlogImage(
                        blog_post_id=new_post.id,
                        filename=img.filename,
                        image_url=image_path,
                        is_primary=is_primary,
                        alt_text=data.get('alt_text', '')
                    )
                    db.session.add(new_image)
            
            db.session.commit()
        
        return jsonify({
            'message': 'Blog post created successfully',
            'post_id': new_post.id,
            'slug': new_post.slug
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error creating blog post: {str(e)}'}), 500

# Update blog post (Admin only)
@blog_bp.route('/posts/<int:post_id>', methods=['PUT'])
def update_blog_post(post_id):
    """Update an existing blog post"""
    try:
        post = BlogPost.query.get_or_404(post_id)
        data = request.get_json()
        
        if 'title' in data:
            post.title = data['title']
            # Update slug if title changed
            post.slug = create_slug(data['title'])
        
        if 'excerpt' in data:
            post.excerpt = data['excerpt']
        
        if 'content' in data:
            post.content = data['content']
        
        if 'author' in data:
            post.author = data['author']
        
        if 'category' in data:
            post.category = data['category']
        
        if 'tags' in data:
            post.tags = data['tags']
        
        if 'is_published' in data:
            post.is_published = data['is_published']
        
        if 'is_featured' in data:
            post.is_featured = data['is_featured']
        
        db.session.commit()
        
        return jsonify({'message': 'Blog post updated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error updating blog post: {str(e)}'}), 500

# Delete blog post (Admin only)
@blog_bp.route('/posts/<int:post_id>', methods=['DELETE'])
def delete_blog_post(post_id):
    """Delete a blog post"""
    try:
        post = BlogPost.query.get_or_404(post_id)
        
        # Delete associated images
        images = BlogImage.query.filter_by(blog_post_id=post_id).all()
        for img in images:
            try:
                if os.path.exists(os.path.join(current_app.config['UPLOAD_FOLDER'], img.image_url.replace('uploads/', ''))):
                    os.remove(os.path.join(current_app.config['UPLOAD_FOLDER'], img.image_url.replace('uploads/', '')))
            except Exception as e:
                current_app.logger.error(f"Failed to delete image {img.image_url}: {str(e)}")
        
        db.session.delete(post)
        db.session.commit()
        
        return jsonify({'message': 'Blog post deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error deleting blog post: {str(e)}'}), 500    