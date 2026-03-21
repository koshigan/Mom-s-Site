import { useState, useEffect, useCallback } from 'react';
import AdminLayout from './AdminLayout';
import api from '../utils/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchPhone, setSearchPhone] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [updating, setUpdating] = useState(null);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchPhone) params.append('phone', searchPhone);
    if (filterStatus) params.append('status', filterStatus);

    api.get(`/orders?${params.toString()}`)
      .then(res => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchPhone, filterStatus]);

  useEffect(() => {
    const timer = setTimeout(fetchOrders, 300);
    return () => clearTimeout(timer);
  }, [fetchOrders]);

  const handleStatusChange = async (id, status) => {
    setUpdating(id);
    try {
      await api.put(`/orders/${id}`, { order_status: status });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, order_status: status } : o));
    } catch (err) {
      alert('Failed to update status.');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/orders/${id}`);
      setOrders(prev => prev.filter(o => o.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      alert('Failed to delete order.');
    }
  };

  return (
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1>Orders Management</h1>
          <p>View, update, and manage all customer orders.</p>
        </div>
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <h3>All Orders ({orders.length})</h3>
          <div className="filter-bar">
            <input
              className="filter-input"
              type="text"
              placeholder="🔍 Search by phone..."
              value={searchPhone}
              onChange={e => setSearchPhone(e.target.value)}
            />
            <select
              className="filter-input"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Stitching">Stitching</option>
              <option value="Ready">Ready</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-container"><div className="spinner"></div><p>Loading orders...</p></div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <p>No orders found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Design</th>
                  <th>Measurements</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td><strong>#{order.id}</strong></td>
                    <td>{order.customer_name}</td>
                    <td>{order.phone}</td>
                    <td>{order.design_name}</td>
                    <td>
                      <span title={order.measurements} style={{ cursor: 'help' }}>
                        {order.measurements.length > 30
                          ? order.measurements.substring(0, 30) + '...'
                          : order.measurements}
                      </span>
                    </td>
                    <td><strong>₹{Number(order.price).toLocaleString()}</strong></td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {new Date(order.order_time).toLocaleDateString('en-IN')}
                    </td>
                    <td>
                      <select
                        className="status-select"
                        value={order.order_status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        disabled={updating === order.id}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Stitching">Stitching</option>
                        <option value="Ready">Ready</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="btn-admin btn-danger"
                        onClick={() => setDeleteConfirm(order.id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Delete Order</h3>
            <p className="confirm-msg">Are you sure you want to delete Order #{deleteConfirm}? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button
                className="btn-admin btn-danger"
                style={{ padding: '10px 20px' }}
                onClick={() => handleDelete(deleteConfirm)}
              >
                🗑️ Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
