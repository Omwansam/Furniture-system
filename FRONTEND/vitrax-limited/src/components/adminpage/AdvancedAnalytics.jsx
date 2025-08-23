import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/adminService';
import './AdvancedAnalytics.css';

const AdvancedAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState({
    overview: null,
    sales: null,
    topProducts: null,
    customerSegments: null
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [overview, sales, topProducts, customerSegments] = await Promise.all([
        analyticsService.getDashboardOverview(timeRange),
        analyticsService.getSalesData(timeRange),
        analyticsService.getTopProducts(10),
        analyticsService.getCustomerSegments()
      ]);

      setAnalyticsData({
        overview,
        sales,
        topProducts,
        customerSegments
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-container">
        <div className="error-container">
          <h3>Error Loading Analytics</h3>
          <p>{error}</p>
          <button onClick={fetchAnalyticsData} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      {/* Header */}
      <div className="analytics-header">
        <div className="header-content">
          <h1>Advanced Analytics</h1>
          <p>Comprehensive insights into your business performance</p>
        </div>
        <div className="header-controls">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <button onClick={fetchAnalyticsData} className="btn btn-secondary">
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon revenue">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="metric-content">
            <h3>Total Revenue</h3>
            <p className="metric-value">
              {analyticsData.overview?.totalRevenue ? 
                formatCurrency(analyticsData.overview.totalRevenue) : 
                '$0.00'
              }
            </p>
            <span className="metric-change positive">
              +{analyticsData.overview?.revenueGrowth || 0}% vs last period
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon orders">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="metric-content">
            <h3>Total Orders</h3>
            <p className="metric-value">
              {analyticsData.overview?.totalOrders || 0}
            </p>
            <span className="metric-change positive">
              +{analyticsData.overview?.orderGrowth || 0}% vs last period
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon customers">
            <i className="fas fa-users"></i>
          </div>
          <div className="metric-content">
            <h3>New Customers</h3>
            <p className="metric-value">
              {analyticsData.overview?.newCustomers || 0}
            </p>
            <span className="metric-change positive">
              +{analyticsData.overview?.customerGrowth || 0}% vs last period
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon conversion">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="metric-content">
            <h3>Conversion Rate</h3>
            <p className="metric-value">
              {analyticsData.overview?.conversionRate ? 
                formatPercentage(analyticsData.overview.conversionRate) : 
                '0%'
              }
            </p>
            <span className="metric-change positive">
              +{analyticsData.overview?.conversionGrowth || 0}% vs last period
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <div className="chart-header">
            <h3>Sales Trend</h3>
            <div className="chart-controls">
              <button className="chart-btn active">Daily</button>
              <button className="chart-btn">Weekly</button>
              <button className="chart-btn">Monthly</button>
            </div>
          </div>
          <div className="chart-content">
            {analyticsData.sales ? (
              <div className="sales-chart">
                {/* Placeholder for chart - would integrate with Chart.js or similar */}
                <div className="chart-placeholder">
                  <p>Sales data visualization would go here</p>
                  <small>Integrate with Chart.js or similar library</small>
                </div>
              </div>
            ) : (
              <div className="no-data">
                <p>No sales data available</p>
              </div>
            )}
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h3>Top Performing Products</h3>
          </div>
          <div className="chart-content">
            {analyticsData.topProducts && analyticsData.topProducts.length > 0 ? (
              <div className="top-products-list">
                {analyticsData.topProducts.map((product, index) => (
                  <div key={product.product_id} className="product-item">
                    <div className="product-rank">{index + 1}</div>
                    <div className="product-info">
                      <h4>{product.product_name}</h4>
                      <p>{product.category_name}</p>
                    </div>
                    <div className="product-stats">
                      <span className="sales-count">{product.sales_count} sold</span>
                      <span className="revenue">{formatCurrency(product.revenue)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">
                <p>No product data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Segments */}
      <div className="segments-section">
        <h3>Customer Segments</h3>
        <div className="segments-grid">
          {analyticsData.customerSegments && analyticsData.customerSegments.length > 0 ? (
            analyticsData.customerSegments.map((segment, index) => (
              <div key={index} className="segment-card">
                <div className="segment-header">
                  <h4>{segment.name}</h4>
                  <span className="segment-size">{segment.size} customers</span>
                </div>
                <div className="segment-stats">
                  <div className="stat">
                    <label>Average Order Value</label>
                    <span>{formatCurrency(segment.avgOrderValue)}</span>
                  </div>
                  <div className="stat">
                    <label>Purchase Frequency</label>
                    <span>{segment.purchaseFrequency} orders/month</span>
                  </div>
                  <div className="stat">
                    <label>Retention Rate</label>
                    <span>{formatPercentage(segment.retentionRate)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">
              <p>No customer segment data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="insights-section">
        <h3>Performance Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon positive">
              <i className="fas fa-arrow-up"></i>
            </div>
            <div className="insight-content">
              <h4>Revenue Growth</h4>
              <p>Your revenue has increased by {analyticsData.overview?.revenueGrowth || 0}% compared to the previous period.</p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon neutral">
              <i className="fas fa-chart-bar"></i>
            </div>
            <div className="insight-content">
              <h4>Product Performance</h4>
              <p>Top 3 products account for {analyticsData.overview?.topProductsRevenue || 0}% of total revenue.</p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon positive">
              <i className="fas fa-users"></i>
            </div>
            <div className="insight-content">
              <h4>Customer Acquisition</h4>
              <p>You've acquired {analyticsData.overview?.newCustomers || 0} new customers this period.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
