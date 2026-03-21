import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Home() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/designs')
      .then(res => setDesigns(res.data.slice(0, 3)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (design) => {
    navigate('/order', { state: { selectedDesign: design } });
  };

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">✦ Premium Tailoring Services ✦</div>
          <h1>RSK <span>Fashion</span><br />Tailoring</h1>
          <p>Expertly crafted blouses tailored to perfection — because you deserve to look extraordinary.</p>
          <div className="hero-buttons">
            <Link to="/designs" className="btn-primary">Explore Designs</Link>
            <Link to="/order" className="btn-outline">Place an Order</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <div className="features-strip">
        {[
          { icon: '✂️', text: '15+ Years Experience' },
          { icon: '📐', text: 'Custom Measurements' },
          { icon: '🪡', text: 'Premium Fabrics' },
          { icon: '🚀', text: 'On-Time Delivery' },
        ].map((f, i) => (
          <div className="feature-item" key={i}>
            <span className="icon">{f.icon}</span>
            <span>{f.text}</span>
          </div>
        ))}
      </div>

      {/* Featured Designs */}
      <div className="section">
        <div className="section-header">
          <div className="section-divider"><span>🌸</span></div>
          <h2>Featured Designs</h2>
          <p>Discover our most loved blouse designs, crafted with care and elegance.</p>
        </div>

        {loading ? (
          <div className="loading-container"><div className="spinner"></div><p>Loading designs...</p></div>
        ) : designs.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🪡</div>
            <p>No designs available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="designs-grid">
            {designs.map(design => (
              <div className="design-card" key={design.id}>
                <img
                  src={design.image_url.startsWith('/') ? `http://localhost:5000${design.image_url}` : design.image_url}
                  alt={design.design_name}
                  className="design-card-img"
                  onError={e => { e.target.src = 'https://placehold.co/400x240?text=Blouse+Design'; }}
                />
                <div className="design-card-body">
                  <h3>{design.design_name}</h3>
                  <div className="design-card-price">
                    <span className="currency">₹</span>{Number(design.price).toLocaleString()}
                  </div>
                </div>
                <div className="design-card-actions">
                  <button className="btn-select" onClick={() => handleSelect(design)}>Select Design</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link to="/designs" className="btn-primary">View All Designs →</Link>
        </div>
      </div>

      {/* Why Choose Us */}
      <div style={{ background: 'white', padding: '0' }}>
        <div className="section" style={{ padding: '80px 5%' }}>
          <div className="section-header">
            <div className="section-divider"><span>⭐</span></div>
            <h2>Why Choose Us?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '28px' }}>
            {[
              { icon: '📏', title: 'Perfect Fit', desc: 'Every blouse is tailored to your exact measurements for a flawless fit.' },
              { icon: '💎', title: 'Premium Quality', desc: 'We use the finest fabrics and materials to craft your garments.' },
              { icon: '⏱️', title: 'Timely Delivery', desc: 'We respect your time and deliver orders on schedule, always.' },
              { icon: '💬', title: '24/7 Support', desc: 'Our team is always available to assist you with queries and updates.' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '30px 20px', borderRadius: '12px', border: '1px solid #E8D5C0', background: '#FDF8F0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{item.icon}</div>
                <h3 style={{ color: '#8B1A1A', marginBottom: '10px', fontSize: '1.1rem' }}>{item.title}</h3>
                <p style={{ color: '#6B6B6B', fontSize: '0.9rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: 'linear-gradient(135deg, #6B1010, #8B1A1A)', padding: '80px 5%', textAlign: 'center' }}>
        <h2 style={{ color: '#E8C87A', fontSize: '2.2rem', marginBottom: '16px' }}>Ready to Order Your Dream Blouse?</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '30px' }}>Browse our collection and place your order in just a few minutes.</p>
        <Link to="/order" className="btn-primary">Place Your Order Now</Link>
      </div>
    </>
  );
}
