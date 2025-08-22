
import React from 'react';
import './AdminDesignSystem.css';

const Reports = () => {
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
        Reports & Analytics
      </h2>
      <p style={{ 
        color: 'var(--text-secondary)', 
        fontSize: 'var(--text-base)',
        lineHeight: 'var(--leading-relaxed)',
        marginBottom: 'var(--space-6)'
      }}>
        Generate comprehensive reports and analyze business performance metrics.
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
            Sales Reports
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Detailed sales analysis, revenue tracking, and performance metrics.
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
            Inventory Reports
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Stock level reports, turnover analysis, and inventory valuation.
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
            Customer Analytics
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Customer behavior analysis, loyalty metrics, and demographic insights.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
