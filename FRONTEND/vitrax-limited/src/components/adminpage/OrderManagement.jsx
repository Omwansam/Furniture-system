import React, {useState} from 'react'
import {
  FaSearch, FaEye, FaBox, FaTruck, FaCheckCircle, FaDownload, FaPlus, FaDollarSign, FaClock, FaExclamationTriangle, FaEllipsisH, FaPrint, FaSync,
} from "react-icons/fa";
import './OrderManagement.css'





const OrderManagement = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [orders, setOrders] = useState([

    {
      id: "ORD-001",
      customer: {
        name: "John Smith",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        address: "123 Main St, New York, NY 10001",
      },
      items: [
        { id: "1", name: "Modern Sofa Set", quantity: 1, price: 2499, total: 2499 },
        { id: "2", name: "Coffee Table", quantity: 1, price: 399, total: 399 },
        { id: "3", name: "Area Rug", quantity: 1, price: 299, total: 299 },
      ],
      subtotal: 3197,
      tax: 255.76,
      shipping: 50,
      total: 3502.76,
      status: "Processing",
      priority: "High",
      date: "2024-01-15",
      estimatedDelivery: "2024-01-25",
      trackingNumber: "TRK123456789",
      notes: "Customer requested white delivery truck. Fragile items included.",
      paymentMethod: "Credit Card",
      paymentStatus: "Paid",
    },
    {
      id: "ORD-002",
      customer: {
        name: "Sarah Johnson",
        email: "sarah@example.com",
        phone: "+1 (555) 234-5678",
        address: "456 Oak Ave, Los Angeles, CA 90210",
      },
      items: [
        { id: "1", name: "Oak Dining Table", quantity: 1, price: 1299, total: 1299 },
        { id: "2", name: "Dining Chairs", quantity: 4, price: 150, total: 600 },
        { id: "3", name: "Table Runner", quantity: 2, price: 25, total: 50 },
      ],
      subtotal: 1949,
      tax: 155.92,
      shipping: 75,
      total: 2179.92,
      status: "Shipped",
      priority: "Medium",
      date: "2024-01-14",
      estimatedDelivery: "2024-01-22",
      trackingNumber: "TRK987654321",
      notes: "Customer prefers evening delivery. Signature required.",
      paymentMethod: "PayPal",
      paymentStatus: "Paid",
    },
    {
      id: "ORD-003",
      customer: {
        name: "Mike Wilson",
        email: "mike@example.com",
        phone: "+1 (555) 345-6789",
        address: "789 Pine St, Chicago, IL 60601",
      },
      items: [
        { id: "1", name: "Leather Recliner", quantity: 1, price: 899, total: 899 },
        { id: "2", name: "Side Table", quantity: 1, price: 149, total: 149 },
      ],
      subtotal: 1048,
      tax: 83.84,
      shipping: 25,
      total: 1156.84,
      status: "Delivered",
      priority: "Low",
      date: "2024-01-13",
      estimatedDelivery: "2024-01-20",
      trackingNumber: "TRK456789123",
      notes: "Delivered to front door. Customer satisfied.",
      paymentMethod: "Bank Transfer",
      paymentStatus: "Paid",
    },
    {
      id: "ORD-004",
      customer: {
        name: "Emily Davis",
        email: "emily@example.com",
        phone: "+1 (555) 456-7890",
        address: "321 Elm St, Houston, TX 77001",
      },
      items: [
        { id: "1", name: "Bookshelf Unit", quantity: 1, price: 599, total: 599 },
        { id: "2", name: "Office Chair", quantity: 1, price: 299, total: 299 },
        { id: "3", name: "Desk Lamp", quantity: 1, price: 49, total: 49 },
      ],
      subtotal: 947,
      tax: 75.76,
      shipping: 30,
      total: 1052.76,
      status: "Pending",
      priority: "Medium",
      date: "2024-01-12",
      estimatedDelivery: "2024-01-24",
      notes: "Customer will call to schedule delivery. Assembly required.",
      paymentMethod: "Credit Card",
      paymentStatus: "Pending",
    },
    {
      id: "ORD-005",
      customer: {
        name: "David Brown",
        email: "david@example.com",
        phone: "+1 (555) 567-8901",
        address: "654 Maple Dr, Phoenix, AZ 85001",
      },
      items: [
        { id: "1", name: "Bed Frame", quantity: 1, price: 799, total: 799 },
        { id: "2", name: "Nightstand", quantity: 2, price: 250, total: 500 },
        { id: "3", name: "Dresser", quantity: 1, price: 599, total: 599 },
      ],
      subtotal: 1898,
      tax: 151.84,
      shipping: 40,
      total: 2089.84,
      status: "Cancelled",
      priority: "Low",
      date: "2024-01-11",
      estimatedDelivery: "2024-01-23",
      notes: "Customer cancelled due to change of address. Full refund processed.",
      paymentMethod: "Credit Card",
      paymentStatus: "Refunded",
    },
    {
      id: "ORD-006",
      customer: {
        name: "Jessica Taylor",
        email: "jessica@example.com",
        phone: "+1 (555) 678-9012",
        address: "987 Cedar Ln, Seattle, WA 98101",
      },
      items: [
        { id: "1", name: "Sectional Sofa", quantity: 1, price: 1899, total: 1899 },
        { id: "2", name: "Ottoman", quantity: 1, price: 199, total: 199 },
      ],
      subtotal: 2098,
      tax: 167.84,
      shipping: 60,
      total: 2325.84,
      status: "Processing",
      priority: "High",
      date: "2024-01-10",
      estimatedDelivery: "2024-01-21",
      trackingNumber: "TRK789123456",
      notes: "White glove delivery requested. Customer available after 3 PM.",
      paymentMethod: "Credit Card",
      paymentStatus: "Paid",
    },
    {
      id: "ORD-007",
      customer: {
        name: "Robert Wilson",
        email: "robert@example.com",
        phone: "+1 (555) 789-0123",
        address: "159 Birch Blvd, Denver, CO 80202",
      },
      items: [
        { id: "1", name: "Patio Set", quantity: 1, price: 899, total: 899 },
        { id: "2", name: "Outdoor Cushions", quantity: 4, price: 39, total: 156 },
      ],
      subtotal: 1055,
      tax: 84.40,
      shipping: 45,
      total: 1184.40,
      status: "Shipped",
      priority: "Medium",
      date: "2024-01-09",
      estimatedDelivery: "2024-01-18",
      trackingNumber: "TRK321654987",
      notes: "Weatherproof packaging required. Customer will assemble.",
      paymentMethod: "PayPal",
      paymentStatus: "Paid",
    },
    {
      id: "ORD-008",
      customer: {
        name: "Amanda Clark",
        email: "amanda@example.com",
        phone: "+1 (555) 890-1234",
        address: "753 Walnut St, Boston, MA 02108",
      },
      items: [
        { id: "1", name: "TV Stand", quantity: 1, price: 349, total: 349 },
        { id: "2", name: "Media Console", quantity: 1, price: 499, total: 499 },
      ],
      subtotal: 848,
      tax: 67.84,
      shipping: 35,
      total: 950.84,
      status: "Delivered",
      priority: "Low",
      date: "2024-01-08",
      estimatedDelivery: "2024-01-15",
      trackingNumber: "TRK654987321",
      notes: "Left with neighbor per customer instructions.",
      paymentMethod: "Credit Card",
      paymentStatus: "Paid",
    },
    {
      id: "ORD-009",
      customer: {
        name: "Daniel Martinez",
        email: "daniel@example.com",
        phone: "+1 (555) 901-2345",
        address: "357 Spruce Ave, Miami, FL 33101",
      },
      items: [
        { id: "1", name: "Bar Stools", quantity: 4, price: 129, total: 516 },
        { id: "2", name: "Counter Height Table", quantity: 1, price: 399, total: 399 },
      ],
      subtotal: 915,
      tax: 73.20,
      shipping: 50,
      total: 1038.20,
      status: "Pending",
      priority: "Medium",
      date: "2024-01-07",
      estimatedDelivery: "2024-01-19",
      notes: "Customer requested assembly service. Waiting for confirmation.",
      paymentMethod: "Credit Card",
      paymentStatus: "Pending",
    },
    {
      id: "ORD-010",
      customer: {
        name: "Jennifer Lee",
        email: "jennifer@example.com",
        phone: "+1 (555) 012-3456",
        address: "852 Redwood Dr, San Francisco, CA 94102",
      },
      items: [
        { id: "1", name: "Accent Chair", quantity: 2, price: 249, total: 498 },
        { id: "2", name: "Side Table", quantity: 2, price: 149, total: 298 },
      ],
      subtotal: 796,
      tax: 63.68,
      shipping: 40,
      total: 899.68,
      status: "Processing",
      priority: "High",
      date: "2024-01-06",
      estimatedDelivery: "2024-01-16",
      trackingNumber: "TRK987321654",
      notes: "Customer prefers eco-friendly packaging. Rush delivery requested.",
      paymentMethod: "PayPal",
      paymentStatus: "Paid",
    },
  ])

  const statusOptions = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"]
  const priorityOptions = ["All", "Low", "Medium", "High", "Urgent"];

  {/**Filter Orders */}
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ==="all" || order.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority = priorityFilter === "all" || order.priority.toLowerCase() === priorityFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesPriority;  
  });


  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  //Statistics
  const totalOrders =orders.length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const processingOrders = orders.filter((o) => o.status === "Processing").length;
  const shippedToday = orders.filter((o) => o.status === "Shipped" && o.date === "2024-01-15").length;
  // const deliveredToday = orders.filter((o) => o.status === "Delivered" && o.date === "2024-01-15").length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  // const avgOrderValue = totalRevenue / totalOrders;

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map((order) => (order.id === orderId ? {...order, status: newStatus} : order)));
    alert(`Order ${orderId} status updated to ${newStatus}`);
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <FaClock className="icon-sm" />;
      case "Processing":
        return <FaBox className="icon-sm" />;
      case "Shipped":
        return <FaTruck className="icon-sm" />;
      case "Delivered":
        return <FaCheckCircle className="icon-sm" />;
      case "Cancelled":
        return <FaExclamationTriangle className="icon-sm" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "badge-secondary";
      case "Processing":
        return "badge-outline";
      case "Shipped":
        return "badge-primary";
      case "Delivered":
        return "badge-primary";
      case "Cancelled":
        return "badge-danger";
      default:
        return "badge-secondary";
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "Low":
        return "badge-secondary";
      case "Medium":
        return "badge-outline";
      case "High":
        return "badge-primary";
      case "Urgent":
        return "badge-danger";
      default:
        return "badge-secondary";
    }
  };

  const handleBulkStatusUpdate = (newStatus) => {
    setOrders(orders.map((order) => (selectedOrders.includes(order.id) ? { ...order, status: newStatus } : order)));
    setSelectedOrders([]);
    alert(`${selectedOrders.length} orders updated to ${newStatus}`);
  };

  

  return (
    <div className="order-management-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Order Management</h1>
          <p className="page-description">Track and manage customer orders</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline">
            <FaDownload className="icon" />
            Export
          </button>
          <button className="btn btn-primary">
            <FaPlus className="icon" />
            New Order
          </button>
        </div>
      </div>

      {/* Order Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <h3 className="stat-title">
              <FaDollarSign className="icon" />
              Total Revenue
            </h3>
          </div>
          <div className="stat-content">
            <div className="stat-value">${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="stat-meta">All time</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <h3 className="stat-title">Total Orders</h3>
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalOrders}</div>
            <p className="stat-meta">+12% from last month</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3 className="stat-title">
              <FaClock className="icon text-orange" />
              Pending Orders
            </h3>
          </div>
          <div className="stat-content">
            <div className="stat-value text-orange">{pendingOrders}</div>
            <p className="stat-meta">Requires attention</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3 className="stat-title">
              <FaBox className="icon text-blue" />
              Processing
            </h3>
          </div>
          <div className="stat-content">
            <div className="stat-value text-blue">{processingOrders}</div>
            <p className="stat-meta">Being prepared</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3 className="stat-title">
              <FaTruck className="icon text-green" />
              Shipped Today
            </h3>
          </div>
          <div className="stat-content">
            <div className="stat-value text-green">{shippedToday}</div>
            <p className="stat-meta">Out for delivery</p>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="order-table-card">
        <div className="card-header">
          <h2 className="card-title">Order Management</h2>
          <p className="card-description">Manage and track customer orders</p>
        </div>
        <div className="card-content">
          <div className="filters-container">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search orders, customers, or emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status.toLowerCase()}>
                  {status} Status
                </option>
              ))}
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="filter-select"
            >
              {priorityOptions.map((priority) => (
                <option key={priority} value={priority.toLowerCase()}>
                  {priority} Priority
                </option>
              ))}
            </select>
          </div>

          {selectedOrders.length > 0 && (
            <div className="bulk-actions">
              <span className="selected-count">{selectedOrders.length} orders selected</span>
              <button className="btn btn-outline" onClick={() => handleBulkStatusUpdate("Processing")}>
                Mark Processing
              </button>
              <button className="btn btn-outline" onClick={() => handleBulkStatusUpdate("Shipped")}>
                Mark Shipped
              </button>
              <button className="btn btn-outline" onClick={() => handleBulkStatusUpdate("Delivered")}>
                Mark Delivered
              </button>
              <button className="btn btn-ghost" onClick={() => setSelectedOrders([])}>
                Clear
              </button>
            </div>
          )}

          <div className="table-responsive">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === paginatedOrders.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedOrders(paginatedOrders.map((o) => o.id));
                        } else {
                          setSelectedOrders([]);
                        }
                      }}
                    />
                  </th>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrders([...selectedOrders, order.id]);
                          } else {
                            setSelectedOrders(selectedOrders.filter((id) => id !== order.id));
                          }
                        }}
                      />
                    </td>
                    <td className="order-id">{order.id}</td>
                    <td>
                      <div className="customer-info">
                        <p className="customer-name">{order.customer.name}</p>
                        <p className="customer-email">{order.customer.email}</p>
                      </div>
                    </td>
                    <td>
                      <div className="order-items">
                        {order.items.slice(0, 2).map((item, index) => (
                          <p key={index} className="item">
                            {item.quantity}x {item.name}
                          </p>
                        ))}
                        {order.items.length > 2 && (
                          <p className="more-items">+{order.items.length - 2} more items</p>
                        )}
                      </div>
                    </td>
                    <td className="order-total">${order.total.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${getStatusClass(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getPriorityClass(order.priority)}`}>
                        {order.priority}
                      </span>
                    </td>
                    <td>{order.date}</td>
                    <td>
                      <div className="dropdown">
                        <button className="btn btn-ghost">
                          <FaEllipsisH className="icon" />
                        </button>
                        <div className="dropdown-content">
                          <div className="dropdown-header">Actions</div>
                          <div className="dropdown-divider"></div>
                          <button className="dropdown-item">
                            <FaEye className="icon" />
                            View Details
                          </button>
                          <div className="dropdown-divider"></div>
                          <button
                            className="dropdown-item"
                            onClick={() => updateOrderStatus(order.id, "Processing")}
                          >
                            <FaBox className="icon" />
                            Mark Processing
                          </button>
                          <button
                            className="dropdown-item"
                            onClick={() => updateOrderStatus(order.id, "Shipped")}
                          >
                            <FaTruck className="icon" />
                            Mark Shipped
                          </button>
                          <button
                            className="dropdown-item"
                            onClick={() => updateOrderStatus(order.id, "Delivered")}
                          >
                            <FaCheckCircle className="icon" />
                            Mark Delivered
                          </button>
                          <div className="dropdown-divider"></div>
                          <button className="dropdown-item">
                            <FaPrint className="icon" />
                            Print Invoice
                          </button>
                          <button className="dropdown-item">
                            <FaSync className="icon" />
                            Refund Order
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <div className="pagination-info">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
            </div>
            <div className="pagination-controls">
              <button
                className="btn btn-outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`btn ${currentPage === page ? "btn-primary" : "btn-outline"}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="btn btn-outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderManagement
