import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardOverview from './DashboardOverview';
import AdvancedAnalytics from './AdvancedAnalytics';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import CustomerManagement from './CustomerManagement';
import InventoryManagement from './InventoryManagement';
import SupplierManagement from './SupplierManagement';
import UserManagement from './UserManagement';
import Reports from './Reports';
import Settings from './Settings';
import './Dashboard.css';

const Dashboard = () => {
  console.log('Dashboard component rendering...');
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <Sidebar />
      </div>

      <div className="dashboard-right">
        <div className="dashboard-header">
          <Header />
        </div>

        <main className="main-content">
          <Routes>
            <Route index element={<Navigate to="overview" replace />} /> 
            <Route path="overview" element={<DashboardOverview />} />
            <Route path="analytics" element={<AdvancedAnalytics />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="customers" element={<CustomerManagement />} />
            <Route path="inventory" element={<InventoryManagement />} />
            <Route path="suppliers" element={<SupplierManagement />} />
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