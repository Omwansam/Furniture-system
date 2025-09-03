
import React, { useState, useEffect } from "react";
import "./Reports.css";
import {
  FiDownload,
  FiRefreshCw,
  FiBarChart,
  FiPieChart,
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiShoppingCart,
  FiUsers,
  FiPackage,
  FiCalendar,
  FiFilter,
  FiEye,
  FiXCircle,
} from "react-icons/fi";
import { reportsService } from "../../services/adminService";

// Chart components
import { ResponsiveContainer, Line, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, PieChart, Pie, Cell, LineChart, AreaChart } from 'recharts';

export default function Reports() {
  const [activeReport, setActiveReport] = useState("sales");
  const [timeRange, setTimeRange] = useState("30d");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState({});

  // Mock data for reports
  const mockData = {
    sales: {
      summary: {
        total_revenue: 125000,
        total_orders: 1245,
        completed_orders: 1180,
        completion_rate: 94.8,
        average_order_value: 105.93
      },
      daily_trend: [
        { date: 'Jan 01', revenue: 12000, orders: 45 },
        { date: 'Jan 02', revenue: 15000, orders: 52 },
        { date: 'Jan 03', revenue: 18000, orders: 61 },
        { date: 'Jan 04', revenue: 14000, orders: 48 },
        { date: 'Jan 05', revenue: 22000, orders: 73 },
        { date: 'Jan 06', revenue: 19000, orders: 65 },
        { date: 'Jan 07', revenue: 25000, orders: 82 }
      ],
      category_sales: [
        { category: 'Living Room', total: 87500, items: 156 },
        { category: 'Bedroom', total: 70000, items: 134 },
        { category: 'Dining', total: 55000, items: 98 },
        { category: 'Office', total: 37500, items: 67 }
      ],
      top_products: [
        { product: 'Premium Sofa', quantity: 45, revenue: 45000 },
        { product: 'Dining Table', quantity: 38, revenue: 38000 },
        { product: 'Bed Frame', quantity: 32, revenue: 32000 },
        { product: 'Office Chair', quantity: 28, revenue: 28000 },
        { product: 'Coffee Table', quantity: 25, revenue: 25000 }
      ]
    },
    inventory: {
      summary: {
        total_products: 156,
        low_stock_products: 12,
        out_of_stock_products: 3,
        total_stock_value: 450000
      },
      category_inventory: [
        { category: 'Living Room', product_count: 45, total_stock: 234, stock_value: 125000 },
        { category: 'Bedroom', product_count: 38, total_stock: 189, stock_value: 98000 },
        { category: 'Dining', product_count: 32, total_stock: 167, stock_value: 87000 },
        { category: 'Office', product_count: 28, total_stock: 145, stock_value: 76000 },
        { category: 'Outdoor', product_count: 13, total_stock: 67, stock_value: 34000 }
      ],
      low_stock_products: [
        { product: 'Premium Sofa', current_stock: 5, reorder_level: 10, price: 1200, category: 'Living Room' },
        { product: 'Dining Table', current_stock: 3, reorder_level: 8, price: 800, category: 'Dining' },
        { product: 'Bed Frame', current_stock: 7, reorder_level: 12, price: 600, category: 'Bedroom' },
        { product: 'Office Chair', current_stock: 4, reorder_level: 6, price: 300, category: 'Office' }
      ]
    },
    customers: {
      summary: {
        total_customers: 892,
        new_customers: 45,
        repeat_customers: 234,
        retention_rate: 26.2
      },
      customer_segments: [
        { segment: 'High Value', count: 89 },
        { segment: 'Medium Value', count: 234 },
        { segment: 'Low Value', count: 569 }
      ],
      top_customers: [
        { username: 'john_doe', name: 'John Doe', order_count: 15, total_spent: 4500, avg_order_value: 300 },
        { username: 'jane_smith', name: 'Jane Smith', order_count: 12, total_spent: 3800, avg_order_value: 317 },
        { username: 'mike_johnson', name: 'Mike Johnson', order_count: 10, total_spent: 3200, avg_order_value: 320 },
        { username: 'sarah_wilson', name: 'Sarah Wilson', order_count: 8, total_spent: 2800, avg_order_value: 350 },
        { username: 'david_brown', name: 'David Brown', order_count: 7, total_spent: 2500, avg_order_value: 357 }
      ]
    },
    financial: {
      summary: {
        total_revenue: 125000,
        total_orders: 1245,
        payment_success_rate: 96.5
      },
      payment_methods: [
        { method: 'Credit Card', count: 856, total: 85600 },
        { method: 'PayPal', count: 234, total: 23400 },
        { method: 'Bank Transfer', count: 98, total: 9800 },
        { method: 'Cash', count: 57, total: 5700 }
      ],
      payment_status: [
        { status: 'Completed', count: 1200, total: 120000 },
        { status: 'Pending', count: 30, total: 3000 },
        { status: 'Failed', count: 15, total: 1500 }
      ],
      monthly_trend: [
        { year: 2024, month: 1, revenue: 125000, orders: 1245 },
        { year: 2023, month: 12, revenue: 118000, orders: 1180 },
        { year: 2023, month: 11, revenue: 112000, orders: 1120 },
        { year: 2023, month: 10, revenue: 108000, orders: 1080 },
        { year: 2023, month: 9, revenue: 105000, orders: 1050 },
        { year: 2023, month: 8, revenue: 102000, orders: 1020 }
      ]
    }
  };

  useEffect(() => {
    loadReportData();
  }, [activeReport, timeRange]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setReportData(mockData[activeReport] || {});
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (format) => {
    const data = reportData;
    if (format === 'csv') {
      // Create CSV content based on active report
      let csvContent = "data:text/csv;charset=utf-8,";
      
      if (activeReport === 'sales') {
        csvContent += "Date,Revenue,Orders\n";
        data.daily_trend?.forEach(row => {
          csvContent += `${row.date},${row.revenue},${row.orders}\n`;
        });
      } else if (activeReport === 'inventory') {
        csvContent += "Category,Product Count,Total Stock,Stock Value\n";
        data.category_inventory?.forEach(row => {
          csvContent += `${row.category},${row.product_count},${row.total_stock},${row.stock_value}\n`;
        });
      }
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${activeReport}_report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderSalesReport = () => (
    <div className="report-content">
      <div className="report-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <FiDollarSign />
          </div>
          <div className="summary-content">
            <h3>${reportData.summary?.total_revenue?.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <FiShoppingCart />
          </div>
          <div className="summary-content">
            <h3>{reportData.summary?.total_orders}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <FiTrendingUp />
          </div>
          <div className="summary-content">
            <h3>{reportData.summary?.completion_rate}%</h3>
            <p>Completion Rate</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <FiDollarSign />
          </div>
          <div className="summary-content">
            <h3>${reportData.summary?.average_order_value}</h3>
            <p>Avg Order Value</p>
          </div>
        </div>
      </div>

      <div className="report-charts">
        <div className="chart-container">
          <h3>Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData.daily_trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Category Sales Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reportData.category_sales}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="total"
              >
                {reportData.category_sales?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658', '#ff7300'][index % 4]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="report-table">
        <h3>Top Selling Products</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {reportData.top_products?.map((product, index) => (
                <tr key={index}>
                  <td>{product.product}</td>
                  <td>{product.quantity}</td>
                  <td>${product.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderInventoryReport = () => (
    <div className="report-content">
      <div className="report-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <FiPackage />
          </div>
          <div className="summary-content">
            <h3>{reportData.summary?.total_products}</h3>
            <p>Total Products</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <FiTrendingDown />
          </div>
          <div className="summary-content">
            <h3>{reportData.summary?.low_stock_products}</h3>
            <p>Low Stock</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <FiXCircle />
          </div>
          <div className="summary-content">
            <h3>{reportData.summary?.out_of_stock_products}</h3>
            <p>Out of Stock</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <FiDollarSign />
          </div>
          <div className="summary-content">
            <h3>${reportData.summary?.total_stock_value?.toLocaleString()}</h3>
            <p>Stock Value</p>
          </div>
        </div>
      </div>

      <div className="report-charts">
        <div className="chart-container">
          <h3>Inventory by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.category_inventory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="product_count" fill="#8884d8" />
              <Bar dataKey="total_stock" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="report-table">
        <h3>Low Stock Products</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Current Stock</th>
                <th>Reorder Level</th>
                <th>Price</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {reportData.low_stock_products?.map((product, index) => (
                <tr key={index}>
                  <td>{product.product}</td>
                  <td className={product.current_stock < product.reorder_level ? 'low-stock' : ''}>
                    {product.current_stock}
                  </td>
                  <td>{product.reorder_level}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCustomerReport = () => (
    <div className="report-content">
      <div className="report-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <FiUsers />
          </div>
          <div className="summary-content">
            <h3>{reportData.summary?.total_customers}</h3>
            <p>Total Customers</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <FiTrendingUp />
          </div>
          <div className="summary-content">
            <h3>{reportData.summary?.new_customers}</h3>
            <p>New Customers</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <FiUsers />
          </div>
          <div className="summary-content">
            <h3>{reportData.summary?.repeat_customers}</h3>
            <p>Repeat Customers</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <FiTrendingUp />
          </div>
          <div className="summary-content">
            <h3>{reportData.summary?.retention_rate}%</h3>
            <p>Retention Rate</p>
          </div>
        </div>
      </div>

      <div className="report-charts">
        <div className="chart-container">
          <h3>Customer Segments</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reportData.customer_segments}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="count"
              >
                {reportData.customer_segments?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658'][index % 3]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="report-table">
        <h3>Top Customers</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Avg Order Value</th>
              </tr>
            </thead>
            <tbody>
              {reportData.top_customers?.map((customer, index) => (
                <tr key={index}>
                  <td>{customer.name}</td>
                  <td>{customer.order_count}</td>
                  <td>${customer.total_spent.toLocaleString()}</td>
                  <td>${customer.avg_order_value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFinancialReport = () => (
    <div className="report-content">
      <div className="report-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <FiDollarSign />
          </div>
          <div className="summary-content">
            <h3>${reportData.summary?.total_revenue?.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <FiShoppingCart />
          </div>
          <div className="summary-content">
            <h3>{reportData.summary?.total_orders}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <FiTrendingUp />
          </div>
          <div className="summary-content">
            <h3>{reportData.summary?.payment_success_rate}%</h3>
            <p>Payment Success Rate</p>
          </div>
        </div>
        </div>
        
      <div className="report-charts">
        <div className="chart-container">
          <h3>Payment Methods Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.payment_methods}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="method" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
              <Bar dataKey="total" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-container">
          <h3>Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={reportData.monthly_trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderReportContent = () => {
    switch (activeReport) {
      case 'sales':
        return renderSalesReport();
      case 'inventory':
        return renderInventoryReport();
      case 'customers':
        return renderCustomerReport();
      case 'financial':
        return renderFinancialReport();
      default:
        return <div>Select a report type</div>;
    }
  };

  return (
    <div className="reports">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>Reports & Analytics</h1>
          <p>Comprehensive business intelligence and reporting dashboard</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => exportReport('csv')}>
            <FiDownload /> Export CSV
          </button>
          <button className="btn btn-secondary" onClick={loadReportData}>
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="report-selector">
        <button
          className={`report-tab ${activeReport === 'sales' ? 'active' : ''}`}
          onClick={() => setActiveReport('sales')}
        >
          <FiBarChart /> Sales Report
        </button>
        <button
          className={`report-tab ${activeReport === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveReport('inventory')}
        >
          <FiPackage /> Inventory Report
        </button>
        <button
          className={`report-tab ${activeReport === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveReport('customers')}
        >
          <FiUsers /> Customer Report
        </button>
        <button
          className={`report-tab ${activeReport === 'financial' ? 'active' : ''}`}
          onClick={() => setActiveReport('financial')}
        >
          <FiDollarSign /> Financial Report
        </button>
      </div>

      {/* Time Range Selector */}
      <div className="time-selector">
        <label>Time Range:</label>
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <FiRefreshCw className="spinning" />
          <p>Loading report data...</p>
        </div>
      )}

      {/* Report Content */}
      {!loading && renderReportContent()}
    </div>
  );
}
