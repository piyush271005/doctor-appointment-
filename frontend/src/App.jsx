import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ApplyDoctor from './pages/ApplyDoctor';
import Notifications from './pages/Notifications';
import BookAppointment from './pages/BookAppointment';
import Appointments from './pages/Appointments';
import DoctorAppointments from './pages/DoctorAppointments';
import DoctorProfile from './pages/DoctorProfile';
import AdminUsers from './pages/AdminUsers';
import AdminDoctors from './pages/AdminDoctors';

import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Layout from './components/Layout';
import { UserContext } from './context/UserContext';
import { RefreshCw } from 'lucide-react';

function App() {
  const { loading } = useContext(UserContext);

  return (
    <Router>
      {/* Global Spinner Backdrop */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(10, 12, 22, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          color: 'var(--text-main)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <RefreshCw className="menu-icon" style={{ animation: 'spin 1.5s linear infinite', width: '40px', height: '40px', color: 'var(--color-primary)', margin: '0 auto 1rem' }} />
            <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Processing connection...</p>
          </div>
        </div>
      )}

      <Routes>
        {/* Protected Core App Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/apply-doctor"
          element={
            <ProtectedRoute>
              <Layout>
                <ApplyDoctor />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notification"
          element={
            <ProtectedRoute>
              <Layout>
                <Notifications />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/book-appointment/:doctorId"
          element={
            <ProtectedRoute>
              <Layout>
                <BookAppointment />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Layout>
                <Appointments />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor-appointments"
          element={
            <ProtectedRoute>
              <Layout>
                <DoctorAppointments />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/profile/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <DoctorProfile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <Layout>
                <AdminUsers />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute>
              <Layout>
                <AdminDoctors />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Public Authentication Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
