import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents } from '../api/events';
import { Event } from '../types';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    getEvents().then(setEvents).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? events : events.filter(e => e.category === filter);

  const categoryColor: Record<string, string> = {
    movie: 'bg-purple-100 text-purple-700',
    concert: 'bg-pink-100 text-pink-700',
    sports: 'bg-green-100 text-green-700',
    other: 'bg-gray-100 text-gray-700',
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-500">Loading events...</div>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
      <p className="text-gray-500 mb-6">Browse and book tickets for upcoming events</p>

      <div className="flex gap-2 mb-8">
        {['all', 'movie', 'concert', 'sports', 'other'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === cat
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No events found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(event => (
            <div
              key={event.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/events/${event.id}`)}
            >
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-6xl">
                  {event.category === 'movie' ? '🎬' :
                   event.category === 'concert' ? '🎵' :
                   event.category === 'sports' ? '🏆' : '🎪'}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 text-lg">{event.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${categoryColor[event.category]}`}>
                    {event.category}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-3">{event.venue}</p>
                <p className="text-gray-500 text-sm mb-4">
                  {new Date(event.eventDate).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-bold text-lg">₹{event.price}</span>
                  <span className="text-sm text-gray-400">{event.availableSeats} seats left</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}