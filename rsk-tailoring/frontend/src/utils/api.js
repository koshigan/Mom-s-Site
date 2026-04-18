import axios from 'axios';

const API_BASE = "https://mom-s-site-production.up.railway.app/api";

const api = axios.create({
  baseURL: API_BASE,
});

// attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ❌ REMOVE auto redirect for login errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API ERROR:", error.response?.data);

    // ONLY redirect if already logged in
    const token = localStorage.getItem('adminToken');

    if (token && (error.response?.status === 401 || error.response?.status === 403)) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }

    return Promise.reject(error);
  }
);

export default api;