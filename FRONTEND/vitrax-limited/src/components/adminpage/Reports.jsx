import React, { useState } from 'react';

const Reports = () => {
  const [createResult, setCreateResult] = useState(null);
  const [validateResult, setValidateResult] = useState(null);
  const [form, setForm] = useState({ code: '', discount_type: 'PERCENTAGE', discount_value: 10, min_order_amount: '', usage_limit: '' });
  const [validateCode, setValidateCode] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateResult(null);
    try {
      const res = await fetch('http://localhost:5000/orders/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          code: form.code,
          discount_type: form.discount_type,
          discount_value: Number(form.discount_value),
          min_order_amount: form.min_order_amount ? Number(form.min_order_amount) : undefined,
          usage_limit: form.usage_limit ? Number(form.usage_limit) : undefined,
          is_active: true
        })
      });
      const data = await res.json();
      setCreateResult({ ok: res.ok, data });
    } catch (e) {
      setCreateResult({ ok: false, data: { error: e.message } });
    }
  };

  const handleValidate = async (e) => {
    e.preventDefault();
    setValidateResult(null);
    try {
      const res = await fetch('http://localhost:5000/orders/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: validateCode })
      });
      const data = await res.json();
      setValidateResult({ ok: res.ok, data });
    } catch (e) {
      setValidateResult({ ok: false, data: { error: e.message } });
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 8 }}>Reports & Tools</h1>
      <p style={{ marginTop: 0, color: '#666' }}>Manage coupons and validate codes</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>Create Coupon</h3>
          <form onSubmit={handleCreate} style={{ display: 'grid', gap: 12 }}>
            <input placeholder="Code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} required />
            <select value={form.discount_type} onChange={e => setForm({ ...form, discount_type: e.target.value })}>
              <option value="PERCENTAGE">PERCENTAGE</option>
              <option value="FIXED">FIXED</option>
            </select>
            <input type="number" step="0.01" placeholder="Discount value" value={form.discount_value} onChange={e => setForm({ ...form, discount_value: e.target.value })} />
            <input type="number" step="0.01" placeholder="Min order amount (optional)" value={form.min_order_amount} onChange={e => setForm({ ...form, min_order_amount: e.target.value })} />
            <input type="number" placeholder="Usage limit (optional)" value={form.usage_limit} onChange={e => setForm({ ...form, usage_limit: e.target.value })} />
            <button type="submit">Create</button>
          </form>
          {createResult && (
            <pre style={{ background: '#fafafa', padding: 12, marginTop: 12, border: '1px solid #eee' }}>{JSON.stringify(createResult, null, 2)}</pre>
          )}
        </div>

        <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>Validate Coupon</h3>
          <form onSubmit={handleValidate} style={{ display: 'grid', gap: 12 }}>
            <input placeholder="Coupon code" value={validateCode} onChange={e => setValidateCode(e.target.value)} />
            <button type="submit">Validate</button>
          </form>
          {validateResult && (
            <pre style={{ background: '#fafafa', padding: 12, marginTop: 12, border: '1px solid #eee' }}>{JSON.stringify(validateResult, null, 2)}</pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
