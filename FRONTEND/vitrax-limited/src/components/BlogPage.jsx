import React, { useState } from "react";
import { FaSearch, FaUser, FaCalendarAlt, FaFolderOpen } from "react-icons/fa";
import "./BlogPage.css";

const blogsData = [
  {
    id: 1,
    title: "Going all-in with millennial design",
    image: "https://source.unsplash.com/600x400/?laptop,desk",
    date: "11 Oct 2022",
    category: "Wood",
    author: "Admin",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget odio risus...",
  },
  {
    id: 2,
    title: "Exploring new ways of decorating",
    image: "https://source.unsplash.com/600x400/?design,architecture",
    date: "11 Oct 2022",
    category: "Handmade",
    author: "Admin",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget odio risus...",
  },
  {
    id: 3,
    title: "Handmade pieces that took time to make",
    image: "https://source.unsplash.com/600x400/?handmade,art",
    date: "11 Oct 2022",
    category: "Wood",
    author: "Admin",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget odio risus...",
  },
  {
    id: 4,
    title: "Kitchen trends in 2023",
    image: "https://source.unsplash.com/600x400/?kitchen,modern",
    date: "10 Oct 2022",
    category: "Interior",
    author: "Admin",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget odio risus...",
  },
  {
    id: 5,
    title: "Cozy home office setup ideas",
    image: "https://source.unsplash.com/600x400/?office,workspace",
    date: "09 Oct 2022",
    category: "Design",
    author: "Admin",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget odio risus...",
  },
];

const categories = [
  { name: "Crafts", count: 2 },
  { name: "Design", count: 3 },
  { name: "Handmade", count: 1 },
  { name: "Interior", count: 1 },
  { name: "Wood", count: 6 },
];

const BlogPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 3;
  const totalPages = Math.ceil(blogsData.length / blogsPerPage);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogsData.slice(indexOfFirstBlog, indexOfLastBlog);


  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="blog-container">
      {/* Blog Section */}
      <div className="blog-content-wrapper">
      <div className="blogs">
        {currentBlogs.map((blog) => (
          <div className="blog-card" key={blog.id}>
            <img src={blog.image} alt={blog.title} className="blog-image" />
            <div className="blog-content">
              <div className="blog-meta">
                <span>
                  <FaUser /> {blog.author}
                </span>
                <span>
                  <FaCalendarAlt /> {blog.date}
                </span>
                <span>
                  <FaFolderOpen /> {blog.category}
                </span>
              </div>
              <h3>{blog.title}</h3>
              <p>{blog.description}</p>
              <a href="#">Read more</a>
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
          <button>
            <FaSearch />
          </button>
        </div>

        <div className="categories">
          <h4>Categories</h4>
          <ul>
            {categories.map((category, index) => (
              <li key={index}>
                {category.name} <span>{category.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="recent-posts">
          <h4>Recent Posts</h4>
          {blogsData.slice(0, 4).map((blog) => (
            <div className="recent-post" key={blog.id}>
              <img src={blog.image} alt={blog.title} />
              <p>{blog.title}</p>
            </div>
          ))}
        </div>
      </aside>

      
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default BlogPage;


