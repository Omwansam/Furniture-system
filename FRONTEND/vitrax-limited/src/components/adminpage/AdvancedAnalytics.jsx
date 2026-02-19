import React, { useState, useEffect } from 'react';
import { 
  FaChartLine, 
  FaDollarSign, 
  FaUsers, 
  FaShoppingCart, 
  FaBox, 
  FaArrowUp,
  FaExclamationTriangle,
  FaDownload,
  FaRedo,
  FaFilter
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import './AdvancedAnalytics.css';
import { userService } from '../../services/adminService';

const AdvancedAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);
  const [dashboardData, setDashboardData] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [productData, setProductData] = useState(null);
  const [financialData, setFinancialData] = useState(null);
  const [realTimeData, setRealTimeData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Color schemes for charts
  const colors = {
    primary: '#3498db',
    secondary: '#2ecc71',
    accent: '#e74c3c',
    warning: '#f39c12',
    info: '#9b59b6',
    success: '#27ae60',
    danger: '#e74c3c'
  };

  const chartColors = [
    '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
    '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#16a085'
  ];

  useEffect(() => {
    fetchAllAnalytics();
    // Set up real-time updates every 5 minutes
    const interval = setInterval(fetchRealTimeData, 300000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchAllAnalytics = async () => {
    setLoading(true);
    try {
      const [dashboard, sales, customers, products, financial, realTime] = await Promise.all([
        userService.getDashboardAnalytics(timeRange),
        userService.getSalesAnalytics(timeRange),
        userService.getCustomerAnalytics(timeRange),
        userService.getProductAnalytics(timeRange),
        userService.getFinancialAnalytics(timeRange),
        userService.getRealTimeAnalytics()
      ]);

      if (dashboard.success) setDashboardData(dashboard.data);
      if (sales.success) setSalesData(sales.data);
      if (customers.success) setCustomerData(customers.data);
      if (products.success) setProductData(products.data);
      if (financial.success) setFinancialData(financial.data);
      if (realTime.success) setRealTimeData(realTime.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRealTimeData = async () => {
    try {
      const data = await userService.getRealTimeAnalytics();
      if (data.success) {
        setRealTimeData(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch real-time data:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };



  if (loading) {
    return (
      <div className="advanced-analytics">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

    return (
    <div className="advanced-analytics">
      {/* Header */}
      <div className="analytics-header">
        <div className="header-content">
          <h1>Advanced Analytics Dashboard</h1>
          <p>Comprehensive insights into your business performance</p>
        </div>
        <div className="header-actions">
          <div className="time-filter">
            <FaFilter />
          <select 
            value={timeRange} 
              onChange={(e) => setTimeRange(Number(e.target.value))}
              className="time-select"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={365}>Last year</option>
          </select>
          </div>
          <button className="btn btn-secondary" onClick={fetchAllAnalytics}>
            <FaRedo /> Refresh
          </button>
          <button className="btn btn-primary">
            <FaDownload /> Export Report
          </button>
        </div>
      </div>

      {/* Real-time Stats */}
      {realTimeData && (
        <div className="real-time-stats">
          <div className="stat-card real-time">
            <div className="stat-icon">
              <FaShoppingCart />
            </div>
            <div className="stat-content">
              <h3>{realTimeData.today?.orders || 0}</h3>
              <p>Today's Orders</p>
              <span className="stat-change positive">
                <FaArrowUp /> +{realTimeData.today?.orders || 0}
              </span>
            </div>
          </div>
          
          <div className="stat-card real-time">
            <div className="stat-icon">
              <FaDollarSign />
            </div>
            <div className="stat-content">
              <h3>{formatCurrency(realTimeData.today?.revenue || 0)}</h3>
              <p>Today's Revenue</p>
              <span className="stat-change positive">
                <FaArrowUp /> +{formatCurrency(realTimeData.today?.revenue || 0)}
              </span>
            </div>
          </div>
          
          <div className="stat-card real-time">
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3>{realTimeData.today?.customers || 0}</h3>
              <p>New Customers</p>
              <span className="stat-change positive">
                <FaArrowUp /> +{realTimeData.today?.customers || 0}
              </span>
            </div>
          </div>
          
          <div className="stat-card alert">
            <div className="stat-icon">
              <FaExclamationTriangle />
            </div>
            <div className="stat-content">
              <h3>{realTimeData.alerts?.pending_orders || 0}</h3>
              <p>Pending Orders</p>
              <span className="stat-change warning">
                <FaExclamationTriangle /> Requires Attention
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="analytics-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FaChartLine /> Overview
        </button>
        <button 
          className={`tab ${activeTab === 'sales' ? 'active' : ''}`}
          onClick={() => setActiveTab('sales')}
        >
          <FaDollarSign /> Sales Analytics
        </button>
        <button 
          className={`tab ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          <FaUsers /> Customer Analytics
        </button>
        <button 
          className={`tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <FaBox /> Product Analytics
        </button>
        <button 
          className={`tab ${activeTab === 'financial' ? 'active' : ''}`}
          onClick={() => setActiveTab('financial')}
        >
          <FaArrowUp /> Financial Analytics
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && dashboardData && (
        <div className="tab-content">
      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
              <div className="metric-icon">
                <FaShoppingCart />
          </div>
          <div className="metric-content">
                <h3>{formatNumber(dashboardData.overview.total_orders)}</h3>
                <p>Total Orders</p>
                <span className="metric-period">Last {timeRange} days</span>
          </div>
        </div>

        <div className="metric-card">
              <div className="metric-icon">
                <FaDollarSign />
          </div>
          <div className="metric-content">
                <h3>{formatCurrency(dashboardData.overview.total_revenue)}</h3>
                <p>Total Revenue</p>
                <span className="metric-period">Last {timeRange} days</span>
          </div>
        </div>

        <div className="metric-card">
              <div className="metric-icon">
                <FaUsers />
          </div>
          <div className="metric-content">
                <h3>{formatNumber(dashboardData.overview.total_customers)}</h3>
                <p>New Customers</p>
                <span className="metric-period">Last {timeRange} days</span>
          </div>
        </div>

        <div className="metric-card">
              <div className="metric-icon">
                <FaBox />
          </div>
          <div className="metric-content">
                <h3>{formatNumber(dashboardData.overview.total_products)}</h3>
                <p>Total Products</p>
                <span className="metric-period">Current</span>
          </div>
        </div>
      </div>

          {/* Sales Trend Chart */}
        <div className="chart-container">
            <h3>Sales Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={dashboardData.sales_trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="orders" fill={colors.primary} name="Orders" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke={colors.success} name="Revenue" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products and Categories */}
          <div className="charts-row">
            <div className="chart-container half">
              <h3>Top Selling Products</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dashboardData.top_products.slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total_sold" fill={colors.secondary} name="Units Sold" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="chart-container half">
              <h3>Category Performance</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={dashboardData.category_performance}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="revenue"
                  >
                    {dashboardData.category_performance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Customer Segments */}
          <div className="chart-container">
            <h3>Customer Segments</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dashboardData.customer_segments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="segment" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={colors.info} name="Customer Count" />
              </BarChart>
            </ResponsiveContainer>
            </div>
          </div>
      )}

      {/* Sales Analytics Tab */}
      {activeTab === 'sales' && salesData && (
        <div className="tab-content">
          <div className="charts-row">
            <div className="chart-container full">
              <h3>Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData.daily_sales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="revenue" stroke={colors.success} fill={colors.success} fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
                </div>
              </div>

          <div className="charts-row">
            <div className="chart-container half">
              <h3>Monthly Sales Breakdown</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salesData.monthly_sales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="revenue" fill={colors.primary} name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
              </div>
            
            <div className="chart-container half">
              <h3>Sales by Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={salesData.status_sales}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="revenue"
                  >
                    {salesData.status_sales.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
            <h3>Average Order Value Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={salesData.aov_trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line type="monotone" dataKey="avg_order_value" stroke={colors.warning} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
                    </div>
              </div>
            )}

      {/* Customer Analytics Tab */}
      {activeTab === 'customers' && customerData && (
        <div className="tab-content">
          <div className="charts-row">
            <div className="chart-container full">
              <h3>Customer Acquisition Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={customerData.customer_acquisition}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="new_customers" stroke={colors.info} fill={colors.info} fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
        </div>
      </div>

          <div className="chart-container">
            <h3>Top Customers by Lifetime Value</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={customerData.customer_lifetime.slice(0, 15)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="username" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="total_spent" fill={colors.success} name="Total Spent" />
              </BarChart>
            </ResponsiveContainer>
                </div>

          <div className="metrics-row">
            <div className="metric-card large">
              <div className="metric-icon">
                <FaUsers />
                  </div>
              <div className="metric-content">
                <h3>{customerData.repeat_customer_rate}%</h3>
                <p>Repeat Customer Rate</p>
                <span className="metric-description">
                  Percentage of customers who made multiple purchases
                </span>
                  </div>
                </div>
              </div>
            </div>
          )}

      {/* Product Analytics Tab */}
      {activeTab === 'products' && productData && (
        <div className="tab-content">
          <div className="charts-row">
            <div className="chart-container half">
              <h3>Category Performance</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={productData.category_performance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="revenue" fill={colors.primary} name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="chart-container half">
              <h3>Top Performing Products</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={productData.top_products.slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="revenue" fill={colors.secondary} name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
        </div>
      </div>

          <div className="chart-container">
            <h3>Inventory Turnover Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={productData.inventory_turnover.slice(0, 20)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="sold_quantity" fill={colors.info} name="Units Sold" />
                <Line yAxisId="right" type="monotone" dataKey="turnover_ratio" stroke={colors.warning} name="Turnover %" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
            </div>
      )}

      {/* Financial Analytics Tab */}
      {activeTab === 'financial' && financialData && (
        <div className="tab-content">
          <div className="charts-row">
            <div className="chart-container full">
              <h3>Revenue Growth & Profit Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={financialData.revenue_growth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="revenue" stroke={colors.success} fill={colors.success} fillOpacity={0.3} name="Revenue" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="charts-row">
            <div className="chart-container half">
              <h3>Payment Method Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={financialData.payment_methods}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ method, percent }) => `${method} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="total_amount"
                  >
                    {financialData.payment_methods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
          </div>

            <div className="chart-container half">
              <h3>Key Financial Metrics</h3>
              <div className="metrics-grid compact">
                <div className="metric-item">
                  <span className="metric-label">Total Revenue</span>
                  <span className="metric-value">{formatCurrency(financialData.key_metrics.total_revenue)}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Total Profit</span>
                  <span className="metric-value">{formatCurrency(financialData.key_metrics.total_profit)}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Profit Margin</span>
                  <span className="metric-value">{financialData.key_metrics.profit_margin}%</span>
            </div>
                <div className="metric-item">
                  <span className="metric-label">Avg Daily Revenue</span>
                  <span className="metric-value">{formatCurrency(financialData.key_metrics.avg_daily_revenue)}</span>
            </div>
          </div>
        </div>
      </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedAnalytics;
