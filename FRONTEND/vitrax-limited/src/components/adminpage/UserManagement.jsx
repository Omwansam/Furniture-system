

import React from 'react';
import './AdminDesignSystem.css';

const UserManagement = () => {
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
        User Management
      </h2>
      <p style={{ 
        color: 'var(--text-secondary)', 
        fontSize: 'var(--text-base)',
        lineHeight: 'var(--leading-relaxed)',
        marginBottom: 'var(--space-6)'
      }}>
        Manage system users, roles, permissions, and access controls.
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
            User Accounts
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Create, edit, and manage user accounts and profiles.
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
            Role Management
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Define and assign user roles with specific permissions.
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
            Access Control
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Manage system access and security permissions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
