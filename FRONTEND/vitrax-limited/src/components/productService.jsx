import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Backend URL

export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/product`);
    // Handle the correct response format - return products array
    return response.data.products || response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductsByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_URL}/product/category/${category}`);
    return response.data.products || response.data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

export const getBestSellers = async () => {
  try {
    const response = await axios.get(`${API_URL}/bestsellers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    throw error;
  }
};

export const getRecentProducts = async (limit = 5) => {
  try {
    const response = await axios.get(`${API_URL}/recent`, {
      params: { limit }
    });
    console.log('Recent products response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching recent products:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const formData = new FormData();
    for (const key in productData) {
      if (key === 'images') {
        productData.images.forEach((image) => {
          formData.append('images', image);
        });
      } else {
        formData.append(key, productData[key]);
      }
    }
    
    const response = await axios.post(`${API_URL}/product`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Add similar functions for update and delete
// 🔹 Update an existing product
export const updateProduct = async (id, productData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, productData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// 🔹 Delete a product
export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error.response?.data || error.message);
    throw error;
  }
};

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};