import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents } from '../api/events';
import { Event } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, MapPin, Loader2, Play } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    getEvents().then(setEvents).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? events : events.filter(e => e.category === filter);

  const categories = [
    { id: 'all', label: 'All Experiences' },
    { id: 'movie', label: 'Cinematic' },
    { id: 'concert', label: 'Live Concerts' },
    { id: 'sports', label: 'Elite Sports' },
    { id: 'other', label: 'Exclusive' }
  ];

  const categoryVisuals: Record<string, { gradient: string, icon: string }> = {
    movie: { gradient: 'from-purple-900 via-purple-600 to-blue-600', icon: '🎬' },
    concert: { gradient: 'from-pink-900 via-pink-600 to-purple-600', icon: '🎵' },
    sports: { gradient: 'from-green-900 via-emerald-600 to-teal-600', icon: '🏆' },
    other: { gradient: 'from-slate-900 via-slate-600 to-slate-400', icon: '🎪' },
  };

  if (loading) return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="absolute inset-0 bg-cyan-neon/30 blur-[40px] rounded-full" />
        <Loader2 className="w-12 h-12 text-cyan-neon animate-spin relative z-10" />
      </div>
      <p className="text-white/50 mt-6 font-medium tracking-wider">INITIALIZING EXPERIENCES...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 w-full">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">Curated <span className="text-gradient">Events</span></h1>
          <p className="text-white/50 text-lg md:text-xl max-w-xl">Discover and secure your access to the world's most exclusive premieres and performances.</p>
        </div>

        {/* Search bar mock */}
        <div className="relative group w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-white/40 group-focus-within:text-cyan-neon transition-colors" />
          </div>
          <input
            type="text"
            className="w-full md:w-80 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-neon/50 focus:border-cyan-neon/50 transition-all backdrop-blur-xl"
            placeholder="Search events..."
          />
        </div>
      </motion.div>

      {/* Filter Pills */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-3 mb-12"
      >
        {categories.map((cat) => {
          const isActive = filter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`relative px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden ${
                isActive ? 'text-black' : 'text-white/60 hover:text-white glass-card hover:bg-white/10'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-white"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat.label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Events Grid */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-32 glass-card rounded-3xl"
          >
            <div className="text-6xl mb-6">🌌</div>
            <h3 className="text-2xl font-bold text-white mb-2">No events found</h3>
            <p className="text-white/40">Try adjusting your filters or check back later.</p>
          </motion.div>
        ) : (
          <motion.div 
            key="grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filtered.map((event, i) => {
              const visual = categoryVisuals[event.category] || categoryVisuals.other;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  key={event.id}
                  onClick={() => navigate(`/events/${event.id}`)}
                  className="group relative rounded-[2rem] bg-black/40 border border-white/10 overflow-hidden cursor-pointer hover:border-white/30 transition-colors"
                >
                  {/* Poster Image Area */}
                  <div className="relative h-72 w-full overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${visual.gradient} opacity-80 group-hover:scale-110 transition-transform duration-700 ease-out`} />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                    
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 rounded-full glass flex items-center justify-center backdrop-blur-md scale-50 group-hover:scale-100 transition-transform duration-500 delay-100">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>

                    <div className="absolute top-4 left-4 glass px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20 flex items-center gap-2">
                      <span className="text-sm">{visual.icon}</span>
                      <span className="text-xs font-semibold text-white uppercase tracking-wider">{event.category}</span>
                    </div>

                    <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20">
                      <span className="text-xs font-bold text-white">₹{event.price}</span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 relative">
                    {/* Glow effect on hover */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-cyan-neon/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <h3 className="font-bold text-white text-2xl mb-3 line-clamp-1 group-hover:text-cyan-neon transition-colors">{event.title}</h3>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-white/50 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.eventDate).toLocaleDateString('en-IN', {
                          weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'
                        })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/50 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{event.venue}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${event.availableSeats > 20 ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
                        <span className="text-sm font-medium text-white/80">{event.availableSeats} seats left</span>
                      </div>
                      <span className="text-cyan-neon font-medium text-sm flex items-center gap-1 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        Book Now <span className="text-lg leading-none">&rarr;</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}