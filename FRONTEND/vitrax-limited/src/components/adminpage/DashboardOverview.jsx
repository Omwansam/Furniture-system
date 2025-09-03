import React, { useState, useEffect, useCallback } from "react";
import "./DashboardOverview.css";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiShoppingCart,
  FiUsers,
  FiAlertTriangle,
  FiEye,
  FiTarget,
  FiCalendar,
  FiArrowUpRight,
  FiArrowDownRight,
  FiPieChart,
  FiActivity,
  FiClock,
  FiMapPin,
  FiStar,
  FiDownload,
  FiRefreshCw,
  FiBarChart,
  FiTrendingUp as FiTrendingUpIcon,
} from "react-icons/fi";

// Sample Chart Libraries
import { ResponsiveContainer, Line, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, PieChart, Pie, Cell, LineChart, AreaChart } from 'recharts';

// Import dashboard service
import { dashboardService } from "../../services/adminService";

export default function DashboardOverview() {
  const [timeRange, setTimeRange] = useState("30d");
  const [activeMetric, setActiveMetric] = useState("revenue");
  const [isLiveView, setIsLiveView] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [notifications] = useState([]);
  
  // Backend data state
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    salesData: [],
    categoryData: [],
    hourlyData: [],
    recentOrders: [],
    topProducts: [],
    regionalData: [],
    alerts: []
  });

  // Mock data for charts when backend data is not available
  const mockData = {
    salesData: [
      { date: 'Jan 01', revenue: 12000, orders: 45, customers: 38, profit: 3600 },
      { date: 'Jan 02', revenue: 15000, orders: 52, customers: 45, profit: 4500 },
      { date: 'Jan 03', revenue: 18000, orders: 61, customers: 52, profit: 5400 },
      { date: 'Jan 04', revenue: 14000, orders: 48, customers: 41, profit: 4200 },
      { date: 'Jan 05', revenue: 22000, orders: 73, customers: 62, profit: 6600 },
      { date: 'Jan 06', revenue: 19000, orders: 65, customers: 55, profit: 5700 },
      { date: 'Jan 07', revenue: 25000, orders: 82, customers: 68, profit: 7500 }
    ],
    categoryData: [
      { name: 'Living Room', value: 35, sales: 87500, color: '#8884d8' },
      { name: 'Bedroom', value: 28, sales: 70000, color: '#82ca9d' },
      { name: 'Dining', value: 22, sales: 55000, color: '#ffc658' },
      { name: 'Office', value: 15, sales: 37500, color: '#ff7300' }
    ],
    hourlyData: [
      { hour: '9 AM', orders: 12, revenue: 4800 },
      { hour: '10 AM', orders: 18, revenue: 7200 },
      { hour: '11 AM', orders: 25, revenue: 10000 },
      { hour: '12 PM', orders: 32, revenue: 12800 },
      { hour: '1 PM', orders: 28, revenue: 11200 },
      { hour: '2 PM', orders: 22, revenue: 8800 },
      { hour: '3 PM', orders: 19, revenue: 7600 },
      { hour: '4 PM', orders: 15, revenue: 6000 },
      { hour: '5 PM', orders: 8, revenue: 3200 }
    ],
    regionalData: [
      { region: "California", sales: 125000, orders: 245, growth: 12.5 },
      { region: "New York", sales: 98000, orders: 189, growth: 8.3 },
      { region: "Texas", sales: 87000, orders: 167, growth: 15.2 },
      { region: "Florida", sales: 76000, orders: 145, growth: -2.1 },
      { region: "Illinois", sales: 65000, orders: 123, growth: 6.8 }
    ],
    alerts: [
      { type: 'warning', message: 'Low stock: Premium Sofa (5 remaining)', time: '5 min ago' },
      { type: 'info', message: 'New customer registration spike (+25%)', time: '1 hour ago' },
      { type: 'success', message: 'Monthly sales target achieved', time: '2 hours ago' },
      { type: 'error', message: 'Payment failed for 3 order(s)', time: '3 hours ago' }
    ]
  };

  // Fetch dashboard data from backend
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getDashboardOverview(timeRange);
      if (response.success) {
        // Ensure data is valid and remove any duplicates
        const validatedData = {
          ...response.data,
          recentOrders: response.data.recentOrders?.filter((order, index, self) => 
            index === self.findIndex(o => o.id === order.id)
          ) || [],
          topProducts: response.data.topProducts?.filter((product, index, self) => 
            index === self.findIndex(p => p.name === product.name)
          ) || [],
          alerts: response.data.alerts?.filter((alert, index, self) => 
            index === self.findIndex(a => a.message === alert.message)
          ) || []
        };
        setDashboardData(validatedData);
        setLastUpdate(new Date());
      } else {
        // Use mock data if backend fails
        setDashboardData({
          ...dashboardData,
          salesData: mockData.salesData,
          categoryData: mockData.categoryData,
          hourlyData: mockData.hourlyData,
          regionalData: mockData.regionalData,
          alerts: mockData.alerts
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use mock data on error
      setDashboardData({
        ...dashboardData,
        salesData: mockData.salesData,
        categoryData: mockData.categoryData,
        hourlyData: mockData.hourlyData,
        regionalData: mockData.regionalData,
        alerts: mockData.alerts
      });
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  // Load data on component mount and when timeRange changes
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Live view updates
  useEffect(() => {
    if (!isLiveView) return;
    
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000); // Update every 30 seconds in live view
    
    return () => clearInterval(interval);
  }, [isLiveView, fetchDashboardData]);

  // Helper function to get icon components
  const getIconComponent = (iconName) => {
    const iconMap = {
      'FiDollarSign': <FiDollarSign />,
      'FiShoppingCart': <FiShoppingCart />,
      'FiUsers': <FiUsers />,
      'FiTarget': <FiTarget />
    };
    return iconMap[iconName] || <FiDollarSign />;
  };

  const toggleLiveView = useCallback(() => {
    setIsLiveView(!isLiveView);
  }, [isLiveView]);

  // Handle refresh button click
  const handleRefresh = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle navigation to different admin pages
  const navigateToPage = (page) => {
    // In a real app, you'd use React Router or navigation
    console.log(`Navigating to ${page}`);
    // For now, we'll show an alert - replace with actual navigation
    alert(`Navigating to ${page} page`);
  };

  // Handle export functionality
  const exportDashboard = async (format) => {
    try {
      const response = await dashboardService.exportDashboard(format, timeRange);
      if (response.success) {
        alert(`Export Complete: ${format.toUpperCase()}`);
      } else {
        alert('Export failed. Please try again.');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    }
  };

  // Handle view all orders
  const handleViewAllOrders = () => {
    navigateToPage('Orders Management');
  };

  // Handle view all products
  const handleViewAllProducts = () => {
    navigateToPage('Inventory Management');
  };

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
        <h1 className="title">Dashboard Overview</h1>
        <p className="subtitle">
          Real-time insights and analytics for your furniture business
              {isLiveView && <span className="live-timestamp">• Live updates active</span>}
            </p>
          </div>
          <div className="header-right">
            <div className="last-update">
              <FiClock />
              <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>
      </div>

        {/* Action Controls */}
        <div className="action-controls">
          <div className="control-group">
            <label htmlFor="timeRange">Time Range:</label>
            <select 
              id="timeRange"
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-select"
            >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
          </div>

          <div className="control-group">
            <button 
              onClick={handleRefresh} 
              className={`refresh-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              <FiRefreshCw className={loading ? 'spinning' : ''} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          <div className="control-group">
            <button 
              onClick={toggleLiveView} 
              className={`live-button ${isLiveView ? "active" : ""}`}
            >
              <FiActivity /> 
              {isLiveView ? "Live View ON" : "Live View OFF"}
          {isLiveView && <span className="live-indicator"></span>}
        </button>
          </div>

          <div className="control-group">
            <div className="export-dropdown">
          <button className="export-button">
                <FiDownload /> Export Data
              </button>
              <div className="export-menu">
                <button onClick={() => exportDashboard("csv")}>
                  <FiDownload /> Export as CSV
                </button>
                <button onClick={() => exportDashboard("excel")}>
                  <FiDownload /> Export as Excel
                </button>
                <button onClick={() => exportDashboard("pdf")}>
                  <FiDownload /> Export as PDF
          </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <FiRefreshCw className="spinning" />
            <p>Loading latest dashboard data...</p>
          </div>
        </div>
      )}

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Stats Cards Row */}
        <div className="stats-row">
          {dashboardData.stats && dashboardData.stats.length > 0 ? (
            dashboardData.stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
                  <span className="stat-title">{stat.title}</span>
                  <span className="stat-icon">{getIconComponent(stat.icon)}</span>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-footer">
                  <span className={`trend-indicator ${stat.trend === "up" ? "trend-up" : "trend-down"}`}>
                {stat.trend === "up" ? <FiTrendingUp /> : <FiTrendingDown />}
                {stat.change}
              </span>
                  <span className="stat-target">Target: {stat.target}</span>
            </div>
                <div className="progress-container">
            <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${stat.progress}%` }}
                    ></div>
            </div>
                  <small className="progress-text">{stat.progress}% of target</small>
          </div>
              </div>
            ))
          ) : (
            <div className="no-data-placeholder">
              <FiBarChart />
              <p>No dashboard data available</p>
              <button onClick={handleRefresh} className="retry-button">
                <FiRefreshCw /> Retry
              </button>
        </div>
      )}
        </div>

      {/* Charts Section */}
        <div className="charts-section">
          {/* Main Revenue Chart */}
          <div className="chart-container main-chart">
            <div className="chart-header">
          <h3>Revenue & Performance Trends</h3>
          <p>Track your business performance over time</p>
              <div className="metric-tabs">
                <button 
                  onClick={() => setActiveMetric("revenue")} 
                  className={`metric-tab ${activeMetric === "revenue" ? "active" : ""}`}
                >
              Revenue
            </button>
                <button 
                  onClick={() => setActiveMetric("orders")} 
                  className={`metric-tab ${activeMetric === "orders" ? "active" : ""}`}
                >
              Orders
            </button>
                <button 
                  onClick={() => setActiveMetric("customers")} 
                  className={`metric-tab ${activeMetric === "customers" ? "active" : ""}`}
                >
              Customers
            </button>
                <button 
                  onClick={() => setActiveMetric("profit")} 
                  className={`metric-tab ${activeMetric === "profit" ? "active" : ""}`}
                >
              Profit
            </button>
          </div>
            </div>
            <div className="chart-content">
              {dashboardData.salesData && dashboardData.salesData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={dashboardData.salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey={activeMetric}
                fill="#8884d8"
                fillOpacity={0.3}
                stroke="#8884d8"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey={activeMetric}
                stroke="#8884d8"
                strokeWidth={3}
                dot={{ fill: "#8884d8", r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
              ) : (
                <div className="chart-placeholder">
                  <FiBarChart />
                  <p>No sales data available</p>
                </div>
              )}
            </div>
        </div>

          {/* Side Charts Grid */}
          <div className="side-charts-grid">
        {/* Category Distribution */}
            <div className="chart-container side-chart">
              <div className="chart-header">
          <h3><FiPieChart /> Sales by Category</h3>
          <p>Revenue distribution across product categories</p>
              </div>
              <div className="chart-content">
                {dashboardData.categoryData && dashboardData.categoryData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                          data={dashboardData.categoryData}
                cx="50%"
                cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                          {dashboardData.categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
            </PieChart>
          </ResponsiveContainer>
                    <div className="category-legend">
                      {dashboardData.categoryData.map((cat, idx) => (
              <div key={idx} className="legend-item">
                          <span style={{ backgroundColor: cat.color }} className="color-dot"></span>
                          <span className="category-name">{cat.name}</span>
                          <span className="category-value">${cat.sales.toLocaleString()}</span>
              </div>
            ))}
                    </div>
                  </>
                ) : (
                  <div className="chart-placeholder">
                    <FiPieChart />
                    <p>No category data</p>
                  </div>
                )}
          </div>
        </div>

        {/* Hourly Sales Pattern */}
            <div className="chart-container side-chart">
              <div className="chart-header">
          <h3><FiClock /> Hourly Sales Pattern</h3>
          <p>Order volume throughout the day</p>
              </div>
              <div className="chart-content">
                {dashboardData.hourlyData && dashboardData.hourlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={dashboardData.hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
                      <Bar dataKey="orders" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="chart-placeholder">
                    <FiClock />
                    <p>No hourly data</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Charts Section */}
        <div className="additional-charts-section">
          {/* Customer Growth Chart */}
          <div className="chart-container">
            <div className="chart-header">
              <h3><FiUsers /> Customer Growth Trend</h3>
              <p>Monthly customer acquisition and retention</p>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={[
                  { month: 'Jan', new: 45, returning: 120, total: 165 },
                  { month: 'Feb', new: 52, returning: 135, total: 187 },
                  { month: 'Mar', new: 48, returning: 142, total: 190 },
                  { month: 'Apr', new: 61, returning: 158, total: 219 },
                  { month: 'May', new: 55, returning: 165, total: 220 },
                  { month: 'Jun', new: 68, returning: 178, total: 246 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="new" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="returning" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Product Performance Chart */}
          <div className="chart-container">
            <div className="chart-header">
              <h3><FiStar /> Top Product Performance</h3>
              <p>Revenue comparison of top-selling products</p>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { product: 'Premium Sofa', revenue: 45000, units: 45 },
                  { product: 'Dining Table', revenue: 38000, units: 38 },
                  { product: 'Bed Frame', revenue: 32000, units: 32 },
                  { product: 'Office Chair', revenue: 28000, units: 28 },
                  { product: 'Coffee Table', revenue: 25000, units: 25 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="product" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" />
                  <Bar dataKey="units" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Additional Charts Section */}
        <div className="additional-charts-section">
          {/* Customer Growth Chart */}
          <div className="chart-container">
            <div className="chart-header">
              <h3><FiUsers /> Customer Growth Trend</h3>
              <p>Monthly customer acquisition and retention</p>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={[
                  { month: 'Jan', new: 45, returning: 120, total: 165 },
                  { month: 'Feb', new: 52, returning: 135, total: 187 },
                  { month: 'Mar', new: 48, returning: 142, total: 190 },
                  { month: 'Apr', new: 61, returning: 158, total: 219 },
                  { month: 'May', new: 55, returning: 165, total: 220 },
                  { month: 'Jun', new: 68, returning: 178, total: 246 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="new" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="returning" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Product Performance Chart */}
          <div className="chart-container">
            <div className="chart-header">
              <h3><FiStar /> Top Product Performance</h3>
              <p>Revenue comparison of top-selling products</p>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { product: 'Premium Sofa', revenue: 45000, units: 45 },
                  { product: 'Dining Table', revenue: 38000, units: 38 },
                  { product: 'Bed Frame', revenue: 32000, units: 32 },
                  { product: 'Office Chair', revenue: 28000, units: 28 },
                  { product: 'Coffee Table', revenue: 25000, units: 25 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="product" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" />
                  <Bar dataKey="units" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
            </div>
        </div>
      </div>

        {/* Data Tables Section */}
        <div className="data-tables-section">
        {/* Recent Orders */}
          <div className="data-table-container">
            <div className="table-header">
              <h3><FiShoppingCart /> Recent Orders</h3>
          <p>Latest customer orders</p>
              <button 
                onClick={handleViewAllOrders} 
                className="view-all-button"
              >
                <FiEye /> View All Orders
              </button>
            </div>
            <div className="table-content">
              {dashboardData.recentOrders && dashboardData.recentOrders.length > 0 ? (
                <div className="orders-list">
                  {dashboardData.recentOrders.map((order, index) => (
                    <div key={`${order.id}-${index}`} className="order-item">
                      <div className="order-id">{order.id}</div>
                      <div className="order-customer">{order.customer}</div>
                      <div className="order-product">{order.product}</div>
                      <div className="order-amount">{order.amount}</div>
                      <div className="order-status">
                        <span className={`status-badge ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                </div>
                      <div className="order-time">{order.time}</div>
              </div>
            ))}
          </div>
              ) : (
                <div className="no-data-message">
                  <FiShoppingCart />
                  <p>No recent orders available</p>
                </div>
              )}
            </div>
        </div>

        {/* Top Products */}
          <div className="data-table-container">
            <div className="table-header">
              <h3><FiStar /> Top Performing Products</h3>
          <p>Best sellers this month</p>
              <button 
                onClick={handleViewAllProducts} 
                className="view-all-button"
              >
                <FiEye /> View All Products
              </button>
            </div>
            <div className="table-content">
              {dashboardData.topProducts && dashboardData.topProducts.length > 0 ? (
                <div className="products-list">
                  {dashboardData.topProducts.map((product, idx) => (
                    <div key={`${product.name}-${idx}`} className="product-item">
                      <div className="product-rank">#{idx + 1}</div>
                      <div className="product-details">
                        <div className="product-name">{product.name}</div>
                        <div className="product-meta">
                          {product.sales} sold • ★{product.rating}
                        </div>
                </div>
                <div className="product-stats">
                        <div className="product-revenue">
                          ${product.revenue.toLocaleString()}
                        </div>
                        <div className={`product-trend ${product.trend > 0 ? "positive" : "negative"}`}>
                    {product.trend > 0 ? <FiArrowUpRight /> : <FiArrowDownRight />}
                    {Math.abs(product.trend)}%
                        </div>
                </div>
              </div>
            ))}
                </div>
              ) : (
                <div className="no-data-message">
                  <FiStar />
                  <p>No product data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bottom-section">
          {/* Regional Performance */}
          <div className="data-container">
            <div className="container-header">
            <h3><FiMapPin /> Top Regions</h3>
              <p>Regional sales performance</p>
            </div>
            <div className="container-content">
              {dashboardData.regionalData && dashboardData.regionalData.length > 0 ? (
                <div className="regions-list">
                  {dashboardData.regionalData.map((region, idx) => (
                <div key={region.region} className="region-item">
                      <div className="region-info">
                        <span className="region-rank">#{idx + 1}</span>
                        <span className="region-name">{region.region}</span>
                      </div>
                      <div className="region-stats">
                        <div className="region-sales">
                          ${region.sales.toLocaleString()}
                        </div>
                        <div className={`region-growth ${region.growth > 0 ? "positive" : "negative"}`}>
                      {region.growth > 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                      {Math.abs(region.growth)}%
                        </div>
                  </div>
                </div>
              ))}
                </div>
              ) : (
                <div className="no-data-message">
                  <FiMapPin />
                  <p>No regional data available</p>
                </div>
              )}
            </div>
          </div>

          {/* System Alerts */}
          <div className="data-container">
            <div className="container-header">
            <h3><FiAlertTriangle /> System Alerts</h3>
              <p>Important notifications and warnings</p>
            </div>
            <div className="container-content">
              {dashboardData.alerts && dashboardData.alerts.length > 0 ? (
                <div className="alerts-list">
                  {dashboardData.alerts.map((alert, idx) => (
                <div key={idx} className={`alert-item ${alert.type}`}>
                      <div className="alert-icon">
                        <span className="alert-dot"></span>
                      </div>
                      <div className="alert-content">
                        <div className="alert-message">{alert.message}</div>
                        <div className="alert-time">{alert.time}</div>
                  </div>
                </div>
              ))}
            </div>
              ) : (
                <div className="no-data-message">
                  <FiAlertTriangle />
                  <p>No system alerts</p>
                </div>
              )}
          </div>
        </div>
      </div>
      </div>

      {/* Live Updates Section */}
      {isLiveView && (
        <div className="live-updates-panel">
          <div className="live-header">
            <FiActivity className="live-icon" />
            <h4>Live Updates</h4>
            <span className="live-badge">{notifications.length}</span>
          </div>
          <div className="live-content">
            {notifications.length > 0 ? (
              <div className="live-notifications">
                {notifications.map((n, i) => (
                  <div key={i} className="live-notification">
                    <span className="notification-message">{n.message}</span>
                    <span className="notification-time">{n.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-live-updates">No live updates yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}