import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { logout } from '../../api/auth';

export default function Navbar() {
  const { user, isAuthenticated, logout: clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearAuth();
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          🎫 TicketBook
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/events" className="text-gray-600 hover:text-blue-600 font-medium">
            Events
          </Link>
          <Link to="/travel" className="text-gray-600 hover:text-blue-600 font-medium">
            Travel
          </Link>

          {isAuthenticated() ? (
            <>
              <Link to="/my-bookings" className="text-gray-600 hover:text-blue-600 font-medium">
                My Bookings
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-gray-600 hover:text-blue-600 font-medium">
                  Admin
                </Link>
              )}
              <span className="text-gray-500 text-sm">Hi, {user?.fullName}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}