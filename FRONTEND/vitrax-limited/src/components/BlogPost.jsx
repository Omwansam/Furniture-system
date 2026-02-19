import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaFolderOpen, FaClock, FaEye, FaArrowLeft, FaShare, FaHeart, FaComment, FaTag } from 'react-icons/fa';
import { blogService } from './blogService';
import './BlogPost.css';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogPost();
  }, [slug]);

  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const postData = await blogService.getPostBySlug(slug);
      setPost(postData);
      
      // Fetch related posts (same category)
      const relatedData = await blogService.getPosts(1, 3, postData.category);
      setRelatedPosts(relatedData.posts.filter(p => p.slug !== slug));
      
    } catch (err) {
      console.error('Error fetching blog post:', err);
      // Set fallback data instead of error
      setPost(getFallbackPost());
      setRelatedPosts(getFallbackRelatedPosts());
      setError(null); // Clear any previous error
    } finally {
      setLoading(false);
    }
  };

  const getFallbackPost = () => {
    // Create a dynamic fallback based on the slug
    const fallbackPosts = {
      'going-all-in-with-millennial-design': {
        id: 1,
        title: "Going all-in with millennial design",
        slug: "going-all-in-with-millennial-design",
        excerpt: "Discover how millennial design trends are reshaping modern furniture and interior spaces with innovative approaches and sustainable materials.",
        content: `
          <p>Millennial design is more than just a trend—it's a movement that's fundamentally changing how we think about furniture and interior spaces. This generation, born between 1981 and 1996, has brought with it a unique set of values and preferences that are reshaping the furniture industry.</p>
          
          <h2>The Rise of Minimalism</h2>
          <p>One of the most significant contributions of millennial design is the emphasis on minimalism. Unlike previous generations who often favored ornate, heavy furniture, millennials prefer clean lines, simple forms, and uncluttered spaces. This preference stems from a desire for functionality and sustainability over mere aesthetics.</p>
          
          <p>Minimalist furniture pieces are designed to serve multiple purposes, reflecting the millennial lifestyle of smaller living spaces and nomadic tendencies. Think convertible sofas that become beds, dining tables that expand for guests, and storage solutions that are both beautiful and practical.</p>
          
          <h2>Sustainable Materials</h2>
          <p>Sustainability is at the heart of millennial design philosophy. This generation is acutely aware of environmental issues and prefers furniture made from sustainable materials like bamboo, reclaimed wood, and recycled metals. They're willing to invest in quality pieces that will last for years rather than disposable furniture that ends up in landfills.</p>
          
          <p>Manufacturers are responding to this demand by offering eco-friendly options, from furniture made with FSC-certified wood to pieces constructed with recycled materials. The result is a market that's becoming increasingly conscious of its environmental impact.</p>
          
          <h2>Technology Integration</h2>
          <p>As digital natives, millennials expect their furniture to accommodate their tech-savvy lifestyle. This has led to the rise of smart furniture—pieces that include built-in charging stations, wireless charging pads, and even integrated speakers. Coffee tables with hidden compartments for cable management and desks with built-in power strips are becoming standard offerings.</p>
          
          <h2>Personalization and Customization</h2>
          <p>Millennials value individuality and self-expression, which has driven demand for customizable furniture. Companies are offering more options for personalization, from choosing fabric colors and patterns to selecting wood finishes and hardware styles. This allows consumers to create pieces that truly reflect their personal style and fit their specific needs.</p>
          
          <h2>The Future of Millennial Design</h2>
          <p>As millennials continue to influence the furniture market, we can expect to see even more innovation in design and functionality. The focus will remain on sustainability, technology integration, and personalization, but with an increasing emphasis on creating pieces that can adapt to changing lifestyles and living situations.</p>
          
          <p>The millennial approach to furniture design isn't just about aesthetics—it's about creating spaces that support their values, lifestyle, and vision for the future. As this generation continues to shape the market, the furniture industry will evolve to meet their unique needs and preferences.</p>
        `,
        author: "Sarah Johnson",
        category: "Design",
        tags: ["Millennial", "Design", "Furniture", "Trends"],
        featured_image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=500&fit=crop",
        is_featured: true,
        view_count: 1250,
        date_posted: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
        read_time: 8,
        images: [
          {
            image_id: 1,
            image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
            is_primary: false,
            alt_text: "Modern living room with minimalist furniture"
          },
          {
            image_id: 2,
            image_url: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=400&fit=crop",
            is_primary: false,
            alt_text: "Sustainable furniture materials"
          }
        ]
      },
      'exploring-new-ways-of-decorating': {
        id: 2,
        title: "Exploring new ways of decorating",
        slug: "exploring-new-ways-of-decorating",
        excerpt: "Innovative decorating techniques that transform ordinary spaces into extraordinary living environments with creative solutions.",
        content: `
          <p>Decorating your home is an art form that combines creativity, functionality, and personal expression. In today's world, there are countless innovative ways to transform your living space into something truly extraordinary.</p>
          
          <h2>Layered Lighting</h2>
          <p>One of the most effective ways to create atmosphere in any room is through layered lighting. This involves combining different types of lighting sources: ambient lighting for overall illumination, task lighting for specific activities, and accent lighting to highlight architectural features or artwork.</p>
          
          <p>Consider using a mix of floor lamps, table lamps, wall sconces, and pendant lights to create depth and dimension in your space. Smart lighting systems can also allow you to adjust the mood of a room with just a tap on your phone.</p>
          
          <h2>Textural Elements</h2>
          <p>Adding various textures to your decor can create visual interest and make your space feel more inviting. Mix materials like velvet, leather, wood, metal, and natural fibers to create a rich, layered look.</p>
          
          <p>Think about incorporating textured throw pillows, area rugs, wall hangings, and decorative objects. The contrast between smooth and rough textures can add depth and character to any room.</p>
          
          <h2>Personal Collections</h2>
          <p>Your home should tell your story. Displaying personal collections, whether it's vintage cameras, travel souvenirs, or family heirlooms, adds personality and creates conversation starters for guests.</p>
        `,
        author: "Michael Chen",
        category: "Interior",
        tags: ["Decorating", "Interior Design", "Lighting", "Textures"],
        featured_image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=500&fit=crop",
        is_featured: false,
        view_count: 890,
        date_posted: "2024-01-12T14:30:00Z",
        updated_at: "2024-01-12T14:30:00Z",
        read_time: 5,
        images: [
          {
            image_id: 3,
            image_url: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=400&fit=crop",
            is_primary: false,
            alt_text: "Interior design with layered lighting"
          }
        ]
      },
      'handmade-pieces-that-took-time-to-make': {
        id: 3,
        title: "Handmade pieces that took time to make",
        slug: "handmade-pieces-that-took-time-to-make",
        excerpt: "The art of craftsmanship in furniture making, where every piece tells a story of dedication, skill, and timeless beauty.",
        content: `
          <p>In our fast-paced, mass-produced world, there's something truly special about handmade furniture. Each piece carries with it the story of its creation, the skill of its maker, and the time invested in bringing it to life.</p>
          
          <h2>The Craftsmanship Process</h2>
          <p>Creating handmade furniture is a labor-intensive process that requires patience, skill, and attention to detail. From selecting the perfect wood to the final finishing touches, every step is carefully considered and executed by hand.</p>
          
          <p>Unlike factory-produced furniture, handmade pieces often use traditional joinery techniques that have been passed down through generations. These methods, such as dovetail joints and mortise-and-tenon connections, create stronger, more durable furniture that can last for centuries.</p>
          
          <h2>Material Selection</h2>
          <p>Handmade furniture makers take great care in selecting their materials. They often work with sustainably sourced hardwoods like oak, walnut, cherry, and maple, choosing each board for its unique grain pattern and character.</p>
          
          <p>The natural variations in wood grain, color, and texture are celebrated rather than hidden, making each piece truly unique. Some makers even incorporate live edges or natural defects to highlight the wood's natural beauty.</p>
          
          <h2>The Human Touch</h2>
          <p>Perhaps the most valuable aspect of handmade furniture is the human touch. Each piece reflects the maker's personality, style, and dedication to their craft. Small imperfections and variations are not flaws but evidence of the human hand at work.</p>
        `,
        author: "Emma Rodriguez",
        category: "Handmade",
        tags: ["Handmade", "Craftsmanship", "Woodworking", "Artisan"],
        featured_image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=500&fit=crop",
        is_featured: true,
        view_count: 2100,
        date_posted: "2024-01-10T09:15:00Z",
        updated_at: "2024-01-10T09:15:00Z",
        read_time: 7,
        images: [
          {
            image_id: 4,
            image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop",
            is_primary: false,
            alt_text: "Handcrafted wooden furniture"
          }
                 ]
       },
       'kitchen-trends-in-2024': {
         id: 4,
         title: "Kitchen trends in 2024",
         slug: "kitchen-trends-in-2024",
         excerpt: "Stay ahead of the curve with the latest kitchen design trends that combine functionality, style, and modern technology.",
         content: `
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
         `,
         author: "David Kim",
         category: "Kitchen",
         tags: ["Kitchen", "2024", "Trends", "Smart Home"],
         featured_image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=500&fit=crop",
         is_featured: false,
         view_count: 1560,
         date_posted: "2024-01-08T16:45:00Z",
         updated_at: "2024-01-08T16:45:00Z",
         read_time: 6,
         images: [
           {
             image_id: 5,
             image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
             is_primary: false,
             alt_text: "Modern kitchen with smart appliances"
           }
         ]
       },
       'cozy-home-office-setup-ideas': {
         id: 5,
         title: "Cozy home office setup ideas",
         slug: "cozy-home-office-setup-ideas",
         excerpt: "Create the perfect work-from-home environment with these cozy and productive home office design ideas.",
         content: `
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
         `,
         author: "Lisa Thompson",
         category: "Office",
         tags: ["Home Office", "Ergonomics", "Productivity", "Remote Work"],
         featured_image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=500&fit=crop",
         is_featured: false,
         view_count: 980,
         date_posted: "2024-01-05T11:20:00Z",
         updated_at: "2024-01-05T11:20:00Z",
         read_time: 5,
         images: [
           {
             image_id: 6,
             image_url: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=400&fit=crop",
             is_primary: false,
             alt_text: "Cozy home office setup"
           }
         ]
       },
       'sustainable-furniture-choices': {
         id: 6,
         title: "Sustainable furniture choices",
         slug: "sustainable-furniture-choices",
         excerpt: "Make environmentally conscious decisions with our guide to sustainable furniture materials and production methods.",
         content: `
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
         `,
         author: "James Wilson",
         category: "Sustainability",
         tags: ["Sustainable", "Eco-friendly", "Green Living", "Environment"],
         featured_image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=500&fit=crop",
         is_featured: true,
         view_count: 1340,
         date_posted: "2024-01-03T13:10:00Z",
         updated_at: "2024-01-03T13:10:00Z",
         read_time: 8,
         images: [
           {
             image_id: 7,
             image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop",
             is_primary: false,
             alt_text: "Sustainable furniture materials"
           }
         ]
       }
     };

    // Return the specific post if it exists, otherwise return the first one
    return fallbackPosts[slug] || fallbackPosts['going-all-in-with-millennial-design'];
  };

  const getFallbackRelatedPosts = () => [
    {
      id: 2,
      title: "Exploring new ways of decorating",
      slug: "exploring-new-ways-of-decorating",
      excerpt: "Innovative decorating techniques that transform ordinary spaces into extraordinary living environments.",
      author: "Michael Chen",
      category: "Interior",
      featured_image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop",
      date_posted: "2024-01-12T14:30:00Z",
      read_time: 5
    },
    {
      id: 3,
      title: "Handmade pieces that took time to make",
      slug: "handmade-pieces-that-took-time-to-make",
      excerpt: "The art of craftsmanship in furniture making, where every piece tells a story of dedication, skill, and timeless beauty.",
      author: "Emma Rodriguez",
      category: "Handmade",
      featured_image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=250&fit=crop",
      date_posted: "2024-01-10T09:15:00Z",
      read_time: 7
    },
    {
      id: 4,
      title: "Kitchen trends in 2024",
      slug: "kitchen-trends-in-2024",
      excerpt: "Stay ahead of the curve with the latest kitchen design trends that combine functionality, style, and modern technology.",
      author: "David Kim",
      category: "Kitchen",
      featured_image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=250&fit=crop",
      date_posted: "2024-01-08T16:45:00Z",
      read_time: 6
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="blog-post-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="blog-post-container">
        <div className="error-state">
          <h2>Blog Post Not Found</h2>
          <p>The blog post you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/blog')} className="back-to-blog-btn">
            <FaArrowLeft /> Back to Blog
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="blog-post-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading blog post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-post-container">
      {/* Back Navigation */}
      <div className="back-navigation">
        <button onClick={() => navigate('/blog')} className="back-btn">
          <FaArrowLeft /> Back to Blog
        </button>
      </div>

      {/* Main Content */}
      <article className="blog-post">
        {/* Header */}
        <header className="post-header">
          <div className="post-meta">
            <span className="meta-item">
              <FaUser />
              {post.author}
            </span>
            <span className="meta-item">
              <FaCalendarAlt />
              {formatDate(post.date_posted)}
            </span>
            <span className="meta-item">
              <FaFolderOpen />
              {post.category}
            </span>
            <span className="meta-item">
              <FaClock />
              {post.read_time} min read
            </span>
            <span className="meta-item">
              <FaEye />
              {post.view_count} views
            </span>
          </div>

          <h1 className="post-title">{post.title}</h1>
          <p className="post-excerpt">{post.excerpt}</p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="post-tags">
              <FaTag />
              {post.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </header>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="featured-image-container">
            <img 
              src={post.featured_image} 
              alt={post.title}
              className="featured-image"
            />
            {post.is_featured && (
              <div className="featured-badge">Featured</div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="post-content">
          <div 
            className="content-html"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Additional Images */}
        {post.images && post.images.length > 0 && (
          <div className="post-gallery">
            <h3>Gallery</h3>
            <div className="gallery-grid">
              {post.images.map((image) => (
                <div key={image.image_id} className="gallery-item">
                  <img 
                    src={image.image_url} 
                    alt={image.alt_text || post.title}
                    className="gallery-image"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="post-actions">
          <button onClick={handleShare} className="action-btn share-btn">
            <FaShare /> Share
          </button>
          <button className="action-btn like-btn">
            <FaHeart /> Like
          </button>
          <button className="action-btn comment-btn">
            <FaComment /> Comment
          </button>
        </div>

        {/* Author Info */}
        <div className="author-info">
          <div className="author-avatar">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" alt={post.author} />
          </div>
          <div className="author-details">
            <h4>About {post.author}</h4>
            <p>Furniture design expert with over 10 years of experience in creating beautiful, functional spaces. Passionate about sustainable design and helping people create homes they love.</p>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="related-posts">
          <h3>Related Articles</h3>
          <div className="related-posts-grid">
            {relatedPosts.map((relatedPost) => (
              <article key={relatedPost.id} className="related-post-card">
                <div className="related-post-image">
                  <img src={relatedPost.featured_image} alt={relatedPost.title} />
                </div>
                <div className="related-post-content">
                  <h4>
                    <Link to={`/blog/${relatedPost.slug}`}>{relatedPost.title}</Link>
                  </h4>
                  <p>{relatedPost.excerpt}</p>
                  <div className="related-post-meta">
                    <span>{formatDate(relatedPost.date_posted)}</span>
                    <span>{relatedPost.read_time} min read</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter Signup */}
      <section className="newsletter-signup">
        <div className="newsletter-content">
          <h3>Stay Updated</h3>
          <p>Get the latest blog posts and design tips delivered to your inbox.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email address" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
