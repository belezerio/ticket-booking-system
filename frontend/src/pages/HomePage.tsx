import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div>
      <div className="text-center py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Book Tickets <span className="text-blue-600">Instantly</span>
        </h1>
        <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
          Movies, concerts, sports, buses, trains and flights — all in one place.
        </p>
        {isAuthenticated() ? (
          <div>
            <p className="text-gray-600 mb-6">Welcome back, <strong>{user?.fullName}</strong>!</p>
            <Link
              to="/events"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 text-lg"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="flex gap-4 justify-center">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 text-lg"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-white text-blue-600 border border-blue-200 px-8 py-3 rounded-xl font-medium hover:bg-blue-50 text-lg"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {[
          { icon: '🎬', title: 'Movies & Events', desc: 'Book seats for movies, concerts and sports events' },
          { icon: '🚌', title: 'Travel', desc: 'Bus, train and flight tickets across India' },
          { icon: '🎫', title: 'Instant Confirmation', desc: 'Get your e-ticket immediately after payment' },
        ].map(card => (
          <div key={card.title} className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
            <div className="text-4xl mb-3">{card.icon}</div>
            <h3 className="font-bold text-gray-900 mb-2">{card.title}</h3>
            <p className="text-gray-500 text-sm">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}