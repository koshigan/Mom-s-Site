import axios from 'axios';

// ✅ Use Railway backend in production
const API_BASE =
  process.env.REACT_APP_API_URL ||
  'https://mom-s-site-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_BASE,
});

// ✅ Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }

    return Promise.reject(error);
  }
);

export default api;