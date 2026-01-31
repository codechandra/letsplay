import { Routes, Route, useNavigate } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';
import { HomePage } from './pages/HomePage';
import { BookingPage } from './pages/BookingPage';
import VenuesPage from './pages/VenuesPage';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import CheckoutPage from './pages/CheckoutPage';
import MyBookingsPage from './pages/MyBookingsPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import DashboardLayout from './layout/DashboardLayout';
import PlayerDashboard from './pages/Dashboard/PlayerDashboard';
import PlayerBookingsPage from './pages/Dashboard/PlayerBookingsPage';
import PlayerTeamsPage from './pages/Dashboard/PlayerTeamsPage';
import OwnerDashboard from './pages/Dashboard/OwnerDashboard';
import CoachDashboard from './pages/Dashboard/CoachDashboard';
import AdminLayout from './layout/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminGroundsPage from './pages/Admin/AdminGroundsPage';
import { useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/venues" element={<VenuesPage />} />
          <Route path="/booking/:id" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />

          {/* Dashboards */}
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/dashboard/player" element={<DashboardLayout role="PLAYER"><PlayerDashboard /></DashboardLayout>} />
          <Route path="/dashboard/player/bookings" element={<DashboardLayout role="PLAYER"><PlayerBookingsPage /></DashboardLayout>} />
          <Route path="/dashboard/player/teams" element={<DashboardLayout role="PLAYER"><PlayerTeamsPage /></DashboardLayout>} />
          <Route path="/dashboard/owner" element={<DashboardLayout role="OWNER"><OwnerDashboard /></DashboardLayout>} />
          <Route path="/dashboard/coach" element={<DashboardLayout role="COACH"><CoachDashboard /></DashboardLayout>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="grounds" element={<AdminGroundsPage />} />
            <Route path="users" element={<div className="p-10 text-center text-slate-400">User Management Coming Soon</div>} />
          </Route>

          <Route path="*" element={<div className="p-20 text-center text-slate-500 font-bold">404 - Not Found</div>} />
        </Route>
      </Routes>
    </ToastProvider>
  )
}

function DashboardRedirect() {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/auth/login');
    else if (user.roles?.includes('GROUND_OWNER')) navigate('/dashboard/owner');
    else if (user.roles?.includes('COACH')) navigate('/dashboard/coach');
    else navigate('/dashboard/player');
  }, [user]);

  return null;
}

export default App
