import React from 'react'
import { Link } from 'react-router-dom'
import Blog1 from '../../assets/Blog1.png'
import Blog2 from '../../assets/Blog2.png'
import Blog3 from '../../assets/Blog3.png'
import { FiClock } from "react-icons/fi";
import { FiCalendar } from "react-icons/fi";
import './BlogSection.css'



const blogPosts = [
    {
        id: 1,
        title: "Going all-in with millennial design",
        image: Blog1,
        readTime: "5 min",
        date: "12th Oct 2022",
    },
    {
        id: 2,
        title: "Going all-in with millennial design",
        image:Blog2,
        readTime: "5 min",
        date: "12th Oct 2022",
    },
    {
        id: 3,
        title: "Going all-in with millennial design",
        image: Blog3,
        readTime: "5 min",
        date: "12th Oct 2022",
    },
];

const BlogSection = () => {
  return (
    <section className='blog-section'>
        <div className='blog-container'>
            <h2 className='blog-title'>Our Blogs</h2>
            <p className='blog-subtitle'>
                Our blog is here to help you stay informed about the latest trends,
                designs, and inspirations.
            </p>

            <div className='blog-posts'>
                {blogPosts.map((post) => (
                    <div key={post.id} className='blog-card'>
                        <img src={post.image} alt={post.title} className='blog-image' />
                        <h3 className='blog-heading'>{post.title}</h3>
                        <Link to='' className='read-more-btn'>
                            <p>Read More</p>
                        </Link>
                        <div className='blog-meta'>
                            <span><FiClock />{post.readTime}</span>
                            <span><FiCalendar />{post.date}</span>
                        </div>
                    </div>
                ))}
            </div>
            <Link to='' className='blog-btn'>
                <p >View All Posts</p>
            </Link>
        </div>    
    </section>
  )
}

export default BlogSection
