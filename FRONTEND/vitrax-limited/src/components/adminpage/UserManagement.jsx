import React, { useState, useEffect } from 'react';
import { FaSearch, FaUserPlus, FaEdit, FaTrash, FaUserShield, FaUser } from 'react-icons/fa';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const mockUsers = [
    { id: 1, username: "admin", email: "admin@company.com", is_admin: true, status: "active" },
    { id: 2, username: "john_doe", email: "john@example.com", is_admin: false, status: "active" },
    { id: 3, username: "sarah_manager", email: "sarah@company.com", is_admin: true, status: "active" }
  ];

  useEffect(() => {
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading users...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>User Management</h1>
        <button style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px' }}>
          <FaUserPlus /> Add User
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px', width: '300px', border: '1px solid #ddd', borderRadius: '5px' }}
        />
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={{ padding: '15px', textAlign: 'left' }}>Username</th>
            <th style={{ padding: '15px', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '15px', textAlign: 'left' }}>Role</th>
            <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '15px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '15px' }}>{user.username}</td>
              <td style={{ padding: '15px' }}>{user.email}</td>
              <td style={{ padding: '15px' }}>
                {user.is_admin ? (
                  <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>
                    <FaUserShield /> Admin
                  </span>
                ) : (
                  <span style={{ color: '#3498db' }}>
                    <FaUser /> User
                  </span>
                )}
              </td>
              <td style={{ padding: '15px' }}>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  fontSize: '12px', 
                  backgroundColor: user.status === 'active' ? '#d4edda' : '#f8d7da',
                  color: user.status === 'active' ? '#155724' : '#721c24'
                }}>
                  {user.status}
                </span>
              </td>
              <td style={{ padding: '15px' }}>
                <button style={{ marginRight: '5px', padding: '5px', border: 'none', backgroundColor: '#f8f9fa', borderRadius: '3px' }}>
                  <FaEdit />
                </button>
                <button style={{ padding: '5px', border: 'none', backgroundColor: '#f8f9fa', borderRadius: '3px' }}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
