#!/usr/bin/env python3
"""
Script to fix blog tables by recreating them with proper structure
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app
from models import db, BlogPost, BlogImage

def fix_blog_tables():
    """Fix blog tables by recreating them with proper structure"""
    with app.app_context():
        try:
            print("Checking current database state...")
            
            # Check if blog tables exist
            inspector = db.inspect(db.engine)
            existing_tables = inspector.get_table_names()
            print(f"Existing tables: {existing_tables}")
            
            # Drop existing blog tables if they exist
            if 'blog_posts' in existing_tables:
                print("Dropping existing blog_posts table...")
                db.engine.execute('DROP TABLE IF EXISTS blog_posts')
                
            if 'blog_images' in existing_tables:
                print("Dropping existing blog_images table...")
                db.engine.execute('DROP TABLE IF EXISTS blog_images')
                
            if 'Blog_images' in existing_tables:
                print("Dropping existing Blog_images table...")
                db.engine.execute('DROP TABLE IF EXISTS "Blog_images"')
            
            print("Creating new blog tables...")
            
            # Create tables with proper structure
            db.create_all()
            
            print("Blog tables created successfully!")
            
            # Verify tables exist
            inspector = db.inspect(db.engine)
            new_tables = inspector.get_table_names()
            print(f"Tables after fix: {new_tables}")
            
            # Check if blog_posts table has correct columns
            if 'blog_posts' in new_tables:
                columns = inspector.get_columns('blog_posts')
                print(f"blog_posts columns: {[col['name'] for col in columns]}")
                
                # Check for required columns
                required_columns = ['id', 'title', 'slug', 'excerpt', 'content', 'author', 
                                 'category', 'tags', 'is_published', 'is_featured', 
                                 'view_count', 'date_posted', 'updated_at']
                
                existing_columns = [col['name'] for col in columns]
                missing_columns = [col for col in required_columns if col not in existing_columns]
                
                if missing_columns:
                    print(f"WARNING: Missing columns: {missing_columns}")
                else:
                    print("✅ All required columns present!")
            
            print("Blog tables fix completed!")
            
        except Exception as e:
            print(f"Error fixing blog tables: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    fix_blog_tables()
