import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <h3>✂️ RSK Fashion Tailoring</h3>
          <p>Expert blouse stitching with precision and care. Bringing your fashion vision to life since 2010.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/designs">Browse Designs</Link></li>
            <li><Link to="/order">Place Order</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>📍 123 Fashion Street, Tamil Nadu</p>
          <p>📞 +91 98765 43210</p>
          <p>🕒 Mon–Sat: 9am – 7pm</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} RSK Fashion Tailoring. All rights reserved.</p>
      </div>
    </footer>
  );
}
