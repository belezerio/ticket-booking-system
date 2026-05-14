import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { logout } from '../../api/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Calendar, Plane, User, LogOut, Settings, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout: clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearAuth();
      navigate('/login');
    }
  };

  const navLinks = [
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Travel', path: '/travel', icon: Plane },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className={`relative flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-300 ${scrolled ? 'glass-card border-white/20' : 'bg-transparent border-transparent'}`}>
          
          <Link to="/" className="relative z-10 flex items-center gap-2 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-electric to-purple-neon">
              <Ticket className="h-5 w-5 text-white transform group-hover:rotate-12 transition-transform" />
              <div className="absolute inset-0 rounded-xl bg-white/20 blur-md group-hover:blur-lg transition-all" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
              NovaTix
            </span>
          </Link>

          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8 glass-card px-8 py-2 border-white/10">
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className="relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors"
                >
                  <span className={`relative z-10 ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                    {link.name}
                  </span>
                  {isActive && (
                     <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 z-0 rounded-lg bg-white/10"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4 relative z-10">
            {isAuthenticated() ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/my-bookings"
                  className="hidden md:flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  <Ticket className="w-4 h-4" />
                  <span>My Bookings</span>
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="hidden md:flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}
                
                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                  <div className="flex flex-col items-end hidden md:flex">
                    <span className="text-sm font-medium text-white">{user?.fullName}</span>
                    <span className="text-xs text-blue-400">{user?.role}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all group"
                  >
                    <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="relative px-5 py-2 text-sm font-medium text-white rounded-lg overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-electric to-cyan-neon opacity-80 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute inset-0 bg-white/20 blur-md group-hover:bg-white/30 transition-colors" />
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}