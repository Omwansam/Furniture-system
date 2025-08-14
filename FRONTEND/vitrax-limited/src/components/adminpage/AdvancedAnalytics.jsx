import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const AdvancedAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/categories/stats');
        if (!res.ok) throw new Error('Failed to load stats');
        const data = await res.json();
        setStats(data.stats || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const chartData = stats.map(s => ({ name: s.category_name, products: s.product_count, stock: s.total_stock }));

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 8 }}>Advanced Analytics</h1>
      <p style={{ marginTop: 0, color: '#555' }}>Category performance overview</p>
      {loading && <div>Loading analytics...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {!loading && !error && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {stats.slice(0, 4).map((s) => (
              <div key={s.category_id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
                <div style={{ fontSize: 12, color: '#777' }}>{s.category_name}</div>
                <div style={{ fontSize: 22, fontWeight: 600 }}>{s.product_count} products</div>
                <div style={{ fontSize: 12, color: '#777' }}>Stock: {s.total_stock} • Avg price: ${s.avg_price.toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
            <h3 style={{ marginTop: 0 }}>Products per Category</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" interval={0} angle={-15} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="products" fill="#8884d8" name="Products" />
                  <Bar dataKey="stock" fill="#82ca9d" name="Stock" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdvancedAnalytics;
