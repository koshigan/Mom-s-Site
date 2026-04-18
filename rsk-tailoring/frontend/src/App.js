import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/global.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Designs from './pages/Designs';
import Order from './pages/Order';

import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminOrders from './admin/AdminOrders';
import AdminDesigns from './admin/AdminDesigns';

// ✅ Layout for customer pages
const CustomerLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= CUSTOMER ================= */}
        <Route
          path="/"
          element={
            <CustomerLayout>
              <Home />
            </CustomerLayout>
          }
        />

        <Route
          path="/designs"
          element={
            <CustomerLayout>
              <Designs />
            </CustomerLayout>
          }
        />

        <Route
          path="/order"
          element={
            <CustomerLayout>
              <Order />
            </CustomerLayout>
          }
        />

        {/* ================= ADMIN ================= */}

        {/* Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/designs"
          element={
            <ProtectedRoute>
              <AdminDesigns />
            </ProtectedRoute>
          }
        />

        {/* Redirect /admin → dashboard */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* ================= 404 ================= */}
        <Route
          path="*"
          element={
            <CustomerLayout>
              <div style={{ textAlign: 'center', padding: '100px 20px' }}>
                <h1 style={{ fontSize: '4rem' }}>404</h1>
                <p>Page not found</p>
                <a href="/">Go Home</a>
              </div>
            </CustomerLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}