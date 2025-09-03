#!/usr/bin/env python3
"""
Script to seed sample blog data for testing
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app
from models import db, BlogPost, BlogImage
from datetime import datetime, timedelta

def seed_sample_blogs():
    """Seed sample blog data"""
    with app.app_context():
        try:
            print("Seeding sample blog data...")
            
            # Check if blogs already exist
            existing_blogs = BlogPost.query.count()
            if existing_blogs > 0:
                print(f"Blogs already exist ({existing_blogs}). Skipping seed.")
                return
            
            # Sample blog data
            sample_blogs = [
                {
                    'title': 'Welcome to Our Furniture Blog',
                    'excerpt': 'Discover the latest trends in furniture design and home decoration.',
                    'content': 'This is our first blog post about furniture trends. We\'ll be sharing insights about modern furniture design, home decoration tips, and industry updates.',
                    'author': 'Admin',
                    'category': 'Design',
                    'tags': 'furniture, design, trends',
                    'is_published': True,
                    'is_featured': True,
                    'view_count': 150
                },
                {
                    'title': 'Modern Living Room Ideas',
                    'excerpt': 'Transform your living room with these modern furniture ideas.',
                    'content': 'Modern living rooms are all about clean lines, comfortable seating, and functional design. Here are some ideas to inspire your next renovation.',
                    'author': 'Admin',
                    'category': 'Interior Design',
                    'tags': 'living room, modern, furniture',
                    'is_published': True,
                    'is_featured': False,
                    'view_count': 89
                },
                {
                    'title': 'Choosing the Right Dining Table',
                    'excerpt': 'A comprehensive guide to selecting the perfect dining table for your home.',
                    'content': 'The dining table is often the centerpiece of family gatherings. Learn how to choose the right size, style, and material for your space.',
                    'author': 'Admin',
                    'category': 'Furniture Guide',
                    'tags': 'dining table, guide, furniture',
                    'is_published': True,
                    'is_featured': True,
                    'view_count': 234
                },
                {
                    'title': 'Sustainable Furniture Options',
                    'excerpt': 'Eco-friendly furniture choices for environmentally conscious consumers.',
                    'content': 'Sustainability is becoming increasingly important in furniture manufacturing. Discover eco-friendly options that don\'t compromise on style.',
                    'author': 'Admin',
                    'category': 'Sustainability',
                    'tags': 'sustainable, eco-friendly, furniture',
                    'is_published': True,
                    'is_featured': False,
                    'view_count': 67
                },
                {
                    'title': 'Bedroom Furniture Essentials',
                    'excerpt': 'Must-have furniture pieces for a comfortable and stylish bedroom.',
                    'content': 'Your bedroom should be a sanctuary. Learn about the essential furniture pieces that create a comfortable and inviting space.',
                    'author': 'Admin',
                    'category': 'Bedroom',
                    'tags': 'bedroom, furniture, essentials',
                    'is_published': False,  # Draft post
                    'is_featured': False,
                    'view_count': 0
                }
            ]
            
            # Create blog posts
            created_blogs = []
            for i, blog_data in enumerate(sample_blogs):
                # Create slug from title
                slug = blog_data['title'].lower().replace(' ', '-').replace(',', '').replace("'", '')
                
                # Set dates
                date_posted = datetime.now() - timedelta(days=i*2)  # Stagger dates
                
                blog = BlogPost(
                    title=blog_data['title'],
                    slug=slug,
                    excerpt=blog_data['excerpt'],
                    content=blog_data['content'],
                    author=blog_data['author'],
                    category=blog_data['category'],
                    tags=blog_data['tags'],
                    is_published=blog_data['is_published'],
                    is_featured=blog_data['is_featured'],
                    view_count=blog_data['view_count'],
                    date_posted=date_posted,
                    updated_at=datetime.now()
                )
                
                db.session.add(blog)
                created_blogs.append(blog)
            
            # Commit all blogs
            db.session.commit()
            
            print(f"✅ Successfully created {len(created_blogs)} sample blog posts!")
            
            # Display created blogs
            for blog in created_blogs:
                print(f"  - {blog.title} ({blog.category}) - {'Published' if blog.is_published else 'Draft'} - {'Featured' if blog.is_featured else 'Not Featured'}")
            
            print("\nSample blog data seeded successfully!")
            
        except Exception as e:
            print(f"Error seeding sample blogs: {e}")
            import traceback
            traceback.print_exc()
            db.session.rollback()

if __name__ == "__main__":
    seed_sample_blogs()
