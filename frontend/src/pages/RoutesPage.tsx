import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRoutes } from '../api/Routes';
import { Route } from '../types';

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    getRoutes().then(setRoutes).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? routes : routes.filter(r => r.type === filter);

  const typeIcon: Record<string, string> = {
    bus: '🚌',
    train: '🚆',
    flight: '✈️',
  };

  const typeColor: Record<string, string> = {
    bus: 'bg-green-100 text-green-700',
    train: 'bg-blue-100 text-blue-700',
    flight: 'bg-purple-100 text-purple-700',
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-500">Loading routes...</div>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Travel</h1>
      <p className="text-gray-500 mb-6">Book bus, train and flight tickets</p>

      <div className="flex gap-2 mb-8">
        {['all', 'bus', 'train', 'flight'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === type
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
            }`}
          >
            {type !== 'all' && typeIcon[type]} {type}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">🚌</div>
          <p>No routes available.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(route => (
            <div
              key={route.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/travel/${route.id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{typeIcon[route.type]}</span>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-gray-900 text-lg">{route.source}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-bold text-gray-900 text-lg">{route.destination}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${typeColor[route.type]}`}>
                        {route.type}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm">{route.operator}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">₹{route.price}</p>
                  <p className="text-sm text-gray-400">{route.availableSeats} seats left</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 text-sm">
                <div>
                  <p className="text-gray-400">Departure</p>
                  <p className="font-medium">
                    {new Date(route.departureTime).toLocaleString('en-IN', {
                      day: 'numeric', month: 'short',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Arrival</p>
                  <p className="font-medium">
                    {new Date(route.arrivalTime).toLocaleString('en-IN', {
                      day: 'numeric', month: 'short',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}