import { useEffect, useState } from 'react';
import { getMyBookings, cancelBooking } from '../api/bookings';
import { Booking } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Ban, Loader2, Ticket, Clock, CheckCircle2, XCircle, TrendingUp, Activity, BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyBookings().then(setBookings).finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const updated = await cancelBooking(id);
      setBookings(prev => prev.map(b => b.id === id ? updated : b));
    } catch {
      alert('Failed to cancel booking.');
    }
  };

  const statusVisuals: Record<string, { bg: string, text: string, icon: any }> = {
    pending: { bg: 'bg-yellow-500/10 border-yellow-500/30', text: 'text-yellow-500', icon: Clock },
    confirmed: { bg: 'bg-green-500/10 border-green-500/30', text: 'text-green-500', icon: CheckCircle2 },
    cancelled: { bg: 'bg-red-500/10 border-red-500/30', text: 'text-red-500', icon: XCircle },
    refunded: { bg: 'bg-white/10 border-white/20', text: 'text-white/50', icon: Ban },
  };

  if (loading) return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-electric/30 blur-[40px] rounded-full" />
        <Loader2 className="w-12 h-12 text-blue-electric animate-spin relative z-10" />
      </div>
      <p className="text-white/50 mt-6 font-medium tracking-wider uppercase">Loading Dashboard...</p>
    </div>
  );

  // Analytics Data Prep
  const totalSpent = bookings.filter(b => b.status === 'confirmed').reduce((acc, curr) => acc + curr.totalAmount, 0);
  const activeTickets = bookings.filter(b => b.status === 'confirmed').reduce((acc, curr) => acc + curr.seatNumbers.length, 0);
  
  // Fake chart data based on bookings
  const chartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 800 },
    { name: 'Apr', value: 600 },
    { name: 'May', value: totalSpent > 0 ? totalSpent / 10 : 900 },
    { name: 'Jun', value: totalSpent > 0 ? totalSpent / 5 : 1200 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 w-full">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">Command <span className="text-gradient">Center</span></h1>
        <p className="text-white/50 text-lg max-w-xl">Monitor your activities, manage bookings, and analyze your experience history.</p>
      </motion.div>

      {/* Analytics Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 border-cyan-neon/20">
           <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-cyan-neon/10 rounded-xl">
               <Activity className="w-6 h-6 text-cyan-neon" />
             </div>
             <span className="text-cyan-neon text-sm font-bold bg-cyan-neon/10 px-2 py-1 rounded-md">+12%</span>
           </div>
           <p className="text-white/50 text-sm font-medium uppercase tracking-wider mb-1">Total Experiences</p>
           <h3 className="text-3xl font-black text-white">{bookings.length}</h3>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 border-purple-neon/20">
           <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-purple-neon/10 rounded-xl">
               <TrendingUp className="w-6 h-6 text-purple-neon" />
             </div>
           </div>
           <p className="text-white/50 text-sm font-medium uppercase tracking-wider mb-1">Active Tickets</p>
           <h3 className="text-3xl font-black text-white">{activeTickets}</h3>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 border-blue-electric/20">
           <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-blue-electric/10 rounded-xl">
               <BarChart3 className="w-6 h-6 text-blue-electric" />
             </div>
           </div>
           <p className="text-white/50 text-sm font-medium uppercase tracking-wider mb-1">Total Invested</p>
           <h3 className="text-3xl font-black text-white">₹{totalSpent}</h3>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Bookings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-white">Booking History</h2>
            <button className="text-sm text-cyan-neon hover:underline">View All</button>
          </div>

          <AnimatePresence>
            {bookings.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="glass-card p-12 text-center border-white/5"
              >
                <Ticket className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No active bookings</h3>
                <p className="text-white/40">Your future experiences will appear here.</p>
              </motion.div>
            ) : (
              bookings.map((booking, i) => {
                const status = statusVisuals[booking.status] || statusVisuals.pending;
                const StatusIcon = status.icon;

                return (
                  <motion.div 
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card overflow-hidden group hover:border-white/20 transition-colors"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl border ${status.bg}`}>
                            <StatusIcon className={`w-6 h-6 ${status.text}`} />
                          </div>
                          <div>
                            <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Booking Ref</div>
                            <div className="font-mono text-white/80 tracking-widest">{booking.id.split('-')[0].toUpperCase()}</div>
                          </div>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full border ${status.bg} ${status.text} text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center`}>
                          {booking.status}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-black/20 rounded-2xl p-4 mb-6 border border-white/5">
                        <div>
                          <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Type</div>
                          <div className="font-medium text-white capitalize">{booking.referenceType}</div>
                        </div>
                        <div>
                          <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Seats</div>
                          <div className="font-medium text-white">{booking.seatNumbers.join(', ')}</div>
                        </div>
                        <div>
                          <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Date</div>
                          <div className="font-medium text-white">{new Date(booking.bookingDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        </div>
                        <div>
                          <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Amount</div>
                          <div className="font-bold text-cyan-neon">₹{booking.totalAmount}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                        {(booking.status === 'confirmed') && (
                          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-neon/10 text-cyan-neon hover:bg-cyan-neon hover:text-black transition-colors font-medium text-sm">
                            <Download className="w-4 h-4" /> Download Ticket
                          </button>
                        )}
                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors font-medium text-sm"
                          >
                            <Ban className="w-4 h-4" /> Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Right Column - Analytics & Insights */}
        <div className="space-y-6">
           <div className="glass-card p-6">
             <h3 className="text-xl font-bold text-white mb-6">Activity Overview</h3>
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#00F0FF' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#00F0FF" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
           </div>

           <div className="glass-card p-6 border-purple-neon/20 bg-gradient-to-br from-purple-neon/5 to-transparent relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-neon/20 via-transparent to-transparent opacity-50" />
             <div className="relative z-10">
               <h3 className="text-lg font-bold text-white mb-2">Unlock VIP Status</h3>
               <p className="text-white/60 text-sm mb-6">Book 2 more premier events to unlock exclusive lounge access and priority boarding.</p>
               
               <div className="w-full bg-black/40 rounded-full h-2 mb-2">
                 <div className="bg-gradient-to-r from-blue-electric to-purple-neon h-2 rounded-full" style={{ width: '60%' }}></div>
               </div>
               <div className="text-xs text-right text-purple-neon font-bold tracking-wider">3/5 BOOKINGS</div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}