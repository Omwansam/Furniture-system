# Admin Dashboard Components

This document describes the newly created admin dashboard components for the Furniture System.

## Components Overview

### 1. OrdersManagement Component
**File:** `FRONTEND/vitrax-limited/src/components/adminpage/OrdersManagement.jsx`
**CSS:** `FRONTEND/vitrax-limited/src/components/adminpage/OrdersManagement.css`

**Features:**
- View all orders with pagination
- Filter orders by status (Pending, Processing, Shipped, Completed, Cancelled, Returned)
- Search orders by order ID, customer name, or email
- Sort orders by various criteria (date, amount, customer, etc.)
- Update order status (Processing, Completed)
- View detailed order information in modal
- Export orders to CSV
- Real-time statistics dashboard

**Backend Endpoints Used:**
- `GET /orders/admin/all` - Get all orders with filtering and pagination
- `GET /orders/admin/stats` - Get order statistics
- `PUT /orders/admin/{order_id}/status` - Update order status

### 2. CustomerManagement Component
**File:** `FRONTEND/vitrax-limited/src/components/adminpage/CustomerManagement.jsx`
**CSS:** `FRONTEND/vitrax-limited/src/components/adminpage/CustomerManagement.css`

**Features:**
- View all customers with pagination
- Filter customers by status (Active, Inactive)
- Search customers by username or email
- Sort customers by various criteria (join date, order count, spending, etc.)
- View detailed customer information including:
  - Personal details
  - Order history
  - Payment methods
  - Spending statistics
- Top customers leaderboard
- Export customer data to CSV
- Real-time customer statistics

**Backend Endpoints Used:**
- `GET /auth/admin/customers` - Get all customers with filtering and pagination
- `GET /auth/admin/customers/stats` - Get customer statistics
- `GET /auth/admin/customers/{customer_id}` - Get detailed customer information

## Integration

Both components are integrated into the main admin dashboard at:
- Orders: `/admin/dashboard/orders`
- Customers: `/admin/dashboard/customers`

## Backend Requirements

### New Endpoints Added

#### Order Management
```python
# Added to order_route.py
@order_bp.route('/admin/all', methods=['GET'])
@order_bp.route('/admin/stats', methods=['GET'])
@order_bp.route('/admin/<int:order_id>/status', methods=['PUT'])
```

#### Customer Management
```python
# Added to users_route.py
@users_bp.route('/admin/customers', methods=['GET'])
@users_bp.route('/admin/customers/stats', methods=['GET'])
@users_bp.route('/admin/customers/<int:customer_id>', methods=['GET'])
```

### Database Models Required
- `User` - Customer information
- `Order` - Order details
- `OrderItem` - Individual items in orders
- `Payment` - Payment information
- `PaymentMethod` - Customer payment methods

## Features

### Common Features
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Live statistics and data
- **Advanced Filtering**: Multiple filter options
- **Search Functionality**: Quick search across data
- **Export Capability**: CSV export for data analysis
- **Modal Views**: Detailed information display
- **Pagination**: Efficient data loading

### Orders Management Specific
- **Status Management**: Update order statuses
- **Order Tracking**: Monitor order progress
- **Revenue Analytics**: Track sales and revenue
- **Customer Insights**: View customer order patterns

### Customer Management Specific
- **Customer Segmentation**: Active vs. inactive customers
- **Spending Analysis**: Track customer value
- **Order History**: Complete customer order records
- **Payment Methods**: Secure payment information display

## Usage

### Accessing the Components
1. Navigate to `/admin/dashboard`
2. Use the sidebar navigation to access:
   - **Orders** - For order management
   - **Customers** - For customer management

### Key Actions
- **View Details**: Click the eye icon to see detailed information
- **Update Status**: Use action buttons to change order status
- **Export Data**: Click export button to download CSV files
- **Search & Filter**: Use the search bar and filter dropdowns
- **Sort Data**: Click column headers or use sort controls

## Styling

Both components use a consistent design system based on the existing `InventoryManagement` component:
- Clean, modern interface
- Consistent color scheme
- Responsive grid layouts
- Interactive elements with hover effects
- Professional typography and spacing

## Future Enhancements

Potential improvements for future versions:
- **Bulk Actions**: Select multiple orders/customers for batch operations
- **Advanced Analytics**: Charts and graphs for data visualization
- **Email Integration**: Send notifications to customers
- **Automated Workflows**: Set up automated order processing rules
- **Customer Communication**: Built-in messaging system
- **Advanced Reporting**: Custom report generation

## Troubleshooting

### Common Issues
1. **Data Not Loading**: Check backend API endpoints and authentication
2. **Permission Errors**: Ensure user has admin privileges
3. **Export Failures**: Verify data format and browser compatibility
4. **Modal Not Opening**: Check for JavaScript errors in console

### Debug Steps
1. Check browser console for JavaScript errors
2. Verify backend API responses
3. Confirm user authentication status
4. Test individual API endpoints
5. Check database connectivity

## Dependencies

### Frontend
- React 18+
- React Router DOM
- Font Awesome Icons
- CSS3 with Flexbox/Grid

### Backend
- Flask
- SQLAlchemy
- JWT Authentication
- Python 3.8+

## Security Considerations

- All endpoints require admin authentication
- Customer data is filtered to exclude admin users
- Payment information is masked for security
- API endpoints validate user permissions
- CSRF protection enabled
- Input validation and sanitization implemented
