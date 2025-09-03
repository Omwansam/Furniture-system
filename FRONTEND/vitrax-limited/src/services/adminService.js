const API_BASE_URL = 'http://localhost:5000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const stored = localStorage.getItem('furniture_user');
  let token = '';
  if (stored) {
    try {
      const user = JSON.parse(stored);
      // Support multiple token field names
      token = user.access_token || user.token || user.jwt || '';
    } catch {
      // Also support raw token string stored directly
      token = stored;
    }
  }
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
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

  // Get all customers (admin only)
  getAllCustomers: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      
      const response = await fetch(`${API_BASE_URL}/customers/admin/customers?${queryParams}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  // Get customer statistics
  getCustomerStats: async (days = 30) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/admin/customers/stats?days=${days}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching customer stats:', error);
      throw error;
    }
  },

  // Get customer details
  getCustomerDetails: async (customerId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/admin/customers/${customerId}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching customer details:', error);
      throw error;
    }
  },

  // Update customer
  updateCustomer: async (customerId, customerData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/admin/customers/${customerId}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  // Delete customer
  deleteCustomer: async (customerId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/admin/customers/${customerId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  },

  // Analytics Services
  // Dashboard Overview
  getDashboardAnalytics: async (days = 30) => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/admin/dashboard?days=${days}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      throw error;
    }
  },

  // Sales Analytics
  getSalesAnalytics: async (days = 30) => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/admin/sales-analytics?days=${days}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching sales analytics:', error);
      throw error;
    }
  },

  // Customer Analytics
  getCustomerAnalytics: async (days = 30) => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/admin/customer-analytics?days=${days}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching customer analytics:', error);
      throw error;
    }
  },

  // Product Analytics
  getProductAnalytics: async (days = 30) => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/admin/product-analytics?days=${days}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching product analytics:', error);
      throw error;
    }
  },

  // Financial Analytics
  getFinancialAnalytics: async (days = 30) => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/admin/financial-analytics?days=${days}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching financial analytics:', error);
      throw error;
    }
  },

  // Real-time Analytics
  getRealTimeAnalytics: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/admin/real-time`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching real-time analytics:', error);
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
      
      const response = await fetch(`${API_BASE_URL}/api/product?${queryParams}`, {
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
      const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
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
      const response = await fetch(`${API_BASE_URL}/api/admin/bulk-update`, {
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
      const response = await fetch(`${API_BASE_URL}/api/admin/bulk-delete`, {
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
      const response = await fetch(`${API_BASE_URL}/api/admin/export`, {
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
      const response = await fetch(`${API_BASE_URL}/api/${productId}`, {
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
      let headers = getAuthHeaders();
      let body;

      // Check if productData is FormData (for image uploads)
      if (productData instanceof FormData) {
        // Remove Content-Type header to let browser set it with boundary for FormData
        delete headers['Content-Type'];
        body = productData;
      } else {
        body = JSON.stringify(productData);
      }

      const response = await fetch(`${API_BASE_URL}/api/product`, {
        method: 'POST',
        headers,
        body
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
      let headers = getAuthHeaders();
      let body;

      // Check if productData is FormData (for image uploads)
      if (productData instanceof FormData) {
        // Remove Content-Type header to let browser set it with boundary for FormData
        delete headers['Content-Type'];
        body = productData;
      } else {
        body = JSON.stringify(productData);
      }

      const response = await fetch(`${API_BASE_URL}/api/${productId}`, {
        method: 'PUT',
        headers,
        body
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
      const response = await fetch(`${API_BASE_URL}/api/${productId}`, {
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
  getAllOrders: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      
      const response = await fetch(`${API_BASE_URL}/orders/admin/all?${queryParams}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get order statistics
  getOrderStats: async (days = 30) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/admin/stats?days=${days}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/admin/${orderId}/status`, {
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

// Dashboard Overview APIs
export const dashboardService = {
  // Get dashboard overview data
  getDashboardOverview: async (timeRange = '30d') => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/admin/overview?timeRange=${timeRange}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      throw error;
    }
  },

  // Export dashboard data
  exportDashboard: async (format = 'csv', timeRange = '30d') => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/admin/overview/export`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ format, timeRange })
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error exporting dashboard:', error);
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

// Suppliers Service
export const suppliersService = {
  async getAllSuppliers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/suppliers/admin/suppliers?${queryString}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getSupplier(id) {
    const response = await fetch(`${API_BASE_URL}/suppliers/admin/suppliers/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async createSupplier(supplierData) {
    const response = await fetch(`${API_BASE_URL}/suppliers/admin/suppliers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(supplierData),
    });
    return handleResponse(response);
  },

  async updateSupplier(id, supplierData) {
    const response = await fetch(`${API_BASE_URL}/suppliers/admin/suppliers/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(supplierData),
    });
    return handleResponse(response);
  },

  async deleteSupplier(id) {
    const response = await fetch(`${API_BASE_URL}/suppliers/admin/suppliers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getSupplierStats() {
    const response = await fetch(`${API_BASE_URL}/suppliers/admin/suppliers/stats`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async exportSuppliers(format = 'csv') {
    const response = await fetch(`${API_BASE_URL}/suppliers/admin/suppliers/export?format=${format}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }
};

// Users Management Service
export const usersManagementService = {
  async getAllUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/user-management/admin/users?${queryString}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getUser(id) {
    const response = await fetch(`${API_BASE_URL}/user-management/admin/users/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async createUser(userData) {
    const response = await fetch(`${API_BASE_URL}/user-management/admin/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  async updateUser(id, userData) {
    const response = await fetch(`${API_BASE_URL}/user-management/admin/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  async deleteUser(id) {
    const response = await fetch(`${API_BASE_URL}/user-management/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async toggleUserStatus(id) {
    const response = await fetch(`${API_BASE_URL}/user-management/admin/users/${id}/toggle-status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async resetUserPassword(id) {
    const response = await fetch(`${API_BASE_URL}/user-management/admin/users/${id}/reset-password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getUserStats() {
    const response = await fetch(`${API_BASE_URL}/user-management/admin/users/stats`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async exportUsers(format = 'csv') {
    const response = await fetch(`${API_BASE_URL}/user-management/admin/users/export?format=${format}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }
};

// Reports Service
export const reportsService = {
  async getSalesReport(days = 30) {
    const response = await fetch(`${API_BASE_URL}/reports/admin/reports/sales?days=${days}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getInventoryReport() {
    const response = await fetch(`${API_BASE_URL}/reports/admin/reports/inventory`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getCustomerReport(days = 30) {
    const response = await fetch(`${API_BASE_URL}/reports/admin/reports/customers?days=${days}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getFinancialReport(days = 30) {
    const response = await fetch(`${API_BASE_URL}/reports/admin/reports/financial?days=${days}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async exportReport(type, format = 'csv', days = 30) {
    const response = await fetch(`${API_BASE_URL}/reports/admin/reports/export?type=${type}&format=${format}&days=${days}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getReportsDashboard(days = 30) {
    const response = await fetch(`${API_BASE_URL}/reports/admin/reports/dashboard?days=${days}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }
};

// Settings Service
export const settingsService = {
  // Get all settings grouped by category
  async getAllSettings() {
    const response = await fetch(`${API_BASE_URL}/settings/admin/settings`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get settings for a specific category
  async getSettingsByCategory(category) {
    const response = await fetch(`${API_BASE_URL}/settings/admin/settings/${category}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get a specific setting
  async getSetting(category, settingKey) {
    const response = await fetch(`${API_BASE_URL}/settings/admin/settings/${category}/${settingKey}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Update a setting
  async updateSetting(category, settingKey, value) {
    const response = await fetch(`${API_BASE_URL}/settings/admin/settings/${category}/${settingKey}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ value }),
    });
    return handleResponse(response);
  },

  // Create a new setting
  async createSetting(category, settingData) {
    const response = await fetch(`${API_BASE_URL}/settings/admin/settings/${category}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(settingData),
    });
    return handleResponse(response);
  },

  // Delete a setting
  async deleteSetting(category, settingKey) {
    const response = await fetch(`${API_BASE_URL}/settings/admin/settings/${category}/${settingKey}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Bulk update multiple settings
  async bulkUpdateSettings(updates) {
    const response = await fetch(`${API_BASE_URL}/settings/admin/settings/bulk-update`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ updates }),
    });
    return handleResponse(response);
  },

  // Reset settings for a category
  async resetCategorySettings(category) {
    const response = await fetch(`${API_BASE_URL}/settings/admin/settings/reset/${category}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Export all settings
  async exportSettings() {
    const response = await fetch(`${API_BASE_URL}/settings/admin/settings/export`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Import settings
  async importSettings(settingsData) {
    const response = await fetch(`${API_BASE_URL}/settings/admin/settings/import`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ settings: settingsData }),
    });
    return handleResponse(response);
  }
};

// Export all services
export default {
  userService,
  productService,
  orderService,
  categoryService,
  dashboardService,
  analyticsService,
  inventoryService,
  paymentMethodService,
  suppliersService,
  usersManagementService,
  reportsService,
  settingsService
};