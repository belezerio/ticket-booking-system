import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById } from '../api/events';
import { createBooking } from '../api/bookings';
import { initiatePayment } from '../api/payments';
import { useAuthStore } from '../store/authStore';
import { Event } from '../types';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (id) getEventById(id).then(setEvent).finally(() => setLoading(false));
  }, [id]);

  const toggleSeat = (seat: string) => {
    setSelectedSeats(prev =>
      prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]
    );
  };

  const handleBookAndPay = async () => {
    if (!isAuthenticated()) { navigate('/login'); return; }
    if (selectedSeats.length === 0) { setError('Please select at least one seat.'); return; }
    setError('');
    setBooking(true);
    try {
      const newBooking = await createBooking({
        referenceId: id!,
        referenceType: 'event',
        seatNumbers: selectedSeats
      });
      await initiatePayment({
        bookingId: newBooking.id,
        paymentMethod: 'card'
      });
      setSuccess('🎉 Booking confirmed! Check My Bookings.');
      setSelectedSeats([]);
    } catch {
      setError('Booking failed. Seats may no longer be available.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-500">Loading event...</div>
    </div>
  );

  if (!event) return (
    <div className="text-center py-16 text-gray-400">Event not found.</div>
  );

  // Generate seat grid A1-J10
  const rows = ['A','B','C','D','E','F','G','H','I','J'];
  const cols = [1,2,3,4,5,6,7,8,9,10];

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/events')}
        className="text-blue-600 hover:underline mb-6 flex items-center gap-1"
      >
        ← Back to Events
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8">
        <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <span className="text-8xl">
            {event.category === 'movie' ? '🎬' :
             event.category === 'concert' ? '🎵' :
             event.category === 'sports' ? '🏆' : '🎪'}
          </span>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
              <p className="text-gray-500 mt-1">{event.description}</p>
            </div>
            <span className="text-2xl font-bold text-blue-600">₹{event.price}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Venue</p>
              <p className="font-medium">{event.venue}</p>
            </div>
            <div>
              <p className="text-gray-400">Date</p>
              <p className="font-medium">
                {new Date(event.eventDate).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Available Seats</p>
              <p className="font-medium">{event.availableSeats}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Select Seats</h2>
        <div className="flex gap-4 text-sm mb-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-600"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300"></div>
            <span>Available</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block">
            <div className="flex gap-1 mb-2 pl-8">
              {cols.map(c => (
                <div key={c} className="w-8 text-center text-xs text-gray-400">{c}</div>
              ))}
            </div>
            {rows.map(row => (
              <div key={row} className="flex gap-1 mb-1 items-center">
                <div className="w-6 text-xs text-gray-400 font-medium">{row}</div>
                {cols.map(col => {
                  const seat = `${row}${col}`;
                  const selected = selectedSeats.includes(seat);
                  return (
                    <button
                      key={seat}
                      onClick={() => toggleSeat(seat)}
                      className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                        selected
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-blue-100'
                      }`}
                    >
                      {col}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-3">Booking Summary</h3>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Selected Seats</span>
            <span className="font-medium">{selectedSeats.join(', ')}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Price per seat</span>
            <span className="font-medium">₹{event.price}</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between">
            <span className="font-bold">Total</span>
            <span className="font-bold text-blue-600">
              ₹{event.price * selectedSeats.length}
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg mb-4 text-sm">{success}</div>
      )}

      <button
        onClick={handleBookAndPay}
        disabled={booking || selectedSeats.length === 0}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 text-lg"
      >
        {booking ? 'Processing...' : `Book & Pay ₹${event.price * selectedSeats.length}`}
      </button>
    </div>
  );
}