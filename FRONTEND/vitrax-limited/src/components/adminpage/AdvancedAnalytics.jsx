import React from 'react';
import './AdminDesignSystem.css';

const AdvancedAnalytics = () => {
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
        Advanced Analytics
      </h2>
      <p style={{ 
        color: 'var(--text-secondary)', 
        fontSize: 'var(--text-base)',
        lineHeight: 'var(--leading-relaxed)',
        marginBottom: 'var(--space-6)'
      }}>
        Deep insights and predictive analytics for your furniture business performance.
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
            Customer Behavior Analysis
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Track customer journey patterns and purchase behaviors.
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
            Predictive Sales Forecasting
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            AI-powered sales predictions and trend analysis.
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
            Inventory Optimization
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Smart inventory management and demand forecasting.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
