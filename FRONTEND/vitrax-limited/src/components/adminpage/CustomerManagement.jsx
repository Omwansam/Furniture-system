import React, { useState } from 'react';

const CustomerManagement = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    try {
      const res = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, is_admin: false })
      });
      const data = await res.json();
      setResult({ ok: res.ok, data });
    } catch (e) {
      setResult({ ok: false, data: { error: e.message } });
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 8 }}>Customer Management</h1>
      <p style={{ marginTop: 0, color: '#666' }}>Register customers (basic)</p>

      <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, maxWidth: 480 }}>
        <h3 style={{ marginTop: 0 }}>Register Customer</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
          <input placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button type="submit">Register</button>
        </form>
        {result && (
          <pre style={{ background: '#fafafa', padding: 12, marginTop: 12, border: '1px solid #eee' }}>{JSON.stringify(result, null, 2)}</pre>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;
