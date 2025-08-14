import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const mockSuppliers = [
    {
      id: 1,
      name: 'Comfort Furniture Co.',
      contact: 'John Smith',
      email: 'john@comfortfurniture.com',
      phone: '+1 (555) 123-4567',
      address: '123 Industrial Ave, New York, NY',
      products: ['Sofas', 'Chairs', 'Tables'],
      status: 'active'
    },
    {
      id: 2,
      name: 'Wood Masters Ltd.',
      contact: 'Sarah Johnson',
      email: 'sarah@woodmasters.com',
      phone: '+1 (555) 234-5678',
      address: '456 Oak Street, Portland, OR',
      products: ['Dining Tables', 'Cabinets'],
      status: 'active'
    },
    {
      id: 3,
      name: 'Luxury Seating Inc.',
      contact: 'Mike Wilson',
      email: 'mike@luxuryseating.com',
      phone: '+1 (555) 345-6789',
      address: '789 Leather Lane, Chicago, IL',
      products: ['Recliners', 'Office Chairs'],
      status: 'inactive'
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setSuppliers(mockSuppliers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading suppliers...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Supplier Management</h1>
        <button style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px' }}>
          <FaPlus /> Add Supplier
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search suppliers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px', width: '300px', border: '1px solid #ddd', borderRadius: '5px' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        {filteredSuppliers.map(supplier => (
          <div key={supplier.id} style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: '1px solid #eee'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#2c3e50' }}>{supplier.name}</h3>
              <span style={{ 
                padding: '4px 8px', 
                borderRadius: '12px', 
                fontSize: '12px', 
                backgroundColor: supplier.status === 'active' ? '#d4edda' : '#f8d7da',
                color: supplier.status === 'active' ? '#155724' : '#721c24'
              }}>
                {supplier.status}
              </span>
            </div>
            
            <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaPhone style={{ color: '#3498db' }} />
              <span>{supplier.phone}</span>
            </div>
            
            <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaEnvelope style={{ color: '#3498db' }} />
              <span>{supplier.email}</span>
            </div>
            
            <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <FaMapMarkerAlt style={{ color: '#3498db', marginTop: '2px' }} />
              <span>{supplier.address}</span>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#2c3e50' }}>Products:</strong>
              <div style={{ marginTop: '5px' }}>
                {supplier.products.map(product => (
                  <span key={product} style={{ 
                    display: 'inline-block',
                    margin: '2px 5px 2px 0',
                    padding: '2px 8px',
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>
                    {product}
                  </span>
                ))}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ 
                flex: 1,
                padding: '8px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                <FaEdit /> Edit
              </button>
              <button style={{ 
                flex: 1,
                padding: '8px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default SupplierManagement


