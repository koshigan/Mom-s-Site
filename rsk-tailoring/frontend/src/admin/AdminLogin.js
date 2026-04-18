import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../utils/api";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', form);

      // ✅ IMPORTANT FIX (no JWT yet)
      localStorage.setItem('adminToken', 'loggedin');

      localStorage.setItem('adminUser', JSON.stringify(res.data.admin));

      // ✅ Redirect
      navigate('/admin/dashboard');

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-card">
        <div className="logo">✂️</div>
        <h2>Admin Login</h2>
        <p>RSK Fashion Tailoring — Admin Panel</p>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter admin username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '12px', color: '#777' }}>
          Default: admin / admin123
        </p>
      </div>
    </div>
  );
}