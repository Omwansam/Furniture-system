import axios from 'axios';

const API_URL = 'http://localhost:5000/cart';

// Get auth token from localStorage
const getAuthToken = () => {
  // Try multiple token storage locations
  const token = localStorage.getItem('token') || 
                (localStorage.getItem('furniture_user') ? JSON.parse(localStorage.getItem('furniture_user')).access_token : null);
  
  if (!token) {
    throw new Error('No authentication token found. Please login.');
  }
  
  return token;
};

// Add auth header to requests
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const cartService = {
  // Get user's cart
  getCart: async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      if (error.response && error.response.status === 401) {
        // Clear invalid tokens
        localStorage.removeItem('token');
        localStorage.removeItem('furniture_user');
        throw new Error('Authentication failed. Please login again.');
      }
      throw error;
    }
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await axios.post(`${API_URL}/items`, {
        product_id: productId,
        quantity: quantity
      }, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response && error.response.status === 401) {
        // Clear invalid tokens
        localStorage.removeItem('token');
        localStorage.removeItem('furniture_user');
        throw new Error('Authentication failed. Please login again.');
      }
      throw error;
    }
  },

  // Update cart item quantity
  updateCartItem: async (itemId, quantity) => {
    try {
      const response = await axios.put(`${API_URL}/items/${itemId}`, {
        quantity: quantity
      }, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    try {
      const response = await axios.delete(`${API_URL}/items/${itemId}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  // Clear entire cart
  clearCart: async () => {
    try {
      const response = await axios.delete(API_URL, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
};

export default cartService;
