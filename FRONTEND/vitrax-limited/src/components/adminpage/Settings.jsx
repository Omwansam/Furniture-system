import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    storeName: 'Vitrax Limited',
    storeEmail: 'admin@vitrax.com',
    storePhone: '+254 700 000 000',
    storeAddress: 'Nairobi, Kenya',
    currency: 'USD',
    timezone: 'Africa/Nairobi'
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
    newCustomerAlerts: true,
    marketingEmails: false
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    stripeEnabled: true,
    paypalEnabled: true,
    mpesaEnabled: true,
    bankTransferEnabled: false
  });

  const handleGeneralSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('General settings updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to update general settings');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Notification settings updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to update notification settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Security settings updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to update security settings');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Payment settings updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to update payment settings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (setting, key) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePaymentToggle = (key) => {
    setPaymentSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="settings-container">
      {/* Header */}
      <div className="settings-header">
        <div className="header-content">
          <h1>Settings</h1>
          <p>Manage your store configuration and preferences</p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="success-banner">
          <p>{success}</p>
          <button onClick={() => setSuccess(null)} className="close-success">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)} className="close-error">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Settings Navigation */}
      <div className="settings-navigation">
        <button
          className={`nav-tab ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          <i className="fas fa-cog"></i>
          General
        </button>
        <button
          className={`nav-tab ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <i className="fas fa-bell"></i>
          Notifications
        </button>
        <button
          className={`nav-tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <i className="fas fa-shield-alt"></i>
          Security
        </button>
        <button
          className={`nav-tab ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          <i className="fas fa-credit-card"></i>
          Payments
        </button>
      </div>

      {/* Settings Content */}
      <div className="settings-content">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="settings-section">
            <div className="section-header">
              <h2>General Settings</h2>
              <p>Configure your store's basic information and preferences</p>
            </div>
            
            <form onSubmit={handleGeneralSave} className="settings-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="storeName">Store Name</label>
                  <input
                    type="text"
                    id="storeName"
                    value={generalSettings.storeName}
                    onChange={(e) => setGeneralSettings({...generalSettings, storeName: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="storeEmail">Store Email</label>
                  <input
                    type="email"
                    id="storeEmail"
                    value={generalSettings.storeEmail}
                    onChange={(e) => setGeneralSettings({...generalSettings, storeEmail: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="storePhone">Store Phone</label>
                  <input
                    type="tel"
                    id="storePhone"
                    value={generalSettings.storePhone}
                    onChange={(e) => setGeneralSettings({...generalSettings, storePhone: e.target.value})}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="storeAddress">Store Address</label>
                  <textarea
                    id="storeAddress"
                    value={generalSettings.storeAddress}
                    onChange={(e) => setGeneralSettings({...generalSettings, storeAddress: e.target.value})}
                    className="form-input"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="currency">Currency</label>
                  <select
                    id="currency"
                    value={generalSettings.currency}
                    onChange={(e) => setGeneralSettings({...generalSettings, currency: e.target.value})}
                    className="form-input"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="KES">KES - Kenyan Shilling</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="timezone">Timezone</label>
                  <select
                    id="timezone"
                    value={generalSettings.timezone}
                    onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                    className="form-input"
                  >
                    <option value="Africa/Nairobi">Africa/Nairobi</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="Europe/London">Europe/London</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="settings-section">
            <div className="section-header">
              <h2>Notification Settings</h2>
              <p>Configure how and when you receive notifications</p>
            </div>
            
            <form onSubmit={handleNotificationSave} className="settings-form">
              <div className="notification-settings">
                <div className="notification-item">
                  <div className="notification-info">
                    <h3>Email Notifications</h3>
                    <p>Receive notifications via email</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={() => handleToggle(notificationSettings, 'emailNotifications')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h3>Order Notifications</h3>
                    <p>Get notified when new orders are placed</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.orderNotifications}
                      onChange={() => handleToggle(notificationSettings, 'orderNotifications')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h3>Low Stock Alerts</h3>
                    <p>Receive alerts when products are running low</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.lowStockAlerts}
                      onChange={() => handleToggle(notificationSettings, 'lowStockAlerts')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h3>New Customer Alerts</h3>
                    <p>Get notified when new customers register</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.newCustomerAlerts}
                      onChange={() => handleToggle(notificationSettings, 'newCustomerAlerts')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h3>Marketing Emails</h3>
                    <p>Receive promotional and marketing emails</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.marketingEmails}
                      onChange={() => handleToggle(notificationSettings, 'marketingEmails')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="settings-section">
            <div className="section-header">
              <h2>Security Settings</h2>
              <p>Configure security preferences and authentication</p>
            </div>
            
            <form onSubmit={handleSecuritySave} className="settings-form">
              <div className="form-grid">
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={securitySettings.twoFactorAuth}
                      onChange={(e) => setSecuritySettings({...securitySettings, twoFactorAuth: e.target.checked})}
                      className="checkbox-input"
                    />
                    Enable Two-Factor Authentication
                  </label>
                  <p className="form-help">Add an extra layer of security to your account</p>
                </div>

                <div className="form-group">
                  <label htmlFor="sessionTimeout">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    id="sessionTimeout"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                    className="form-input"
                    min="5"
                    max="120"
                  />
                  <p className="form-help">Automatically log out after inactivity</p>
                </div>

                <div className="form-group">
                  <label htmlFor="passwordExpiry">Password Expiry (days)</label>
                  <input
                    type="number"
                    id="passwordExpiry"
                    value={securitySettings.passwordExpiry}
                    onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiry: parseInt(e.target.value)})}
                    className="form-input"
                    min="30"
                    max="365"
                  />
                  <p className="form-help">Force password change after specified days</p>
                </div>

                <div className="form-group">
                  <label htmlFor="loginAttempts">Max Login Attempts</label>
                  <input
                    type="number"
                    id="loginAttempts"
                    value={securitySettings.loginAttempts}
                    onChange={(e) => setSecuritySettings({...securitySettings, loginAttempts: parseInt(e.target.value)})}
                    className="form-input"
                    min="3"
                    max="10"
                  />
                  <p className="form-help">Lock account after failed attempts</p>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Payment Settings */}
        {activeTab === 'payments' && (
          <div className="settings-section">
            <div className="section-header">
              <h2>Payment Settings</h2>
              <p>Configure payment methods and processing options</p>
            </div>
            
            <form onSubmit={handlePaymentSave} className="settings-form">
              <div className="payment-settings">
                <div className="payment-item">
                  <div className="payment-info">
                    <div className="payment-icon stripe">
                      <i className="fab fa-stripe"></i>
                    </div>
                    <div className="payment-details">
                      <h3>Stripe</h3>
                      <p>Credit card processing via Stripe</p>
                    </div>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={paymentSettings.stripeEnabled}
                      onChange={() => handlePaymentToggle('stripeEnabled')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="payment-item">
                  <div className="payment-info">
                    <div className="payment-icon paypal">
                      <i className="fab fa-paypal"></i>
                    </div>
                    <div className="payment-details">
                      <h3>PayPal</h3>
                      <p>PayPal digital payments</p>
                    </div>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={paymentSettings.paypalEnabled}
                      onChange={() => handlePaymentToggle('paypalEnabled')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="payment-item">
                  <div className="payment-info">
                    <div className="payment-icon mpesa">
                      <i className="fas fa-mobile-alt"></i>
                    </div>
                    <div className="payment-details">
                      <h3>M-Pesa</h3>
                      <p>Mobile money payments</p>
                    </div>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={paymentSettings.mpesaEnabled}
                      onChange={() => handlePaymentToggle('mpesaEnabled')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="payment-item">
                  <div className="payment-info">
                    <div className="payment-icon bank">
                      <i className="fas fa-university"></i>
                    </div>
                    <div className="payment-details">
                      <h3>Bank Transfer</h3>
                      <p>Direct bank transfer payments</p>
                    </div>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={paymentSettings.bankTransferEnabled}
                      onChange={() => handlePaymentToggle('bankTransferEnabled')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;

