#!/usr/bin/env python3
"""
Seed script for blog posts and images
"""

import os
import sys
from datetime import datetime, timedelta
import re

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from server import create_app
from server.models import db, BlogPost, BlogImage
from server.extensions import db as db_instance

def create_slug(title):
    """Create a URL-friendly slug from the title"""
    slug = re.sub(r'[^\w\s-]', '', title.lower())
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug.strip('-')

def seed_blog_posts():
    """Seed the database with sample blog posts"""
    
    app = create_app()
    
    with app.app_context():
        # Check if blog posts already exist
        existing_posts = BlogPost.query.count()
        if existing_posts > 0:
            print(f"Found {existing_posts} existing blog posts. Skipping blog seeding.")
            return
        
        print("Seeding blog posts...")
        
        # Sample blog posts data
        blog_posts_data = [
            {
                'title': 'Going all-in with millennial design',
                'excerpt': 'Discover how millennial design trends are reshaping modern furniture and interior spaces with innovative approaches and sustainable materials.',
                'content': '''
                <p>Millennial design is more than just a trend—it's a movement that's fundamentally changing how we think about furniture and interior spaces. This generation, born between 1981 and 1996, has brought with it a unique set of values and preferences that are reshaping the furniture industry.</p>
                
                <h2>The Rise of Minimalism</h2>
                <p>One of the most significant contributions of millennial design is the emphasis on minimalism. Unlike previous generations who often favored ornate, heavy furniture, millennials prefer clean lines, simple forms, and uncluttered spaces. This preference stems from a desire for functionality and sustainability over mere aesthetics.</p>
                
                <p>Minimalist furniture pieces are designed to serve multiple purposes, reflecting the millennial lifestyle of smaller living spaces and nomadic tendencies. Think convertible sofas that become beds, dining tables that expand for guests, and storage solutions that are both beautiful and practical.</p>
                
                <h2>Sustainable Materials</h2>
                <p>Sustainability is at the heart of millennial design philosophy. This generation is acutely aware of environmental issues and prefers furniture made from sustainable materials like bamboo, reclaimed wood, and recycled metals. They're willing to invest in quality pieces that will last for years rather than disposable furniture that ends up in landfills.</p>
                
                <h2>Technology Integration</h2>
                <p>As digital natives, millennials expect their furniture to accommodate their tech-savvy lifestyle. This has led to the rise of smart furniture—pieces that include built-in charging stations, wireless charging pads, and even integrated speakers.</p>
                ''',
                'author': 'Sarah Johnson',
                'category': 'Design',
                'tags': 'Millennial,Design,Furniture,Trends',
                'is_featured': True,
                'date_posted': datetime.now() - timedelta(days=5)
            },
            {
                'title': 'Exploring new ways of decorating',
                'excerpt': 'Innovative decorating techniques that transform ordinary spaces into extraordinary living environments with creative solutions.',
                'content': '''
                <p>Decorating your home is an art form that combines creativity, functionality, and personal expression. In today's world, there are countless innovative ways to transform your living space into something truly extraordinary.</p>
                
                <h2>Layered Lighting</h2>
                <p>One of the most effective ways to create atmosphere in any room is through layered lighting. This involves combining different types of lighting sources: ambient lighting for overall illumination, task lighting for specific activities, and accent lighting to highlight architectural features or artwork.</p>
                
                <p>Consider using a mix of floor lamps, table lamps, wall sconces, and pendant lights to create depth and dimension in your space. Smart lighting systems can also allow you to adjust the mood of a room with just a tap on your phone.</p>
                
                <h2>Textural Elements</h2>
                <p>Adding various textures to your decor can create visual interest and make your space feel more inviting. Mix materials like velvet, leather, wood, metal, and natural fibers to create a rich, layered look.</p>
                
                <p>Think about incorporating textured throw pillows, area rugs, wall hangings, and decorative objects. The contrast between smooth and rough textures can add depth and character to any room.</p>
                
                <h2>Personal Collections</h2>
                <p>Your home should tell your story. Displaying personal collections, whether it's vintage cameras, travel souvenirs, or family heirlooms, adds personality and creates conversation starters for guests.</p>
                ''',
                'author': 'Michael Chen',
                'category': 'Interior',
                'tags': 'Decorating,Interior Design,Lighting,Textures',
                'is_featured': False,
                'date_posted': datetime.now() - timedelta(days=8)
            },
            {
                'title': 'Handmade pieces that took time to make',
                'excerpt': 'The art of craftsmanship in furniture making, where every piece tells a story of dedication, skill, and timeless beauty.',
                'content': '''
                <p>In our fast-paced, mass-produced world, there's something truly special about handmade furniture. Each piece carries with it the story of its creation, the skill of its maker, and the time invested in bringing it to life.</p>
                
                <h2>The Craftsmanship Process</h2>
                <p>Creating handmade furniture is a labor-intensive process that requires patience, skill, and attention to detail. From selecting the perfect wood to the final finishing touches, every step is carefully considered and executed by hand.</p>
                
                <p>Unlike factory-produced furniture, handmade pieces often use traditional joinery techniques that have been passed down through generations. These methods, such as dovetail joints and mortise-and-tenon connections, create stronger, more durable furniture that can last for centuries.</p>
                
                <h2>Material Selection</h2>
                <p>Handmade furniture makers take great care in selecting their materials. They often work with sustainably sourced hardwoods like oak, walnut, cherry, and maple, choosing each board for its unique grain pattern and character.</p>
                
                <p>The natural variations in wood grain, color, and texture are celebrated rather than hidden, making each piece truly unique. Some makers even incorporate live edges or natural defects to highlight the wood's natural beauty.</p>
                
                <h2>The Human Touch</h2>
                <p>Perhaps the most valuable aspect of handmade furniture is the human touch. Each piece reflects the maker's personality, style, and dedication to their craft. Small imperfections and variations are not flaws but evidence of the human hand at work.</p>
                ''',
                'author': 'Emma Rodriguez',
                'category': 'Handmade',
                'tags': 'Handmade,Craftsmanship,Woodworking,Artisan',
                'is_featured': True,
                'date_posted': datetime.now() - timedelta(days=12)
            },
            {
                'title': 'Kitchen trends in 2024',
                'excerpt': 'Stay ahead of the curve with the latest kitchen design trends that combine functionality, style, and modern technology.',
                'content': '''
                <p>The kitchen has evolved from a purely functional space to the heart of the home, where families gather, entertain, and create memories. As we move into 2024, several exciting trends are shaping the future of kitchen design.</p>
                
                <h2>Smart Technology Integration</h2>
                <p>Smart technology is becoming increasingly integrated into kitchen design. From refrigerators with built-in cameras to ovens that can be controlled via smartphone, technology is making kitchens more convenient and efficient than ever before.</p>
                
                <p>Smart faucets with touchless operation, voice-controlled lighting, and appliances that can communicate with each other are just the beginning. The kitchen of the future will be a connected hub that anticipates your needs and simplifies your daily routine.</p>
                
                <h2>Sustainable Materials</h2>
                <p>Sustainability continues to be a major focus in kitchen design. Homeowners are choosing materials that are both beautiful and environmentally responsible, such as bamboo, reclaimed wood, and recycled glass.</p>
                
                <p>Energy-efficient appliances, water-saving fixtures, and LED lighting are becoming standard features. Many homeowners are also incorporating indoor herb gardens and composting systems into their kitchen design.</p>
                
                <h2>Open Concept Living</h2>
                <p>The trend toward open-concept living shows no signs of slowing down. Kitchens are increasingly being designed as part of larger living spaces, with seamless transitions between cooking, dining, and entertaining areas.</p>
                
                <p>This design approach creates a more social and inclusive environment, allowing the cook to remain part of the conversation while preparing meals. Large islands with seating areas serve as both work surfaces and gathering spots.</p>
                ''',
                'author': 'David Kim',
                'category': 'Kitchen',
                'tags': 'Kitchen,2024,Trends,Smart Home',
                'is_featured': False,
                'date_posted': datetime.now() - timedelta(days=15)
            },
            {
                'title': 'Cozy home office setup ideas',
                'excerpt': 'Create the perfect work-from-home environment with these cozy and productive home office design ideas.',
                'content': '''
                <p>With remote work becoming increasingly common, creating a comfortable and productive home office has never been more important. A well-designed workspace can boost your productivity, reduce stress, and make your workday more enjoyable.</p>
                
                <h2>Ergonomic Essentials</h2>
                <p>Start with the basics: a comfortable, adjustable chair and a desk at the right height. Your chair should support your lower back and allow your feet to rest flat on the floor. Your desk should be at elbow height when you're seated.</p>
                
                <p>Consider investing in an ergonomic keyboard and mouse to prevent wrist strain. A monitor stand can help position your screen at eye level, reducing neck strain. Don't forget about proper lighting—natural light is ideal, but a good desk lamp is essential for evening work.</p>
                
                <h2>Personal Touches</h2>
                <p>Make your workspace feel like your own by adding personal touches. Display photos of loved ones, include plants for a touch of nature, or hang artwork that inspires you. Choose colors that make you feel calm and focused.</p>
                
                <p>Consider the psychology of color: blue promotes focus and productivity, green creates a sense of balance, and warm neutrals can make a space feel cozy and inviting.</p>
                
                <h2>Organization Systems</h2>
                <p>A cluttered workspace can lead to a cluttered mind. Invest in good storage solutions like filing cabinets, desk organizers, and wall-mounted shelves. Keep your desk surface clear of unnecessary items.</p>
                
                <p>Use cable management solutions to keep cords organized and out of sight. Consider using a pegboard or wall-mounted organizer to keep frequently used items within easy reach.</p>
                ''',
                'author': 'Lisa Thompson',
                'category': 'Office',
                'tags': 'Home Office,Ergonomics,Productivity,Remote Work',
                'is_featured': False,
                'date_posted': datetime.now() - timedelta(days=18)
            },
            {
                'title': 'Sustainable furniture choices',
                'excerpt': 'Make environmentally conscious decisions with our guide to sustainable furniture materials and production methods.',
                'content': '''
                <p>As awareness of environmental issues grows, more and more people are looking for ways to make sustainable choices in their homes. When it comes to furniture, there are many factors to consider, from the materials used to the manufacturing process.</p>
                
                <h2>Material Matters</h2>
                <p>The choice of materials is one of the most important factors in sustainable furniture. Look for pieces made from rapidly renewable materials like bamboo, which can grow up to 91 cm per day, or cork, which is harvested without harming the tree.</p>
                
                <p>Reclaimed wood is another excellent choice, as it gives new life to materials that might otherwise go to waste. FSC-certified wood ensures that the wood comes from responsibly managed forests.</p>
                
                <h2>Manufacturing Process</h2>
                <p>Consider how the furniture is made. Look for companies that use environmentally friendly manufacturing processes, such as water-based finishes instead of toxic chemicals, and energy-efficient production methods.</p>
                
                <p>Local manufacturing reduces the carbon footprint associated with transportation. Many sustainable furniture companies also use renewable energy in their production facilities.</p>
                
                <h2>Longevity and Durability</h2>
                <p>Perhaps the most sustainable choice is to buy furniture that will last. Well-made, durable pieces may cost more initially, but they'll save you money in the long run and reduce waste.</p>
                
                <p>Look for furniture with solid construction, quality materials, and timeless design. Classic styles are less likely to go out of fashion, meaning you'll be less tempted to replace them.</p>
                ''',
                'author': 'James Wilson',
                'category': 'Sustainability',
                'tags': 'Sustainable,Eco-friendly,Green Living,Environment',
                'is_featured': True,
                'date_posted': datetime.now() - timedelta(days=22)
            }
        ]
        
        # Create blog posts
        for post_data in blog_posts_data:
            # Create slug from title
            slug = create_slug(post_data['title'])
            
            # Check if slug already exists
            existing_post = BlogPost.query.filter_by(slug=slug).first()
            if existing_post:
                # Add timestamp to make slug unique
                slug = f"{slug}-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
            
            new_post = BlogPost(
                title=post_data['title'],
                slug=slug,
                excerpt=post_data['excerpt'],
                content=post_data['content'],
                author=post_data['author'],
                category=post_data['category'],
                tags=post_data['tags'],
                is_featured=post_data['is_featured'],
                date_posted=post_data['date_posted']
            )
            
            db.session.add(new_post)
            db.session.commit()
            
            # Add sample images for each post
            sample_images = [
                {
                    'filename': f"blog_{new_post.id}_main.jpg",
                    'image_url': f"uploads/blog_{new_post.id}_main.jpg",
                    'is_primary': True,
                    'alt_text': f"Main image for {post_data['title']}"
                },
                {
                    'filename': f"blog_{new_post.id}_gallery1.jpg",
                    'image_url': f"uploads/blog_{new_post.id}_gallery1.jpg",
                    'is_primary': False,
                    'alt_text': f"Gallery image 1 for {post_data['title']}"
                },
                {
                    'filename': f"blog_{new_post.id}_gallery2.jpg",
                    'image_url': f"uploads/blog_{new_post.id}_gallery2.jpg",
                    'is_primary': False,
                    'alt_text': f"Gallery image 2 for {post_data['title']}"
                }
            ]
            
            for img_data in sample_images:
                new_image = BlogImage(
                    blog_post_id=new_post.id,
                    filename=img_data['filename'],
                    image_url=img_data['image_url'],
                    is_primary=img_data['is_primary'],
                    alt_text=img_data['alt_text']
                )
                db.session.add(new_image)
            
            db.session.commit()
            print(f"Created blog post: {post_data['title']}")
        
        print(f"Successfully seeded {len(blog_posts_data)} blog posts with images!")

if __name__ == '__main__':
    seed_blog_posts()
