import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRoutes } from '../api/Routes';
import { Route } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Bus, Train, Search, ArrowRight, Loader2, Calendar, MapPin } from 'lucide-react';

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    getRoutes().then(setRoutes).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? routes : routes.filter(r => r.type === filter);

  const typeConfig: Record<string, { icon: any, color: string, glow: string }> = {
    bus: { icon: Bus, color: 'text-emerald-400', glow: 'shadow-[0_0_15px_rgba(52,211,153,0.3)]' },
    train: { icon: Train, color: 'text-blue-400', glow: 'shadow-[0_0_15px_rgba(96,165,250,0.3)]' },
    flight: { icon: Plane, color: 'text-purple-400', glow: 'shadow-[0_0_15px_rgba(192,132,252,0.3)]' },
  };

  const calculateDuration = (start: string, end: string) => {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  };

  if (loading) return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="absolute inset-0 bg-purple-neon/30 blur-[40px] rounded-full" />
        <Loader2 className="w-12 h-12 text-purple-neon animate-spin relative z-10" />
      </div>
      <p className="text-white/50 mt-6 font-medium tracking-wider">SEARCHING GLOBAL ROUTES...</p>
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
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">Global <span className="text-gradient">Travel</span></h1>
          <p className="text-white/50 text-lg md:text-xl max-w-xl">First-class travel experiences. Book flights, luxury trains, and premium coaches seamlessly.</p>
        </div>

        {/* Search Input */}
        <div className="relative group w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-white/40 group-focus-within:text-purple-neon transition-colors" />
          </div>
          <input
            type="text"
            className="w-full md:w-80 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-neon/50 focus:border-purple-neon/50 transition-all backdrop-blur-xl"
            placeholder="Search destinations..."
          />
        </div>
      </motion.div>

      {/* Filter Options */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-3 mb-12 overflow-x-auto pb-4 hide-scrollbar"
      >
        {['all', 'flight', 'train', 'bus'].map((type) => {
          const isActive = filter === type;
          const TypeIcon = type !== 'all' ? typeConfig[type].icon : Search;
          
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`relative flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 overflow-hidden min-w-max ${
                isActive ? 'text-black' : 'text-white/60 hover:text-white glass-card hover:bg-white/10'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="travelFilter"
                  className="absolute inset-0 bg-white"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2 capitalize">
                {type !== 'all' && <TypeIcon className="w-4 h-4" />}
                {type}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Routes List */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-32 glass-card rounded-3xl"
          >
            <Plane className="w-16 h-16 text-white/20 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-2">No routes found</h3>
            <p className="text-white/40">Try adjusting your travel preferences.</p>
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            className="flex flex-col gap-6"
          >
            {filtered.map((route, i) => {
              const config = typeConfig[route.type] || typeConfig.bus;
              const Icon = config.icon;

              return (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  key={route.id}
                  onClick={() => navigate(`/travel/${route.id}`)}
                  className="group relative glass-card p-6 overflow-hidden cursor-pointer hover:border-white/30 transition-colors"
                >
                  <div className="absolute top-0 right-0 p-16 bg-gradient-to-bl from-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
                    
                    {/* Left Side - Operator & Type */}
                    <div className="w-full lg:w-48 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${config.glow}`}>
                        <Icon className={`w-6 h-6 ${config.color}`} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white/40 tracking-widest uppercase mb-1">{route.type}</div>
                        <div className="text-white font-medium truncate">{route.operator}</div>
                      </div>
                    </div>

                    {/* Middle - Timeline */}
                    <div className="flex-1 w-full flex items-center justify-between px-4 lg:px-12 relative">
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <div className="text-xs font-medium text-white/40 mb-1">{calculateDuration(route.departureTime, route.arrivalTime)}</div>
                        <div className="w-32 h-[1px] bg-white/20 relative">
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20">
                             <Icon className="w-4 h-4" />
                          </div>
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/50" />
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/50" />
                        </div>
                      </div>

                      <div className="text-center lg:text-left">
                        <div className="text-3xl font-black text-white mb-1">
                          {new Date(route.departureTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-sm font-medium text-white/60">{route.source}</div>
                        <div className="text-xs text-white/40 mt-1">
                          {new Date(route.departureTime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>

                      <div className="text-center lg:text-right">
                        <div className="text-3xl font-black text-white mb-1">
                          {new Date(route.arrivalTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-sm font-medium text-white/60">{route.destination}</div>
                        <div className="text-xs text-white/40 mt-1">
                          {new Date(route.arrivalTime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    {/* Right - Price & Action */}
                    <div className="w-full lg:w-48 flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-8">
                       <div className="text-left lg:text-right">
                         <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Price</div>
                         <div className="text-3xl font-black text-cyan-neon group-hover:scale-110 origin-right transition-transform">₹{route.price}</div>
                       </div>
                       
                       <div className="flex items-center gap-2 mt-0 lg:mt-4">
                         <div className="text-sm font-medium text-white/60">
                           <span className="text-white font-bold">{route.availableSeats}</span> seats
                         </div>
                         <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                           <ArrowRight className="w-4 h-4 text-white" />
                         </div>
                       </div>
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