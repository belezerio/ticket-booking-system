import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById } from '../api/events';
import { createBooking } from '../api/bookings';
import { initiatePayment } from '../api/payments';
import { useAuthStore } from '../store/authStore';
import { Event } from '../types';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Users, Loader2, CheckCircle2, Ticket } from 'lucide-react';

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
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const headerY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

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
      setSuccess('🎉 Booking confirmed! Redirecting...');
      setSelectedSeats([]);
      setTimeout(() => navigate('/my-bookings'), 2000);
    } catch {
      setError('Booking failed. Seats may no longer be available.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-electric/20 blur-2xl rounded-full" />
        <Loader2 className="w-12 h-12 text-blue-electric animate-spin relative z-10" />
      </div>
    </div>
  );

  if (!event) return (
    <div className="min-h-screen flex items-center justify-center text-white/50">Event not found.</div>
  );

  const rows = ['A','B','C','D','E','F','G','H'];
  const cols = [1,2,3,4,5,6,7,8,9,10,11,12];

  // Randomize some booked seats for demo
  const bookedSeats = ['A4', 'A5', 'C10', 'C11', 'D6', 'E8', 'F2'];

  const categoryVisuals: Record<string, { gradient: string, icon: string }> = {
    movie: { gradient: 'from-purple-900 via-purple-600 to-blue-600', icon: '🎬' },
    concert: { gradient: 'from-pink-900 via-pink-600 to-purple-600', icon: '🎵' },
    sports: { gradient: 'from-green-900 via-emerald-600 to-teal-600', icon: '🏆' },
    other: { gradient: 'from-slate-900 via-slate-600 to-slate-400', icon: '🎪' },
  };

  const visual = categoryVisuals[event.category] || categoryVisuals.other;

  return (
    <div className="relative min-h-screen pb-40" ref={containerRef}>
      
      {/* Hero Header */}
      <div className="relative h-[50vh] w-full overflow-hidden flex items-end pb-12">
        <motion.div style={{ y: headerY, opacity: headerOpacity }} className="absolute inset-0 z-0">
          {event.imageUrl ? (
            <img src={event.imageUrl} alt={event.title} className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen" />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-b ${visual.gradient} opacity-40 mix-blend-screen`} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/80 to-transparent" />
        </motion.div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
          <button
            onClick={() => navigate('/events')}
            className="w-10 h-10 rounded-full glass flex items-center justify-center mb-8 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="glass px-3 py-1 rounded-full text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
                  <span>{visual.icon}</span> {event.category}
                </span>
                <span className="glass px-3 py-1 rounded-full text-xs font-bold text-cyan-neon tracking-widest uppercase">
                  LIVE
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-2">{event.title}</h1>
              <p className="text-xl text-white/50 max-w-2xl">{event.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        
        {/* Left Column - Seat Map */}
        <div className="lg:col-span-2">
          
          <div className="glass-card p-8 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-24 bg-cyan-neon/10 blur-3xl pointer-events-none rounded-full" />
            
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                 <Ticket className="w-6 h-6 text-cyan-neon" />
                 Select Your Seats
               </h2>
               <div className="flex gap-4">
                 <div className="flex items-center gap-2 text-sm text-white/60">
                   <div className="w-3 h-3 rounded-sm bg-white/10 border border-white/20" /> Available
                 </div>
                 <div className="flex items-center gap-2 text-sm text-white/60">
                   <div className="w-3 h-3 rounded-sm bg-cyan-neon shadow-[0_0_10px_rgba(0,240,255,0.5)]" /> Selected
                 </div>
                 <div className="flex items-center gap-2 text-sm text-white/60">
                   <div className="w-3 h-3 rounded-sm bg-white/5 opacity-50" /> Booked
                 </div>
               </div>
            </div>

            {/* Screen Arch */}
            <div className="w-full flex flex-col items-center mb-16 relative">
              <div className="w-3/4 h-2 bg-gradient-to-r from-transparent via-cyan-neon to-transparent opacity-50 blur-[2px]" />
              <div className="w-1/2 h-8 bg-gradient-to-b from-cyan-neon/20 to-transparent blur-xl" />
              <div className="absolute top-4 text-xs font-bold text-cyan-neon tracking-[0.5em] uppercase">Stage</div>
            </div>

            {/* Seat Map Container with Interactive Zoom Simulation */}
            <motion.div 
              className="w-full overflow-x-auto pb-8 hide-scrollbar cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: -200, right: 0 }}
            >
              <div className="min-w-[700px] flex flex-col items-center gap-3">
                {rows.map((row, rIndex) => (
                  <div key={row} className="flex items-center gap-4">
                    <div className="w-6 text-sm font-bold text-white/30 text-right">{row}</div>
                    <div className="flex gap-2">
                      {cols.map((col, cIndex) => {
                        const seat = `${row}${col}`;
                        const isSelected = selectedSeats.includes(seat);
                        const isBooked = bookedSeats.includes(seat);
                        
                        // Add gaps for aisles
                        const isAisle = cIndex === 3 || cIndex === 7;

                        return (
                          <div key={seat} className={`flex items-center ${isAisle ? 'mr-6' : ''}`}>
                            <motion.button
                              disabled={isBooked}
                              whileHover={!isBooked ? { scale: 1.2, zIndex: 10 } : {}}
                              whileTap={!isBooked ? { scale: 0.9 } : {}}
                              onClick={() => toggleSeat(seat)}
                              className={`
                                relative w-8 h-8 rounded-t-lg rounded-b-sm flex items-center justify-center text-[10px] font-bold transition-colors
                                ${isBooked ? 'bg-white/5 text-transparent cursor-not-allowed opacity-50' : 
                                  isSelected ? 'bg-cyan-neon text-black shadow-[0_0_15px_rgba(0,240,255,0.6)]' : 
                                  'bg-white/10 text-white/50 border border-white/10 hover:border-cyan-neon/50'}
                              `}
                            >
                              {!isBooked && col}
                              {isSelected && (
                                <motion.div
                                  layoutId="seatGlow"
                                  className="absolute inset-0 bg-cyan-neon rounded-t-lg rounded-b-sm blur-md -z-10"
                                />
                              )}
                            </motion.button>
                          </div>
                        );
                      })}
                    </div>
                    <div className="w-6 text-sm font-bold text-white/30">{row}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Column - Details & Summary */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-6">Event Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-white/70">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-cyan-neon" />
                </div>
                <div>
                  <div className="text-xs text-white/40 font-semibold uppercase tracking-wider">Venue</div>
                  <div className="font-medium">{event.venue}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white/70">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-cyan-neon" />
                </div>
                <div>
                  <div className="text-xs text-white/40 font-semibold uppercase tracking-wider">Date & Time</div>
                  <div className="font-medium">
                    {new Date(event.eventDate).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white/70">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <Users className="w-5 h-5 text-cyan-neon" />
                </div>
                <div>
                  <div className="text-xs text-white/40 font-semibold uppercase tracking-wider">Availability</div>
                  <div className="font-medium">{event.availableSeats} Seats Left</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Booking Summary */}
      <AnimatePresence>
        {selectedSeats.length > 0 && (
          <motion.div
            initial={{ y: 150 }}
            animate={{ y: 0 }}
            exit={{ y: 150 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-6 pointer-events-none"
          >
            <div className="max-w-4xl mx-auto glass-card border border-cyan-neon/30 p-6 flex flex-col md:flex-row items-center justify-between pointer-events-auto shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
              
              <div className="flex-1 mb-4 md:mb-0 w-full">
                <div className="text-xs font-bold text-cyan-neon tracking-widest uppercase mb-1">Your Selection</div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedSeats.map(seat => (
                    <span key={seat} className="px-3 py-1 bg-white/10 rounded-md text-white font-medium text-sm">
                      {seat}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-white/50">{selectedSeats.length} Tickets × ₹{event.price}</div>
              </div>

              <div className="flex items-center gap-8 w-full md:w-auto">
                <div className="text-right">
                  <div className="text-xs font-bold text-white/40 tracking-widest uppercase mb-1">Total Amount</div>
                  <div className="text-3xl font-black text-white">₹{event.price * selectedSeats.length}</div>
                </div>
                <button
                  onClick={handleBookAndPay}
                  disabled={booking}
                  className="relative group overflow-hidden rounded-xl bg-cyan-neon text-black font-bold px-8 py-4 flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-70 disabled:hover:scale-100"
                >
                  {booking ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  {booking ? 'Processing...' : 'Secure Tickets'}
                  <div className="absolute inset-0 bg-white/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 max-w-md w-full"
          >
            <div className={`p-4 rounded-xl backdrop-blur-xl border flex items-center justify-center shadow-2xl ${
              error ? 'bg-red-500/20 border-red-500/50 text-red-200' : 'bg-green-500/20 border-green-500/50 text-green-200'
            }`}>
              {error || success}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}