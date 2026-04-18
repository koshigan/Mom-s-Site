import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken');

  // ❌ Not logged in → go to login
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // ✅ Logged in → allow access
  return children;
}