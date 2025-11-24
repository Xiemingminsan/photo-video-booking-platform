import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';

// Client Pages
import Home from './pages/client/Home';
import Login from './pages/client/Login';
import Register from './pages/client/Register';
import PackageDetails from './pages/client/PackageDetails';
import Booking from './pages/client/Booking';
import MyBookings from './pages/client/MyBookings';
import DeliveryView from './pages/client/DeliveryView';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManagePackages from './pages/admin/ManagePackages';
import ManageBookings from './pages/admin/ManageBookings';
import ManageAddons from './pages/admin/ManageAddons';
import UploadDelivery from './pages/admin/UploadDelivery';
import AdminBookingDetails from './pages/admin/BookingDetails';

import './styles/App.css';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" />;
  }

  return children;
};

function AppContent() {
  const { isAdmin } = useAuth();

  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={isAdmin() ? <Navigate to="/admin" /> : <Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/package/:id" element={<PackageDetails />} />
          <Route path="/packages/:id" element={<PackageDetails />} />

          {/* Client Protected Routes */}
          <Route
            path="/booking/:packageId"
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery/:bookingId"
            element={
              <ProtectedRoute>
                <DeliveryView />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/packages"
            element={
              <ProtectedRoute adminOnly>
                <ManagePackages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute adminOnly>
                <ManageBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings/:bookingId"
            element={
              <ProtectedRoute adminOnly>
                <AdminBookingDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/addons"
            element={
              <ProtectedRoute adminOnly>
                <ManageAddons />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/delivery/:bookingId"
            element={
              <ProtectedRoute adminOnly>
                <UploadDelivery />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
