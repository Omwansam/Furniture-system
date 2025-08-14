import React, { useState } from 'react';
import { FaCog, FaSave, FaBell, FaLock, FaGlobe, FaDatabase } from 'react-icons/fa';

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Vitrax Furniture Store',
    currency: 'USD',
    timezone: 'UTC',
    emailNotifications: true,
    smsNotifications: false,
    lowStockThreshold: 5,
    autoBackup: true,
    maintenanceMode: false
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  const settingSections = [
    {
      title: 'General Settings',
      icon: <FaCog />,
      settings: [
        { key: 'siteName', label: 'Site Name', type: 'text' },
        { key: 'currency', label: 'Currency', type: 'select', options: ['USD', 'EUR', 'GBP'] },
        { key: 'timezone', label: 'Timezone', type: 'select', options: ['UTC', 'EST', 'PST'] }
      ]
    },
    {
      title: 'Notifications',
      icon: <FaBell />,
      settings: [
        { key: 'emailNotifications', label: 'Email Notifications', type: 'checkbox' },
        { key: 'smsNotifications', label: 'SMS Notifications', type: 'checkbox' }
      ]
    },
    {
      title: 'Inventory',
      icon: <FaDatabase />,
      settings: [
        { key: 'lowStockThreshold', label: 'Low Stock Threshold', type: 'number' }
      ]
    },
    {
      title: 'System',
      icon: <FaLock />,
      settings: [
        { key: 'autoBackup', label: 'Auto Backup', type: 'checkbox' },
        { key: 'maintenanceMode', label: 'Maintenance Mode', type: 'checkbox' }
      ]
    }
  ];

  const renderSetting = (setting) => {
    switch (setting.type) {
      case 'text':
        return (
          <input
            type="text"
            value={settings[setting.key]}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', width: '300px' }}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={settings[setting.key]}
            onChange={(e) => handleSettingChange(setting.key, parseInt(e.target.value))}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', width: '100px' }}
          />
        );
      case 'select':
        return (
          <select
            value={settings[setting.key]}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', width: '200px' }}
          >
            {setting.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={settings[setting.key]}
            onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
            style={{ transform: 'scale(1.2)' }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>System Settings</h1>
        <button 
          onClick={handleSave}
          style={{ 
            padding: '12px 24px', 
            backgroundColor: '#27ae60', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <FaSave /> Save Changes
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {settingSections.map(section => (
          <div 
            key={section.title}
            style={{ 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '8px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
            }}
          >
            <h3 style={{ 
              margin: '0 0 20px 0', 
              color: '#2c3e50',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {section.icon} {section.title}
            </h3>
            
            {section.settings.map(setting => (
              <div key={setting.key} style={{ marginBottom: '15px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '5px', 
                  fontWeight: '500',
                  color: '#2c3e50'
                }}>
                  {setting.label}
                </label>
                {renderSetting(setting)}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: '30px', 
        backgroundColor: '#fff3cd', 
        padding: '15px', 
        borderRadius: '8px',
        border: '1px solid #ffeaa7'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>⚠️ Important Notes</h4>
        <ul style={{ margin: 0, color: '#856404' }}>
          <li>Changes to currency and timezone will affect all future transactions</li>
          <li>Maintenance mode will make the site unavailable to customers</li>
          <li>Auto backup runs daily at 2 AM server time</li>
        </ul>
      </div>
    </div>
  );
};


export default Settings

