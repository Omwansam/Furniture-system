import React from 'react';
import './AdminDesignSystem.css';

const Settings = () => {
  return (
    <div style={{ 
      padding: 'var(--space-5)', 
      background: 'var(--surface-0)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-md)',
      border: '1px solid var(--border-light)',
      margin: 'var(--space-4)'
    }}>
      <h2 style={{ 
        color: 'var(--text-primary)', 
        fontSize: 'var(--text-2xl)', 
        fontWeight: 'var(--font-bold)',
        marginBottom: 'var(--space-4)'
      }}>
        System Settings
      </h2>
      <p style={{ 
        color: 'var(--text-secondary)', 
        fontSize: 'var(--text-base)',
        lineHeight: 'var(--leading-relaxed)',
        marginBottom: 'var(--space-6)'
      }}>
        Configure system preferences, integrations, and administrative settings.
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: 'var(--space-6)' 
      }}>
        <div style={{ 
          padding: 'var(--space-6)', 
          background: 'var(--bg-50)', 
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)'
        }}>
          <h3 style={{ 
            color: 'var(--text-primary)', 
            fontSize: 'var(--text-lg)', 
            fontWeight: 'var(--font-semibold)',
            marginBottom: 'var(--space-3)'
          }}>
            General Settings
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Configure basic system settings, company information, and preferences.
          </p>
        </div>
        
        <div style={{ 
          padding: 'var(--space-6)', 
          background: 'var(--bg-50)', 
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)'
        }}>
          <h3 style={{ 
            color: 'var(--text-primary)', 
            fontSize: 'var(--text-lg)', 
            fontWeight: 'var(--font-semibold)',
            marginBottom: 'var(--space-3)'
          }}>
            Integrations
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Manage third-party integrations, APIs, and external service connections.
          </p>
        </div>
        
        <div style={{ 
          padding: 'var(--space-6)', 
          background: 'var(--bg-50)', 
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)'
        }}>
          <h3 style={{ 
            color: 'var(--text-primary)', 
            fontSize: 'var(--text-lg)', 
            fontWeight: 'var(--font-semibold)',
            marginBottom: 'var(--space-3)'
          }}>
            Security & Backup
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Configure security settings, backup schedules, and data protection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;

