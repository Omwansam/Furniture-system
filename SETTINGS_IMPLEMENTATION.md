# Settings System Implementation

This document describes the complete implementation of the settings system for the Vitrax Limited furniture store admin panel.

## Overview

The settings system provides a comprehensive way to manage application configuration through a user-friendly admin interface. It supports multiple categories of settings with different data types and provides both individual and bulk update capabilities.

## Features

- **Multi-category Settings**: General, Notifications, Security, Payments, Email, Social Media, Analytics
- **Flexible Data Types**: String, Boolean, Integer, Float, JSON
- **Real-time Updates**: Immediate synchronization with backend
- **Bulk Operations**: Update multiple settings at once
- **Admin-only Access**: Secure access control
- **Import/Export**: Backup and restore settings
- **Responsive Design**: Works on all device sizes

## Backend Implementation

### Database Model

The `Settings` model is defined in `models.py`:

```python
class Settings(db.Model):
    __tablename__ = 'settings'
    
    id = db.Column(db.Integer, primary_key=True)
    setting_key = db.Column(db.String(100), unique=True, nullable=False)
    setting_value = db.Column(db.Text)
    setting_type = db.Column(db.String(50), default='string')
    category = db.Column(db.String(50), default='general')
    description = db.Column(db.Text)
    is_editable = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
```

### API Routes

The settings API is implemented in `routes/settings_route.py` with the following endpoints:

- `GET /settings/admin/settings` - Get all settings grouped by category
- `GET /settings/admin/settings/<category>` - Get settings for a specific category
- `GET /settings/admin/settings/<category>/<key>` - Get a specific setting
- `PUT /settings/admin/settings/<category>/<key>` - Update a specific setting
- `POST /settings/admin/settings/<category>` - Create a new setting
- `DELETE /settings/admin/settings/<category>/<key>` - Delete a setting
- `PUT /settings/admin/settings/bulk-update` - Update multiple settings
- `POST /settings/admin/settings/reset/<category>` - Reset category to defaults
- `GET /settings/admin/settings/export` - Export all settings
- `POST /settings/admin/settings/import` - Import settings

### Security

- JWT authentication required for all endpoints
- Admin role verification for all operations
- Input validation and sanitization
- SQL injection protection through SQLAlchemy ORM

## Frontend Implementation

### Component Structure

The `Settings.jsx` component is organized into tabs:

1. **General Settings**: Store information, currency, timezone
2. **Notifications**: Email preferences, alerts, marketing
3. **Security**: Authentication, session management
4. **Payments**: Payment method configuration

### State Management

- Local state for form inputs
- Real-time synchronization with backend
- Loading states and error handling
- Success/error notifications

### API Integration

Uses the `settingsService` from `adminService.js` for all backend communication:

```javascript
import { settingsService } from '../../services/adminService';

// Load settings
const response = await settingsService.getAllSettings();

// Update settings
const response = await settingsService.bulkUpdateSettings(updates);
```

## Setup Instructions

### 1. Database Migration

Run the database migration to create the settings table:

```bash
cd BACKEND/server
python -m flask db upgrade
```

### 2. Seed Default Settings

Populate the database with default settings:

```bash
cd BACKEND/server
python seed_settings.py
```

### 3. Start the Backend

```bash
cd BACKEND
python start_server.py
```

### 4. Start the Frontend

```bash
cd FRONTEND/vitrax-limited
npm start
```

## Default Settings

The system comes pre-configured with sensible defaults:

### General
- Store name: Vitrax Limited
- Currency: KES (Kenyan Shilling)
- Timezone: Africa/Nairobi
- Tax rate: 16%
- Shipping cost: 500 KES

### Notifications
- Email notifications: Enabled
- Order alerts: Enabled
- Low stock alerts: Enabled
- Marketing emails: Disabled

### Security
- Two-factor auth: Disabled
- Session timeout: 30 minutes
- Password expiry: 90 days
- Login attempts: 5

### Payments
- Stripe: Enabled
- PayPal: Enabled
- M-Pesa: Enabled
- Bank transfer: Disabled

## Usage Examples

### Updating a Single Setting

```javascript
// Update store name
await settingsService.updateSetting('general', 'store_name', 'New Store Name');
```

### Bulk Updates

```javascript
const updates = [
  { category: 'general', setting_key: 'store_name', value: 'New Name' },
  { category: 'general', setting_key: 'currency', value: 'USD' }
];

await settingsService.bulkUpdateSettings(updates);
```

### Getting Settings by Category

```javascript
const generalSettings = await settingsService.getSettingsByCategory('general');
```

## Customization

### Adding New Settings

1. Add the setting to the `seed_settings.py` file
2. Update the frontend component to include the new setting
3. Add any necessary validation or business logic

### Adding New Categories

1. Create the category in the seed script
2. Add a new tab to the frontend component
3. Implement the category-specific logic

### Custom Validation

Add validation logic in the backend route handlers:

```python
@settings_bp.route('/admin/settings/<category>/<setting_key>', methods=['PUT'])
@jwt_required()
@admin_required
def update_setting(category, setting_key):
    # Add custom validation here
    if setting_key == 'tax_rate':
        value = request.json.get('value')
        if not 0 <= value <= 100:
            return jsonify({'error': 'Tax rate must be between 0 and 100'}), 400
```

## Error Handling

The system includes comprehensive error handling:

- **Network Errors**: Automatic retry with user feedback
- **Validation Errors**: Clear error messages for invalid input
- **Permission Errors**: Redirect to login for unauthorized access
- **Server Errors**: Graceful degradation with user notification

## Performance Considerations

- Database indexing on frequently queried fields
- Efficient bulk operations for multiple updates
- Client-side caching of settings
- Optimized API responses with minimal data transfer

## Security Best Practices

- Input validation and sanitization
- SQL injection protection
- XSS prevention
- CSRF protection through JWT tokens
- Rate limiting on API endpoints
- Audit logging for sensitive operations

## Troubleshooting

### Common Issues

1. **Settings not loading**: Check database connection and migration status
2. **Permission denied**: Verify user has admin role
3. **Validation errors**: Check input format and constraints
4. **Database errors**: Ensure settings table exists and is properly migrated

### Debug Mode

Enable debug logging in the backend:

```python
app.config['DEBUG'] = True
```

### Database Inspection

Check the settings table directly:

```sql
SELECT * FROM settings WHERE category = 'general';
```

## Future Enhancements

- **Real-time Updates**: WebSocket integration for live settings changes
- **Version Control**: Track settings changes over time
- **Environment-specific Settings**: Different configs for dev/staging/prod
- **Settings Templates**: Pre-configured settings for different business types
- **Advanced Validation**: Complex validation rules and dependencies
- **Settings History**: Audit trail of all changes

## Support

For issues or questions about the settings system:

1. Check the logs for error messages
2. Verify database connectivity
3. Ensure all migrations are applied
4. Check user permissions and authentication
5. Review the API documentation

## Contributing

When contributing to the settings system:

1. Follow the existing code structure
2. Add appropriate tests for new functionality
3. Update documentation for any changes
4. Ensure backward compatibility
5. Follow security best practices
