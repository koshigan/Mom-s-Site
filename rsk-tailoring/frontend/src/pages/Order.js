import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

export default function Order() {
  const location = useLocation();
  const navigate = useNavigate();

  const [designs, setDesigns] = useState([]);
  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    measurements: '',
    design_id: '',
  });
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    api.get('/designs').then(res => {
      setDesigns(res.data);
      if (location.state?.selectedDesign) {
        const d = location.state.selectedDesign;
        setSelectedDesign(d);
        setForm(f => ({ ...f, design_id: String(d.id) }));
      }
    }).catch(console.error);
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));

    if (name === 'design_id') {
      const found = designs.find(d => String(d.id) === value);
      setSelectedDesign(found || null);
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customer_name || !form.phone || !form.measurements || !form.design_id) {
      setError('Please fill in all fields.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      setError('Please enter a valid 10-digit Indian phone number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/orders', {
        ...form,
        price: selectedDesign?.price,
      });
      setOrderId(res.data.order?.id);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="success-screen">
        <div className="success-icon">✅</div>
        <h2>Order Placed!</h2>
        <p>Thank you! Your order #{orderId} has been received. We will contact you shortly on your phone number.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link to="/" className="btn-primary">Back to Home</Link>
          <Link to="/designs" className="btn-outline" style={{ background: 'transparent', border: '2px solid #8B1A1A', color: '#8B1A1A', padding: '14px 32px', borderRadius: '50px', fontWeight: '600' }}>Browse More</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page">
      <div className="section-header" style={{ marginBottom: '36px' }}>
        <div className="section-divider"><span>📋</span></div>
        <h2>Place Your Order</h2>
        <p>Fill in your details and we'll get your blouse stitched to perfection.</p>
      </div>

      <div className="order-form-container">
        <div className="form-card">
          <h2>Order Details</h2>
          <p>Please provide your measurements and contact information.</p>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="customer_name"
                placeholder="Enter your full name"
                value={form.customer_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter 10-digit mobile number"
                value={form.phone}
                onChange={handleChange}
                maxLength={10}
                required
              />
            </div>

            <div className="form-group">
              <label>Select Blouse Design *</label>
              <select name="design_id" value={form.design_id} onChange={handleChange} required>
                <option value="">-- Choose a Design --</option>
                {designs.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.design_name} — ₹{Number(d.price).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Measurements *</label>
              <textarea
                name="measurements"
                placeholder="E.g. Bust: 36, Waist: 32, Shoulder: 14, Length: 15, Sleeve Length: 6..."
                value={form.measurements}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? '⏳ Placing Order...' : '✅ Confirm Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          {selectedDesign ? (
            <>
              <img
                src={selectedDesign.image_url?.startsWith('/') ? `http://localhost:5000${selectedDesign.image_url}` : selectedDesign.image_url}
                alt={selectedDesign.design_name}
                className="selected-design-preview"
                onError={e => { e.target.src = 'https://placehold.co/400x160?text=Design'; }}
              />
              <div className="summary-item">
                <span>Design</span>
                <span>{selectedDesign.design_name}</span>
              </div>
              <div className="summary-item">
                <span>Stitching Cost</span>
                <span>₹{Number(selectedDesign.price).toLocaleString()}</span>
              </div>
              <div className="summary-total">
                <span>Total Amount</span>
                <span>₹{Number(selectedDesign.price).toLocaleString()}</span>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', color: '#6B6B6B', padding: '20px 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px', opacity: 0.4 }}>👗</div>
              <p style={{ fontSize: '0.9rem' }}>Select a design to see your order summary.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
