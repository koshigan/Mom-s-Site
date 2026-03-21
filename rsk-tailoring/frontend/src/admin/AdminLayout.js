import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/admin/orders', icon: '📋', label: 'Orders' },
  { path: '/admin/designs', icon: '👗', label: 'Designs' },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const admin = JSON.parse(localStorage.getItem('adminUser') || '{}');

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✂️</div>
          <h3>RSK Tailoring</h3>
          <p>Admin Panel</p>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.path}
              className={`sidebar-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <div style={{ margin: '12px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}></div>
          <button className="sidebar-nav-item" onClick={() => navigate('/')}>
            <span className="nav-icon">🏠</span>
            Customer Site
          </button>
          <button className="sidebar-nav-item" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            Logout ({admin.username})
          </button>
        </nav>
      </aside>
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
