import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Designs() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/designs')
      .then(res => setDesigns(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (design) => {
    navigate('/order', { state: { selectedDesign: design } });
  };

  return (
    <div className="section" style={{ paddingTop: '60px' }}>
      <div className="section-header">
        <div className="section-divider"><span>🌸</span></div>
        <h2>Our Blouse Designs</h2>
        <p>Choose from our exquisite collection of handcrafted blouse designs.</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading designs...</p>
        </div>
      ) : designs.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🪡</div>
          <p>No designs available yet. Please check back soon!</p>
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
                <button className="btn-select" onClick={() => handleSelect(design)}>
                  Select Design
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
