import React, { useState, useEffect } from 'react';
import { FaChartLine, FaChartBar, FaDollarSign, FaShoppingCart, FaUsers, FaBox, FaTrendingUp, FaTrendingDown, FaCalendarAlt, FaDownload, FaFilter } from 'react-icons/fa';
import './AdvancedAnalytics.css';

const AdvancedAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      totalProducts: 0,
      revenueGrowth: 0,
      orderGrowth: 0,
      customerGrowth: 0,
      productGrowth: 0
    },
    salesData: [],
    topProducts: [],
    customerSegments: [],
    recentTransactions: []
  });

  // Mock data for demonstration
  const mockData = {
    overview: {
      totalRevenue: 125430.50,
      totalOrders: 1247,
      totalCustomers: 892,
      totalProducts: 156,
      revenueGrowth: 15.3,
      orderGrowth: 8.7,
      customerGrowth: 12.1,
      productGrowth: 5.2
    },
    salesData: [
      { date: '2024-01-01', revenue: 12500, orders: 45 },
      { date: '2024-01-02', revenue: 15200, orders: 52 },
      { date: '2024-01-03', revenue: 11800, orders: 38 },
      { date: '2024-01-04', revenue: 18900, orders: 67 },
      { date: '2024-01-05', revenue: 16300, orders: 59 },
      { date: '2024-01-06', revenue: 14700, orders: 48 },
      { date: '2024-01-07', revenue: 19800, orders: 72 }
    ],
    topProducts: [
      { id: 1, name: 'Modern Sofa Set', sales: 89, revenue: 222411, growth: 23.5 },
      { id: 2, name: 'Oak Dining Table', sales: 56, revenue: 72744, growth: 15.2 },
      { id: 3, name: 'Leather Recliner', sales: 43, revenue: 38657, growth: -5.3 },
      { id: 4, name: 'Coffee Table', sales: 78, revenue: 31122, growth: 8.9 },
      { id: 5, name: 'Bookshelf', sales: 34, revenue: 20400, growth: 12.7 }
    ],
    customerSegments: [
      { segment: 'Premium', count: 156, percentage: 17.5, avgSpent: 2850 },
      { segment: 'Regular', count: 534, percentage: 59.9, avgSpent: 1250 },
      { segment: 'Occasional', count: 202, percentage: 22.6, avgSpent: 450 }
    ],
    recentTransactions: [
      { id: 'TXN-001', customer: 'John Doe', amount: 2499, product: 'Modern Sofa Set', date: '2024-01-15' },
      { id: 'TXN-002', customer: 'Sarah Johnson', amount: 1299, product: 'Oak Dining Table', date: '2024-01-15' },
      { id: 'TXN-003', customer: 'Mike Wilson', amount: 899, product: 'Leather Recliner', date: '2024-01-14' },
      { id: 'TXN-004', customer: 'Emily Davis', amount: 399, product: 'Coffee Table', date: '2024-01-14' },
      { id: 'TXN-005', customer: 'David Brown', amount: 599, product: 'Bookshelf', date: '2024-01-13' }
    ]
  };

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAnalyticsData(mockData);
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getGrowthIcon = (growth) => {
    return growth >= 0 ? <FaTrendingUp className="growth-up" /> : <FaTrendingDown className="growth-down" />;
  };

  const getGrowthClass = (growth) => {
    return growth >= 0 ? 'growth-positive' : 'growth-negative';
  };

  if (loading) {
  return (
      <div className="analytics-loading">
        <div className="loading-spinner"></div>
        <p>Loading analytics...</p>
    </div>
    );
  }

  return (
    <div className="advanced-analytics">
      <div className="analytics-header">
        <div className="header-info">
          <h1>Advanced Analytics</h1>
          <p>Comprehensive business insights and performance metrics</p>
        </div>
        <div className="header-controls">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="btn btn-primary">
            <FaDownload /> Export Report
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="overview-grid">
        <div className="overview-card">
          <div className="card-icon revenue">
            <FaDollarSign />
          </div>
          <div className="card-content">
            <h3>{formatCurrency(analyticsData.overview.totalRevenue)}</h3>
            <p>Total Revenue</p>
            <div className={`growth-indicator ${getGrowthClass(analyticsData.overview.revenueGrowth)}`}>
              {getGrowthIcon(analyticsData.overview.revenueGrowth)}
              <span>{Math.abs(analyticsData.overview.revenueGrowth)}%</span>
            </div>
          </div>
        </div>

        <div className="overview-card">
          <div className="card-icon orders">
            <FaShoppingCart />
          </div>
          <div className="card-content">
            <h3>{analyticsData.overview.totalOrders.toLocaleString()}</h3>
            <p>Total Orders</p>
            <div className={`growth-indicator ${getGrowthClass(analyticsData.overview.orderGrowth)}`}>
              {getGrowthIcon(analyticsData.overview.orderGrowth)}
              <span>{Math.abs(analyticsData.overview.orderGrowth)}%</span>
            </div>
          </div>
        </div>

        <div className="overview-card">
          <div className="card-icon customers">
            <FaUsers />
          </div>
          <div className="card-content">
            <h3>{analyticsData.overview.totalCustomers.toLocaleString()}</h3>
            <p>Total Customers</p>
            <div className={`growth-indicator ${getGrowthClass(analyticsData.overview.customerGrowth)}`}>
              {getGrowthIcon(analyticsData.overview.customerGrowth)}
              <span>{Math.abs(analyticsData.overview.customerGrowth)}%</span>
            </div>
          </div>
        </div>

        <div className="overview-card">
          <div className="card-icon products">
            <FaBox />
          </div>
          <div className="card-content">
            <h3>{analyticsData.overview.totalProducts.toLocaleString()}</h3>
            <p>Total Products</p>
            <div className={`growth-indicator ${getGrowthClass(analyticsData.overview.productGrowth)}`}>
              {getGrowthIcon(analyticsData.overview.productGrowth)}
              <span>{Math.abs(analyticsData.overview.productGrowth)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Sales Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3><FaChartLine /> Sales Trend</h3>
            <div className="chart-controls">
              <button className="chart-btn active">Revenue</button>
              <button className="chart-btn">Orders</button>
            </div>
          </div>
          <div className="chart-content">
            <div className="simple-chart">
              {analyticsData.salesData.map((data, index) => (
                <div key={index} className="chart-bar">
                  <div 
                    className="bar" 
                    style={{ 
                      height: `${(data.revenue / 20000) * 100}%`,
                      backgroundColor: '#3498db'
                    }}
                  ></div>
                  <span className="bar-label">{formatDate(data.date)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="chart-card">
          <div className="chart-header">
            <h3><FaChartBar /> Top Products</h3>
          </div>
          <div className="chart-content">
            <div className="top-products-list">
              {analyticsData.topProducts.map((product, index) => (
                <div key={product.id} className="product-item">
                  <div className="product-rank">#{index + 1}</div>
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="product-stats">
                      <span>{product.sales} sales</span>
                      <span>{formatCurrency(product.revenue)}</span>
                    </div>
                  </div>
                  <div className={`product-growth ${getGrowthClass(product.growth)}`}>
                    {getGrowthIcon(product.growth)}
                    {Math.abs(product.growth)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="analytics-grid">
        {/* Customer Segments */}
        <div className="analytics-card">
          <div className="card-header">
            <h3>Customer Segments</h3>
          </div>
          <div className="card-content">
            <div className="segments-list">
              {analyticsData.customerSegments.map((segment, index) => (
                <div key={index} className="segment-item">
                  <div className="segment-info">
                    <div className="segment-name">{segment.segment}</div>
                    <div className="segment-count">{segment.count} customers</div>
                  </div>
                  <div className="segment-stats">
                    <div className="segment-percentage">{segment.percentage}%</div>
                    <div className="segment-avg">Avg: {formatCurrency(segment.avgSpent)}</div>
                  </div>
                  <div className="segment-bar">
                    <div 
                      className="segment-fill" 
                      style={{ width: `${segment.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="analytics-card">
          <div className="card-header">
            <h3>Recent Transactions</h3>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="card-content">
            <div className="transactions-list">
              {analyticsData.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-info">
                    <div className="transaction-customer">{transaction.customer}</div>
                    <div className="transaction-product">{transaction.product}</div>
                  </div>
                  <div className="transaction-details">
                    <div className="transaction-amount">{formatCurrency(transaction.amount)}</div>
                    <div className="transaction-date">{formatDate(transaction.date)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};





export default AdvancedAnalytics

