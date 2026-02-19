import axios from 'axios';

const API_URL = 'http://localhost:5000/social';

export const socialMediaService = {
  // Get social media posts
  getPosts: async (platform = 'instagram', limit = 6) => {
    try {
      const response = await axios.get(`${API_URL}/posts`, {
        params: { platform, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching social media posts:', error);
      throw error;
    }
  },

  // Get featured posts
  getFeaturedPosts: async (platform = 'instagram', limit = 3) => {
    try {
      const response = await axios.get(`${API_URL}/posts/featured`, {
        params: { platform, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching featured posts:', error);
      throw error;
    }
  },

  // Get social media statistics
  getStats: async (platform = 'instagram') => {
    try {
      const response = await axios.get(`${API_URL}/stats`, {
        params: { platform }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching social media stats:', error);
      throw error;
    }
  },

  // Create new social media post (Admin only)
  createPost: async (postData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/posts`, postData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating social media post:', error);
      throw error;
    }
  },

  // Update social media statistics (Admin only)
  updateStats: async (statsData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/stats`, statsData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating social media stats:', error);
      throw error;
    }
  }
};

export default socialMediaService;
