import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Contact form submission service
export const contactService = {
  // Submit contact form
  submitContact: async (contactData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/contact/submit`, contactData);
      return response.data;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  },

  // Get contact information
  getContactInfo: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contact/info`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contact info:', error);
      throw error;
    }
  },

  // Get social media links
  getSocialMedia: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contact/social-media`);
      return response.data;
    } catch (error) {
      console.error('Error fetching social media:', error);
      throw error;
    }
  }
};

// Fallback function for when backend is not available
export const submitContactForm = async (contactData) => {
  try {
    // Try to call the backend API
    return await contactService.submitContact(contactData);
  } catch {
    // If backend is not available, simulate success
    console.log('Backend not available, using fallback contact submission');
    
    // Store in localStorage as fallback
    const contacts = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
    const newContact = {
      ...contactData,
      id: Date.now(),
      submitted_at: new Date().toISOString(),
      status: 'pending'
    };
    contacts.push(newContact);
    localStorage.setItem('contact_submissions', JSON.stringify(contacts));
    
    return {
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
      contact: newContact
    };
  }
};

// Fallback contact information
export const getFallbackContactInfo = () => ({
  address: {
    street: "Westlands Business District",
    city: "Nairobi",
    country: "Kenya",
    postal_code: "00100",
    full_address: "Westlands Business District, Nairobi, Kenya 00100"
  },
  phone: {
    primary: "+254 700 123 456",
    secondary: "+254 733 123 456",
    whatsapp: "+254 700 123 456"
  },
  email: {
    primary: "info@vitrax.co.ke",
    support: "support@vitrax.co.ke",
    sales: "sales@vitrax.co.ke"
  },
  working_hours: {
    weekdays: "Monday - Friday: 8:00 AM - 6:00 PM",
    weekends: "Saturday: 9:00 AM - 4:00 PM",
    sunday: "Sunday: Closed"
  },
  coordinates: {
    latitude: -1.2921,
    longitude: 36.8219
  }
});

// Fallback social media data
export const getFallbackSocialMedia = () => ({
  instagram: {
    url: "https://instagram.com/vitrax_kenya",
    handle: "@vitrax_kenya",
    followers: "2.5K",
    posts: "156"
  },
  facebook: {
    url: "https://facebook.com/vitraxkenya",
    handle: "Vitrax Kenya",
    followers: "5.2K",
    posts: "89"
  },
  youtube: {
    url: "https://youtube.com/@vitraxkenya",
    handle: "Vitrax Kenya",
    subscribers: "1.8K",
    videos: "45"
  },
  twitter: {
    url: "https://twitter.com/vitrax_kenya",
    handle: "@vitrax_kenya",
    followers: "3.1K",
    tweets: "234"
  },
  whatsapp: {
    url: "https://wa.me/254700123456",
    number: "+254 700 123 456",
    status: "Available"
  }
});
