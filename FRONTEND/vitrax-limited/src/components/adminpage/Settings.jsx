import React, { useState } from 'react';

const Settings = () => {
  const [result, setResult] = useState(null);

  const checkProtected = async () => {
    setResult(null);
    try {
      const res = await fetch('http://localhost:5000/auth/protected', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setResult({ ok: res.ok, data });
    } catch (e) {
      setResult({ ok: false, data: { error: e.message } });
    }
  };

  const refreshToken = async () => {
    setResult(null);
    try {
      const res = await fetch('http://localhost:5000/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminRefreshToken') || localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (res.ok && data.access_token) localStorage.setItem('token', data.access_token);
      setResult({ ok: res.ok, data });
    } catch (e) {
      setResult({ ok: false, data: { error: e.message } });
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 8 }}>Admin Settings</h1>
      <p style={{ marginTop: 0, color: '#666' }}>Manage your session</p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <button onClick={checkProtected}>Check Protected</button>
        <button onClick={refreshToken}>Refresh Access Token</button>
      </div>

      {result && (
        <pre style={{ background: '#fafafa', padding: 12, border: '1px solid #eee' }}>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
};

export default Settings;
