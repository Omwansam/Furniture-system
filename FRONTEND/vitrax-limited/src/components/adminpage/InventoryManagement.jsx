import React, { useEffect, useMemo, useState } from 'react';

const InventoryManagement = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [editing, setEditing] = useState({});

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/product');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filtered = useMemo(() => {
    return (products || []).filter(p => {
      const q = search.trim().toLowerCase();
      const matches = !q || p.product_name.toLowerCase().includes(q) || String(p.product_id).includes(q);
      const low = onlyLowStock ? (p.stock_quantity <= 5) : true;
      return matches && low;
    });
  }, [products, search, onlyLowStock]);

  const startEdit = (p) => {
    setEditing({ [p.product_id]: { stock_quantity: p.stock_quantity, product_price: p.product_price } });
  };

  const changeEdit = (id, field, value) => {
    setEditing(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const saveEdit = async (id) => {
    const payload = editing[id];
    if (!payload) return;
    try {
      const res = await fetch(`http://localhost:5000/api/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          stock_quantity: Number(payload.stock_quantity),
          product_price: Number(payload.product_price)
        })
      });
      if (!res.ok) throw new Error('Failed to update product');
      await loadProducts();
      setEditing(prev => { const n = { ...prev }; delete n[id]; return n; });
      alert('Updated successfully');
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0 }}>Inventory</h1>
          <p style={{ margin: 0, color: '#666' }}>Manage stock and pricing</p>
        </div>
        <div>
          <button onClick={loadProducts}>Reload</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or ID"
          style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6, minWidth: 260 }}
        />
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={onlyLowStock} onChange={(e) => setOnlyLowStock(e.target.checked)} />
          Only low stock (&#8804;5)
        </label>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {!loading && !error && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>ID</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Name</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Category</th>
                <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #eee' }}>Price ($)</th>
                <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #eee' }}>Stock</th>
                <th style={{ textAlign: 'center', padding: 8, borderBottom: '1px solid #eee' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const isEditing = !!editing[p.product_id];
                return (
                  <tr key={p.product_id}>
                    <td style={{ padding: 8, borderBottom: '1px solid #f5f5f5' }}>{p.product_id}</td>
                    <td style={{ padding: 8, borderBottom: '1px solid #f5f5f5' }}>{p.product_name}</td>
                    <td style={{ padding: 8, borderBottom: '1px solid #f5f5f5' }}>{p.category_id}</td>
                    <td style={{ padding: 8, borderBottom: '1px solid #f5f5f5', textAlign: 'right' }}>
                      {isEditing ? (
                        <input type="number" step="0.01" value={editing[p.product_id]?.product_price ?? p.product_price}
                          onChange={e => changeEdit(p.product_id, 'product_price', e.target.value)} style={{ width: 100 }} />
                      ) : (
                        Number(p.product_price).toFixed(2)
                      )}
                    </td>
                    <td style={{ padding: 8, borderBottom: '1px solid #f5f5f5', textAlign: 'right' }}>
                      {isEditing ? (
                        <input type="number" value={editing[p.product_id]?.stock_quantity ?? p.stock_quantity}
                          onChange={e => changeEdit(p.product_id, 'stock_quantity', e.target.value)} style={{ width: 80 }} />
                      ) : (
                        p.stock_quantity
                      )}
                    </td>
                    <td style={{ padding: 8, borderBottom: '1px solid #f5f5f5', textAlign: 'center' }}>
                      {!isEditing ? (
                        <button onClick={() => startEdit(p)}>Edit</button>
                      ) : (
                        <>
                          <button onClick={() => saveEdit(p.product_id)} style={{ marginRight: 8 }}>Save</button>
                          <button onClick={() => setEditing(prev => { const n = { ...prev }; delete n[p.product_id]; return n; })}>Cancel</button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
