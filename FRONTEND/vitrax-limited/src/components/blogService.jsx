import axios from 'axios';

const API_URL = 'http://localhost:5000/blog';

export const blogService = {
  // Get all blog posts with pagination
  getPosts: async (page = 1, perPage = 6, category = null, search = null) => {
    try {
      const params = { page, per_page: perPage };
      if (category) params.category = category;
      if (search) params.search = search;
      
      const response = await axios.get(`${API_URL}/posts`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  },

  // Get featured blog posts
  getFeaturedPosts: async (limit = 3) => {
    try {
      const response = await axios.get(`${API_URL}/posts/featured`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching featured posts:', error);
      throw error;
    }
  },

  // Get single blog post by slug
  getPostBySlug: async (slug) => {
    try {
      const response = await axios.get(`${API_URL}/posts/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }
  },

  // Get blog categories
  getCategories: async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get recent blog posts
  getRecentPosts: async (limit = 4) => {
    try {
      const response = await axios.get(`${API_URL}/posts/recent`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent posts:', error);
      throw error;
    }
  },

  // Create new blog post (Admin only)
  createPost: async (postData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/posts`, postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  },

  // Update blog post (Admin only)
  updatePost: async (postId, postData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/posts/${postId}`, postData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  },

  // Delete blog post (Admin only)
  deletePost: async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/posts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  }
};

export default blogService;
