import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, Ticket, TrendingUp, Activity, Plus, Search, Filter, MoreVertical, DollarSign, Calendar, Plane, Trash2, Image as ImageIcon } from 'lucide-react';
import { getEvents, createEvent, deleteEvent } from '../api/events';
import { getRoutes, createRoute, deleteRoute } from '../api/Routes';
import { Event, Route } from '../types';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">Admin <span className="text-gradient">Control</span></h1>
          <p className="text-white/50 text-lg">Enterprise Management System</p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4 overflow-x-auto hide-scrollbar">
        {['overview', 'events', 'travel'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all whitespace-nowrap ${
              activeTab === tab ? 'bg-white/10 text-cyan-neon border border-cyan-neon/30 shadow-[0_0_15px_rgba(0,240,255,0.1)]' : 'text-white/50 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'events' && <EventsTab />}
      {activeTab === 'travel' && <TravelTab />}
    </div>
  );
}

function OverviewTab() {
  const [events, setEvents] = useState<Event[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getEvents(), getRoutes()]).then(([e, r]) => {
      setEvents(e);
      setRoutes(r);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-white/50">Loading overview...</div>;

  const totalEventRevenue = events.reduce((acc, ev) => acc + ((ev.totalSeats - ev.availableSeats) * ev.price), 0);
  const totalRouteRevenue = routes.reduce((acc, r) => acc + ((r.totalSeats - r.availableSeats) * r.price), 0);
  const totalRevenue = totalEventRevenue + totalRouteRevenue;

  const eventTicketsSold = events.reduce((acc, ev) => acc + (ev.totalSeats - ev.availableSeats), 0);
  const routeTicketsSold = routes.reduce((acc, r) => acc + (r.totalSeats - r.availableSeats), 0);
  const totalTicketsSold = eventTicketsSold + routeTicketsSold;

  const activeUsers = 124; // This would come from a real users API

  const revenueData = [
    { name: 'Last Month', value: totalRevenue * 0.4 },
    { name: 'This Month', value: totalRevenue * 0.6 },
    { name: 'Current', value: totalRevenue },
  ];

  const salesData = [
    { name: 'Movies', tickets: events.filter(e => e.category === 'movie').reduce((acc, ev) => acc + (ev.totalSeats - ev.availableSeats), 0) },
    { name: 'Concerts', tickets: events.filter(e => e.category === 'concert').reduce((acc, ev) => acc + (ev.totalSeats - ev.availableSeats), 0) },
    { name: 'Sports', tickets: events.filter(e => e.category === 'sports').reduce((acc, ev) => acc + (ev.totalSeats - ev.availableSeats), 0) },
    { name: 'Travel', tickets: routeTicketsSold },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Active Users', value: activeUsers.toLocaleString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Tickets Sold', value: totalTicketsSold.toLocaleString(), icon: Ticket, color: 'text-purple-400', bg: 'bg-purple-400/10' },
          { label: 'Growth Rate', value: '+24.5%', icon: TrendingUp, color: 'text-cyan-neon', bg: 'bg-cyan-neon/10' },
        ].map((stat, i) => (
          <div key={stat.label} className="glass-card p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white">Revenue Analytics</h3>
            <button className="text-xs font-bold text-cyan-neon uppercase tracking-widest hover:text-white transition-colors">Export Report</button>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#00F0FF' }}
                />
                <Area type="monotone" dataKey="value" stroke="#00F0FF" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-8">Sales by Category</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.6)" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="tickets" fill="#C084FC" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EventsTab() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '', description: '', category: 'movie', venue: '', eventDate: '', totalSeats: 100, price: 500, imageUrl: ''
  });

  const loadEvents = () => {
    setLoading(true);
    getEvents().then(setEvents).finally(() => setLoading(false));
  };

  useEffect(() => { loadEvents(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEvent({
        ...formData,
        availableSeats: formData.totalSeats || 100,
        isActive: true,
      } as Omit<Event, 'id'>);
      loadEvents();
      alert('Event created successfully!');
    } catch (err) {
      alert('Error creating event');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete event?')) return;
    try {
      await deleteEvent(id);
      loadEvents();
    } catch (err) {
      alert('Error deleting event');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Create Form */}
      <div className="glass-card p-6 h-fit">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cyan-neon" /> Add New Event
        </h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Title</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-neon" />
          </div>
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Category</label>
            <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-neon">
              <option value="movie">Movie</option>
              <option value="concert">Concert</option>
              <option value="sports">Sports</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Venue</label>
            <input required type="text" value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-neon" />
          </div>
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Date & Time</label>
            <input required type="datetime-local" value={formData.eventDate} onChange={e => setFormData({...formData, eventDate: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-neon" style={{ colorScheme: 'dark' }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Price (₹)</label>
              <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-neon" />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Total Seats</label>
              <input required type="number" value={formData.totalSeats} onChange={e => setFormData({...formData, totalSeats: Number(e.target.value)})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-neon" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Image URL
            </label>
            <input type="url" placeholder="https://..." value={formData.imageUrl || ''} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-neon" />
            {formData.imageUrl && <img src={formData.imageUrl} alt="preview" className="mt-4 rounded-lg h-32 w-full object-cover border border-white/10" />}
          </div>
          <button type="submit" className="w-full bg-cyan-neon text-black font-bold py-3 rounded-xl hover:bg-white transition-colors mt-4 flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> Publish Event
          </button>
        </form>
      </div>

      {/* Events List */}
      <div className="lg:col-span-2 glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-6">Manage Events</h3>
        {loading ? <p className="text-white/50">Loading...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map(event => (
              <div key={event.id} className="bg-black/40 border border-white/10 rounded-2xl p-4 flex gap-4 hover:border-white/30 transition-colors">
                <div className="w-20 h-20 rounded-xl bg-white/5 shrink-0 overflow-hidden border border-white/10">
                  {event.imageUrl ? (
                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      {event.category === 'movie' ? '🎬' : '🎵'}
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h4 className="font-bold text-white text-sm line-clamp-1">{event.title}</h4>
                    <p className="text-white/40 text-xs mt-1">{new Date(event.eventDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-cyan-neon font-bold text-sm">₹{event.price}</span>
                    <button onClick={() => handleDelete(event.id)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TravelTab() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<Route>>({
    type: 'flight', operator: '', source: '', destination: '', departureTime: '', arrivalTime: '', totalSeats: 60, price: 4500
  });

  const loadRoutes = () => {
    setLoading(true);
    getRoutes().then(setRoutes).finally(() => setLoading(false));
  };

  useEffect(() => { loadRoutes(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRoute({
        ...formData,
        availableSeats: formData.totalSeats || 60,
        isActive: true,
      } as Omit<Route, 'id'>);
      loadRoutes();
      alert('Route created successfully!');
    } catch (err) {
      alert('Error creating route');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete route?')) return;
    try {
      await deleteRoute(id);
      loadRoutes();
    } catch (err) {
      alert('Error deleting route');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Create Form */}
      <div className="glass-card p-6 h-fit">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Plane className="w-5 h-5 text-purple-neon" /> Add New Route
        </h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Type</label>
            <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-neon">
              <option value="flight">Flight</option>
              <option value="train">Train</option>
              <option value="bus">Bus</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Operator (Airline/Bus Co)</label>
            <input required type="text" value={formData.operator} onChange={e => setFormData({...formData, operator: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-neon" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">From</label>
              <input required type="text" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-neon" />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">To</label>
              <input required type="text" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-neon" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Departure Time</label>
              <input required type="datetime-local" value={formData.departureTime} onChange={e => setFormData({...formData, departureTime: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-neon" style={{ colorScheme: 'dark' }} />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Arrival Time</label>
              <input required type="datetime-local" value={formData.arrivalTime} onChange={e => setFormData({...formData, arrivalTime: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-neon" style={{ colorScheme: 'dark' }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Price (₹)</label>
              <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-neon" />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Total Seats</label>
              <input required type="number" value={formData.totalSeats} onChange={e => setFormData({...formData, totalSeats: Number(e.target.value)})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-neon" />
            </div>
          </div>
          <button type="submit" className="w-full bg-purple-neon text-white font-bold py-3 rounded-xl hover:bg-white hover:text-black transition-colors mt-4 flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> Launch Route
          </button>
        </form>
      </div>

      {/* Routes List */}
      <div className="lg:col-span-2 glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-6">Manage Routes</h3>
        {loading ? <p className="text-white/50">Loading...</p> : (
          <div className="flex flex-col gap-4">
            {routes.map(route => (
              <div key={route.id} className="bg-black/40 border border-white/10 rounded-2xl p-5 flex items-center justify-between hover:border-white/30 transition-colors">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-purple-neon/10 border border-purple-neon/30 flex items-center justify-center">
                    <Plane className="w-6 h-6 text-purple-neon" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white text-lg">{route.source}</span>
                      <span className="text-white/30">→</span>
                      <span className="font-bold text-white text-lg">{route.destination}</span>
                    </div>
                    <p className="text-white/50 text-sm mt-1">{route.operator} • {new Date(route.departureTime).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <div className="text-purple-neon font-bold text-lg">₹{route.price}</div>
                    <div className="text-white/40 text-xs">{route.availableSeats} seats</div>
                  </div>
                  <button onClick={() => handleDelete(route.id)} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
