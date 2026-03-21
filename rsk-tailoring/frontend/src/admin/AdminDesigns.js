import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import api from '../utils/api';

const emptyForm = { design_name: '', price: '', image_url: '', imageFile: null };

export default function AdminDesigns() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editDesign, setEditDesign] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [error, setError] = useState('');

  const fetchDesigns = () => {
    setLoading(true);
    api.get('/designs')
      .then(res => setDesigns(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDesigns(); }, []);

  const openAdd = () => {
    setEditDesign(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (design) => {
    setEditDesign(design);
    setForm({ design_name: design.design_name, price: design.price, image_url: design.image_url, imageFile: null });
    setError('');
    setShowModal(true);
  };

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      setForm(f => ({ ...f, imageFile: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
    setError('');
  };

  const handleSave = async () => {
    if (!form.design_name || !form.price) {
      setError('Design name and price are required.');
      return;
    }
    if (!editDesign && !form.imageFile && !form.image_url) {
      setError('Please provide an image URL or upload a file.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('design_name', form.design_name);
      formData.append('price', form.price);

      if (form.imageFile) {
        formData.append('image', form.imageFile);
      } else if (form.image_url) {
        formData.append('image_url', form.image_url);
      }

      if (editDesign) {
        await api.put(`/designs/${editDesign.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/designs', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setShowModal(false);
      fetchDesigns();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save design.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/designs/${id}`);
      setDesigns(prev => prev.filter(d => d.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      alert('Failed to delete design.');
    }
  };

  return (
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1>Design Management</h1>
          <p>Add, edit, and manage blouse designs in your catalog.</p>
        </div>
        <button className="btn-add" onClick={openAdd}>+ Add New Design</button>
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <h3>All Designs ({designs.length})</h3>
        </div>

        {loading ? (
          <div className="loading-container"><div className="spinner"></div><p>Loading designs...</p></div>
        ) : designs.length === 0 ? (
          <div className="empty-state">
            <div className="icon">👗</div>
            <p>No designs yet. Add your first blouse design!</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Design Name</th>
                  <th>Price</th>
                  <th>Added On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {designs.map(design => (
                  <tr key={design.id}>
                    <td>{design.id}</td>
                    <td>
                      <img
                        src={design.image_url.startsWith('/') ? `http://localhost:5000${design.image_url}` : design.image_url}
                        alt={design.design_name}
                        className="design-thumb"
                        onError={e => { e.target.src = 'https://placehold.co/50x50?text=No+Img'; }}
                      />
                    </td>
                    <td><strong>{design.design_name}</strong></td>
                    <td><strong>₹{Number(design.price).toLocaleString()}</strong></td>
                    <td>{new Date(design.created_at).toLocaleDateString('en-IN')}</td>
                    <td style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-admin btn-edit" onClick={() => openEdit(design)}>✏️ Edit</button>
                      <button className="btn-admin btn-danger" onClick={() => setDeleteConfirm(design.id)}>🗑️ Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editDesign ? 'Edit Design' : 'Add New Design'}</h3>

            {error && <div className="alert alert-error">⚠️ {error}</div>}

            <div className="form-group">
              <label>Design Name *</label>
              <input
                type="text"
                name="design_name"
                placeholder="E.g. Classic Silk Blouse"
                value={form.design_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Price (₹) *</label>
              <input
                type="number"
                name="price"
                placeholder="E.g. 850"
                value={form.price}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Upload Image</label>
              <input
                type="file"
                name="imageFile"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Or Image URL</label>
              <input
                type="url"
                name="image_url"
                placeholder="https://example.com/blouse.jpg"
                value={form.image_url}
                onChange={handleChange}
              />
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-save" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editDesign ? '✏️ Update Design' : '➕ Add Design'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Delete Design</h3>
            <p className="confirm-msg">Are you sure you want to delete this design? All associated orders may be affected.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn-admin btn-danger" style={{ padding: '10px 20px' }} onClick={() => handleDelete(deleteConfirm)}>
                🗑️ Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
