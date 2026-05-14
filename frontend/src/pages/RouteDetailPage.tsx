import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRouteById } from '../api/Routes';
import { createBooking } from '../api/bookings';
import { initiatePayment } from '../api/payments';
import { useAuthStore } from '../store/authStore';
import { Route } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Bus, Train, ArrowLeft, Loader2, CheckCircle2, Ticket, ShieldCheck, Clock } from 'lucide-react';

export default function RouteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (id) getRouteById(id).then(setRoute).finally(() => setLoading(false));
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
        referenceType: 'route',
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

  const typeConfig: Record<string, { icon: any, color: string, glow: string }> = {
    bus: { icon: Bus, color: 'text-emerald-400', glow: 'from-emerald-400' },
    train: { icon: Train, color: 'text-blue-400', glow: 'from-blue-400' },
    flight: { icon: Plane, color: 'text-purple-400', glow: 'from-purple-400' },
  };

  if (loading) return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="absolute inset-0 bg-white/20 blur-[40px] rounded-full" />
        <Loader2 className="w-12 h-12 text-white animate-spin relative z-10" />
      </div>
    </div>
  );

  if (!route) return (
    <div className="text-center py-16 text-white/50">Route not found.</div>
  );

  const config = typeConfig[route.type] || typeConfig.bus;
  const Icon = config.icon;

  // Simulate seating layout based on type
  const isFlight = route.type === 'flight';
  const isBus = route.type === 'bus';
  const rows = isFlight ? ['A','B','C','D','E','F'] : isBus ? ['A','B','C','D'] : ['A','B','C','D','E','F'];
  const cols = Array.from({ length: 14 }, (_, i) => i + 1);
  const bookedSeats = ['A1', 'B2', 'C5', 'D5', 'F12'];

  const calculateDuration = (start: string, end: string) => {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pb-40 w-full relative">
      
      {/* Background Glow */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b ${config.glow} to-transparent opacity-10 blur-[100px] pointer-events-none`} />

      <button
        onClick={() => navigate('/routes')}
        className="w-10 h-10 rounded-full glass flex items-center justify-center mb-8 hover:bg-white/10 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Route Details & Seat Map */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Boarding Pass Header */}
          <div className="glass-card p-0 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-32 bg-white/5 rotate-45 translate-x-1/2 -translate-y-1/2" />
            
            <div className="p-8 relative z-10 border-b border-white/10 border-dashed">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white/40 tracking-widest uppercase">{route.type}</div>
                    <div className="text-white font-medium">{route.operator}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-white/40 tracking-widest uppercase mb-1">Status</div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> On Time
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-4xl md:text-5xl font-black text-white mb-2">{route.source}</div>
                  <div className="text-white/60">
                    {new Date(route.departureTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-xs text-white/40 mt-1">
                    {new Date(route.departureTime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                <div className="flex-1 px-8 relative flex flex-col items-center">
                  <div className="text-xs font-bold text-white/40 mb-2">{calculateDuration(route.departureTime, route.arrivalTime)}</div>
                  <div className="w-full h-[2px] bg-white/10 relative">
                    <motion.div 
                      initial={{ left: 0 }}
                      animate={{ left: "100%" }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                    >
                      <Icon className={`w-6 h-6 ${config.color}`} />
                    </motion.div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-white bg-black" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-white bg-black" />
                  </div>
                  <div className="text-xs text-white/30 mt-2 uppercase tracking-widest">Direct</div>
                </div>

                <div className="text-right">
                  <div className="text-4xl md:text-5xl font-black text-white mb-2">{route.destination}</div>
                  <div className="text-white/60">
                    {new Date(route.arrivalTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-xs text-white/40 mt-1">
                    {new Date(route.arrivalTime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Cutouts for ticket effect */}
            <div className="absolute left-[-16px] bottom-[-16px] w-8 h-8 rounded-full bg-[#030303]" />
            <div className="absolute right-[-16px] bottom-[-16px] w-8 h-8 rounded-full bg-[#030303]" />
          </div>

          {/* Seat Selection Map */}
          <div className="glass-card p-8">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
               <h2 className="text-xl font-bold text-white flex items-center gap-2">
                 <Ticket className="w-5 h-5 text-white/50" />
                 Seat Assignment
               </h2>
               <div className="flex gap-4">
                 <div className="flex items-center gap-2 text-sm text-white/60">
                   <div className="w-4 h-4 rounded bg-white/10 border border-white/20" /> Available
                 </div>
                 <div className="flex items-center gap-2 text-sm text-white/60">
                   <div className="w-4 h-4 rounded bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.5)]" /> Selected
                 </div>
                 <div className="flex items-center gap-2 text-sm text-white/60">
                   <div className="w-4 h-4 rounded bg-white/5 opacity-50 relative after:content-[''] after:absolute after:w-full after:h-[1px] after:bg-white/20 after:top-1/2 after:left-0 after:-rotate-45" /> Booked
                 </div>
               </div>
            </div>

            {/* Interactive Seat Grid */}
            <div className="w-full overflow-x-auto pb-8 hide-scrollbar">
              <div className="min-w-max mx-auto bg-white/5 border border-white/10 rounded-[3rem] p-8 relative">
                
                {/* Vehicle Front Indicator */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-4 text-white/20 flex flex-col items-center">
                  <div className="w-8 h-32 border-2 border-r-0 border-white/20 rounded-l-full" />
                  <span className="text-[10px] font-bold uppercase tracking-widest mt-2 -rotate-90 origin-left">Front</span>
                </div>

                <div className="flex flex-col gap-2">
                  {rows.map((row, rIndex) => {
                    // Create aisle gap
                    const isAisle = isFlight ? rIndex === 3 : isBus ? rIndex === 2 : rIndex === 3;
                    
                    return (
                      <div key={row} className={`flex items-center gap-2 ${isAisle ? 'mt-8 mb-4 relative' : ''}`}>
                        {isAisle && <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-white/5 pointer-events-none" />}
                        
                        <div className="w-6 text-xs font-bold text-white/30 text-right pr-2">{row}</div>
                        
                        {cols.map((col) => {
                          const seat = `${row}${col}`;
                          const isSelected = selectedSeats.includes(seat);
                          const isBooked = bookedSeats.includes(seat);

                          return (
                            <motion.button
                              key={seat}
                              disabled={isBooked}
                              whileHover={!isBooked ? { scale: 1.1 } : {}}
                              whileTap={!isBooked ? { scale: 0.95 } : {}}
                              onClick={() => toggleSeat(seat)}
                              className={`
                                relative w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-colors
                                ${isBooked ? 'bg-white/5 text-transparent cursor-not-allowed opacity-50 relative after:content-[""] after:absolute after:w-full after:h-[1px] after:bg-white/20 after:-rotate-45' : 
                                  isSelected ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.6)]' : 
                                  'bg-white/10 text-white/50 border border-white/10 hover:border-white/50'}
                              `}
                            >
                              {!isBooked && col}
                            </motion.button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Booking Summary & Pay */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-white/50">Fare Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between text-white/80">
                <span>Base Fare (×{selectedSeats.length || 1})</span>
                <span className="font-mono">₹{route.price * (selectedSeats.length || 1)}</span>
              </div>
              <div className="flex items-center justify-between text-white/60 text-sm">
                <span>Taxes & Fees</span>
                <span className="font-mono">₹{selectedSeats.length > 0 ? 150 : 0}</span>
              </div>
              <div className="flex items-center justify-between text-white/60 text-sm">
                <span>Premium Service</span>
                <span className="font-mono">₹{selectedSeats.length > 0 ? 50 : 0}</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-white">Total</span>
                <span className="text-3xl font-black text-white font-mono">
                  ₹{selectedSeats.length > 0 ? (route.price * selectedSeats.length) + 200 : 0}
                </span>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 flex items-start gap-3 mb-6">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-white/60 leading-relaxed">Secure transaction. Free cancellation up to 24 hours before departure.</p>
            </div>

            <button
              onClick={handleBookAndPay}
              disabled={booking || selectedSeats.length === 0}
              className="w-full relative group overflow-hidden rounded-xl bg-white text-black font-bold py-4 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {booking ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
              {booking ? 'PROCESSING PAYMENT...' : 'CONFIRM & PAY'}
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 flex flex-col items-center justify-center text-center">
              <Clock className="w-5 h-5 text-white/40 mb-2" />
              <div className="text-xl font-black text-white mb-1">{route.availableSeats}</div>
              <div className="text-[10px] uppercase tracking-widest text-white/40">Seats Left</div>
            </div>
            <div className="glass-card p-4 flex flex-col items-center justify-center text-center">
              <Ticket className="w-5 h-5 text-white/40 mb-2" />
              <div className="text-xl font-black text-white mb-1">M-Ticket</div>
              <div className="text-[10px] uppercase tracking-widest text-white/40">Supported</div>
            </div>
          </div>

        </div>
      </div>

      <AnimatePresence>
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-50 max-w-md w-full px-6"
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