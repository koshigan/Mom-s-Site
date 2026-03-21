import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import api from '../utils/api';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/dashboard')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-container"><div className="spinner"></div><p>Loading dashboard...</p></div>
      </AdminLayout>
    );
  }

  const { stats, recentOrders } = data || {};

  return (
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening at RSK Fashion Tailoring.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-value">{stats?.total || 0}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-icon">⏳</div>
          <div className="stat-value">{stats?.pending || 0}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon">🪡</div>
          <div className="stat-value">{stats?.stitching || 0}</div>
          <div className="stat-label">Stitching</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{stats?.delivered || 0}</div>
          <div className="stat-label">Delivered</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">💰</div>
          <div className="stat-value">₹{Number(stats?.totalRevenue || 0).toLocaleString()}</div>
          <div className="stat-label">Revenue Earned</div>
        </div>
        <div className="stat-card" style={{ borderColor: '#9B59B6' }}>
          <div className="stat-icon">👗</div>
          <div className="stat-value">{stats?.totalDesigns || 0}</div>
          <div className="stat-label">Total Designs</div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="table-card">
        <div className="table-card-header">
          <h3>Recent Orders</h3>
          <span style={{ fontSize: '0.85rem', color: '#999' }}>Last 5 orders</span>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>#ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Design</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {!recentOrders?.length ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: '#999', padding: '30px' }}>No orders yet</td></tr>
              ) : recentOrders.map(order => (
                <tr key={order.id}>
                  <td><strong>#{order.id}</strong></td>
                  <td>{order.customer_name}</td>
                  <td>{order.phone}</td>
                  <td>{order.design_name}</td>
                  <td><strong>₹{Number(order.price).toLocaleString()}</strong></td>
                  <td>{new Date(order.order_time).toLocaleDateString('en-IN')}</td>
                  <td>
                    <span className={`status-badge status-${order.order_status}`}>
                      {order.order_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
