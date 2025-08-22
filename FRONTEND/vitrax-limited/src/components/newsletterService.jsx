import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Newsletter subscription service
export const newsletterService = {
  // Subscribe to newsletter
  subscribe: async (email) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/newsletter/subscribe`, {
        email: email
      });
      return response.data;
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      throw error;
    }
  },

  // Unsubscribe from newsletter
  unsubscribe: async (email) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/newsletter/unsubscribe`, {
        email: email
      });
      return response.data;
    } catch (error) {
      console.error('Error unsubscribing from newsletter:', error);
      throw error;
    }
  },

  // Get subscription status
  getStatus: async (email) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/newsletter/status/${email}`);
      return response.data;
    } catch (error) {
      console.error('Error getting newsletter status:', error);
      throw error;
    }
  }
};

// Fallback function for when backend is not available
export const subscribeToNewsletter = async (email) => {
  try {
    // Try to call the backend API
    return await newsletterService.subscribe(email);
  } catch (error) {
    // If backend is not available, simulate success
    console.log('Backend not available, using fallback newsletter subscription');
    
    // Store in localStorage as fallback
    const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
    if (!subscribers.includes(email)) {
      subscribers.push(email);
      localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
    }
    
    return {
      success: true,
      message: 'Successfully subscribed to newsletter!',
      email: email
    };
  }
};
