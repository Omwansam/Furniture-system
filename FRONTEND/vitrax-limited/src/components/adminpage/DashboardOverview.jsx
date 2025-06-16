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
} from "react-icons/fi";

// Sample Chart Libraries
import { ResponsiveContainer, Line, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, PieChart, Pie, Cell } from 'recharts';

export default function DashboardOverview() {
  const [timeRange, setTimeRange] = useState("30d");
  const [activeMetric, setActiveMetric] = useState("revenue");
  const [isLiveView, setIsLiveView] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [notifications, setNotifications] = useState([]);

  // Enhanced data for charts
  const salesData = [
    { date: "Jan 1", revenue: 12000, orders: 45, customers: 32, profit: 3600 },
    { date: "Jan 8", revenue: 15000, orders: 52, customers: 38, profit: 4500 },
    { date: "Jan 15", revenue: 18000, orders: 61, customers: 45, profit: 5400 },
    { date: "Jan 22", revenue: 22000, orders: 68, customers: 52, profit: 6600 },
    { date: "Jan 29", revenue: 25000, orders: 75, customers: 58, profit: 7500 },
    { date: "Feb 5", revenue: 28000, orders: 82, customers: 65, profit: 8400 },
    { date: "Feb 12", revenue: 32000, orders: 89, customers: 72, profit: 9600 },
  ];

  const categoryData = [
    { name: "Living Room", value: 35, sales: 450000, color: "#8884d8" },
    { name: "Bedroom", value: 25, sales: 320000, color: "#82ca9d" },
    { name: "Dining Room", value: 20, sales: 256000, color: "#ffc658" },
    { name: "Office", value: 15, sales: 192000, color: "#ff7300" },
    { name: "Storage", value: 5, sales: 64000, color: "#00ff88" },
  ];

  const hourlyData = [
    { hour: "6 AM", orders: 2, revenue: 800 },
    { hour: "9 AM", orders: 8, revenue: 3200 },
    { hour: "12 PM", orders: 15, revenue: 6000 },
    { hour: "3 PM", orders: 22, revenue: 8800 },
    { hour: "6 PM", orders: 18, revenue: 7200 },
    { hour: "9 PM", orders: 12, revenue: 4800 },
  ];

  const topRegions = [
    { region: "California", sales: "$125,000", orders: 245, growth: 12.5 },
    { region: "New York", sales: "$98,000", orders: 189, growth: 8.3 },
    { region: "Texas", sales: "$87,000", orders: 167, growth: 15.2 },
    { region: "Florida", sales: "$76,000", orders: 145, growth: -2.1 },
    { region: "Illinois", sales: "$65,000", orders: 123, growth: 6.8 },
  ];

  const stats = [
    {
      title: "Total Revenue",
      value: "$124,563",
      change: "+12.5%",
      trend: "up",
      icon: <FiDollarSign />,
      target: "$150,000",
      progress: 83,
    },
    {
      title: "Total Orders",
      value: "1,234",
      change: "+8.2%",
      trend: "up",
      icon: <FiShoppingCart />,
      target: "1,500",
      progress: 82,
    },
    {
      title: "Active Customers",
      value: "2,847",
      change: "+15.3%",
      trend: "up",
      icon: <FiUsers />,
      target: "3,000",
      progress: 95,
    },
    {
      title: "Avg Order Value",
      value: "$324",
      change: "+3.1%",
      trend: "up",
      icon: <FiTarget />,
      target: "$350",
      progress: 93,
    },
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "John Smith",
      product: "Modern Sofa Set",
      amount: "$2,499",
      status: "Processing",
      time: "2 min ago",
    },
    {
      id: "ORD-002",
      customer: "Sarah Johnson",
      product: "Oak Dining Table",
      amount: "$1,299",
      status: "Shipped",
      time: "15 min ago",
    },
    {
      id: "ORD-003",
      customer: "Mike Wilson",
      product: "Leather Recliner",
      amount: "$899",
      status: "Delivered",
      time: "1 hour ago",
    },
    {
      id: "ORD-004",
      customer: "Emily Davis",
      product: "Bookshelf Unit",
      amount: "$599",
      status: "Pending",
      time: "2 hours ago",
    },
    {
      id: "ORD-005",
      customer: "David Brown",
      product: "Coffee Table",
      amount: "$399",
      status: "Processing",
      time: "3 hours ago",
    },
  ];

  const topProducts = [
    { name: "Modern Sofa Set", sales: 45, revenue: 112455, trend: 12.5, rating: 4.8 },
    { name: "Oak Dining Table", sales: 32, revenue: 41568, trend: 8.3, rating: 4.6 },
    { name: "Leather Recliner", sales: 28, revenue: 25172, trend: -2.1, rating: 4.9 },
    { name: "Office Chair", sales: 67, revenue: 20033, trend: 15.2, rating: 4.4 },
    { name: "Bookshelf Unit", sales: 23, revenue: 13777, trend: 6.8, rating: 4.7 },
  ];

  const alerts = [
    { type: "warning", message: "Low stock: Modern Sofa Set (3 remaining)", time: "5 min ago" },
    { type: "info", message: "New customer registration spike (+25%)", time: "1 hour ago" },
    { type: "success", message: "Monthly sales target achieved", time: "2 hours ago" },
    { type: "error", message: "Payment failed for order ORD-456", time: "3 hours ago" },
  ];

  const toggleLiveView = useCallback(() => {
    setIsLiveView(!isLiveView);
  }, [isLiveView]);

  useEffect(() => {
    if (!isLiveView) return;
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      if (Math.random() > 0.7) {
        const newNotification = {
          id: Date.now(),
          type: "order",
          message: `New order received: ORD-${Math.floor(Math.random() * 1000)}`,
          time: new Date().toLocaleTimeString(),
        };
        setNotifications((prev) => [newNotification, ...prev.slice(0, 4)]);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isLiveView]);

  const exportDashboard = (format) => {
    alert(`Exporting as ${format.toUpperCase()}...`);
    setTimeout(() => {
      alert(`Export Complete: ${format.toUpperCase()}`);
    }, 2000);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="header-section">
        <h1 className="title">Dashboard Overview</h1>
        <p className="subtitle">
          Real-time insights and analytics for your furniture business
          {isLiveView && <span className="live-timestamp">• Last updated: {lastUpdate.toLocaleTimeString()}</span>}
        </p>
      </div>

      <div className="action-buttons">
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
        <button onClick={toggleLiveView} className={`live-button ${isLiveView ? "active" : ""}`}>
          <FiActivity /> {isLiveView ? "Live" : "Live View"}
          {isLiveView && <span className="live-indicator"></span>}
        </button>
        <div className="dropdown">
          <button className="export-button">
            <FiDownload /> Export
          </button>
          <div className="dropdown-content">
            <button onClick={() => exportDashboard("pdf")}>Export as PDF</button>
            <button onClick={() => exportDashboard("csv")}>Export as CSV</button>
            <button onClick={() => exportDashboard("excel")}>Export as Excel</button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <span>{stat.title}</span>
              <span>{stat.icon}</span>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-footer">
              <span className={stat.trend === "up" ? "trend-up" : "trend-down"}>
                {stat.trend === "up" ? <FiTrendingUp /> : <FiTrendingDown />}
                {stat.change}
              </span>
              <span>Target: {stat.target}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${stat.progress}%` }}></div>
            </div>
            <small>{stat.progress}% of target</small>
          </div>
        ))}
      </div>

      {/* Live Notifications */}
      {isLiveView && notifications.length > 0 && (
        <div className="live-updates">
          <h3><FiActivity /> Live Updates <span className="badge">{notifications.length}</span></h3>
          <div className="notification-list">
            {notifications.map((n, i) => (
              <div key={i} className="notification-item">
                <span>{n.message}</span>
                <span className="time">{n.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="chart-section">
        {/* Revenue Trends */}
        <div className="chart-card full-width">
          <h3>Revenue & Performance Trends</h3>
          <p>Track your business performance over time</p>
          <div className="tabs">
            <button onClick={() => setActiveMetric("revenue")} className={activeMetric === "revenue" ? "active" : ""}>
              Revenue
            </button>
            <button onClick={() => setActiveMetric("orders")} className={activeMetric === "orders" ? "active" : ""}>
              Orders
            </button>
            <button onClick={() => setActiveMetric("customers")} className={activeMetric === "customers" ? "active" : ""}>
              Customers
            </button>
            <button onClick={() => setActiveMetric("profit")} className={activeMetric === "profit" ? "active" : ""}>
              Profit
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={salesData}>
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
        </div>

        {/* Category Distribution */}
        <div className="chart-card">
          <h3><FiPieChart /> Sales by Category</h3>
          <p>Revenue distribution across product categories</p>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="legend-list">
            {categoryData.map((cat, idx) => (
              <div key={idx} className="legend-item">
                <span style={{ backgroundColor: cat.color }} className="color-box"></span>
                <span>{cat.name}</span>
                <span>${cat.sales.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Sales Pattern */}
        <div className="chart-card">
          <h3><FiClock /> Hourly Sales Pattern</h3>
          <p>Order volume throughout the day</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Other Sections */}
      <div className="grid-layout">
        {/* Recent Orders */}
        <div className="card">
          <h3>Recent Orders</h3>
          <p>Latest customer orders</p>
          <div className="order-list">
            {recentOrders.map((order) => (
              <div key={order.id} className="order-item">
                <strong>{order.id}</strong>
                <span className={`status-tag ${order.status.toLowerCase()}`}>{order.status}</span>
                <p>{order.customer}</p>
                <small>{order.product}</small>
                <div className="meta">
                  <span>{order.amount}</span>
                  <span className="time">{order.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="view-all-btn"><FiEye /> View All Orders</button>
        </div>

        {/* Top Products */}
        <div className="card">
          <h3>Top Performing Products</h3>
          <p>Best sellers this month</p>
          <div className="product-list">
            {topProducts.map((product, idx) => (
              <div key={product.name} className="product-item">
                <div className="rank"># {idx + 1}</div>
                <div className="details">
                  <strong>{product.name}</strong>
                  <small>{product.sales} sold • ★{product.rating}</small>
                </div>
                <div className="product-stats">
                  <span>${product.revenue.toLocaleString()}</span>
                  <span className={product.trend > 0 ? "positive" : "negative"}>
                    {product.trend > 0 ? <FiArrowUpRight /> : <FiArrowDownRight />}
                    {Math.abs(product.trend)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Performance & Alerts */}
        <div>
          <div className="card">
            <h3><FiMapPin /> Top Regions</h3>
            <div className="region-list">
              {topRegions.map((region, idx) => (
                <div key={region.region} className="region-item">
                  <span>#{idx + 1} {region.region}</span>
                  <div>
                    <strong>{region.sales}</strong>
                    <span className={region.growth > 0 ? "positive" : "negative"}>
                      {region.growth > 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                      {Math.abs(region.growth)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3><FiAlertTriangle /> System Alerts</h3>
            <div className="alert-list">
              {alerts.map((alert, idx) => (
                <div key={idx} className={`alert-item ${alert.type}`}>
                  <span className="dot"></span>
                  <div>
                    <p>{alert.message}</p>
                    <small>{alert.time}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}