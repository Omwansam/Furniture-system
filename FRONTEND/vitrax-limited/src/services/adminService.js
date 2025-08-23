const API_BASE_URL = 'http://localhost:5000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('furniture_user') || '{}');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.access_token || ''}`
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
};

// User Management APIs
export const userService = {
  // Get all users (admin only)
  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/users`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Create new user
  createUser: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};

// Product Management APIs
export const productService = {
  // Get all products with filtering and pagination
  getAllProducts: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      
      const response = await fetch(`${API_BASE_URL}/products/product?${queryParams}`, {
        headers: getAuthHeaders()
      });
      const data = await handleResponse(response);
      return data.products || data; // Handle both new and old response formats
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get product statistics
  getProductStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/admin/stats`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching product stats:', error);
      throw error;
    }
  },

  // Bulk update products
  bulkUpdateProducts: async (productIds, updates) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/admin/bulk-update`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ product_ids: productIds, updates })
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error bulk updating products:', error);
      throw error;
    }
  },

  // Bulk delete products
  bulkDeleteProducts: async (productIds) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/admin/bulk-delete`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({ product_ids: productIds })
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      throw error;
    }
  },

  // Export products
  exportProducts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/admin/export`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error exporting products:', error);
      throw error;
    }
  },

  // Get single product
  getProduct: async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Create product
  createProduct: async (productData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/product`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product
  updateProduct: async (productId, productData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};

// Order Management APIs
export const orderService = {
  // Get all orders
  getAllOrders: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/admin/all`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Process return request
  processReturn: async (returnId, action, notes = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/admin/returns/${returnId}/process`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ action, notes })
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error processing return:', error);
      throw error;
    }
  }
};

// Category Management APIs
export const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Create category
  createCategory: async (categoryData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Update category
  updateCategory: async (categoryId, categoryData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  // Delete category
  deleteCategory: async (categoryId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  // Get category stats
  getCategoryStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/stats`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching category stats:', error);
      throw error;
    }
  }
};

// Analytics APIs
export const analyticsService = {
  // Get dashboard overview
  getDashboardOverview: async (timeRange = '30d') => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/overview?range=${timeRange}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      throw error;
    }
  },

  // Get sales data
  getSalesData: async (timeRange = '30d') => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/sales?range=${timeRange}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      throw error;
    }
  },

  // Get top products
  getTopProducts: async (limit = 10) => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/top-products?limit=${limit}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching top products:', error);
      throw error;
    }
  },

  // Get customer segments
  getCustomerSegments: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/customer-segments`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching customer segments:', error);
      throw error;
    }
  }
};

// Inventory APIs
export const inventoryService = {
  // Get inventory status
  getInventoryStatus: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/status`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching inventory status:', error);
      throw error;
    }
  },

  // Update stock levels
  updateStock: async (productId, quantity, operation = 'set') => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/${productId}/stock`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity, operation })
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  },

  // Get low stock alerts
  getLowStockAlerts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/low-stock`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching low stock alerts:', error);
      throw error;
    }
  }
};

// Payment Methods APIs
export const paymentMethodService = {
  // Get all payment methods
  getAllPaymentMethods: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/payment-methods`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  }
};

// Export all services
export default {
  userService,
  productService,
  orderService,
  categoryService,
  analyticsService,
  inventoryService,
  paymentMethodService
};