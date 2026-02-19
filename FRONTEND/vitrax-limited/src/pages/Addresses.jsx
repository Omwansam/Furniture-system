import React, { useState } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaMapMarkerAlt,
  FaHome,
  FaBuilding,
  FaStar,
  FaCheck,
  FaTruck
} from 'react-icons/fa';
import AccountLayout from '../components/AccountLayout';
import './Addresses.css';

const Addresses = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'shipping',
      name: 'John Doe',
      phone: '+254 123 456 789',
      address: '123 Main Street',
      city: 'Nairobi',
      state: 'Nairobi County',
      postalCode: '00100',
      country: 'Kenya',
      isDefault: true,
      isBilling: false
    },
    {
      id: 2,
      type: 'billing',
      name: 'John Doe',
      phone: '+254 123 456 789',
      address: '456 Business Avenue',
      city: 'Mombasa',
      state: 'Mombasa County',
      postalCode: '80100',
      country: 'Kenya',
      isDefault: false,
      isBilling: true
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    type: 'shipping',
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Kenya',
    isDefault: false,
    isBilling: false
  });

  const handleAddAddress = () => {
    if (editingAddress) {
      setAddresses(addresses.map(addr => 
        addr.id === editingAddress.id ? { ...formData, id: addr.id } : addr
      ));
      setEditingAddress(null);
    } else {
      const newAddress = {
        ...formData,
        id: Date.now()
      };
      setAddresses([...addresses, newAddress]);
    }
    setShowAddForm(false);
    resetForm();
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setFormData(address);
    setShowAddForm(true);
  };

  const handleDeleteAddress = (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  const handleSetDefault = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const resetForm = () => {
    setFormData({
      type: 'shipping',
      name: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Kenya',
      isDefault: false,
      isBilling: false
    });
  };

  const getAddressIcon = (type) => {
    switch (type) {
      case 'shipping':
        return <FaTruck className="address-icon shipping" />;
      case 'billing':
        return <FaBuilding className="address-icon billing" />;
      default:
        return <FaHome className="address-icon" />;
    }
  };

  return (
    <AccountLayout>
      <div className="addresses-container">
        <div className="addresses-header">
          <h1>My Addresses</h1>
          <p>Manage your shipping and billing addresses</p>
        </div>

        <div className="add-address-section">
          <button 
            className="add-address-btn"
            onClick={() => {
              setShowAddForm(true);
              setEditingAddress(null);
              resetForm();
            }}
          >
            <FaPlus />
            Add New Address
          </button>
        </div>

        {showAddForm && (
          <div className="address-form-overlay">
            <div className="address-form">
              <h3>{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Address Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="shipping">Shipping Address</option>
                    <option value="billing">Billing Address</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Enter street address"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="Enter city"
                  />
                </div>
                <div className="form-group">
                  <label>State/County</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    placeholder="Enter state or county"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                    placeholder="Enter postal code"
                  />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    placeholder="Enter country"
                  />
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                  />
                  Set as default address
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isBilling}
                    onChange={(e) => setFormData({...formData, isBilling: e.target.checked})}
                  />
                  Use as billing address
                </label>
              </div>

              <div className="form-actions">
                <button 
                  className="save-btn"
                  onClick={handleAddAddress}
                >
                  <FaCheck />
                  {editingAddress ? 'Update Address' : 'Save Address'}
                </button>
                <button 
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingAddress(null);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="addresses-list">
          {addresses.map((address) => (
            <div key={address.id} className="address-card">
              <div className="address-header">
                <div className="address-type">
                  {getAddressIcon(address.type)}
                  <span className="type-label">
                    {address.type === 'shipping' ? 'Shipping Address' : 'Billing Address'}
                  </span>
                  {address.isDefault && (
                    <span className="default-badge">
                      <FaStar />
                      Default
                    </span>
                  )}
                </div>
                <div className="address-actions">
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => handleEditAddress(address)}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteAddress(address.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="address-content">
                <h4>{address.name}</h4>
                <p className="address-phone">{address.phone}</p>
                <p className="address-street">{address.address}</p>
                <p className="address-city">
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p className="address-country">{address.country}</p>
              </div>

              <div className="address-footer">
                {!address.isDefault && (
                  <button 
                    className="set-default-btn"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    <FaStar />
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="address-stats">
          <div className="stat-item">
            <h4>Total Addresses</h4>
            <span className="stat-number">{addresses.length}</span>
          </div>
          <div className="stat-item">
            <h4>Shipping Addresses</h4>
            <span className="stat-number">
              {addresses.filter(addr => addr.type === 'shipping').length}
            </span>
          </div>
          <div className="stat-item">
            <h4>Billing Addresses</h4>
            <span className="stat-number">
              {addresses.filter(addr => addr.type === 'billing').length}
            </span>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
};

export default Addresses;
