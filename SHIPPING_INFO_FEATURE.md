# Shipping Information Persistence Feature

## Overview

This feature allows users to save their shipping information during checkout so that it can be automatically retrieved and populated in future orders. Users can save multiple addresses and set one as default for quick checkout.

## Features

### ✅ Backend Implementation

1. **New Database Model**: `UserShippingInformation`
   - Stores user shipping details with relationship to User
   - Supports multiple addresses per user
   - Default address functionality
   - Timestamps for creation and updates

2. **API Endpoints**:
   - `POST /shipping/save` - Save new shipping information
   - `GET /shipping/get` - Get all saved addresses for user
   - `GET /shipping/default` - Get user's default address
   - `PUT /shipping/update/<id>` - Update specific address
   - `DELETE /shipping/delete/<id>` - Delete specific address
   - `PUT /shipping/set-default/<id>` - Set address as default

### ✅ Frontend Implementation

1. **Auto-population**: Form automatically fills with user's default address
2. **Saved Addresses**: Users can view and select from previously saved addresses
3. **Save Option**: Checkbox to save current address for future use
4. **Address Management**: Visual interface for managing multiple addresses

## Database Schema

```sql
CREATE TABLE user_shipping_information (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    company_name VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    street_address VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    additional_info TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## Setup Instructions

### 1. Database Migration

Run the migration script to create the new table:

```bash
cd BACKEND/server
python create_shipping_table.py
```

### 2. Backend Setup

The backend is already configured with:
- New model in `models.py`
- API routes in `routes/shipping_route.py`
- Blueprint registered in `app.py`

### 3. Frontend Setup

The frontend components are updated:
- `BillingForm.jsx` - Enhanced with shipping persistence
- `BillingForm.css` - New styles for address management

## Usage

### For Users

1. **First Time Checkout**:
   - Fill in shipping information
   - Check "Save this address for future orders"
   - Complete checkout

2. **Subsequent Checkouts**:
   - Form auto-populates with default address
   - Click "Show Saved Addresses" to see all saved addresses
   - Select "Use This Address" to load any saved address
   - Modify information as needed
   - Option to save new/modified address

### For Developers

#### Backend API Usage

```javascript
// Save shipping information
const response = await fetch('/shipping/save', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    first_name: 'John',
    last_name: 'Doe',
    country: 'Kenya',
    street_address: '123 Main St',
    city: 'Nairobi',
    province: 'Nairobi',
    zip_code: '00100',
    phone: '254712345678',
    email: 'john@example.com',
    is_default: true
  })
});

// Get saved addresses
const addresses = await fetch('/shipping/get', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

#### Frontend Integration

The `BillingForm` component now includes:
- `fetchSavedShippingInfo()` - Loads user's saved addresses
- `saveShippingInfo()` - Saves current form data
- `loadSavedAddress()` - Populates form with selected address
- Auto-population on component mount

## API Endpoints Reference

### POST /shipping/save
Save new shipping information.

**Request Body:**
```json
{
  "first_name": "string",
  "last_name": "string",
  "company_name": "string (optional)",
  "country": "string",
  "street_address": "string",
  "city": "string",
  "province": "string",
  "zip_code": "string",
  "phone": "string",
  "email": "string",
  "additional_info": "string (optional)",
  "is_default": "boolean"
}
```

**Response:**
```json
{
  "message": "Shipping information saved successfully",
  "shipping_info": { /* saved address object */ }
}
```

### GET /shipping/get
Get all saved addresses for the authenticated user.

**Response:**
```json
{
  "shipping_infos": [
    {
      "id": 1,
      "user_id": 123,
      "first_name": "John",
      "last_name": "Doe",
      "is_default": true,
      "created_at": "2024-01-01T00:00:00",
      "updated_at": "2024-01-01T00:00:00"
      // ... other fields
    }
  ]
}
```

### GET /shipping/default
Get the user's default shipping address.

**Response:**
```json
{
  "shipping_info": { /* default address object */ }
}
```

## Testing

Run the test script to verify functionality:

```bash
python test_shipping_feature.py
```

This will test:
- Database connection
- API endpoint availability
- Authentication requirements

## Security Considerations

1. **Authentication Required**: All endpoints require valid JWT token
2. **User Isolation**: Users can only access their own shipping information
3. **Input Validation**: All required fields are validated
4. **SQL Injection Protection**: Using SQLAlchemy ORM

## Future Enhancements

1. **Address Validation**: Integrate with address validation services
2. **Geolocation**: Auto-detect user location for address suggestions
3. **Address History**: Track address usage patterns
4. **Bulk Operations**: Allow managing multiple addresses at once
5. **Address Sharing**: Allow sharing addresses between family members

## Troubleshooting

### Common Issues

1. **Table Not Found**: Run `create_shipping_table.py`
2. **Authentication Errors**: Ensure user is logged in with valid token
3. **CORS Issues**: Check CORS configuration in Flask app
4. **Database Connection**: Verify database file exists and is accessible

### Debug Mode

Enable debug logging in the backend to see detailed error messages:

```python
app.config['DEBUG'] = True
```

## Files Modified

### Backend
- `models.py` - Added UserShippingInformation model
- `routes/shipping_route.py` - New API routes
- `app.py` - Registered shipping blueprint
- `create_shipping_table.py` - Database migration script

### Frontend
- `components/BillingForm.jsx` - Enhanced with shipping persistence
- `components/BillingForm.css` - New styles for address management

### Testing
- `test_shipping_feature.py` - Comprehensive test script
- `SHIPPING_INFO_FEATURE.md` - This documentation

## Conclusion

The shipping information persistence feature provides a seamless checkout experience by allowing users to save and reuse their shipping information. The implementation is secure, user-friendly, and easily extensible for future enhancements.
