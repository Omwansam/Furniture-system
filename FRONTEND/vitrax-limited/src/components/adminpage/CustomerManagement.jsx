import React from 'react';
import './AdminDesignSystem.css';

const CustomerManagement = () => {
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
        Customer Management
      </h2>
      <p style={{ 
        color: 'var(--text-secondary)', 
        fontSize: 'var(--text-base)',
        lineHeight: 'var(--leading-relaxed)',
        marginBottom: 'var(--space-6)'
      }}>
        Manage customer relationships, profiles, and communication preferences.
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
            Customer Profiles
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            View and manage detailed customer information and preferences.
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
            Communication Hub
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Send emails, notifications, and manage customer communications.
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
            Loyalty Programs
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Manage customer rewards, points, and loyalty program features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;
