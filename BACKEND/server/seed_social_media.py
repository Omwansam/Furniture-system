#!/usr/bin/env python3
"""
Social Media Seeding Script
This script populates the social media database with sample Instagram posts and statistics.
"""
import os
import sys
from datetime import datetime, timedelta
from app import app
from extensions import db
from models import SocialMediaPost, SocialMediaStats

def seed_social_media_data():
    """Seed the database with sample social media data"""
    with app.app_context():
        try:
            print("🌱 Starting social media data seeding...")
            
            # Check if social media posts already exist
            existing_posts = SocialMediaPost.query.first()
            if existing_posts:
                print("✅ Social media posts already exist. Skipping...")
                return
            
            # Sample Instagram posts
            sample_posts = [
                {
                    'platform': 'instagram',
                    'post_url': 'https://instagram.com/p/sample1',
                    'image_url': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
                    'caption': 'Modern living room setup with our premium furniture collection. Perfect for those who appreciate both style and comfort. #furniture #livingroom #modern #interiordesign',
                    'likes_count': 1247,
                    'comments_count': 89,
                    'is_featured': True
                },
                {
                    'platform': 'instagram',
                    'post_url': 'https://instagram.com/p/sample2',
                    'image_url': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
                    'caption': 'Cozy bedroom design featuring our latest arrivals. Transform your sleep space into a sanctuary of comfort and elegance. #bedroom #cozy #furniture #sleep',
                    'likes_count': 892,
                    'comments_count': 56,
                    'is_featured': True
                },
                {
                    'platform': 'instagram',
                    'post_url': 'https://instagram.com/p/sample3',
                    'image_url': 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=400&fit=crop',
                    'caption': 'Dining room elegance with our signature pieces. Every meal becomes a special occasion with the right furniture. #diningroom #elegance #furniture #home',
                    'likes_count': 1567,
                    'comments_count': 123,
                    'is_featured': True
                },
                {
                    'platform': 'instagram',
                    'post_url': 'https://instagram.com/p/sample4',
                    'image_url': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
                    'caption': 'Office space transformation with ergonomic furniture. Boost productivity with comfort and style. #office #ergonomic #furniture #productivity',
                    'likes_count': 743,
                    'comments_count': 45,
                    'is_featured': False
                },
                {
                    'platform': 'instagram',
                    'post_url': 'https://instagram.com/p/sample5',
                    'image_url': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
                    'caption': 'Outdoor furniture collection for your patio. Enjoy the outdoors in style and comfort. #outdoor #patio #furniture #summer',
                    'likes_count': 1023,
                    'comments_count': 78,
                    'is_featured': False
                },
                {
                    'platform': 'instagram',
                    'post_url': 'https://instagram.com/p/sample6',
                    'image_url': 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=400&fit=crop',
                    'caption': 'Kitchen island design with bar stools. The perfect gathering spot for family and friends. #kitchen #island #barstools #family',
                    'likes_count': 1345,
                    'comments_count': 92,
                    'is_featured': False
                },
                {
                    'platform': 'instagram',
                    'post_url': 'https://instagram.com/p/sample7',
                    'image_url': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
                    'caption': 'Study room essentials for focused work and learning. Create your perfect workspace. #study #workspace #furniture #focus',
                    'likes_count': 678,
                    'comments_count': 34,
                    'is_featured': False
                },
                {
                    'platform': 'instagram',
                    'post_url': 'https://instagram.com/p/sample8',
                    'image_url': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
                    'caption': 'Entryway furniture that makes a lasting first impression. Welcome guests in style. #entryway #welcome #furniture #firstimpression',
                    'likes_count': 567,
                    'comments_count': 28,
                    'is_featured': False
                },
                {
                    'platform': 'instagram',
                    'post_url': 'https://instagram.com/p/sample9',
                    'image_url': 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=400&fit=crop',
                    'caption': 'Kids room furniture that grows with your child. Safe, durable, and stylish. #kidsroom #children #furniture #safety',
                    'likes_count': 445,
                    'comments_count': 23,
                    'is_featured': False
                }
            ]
            
            # Create social media posts with different posted dates
            for i, post_data in enumerate(sample_posts):
                # Create posts with different dates (newest first)
                posted_date = datetime.now() - timedelta(days=i*2)
                
                post = SocialMediaPost(
                    platform=post_data['platform'],
                    post_url=post_data['post_url'],
                    image_url=post_data['image_url'],
                    caption=post_data['caption'],
                    likes_count=post_data['likes_count'],
                    comments_count=post_data['comments_count'],
                    posted_at=posted_date,
                    is_featured=post_data['is_featured'],
                    is_active=True
                )
                
                db.session.add(post)
                print(f"📸 Created Instagram post {i+1}: {post_data['caption'][:50]}...")
            
            # Create social media statistics
            stats = SocialMediaStats(
                platform='instagram',
                followers_count=15420,
                posts_count=342,
                engagement_rate=4.8
            )
            
            db.session.add(stats)
            print("📊 Created Instagram statistics")
            
            # Commit all changes
            db.session.commit()
            print("✅ Social media data seeded successfully!")
            print(f"📸 Created {len(sample_posts)} Instagram posts")
            print(f"📊 Created Instagram statistics")
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error seeding social media data: {str(e)}")
            raise

if __name__ == "__main__":
    seed_social_media_data()
