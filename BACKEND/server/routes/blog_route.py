from flask import Blueprint,jsonify,current_app
from werkzeug.utils import secure_filename
import os


blog_bp = Blueprint('blogs', __name__)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.',1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']


def generate_unique_filename(filename, product_id):
    """Generate a unique filename using the product ID."""
    basename = secure_filename(filename.rsplit('.',1)[0])
    extension = filename.rsplit('.',1)[1].lower()
    return f"product_{product_id}_{basename}.{extension}"

def save_blog_media(file, post_id,file_type='post_image'):
    """Save the uploaded image and return the relative path"""
    if not file or not allowed_file(file.filename):
        return None
    
    filename = generate_unique_filename(file.filename, post_id)
    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)

    try:
        file.save(file_path)
        return f"uploads/{filename}"
    except Exception as e:
        current_app.logger.error(f"Error saving product image: {str(e)}")
        return None    