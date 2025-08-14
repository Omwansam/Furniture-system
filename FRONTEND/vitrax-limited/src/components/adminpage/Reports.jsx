import React, { useState } from 'react';
import { FaFileAlt, FaDownload, FaCalendarAlt, FaChartBar } from 'react-icons/fa';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('sales');
  const [dateRange, setDateRange] = useState('30d');

  const reportTypes = [
    { id: 'sales', name: 'Sales Report', icon: <FaChartBar />, description: 'Revenue and sales analytics' },
    { id: 'inventory', name: 'Inventory Report', icon: <FaFileAlt />, description: 'Stock levels and movements' },
    { id: 'customers', name: 'Customer Report', icon: <FaFileAlt />, description: 'Customer analytics and demographics' },
    { id: 'orders', name: 'Order Report', icon: <FaFileAlt />, description: 'Order status and fulfillment' }
  ];

  const handleGenerateReport = () => {
    alert(`Generating ${reportTypes.find(r => r.id === selectedReport)?.name} for ${dateRange}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '30px' }}>Reports & Analytics</h1>
      
      <div style={{ marginBottom: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {reportTypes.map(report => (
          <div 
            key={report.id}
            style={{
              padding: '20px',
              backgroundColor: selectedReport === report.id ? '#e3f2fd' : 'white',
              border: selectedReport === report.id ? '2px solid #3498db' : '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onClick={() => setSelectedReport(report.id)}
          >
            <div style={{ fontSize: '24px', color: '#3498db', marginBottom: '10px' }}>
              {report.icon}
            </div>
            <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>{report.name}</h3>
            <p style={{ margin: 0, color: '#7f8c8d', fontSize: '14px' }}>{report.description}</p>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '20px' }}>Generate Report</h3>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            <FaCalendarAlt /> Date Range
          </label>
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', width: '200px' }}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
            <option value="custom">Custom range</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={handleGenerateReport}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: '#3498db', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <FaFileAlt /> Generate Report
          </button>
          <button 
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
            <FaDownload /> Export to PDF
          </button>
        </div>
      </div>

      <div style={{ marginTop: '30px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3>Recent Reports</h3>
        <div style={{ marginTop: '15px' }}>
          <div style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Sales Report - January 2024</span>
            <button style={{ padding: '5px 10px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '3px' }}>
              <FaDownload /> Download
            </button>
          </div>
          <div style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Inventory Report - December 2023</span>
            <button style={{ padding: '5px 10px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '3px' }}>
              <FaDownload /> Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Reports

