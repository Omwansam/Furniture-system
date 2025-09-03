import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt, FaBox, FaShoppingCart, FaUsers,
  FaWarehouse, FaUserCog, FaChartBar, FaCouch, FaTruck, FaCog
} from 'react-icons/fa';
import DashboardOverview from './DashboardOverview';
import AdvancedAnalytics from './AdvancedAnalytics';
import ProductManagement from './ProductManagement';
import OrdersManagement from './OrdersManagement';
import CustomerManagement from './CustomerManagement';
import InventoryManagement from './InventoryManagement';
import SuppliersManagement from './SuppliersManagement';
import UserManagement from './UserManagement';
import Reports from './Reports';
import Settings from './Settings';
import './Dashboard.css';
import './Header.css';
import './Sidebar.css';
import './AdminDesignSystem.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('furniture_user');
    navigate('/admin/login');
  };

  const handleNavClick = (path) => {
    navigate(`/admin/dashboard/${path}`);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar">
          <div className="sidebar-header">
            <FaCouch className="sidebar-logo" />
            <h1 className="sidebar-title">FurniAdmin</h1>
          </div>
          <nav className="sidebar-menu">
            <button 
              onClick={() => handleNavClick('overview')}
              className="sidebar-button"
            >
              <span className="icon"><FaTachometerAlt /></span>
              Dashboard
            </button>
            <button 
              onClick={() => handleNavClick('analytics')}
              className="sidebar-button"
            >
              <span className="icon"><FaChartBar /></span>
              Analytics
            </button>
            <button 
              onClick={() => handleNavClick('products')}
              className="sidebar-button"
            >
              <span className="icon"><FaBox /></span>
              Products
            </button>
            <button 
              onClick={() => handleNavClick('orders')}
              className="sidebar-button"
            >
              <span className="icon"><FaShoppingCart /></span>
              Orders
            </button>
            <button 
              onClick={() => handleNavClick('customers')}
              className="sidebar-button"
            >
              <span className="icon"><FaUsers /></span>
              Customers
            </button>
            <button 
              onClick={() => handleNavClick('inventory')}
              className="sidebar-button"
            >
              <span className="icon"><FaWarehouse /></span>
              Inventory
            </button>
            <button 
              onClick={() => handleNavClick('suppliers')}
              className="sidebar-button"
            >
              <span className="icon"><FaTruck /></span>
              Suppliers
            </button>
            <button 
              onClick={() => handleNavClick('users')}
              className="sidebar-button"
            >
              <span className="icon"><FaUserCog /></span>
              User Management
            </button>
            <button 
              onClick={() => handleNavClick('reports')}
              className="sidebar-button"
            >
              <span className="icon"><FaChartBar /></span>
              Reports
            </button>
            <button 
              onClick={() => handleNavClick('settings')}
              className="sidebar-button"
            >
              <span className="icon"><FaCog /></span>
              Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-right">
        <div className="dashboard-header">
          <div className="header">
            <div className="header-container">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search products, orders, customers..."
                  className="search-input"
                />
              </div>
              <div className="actions">
                <div className="avatar-dropdown">
                  <button className="avatar-button">
                    <span>Admin</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    style={{
                      background: 'var(--error-500)',
                      color: 'var(--text-inverse)',
                      border: 'none',
                      padding: 'var(--space-2) var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      marginLeft: 'var(--space-2)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-medium)',
                      transition: 'var(--transition-normal)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'var(--error-600)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'var(--error-500)';
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="main-content">
          <Routes>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<DashboardOverview />} />
            <Route path="analytics" element={<AdvancedAnalytics />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="orders" element={<OrdersManagement />} />
            <Route path="customers" element={<CustomerManagement />} />
            <Route path="inventory" element={<InventoryManagement />} />
            <Route path="suppliers" element={<SuppliersManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="overview" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
