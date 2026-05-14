import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuthStore } from './store/authStore';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import MyBookingsPage from './pages/MyBookingsPage';
import EventDetailPage from './pages/EventDetailPage';
import RoutesPage from './pages/RoutesPage';
import RouteDetailPage from './pages/RouteDetailPage';
import AdminDashboard from './pages/AdminDashboard';

function PrivateRoute({ children, requireAdmin = false }: { children: ReactNode, requireAdmin?: boolean }) {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:id" element={<EventDetailPage />} />
          <Route path="travel" element={<RoutesPage />} />
          <Route path="travel/:id" element={<RouteDetailPage />} />
          <Route
            path="my-bookings"
            element={<PrivateRoute><MyBookingsPage /></PrivateRoute>}
          />
          <Route
            path="admin"
            element={<PrivateRoute requireAdmin><AdminDashboard /></PrivateRoute>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}