import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, ChevronRight, Ticket, Film, Plane, Calendar, Zap, Shield, Star } from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="w-full flex flex-col items-center" ref={containerRef}>
      
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center px-6 pt-20 overflow-hidden">
        
        {/* Animated Background Mesh */}
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
          <div className="absolute w-[800px] h-[800px] bg-gradient-to-tr from-cyan-neon/20 via-blue-electric/10 to-purple-neon/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
        </motion.div>

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 mb-8"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-neon opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-neon"></span>
            </span>
            <span className="text-sm font-medium text-white/80">Experience the Future of Ticketing</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-tight"
          >
            <span className="text-white block">Book Beyond</span>
            <span className="text-gradient block">Imagination.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/50 max-w-2xl mb-10 font-light"
          >
            Cinematic premieres, exclusive events, and luxury travel. One unified platform built for the modern world.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 items-center"
          >
            <Link
              to={isAuthenticated() ? "/events" : "/register"}
              className="relative group px-8 py-4 rounded-2xl bg-white text-black font-semibold text-lg overflow-hidden transition-all hover:scale-105"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity" />
              <span className="relative flex items-center gap-2">
                Explore Now <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            
            <button className="flex items-center gap-3 px-8 py-4 rounded-2xl glass font-medium text-white hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                <Play className="w-4 h-4 ml-1" />
              </div>
              Watch Reel
            </button>
          </motion.div>
        </div>
      </section>

      {/* Floating Interactive Cards - Preview Section */}
      <section className="relative w-full max-w-7xl mx-auto px-6 py-20 z-20 -mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Film, title: "Cinematic Experiences", color: "from-purple-500/20 to-blue-500/20", border: "border-purple-500/30" },
            { icon: Calendar, title: "Exclusive Concerts", color: "from-cyan-500/20 to-blue-500/20", border: "border-cyan-500/30" },
            { icon: Plane, title: "First-Class Travel", color: "from-blue-500/20 to-indigo-500/20", border: "border-blue-500/30" }
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`glass-card p-8 bg-gradient-to-br ${item.color} border ${item.border} backdrop-blur-2xl group cursor-pointer`}
            >
              <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-white/50">Immersive booking experiences designed for the elite class.</p>
              <div className="mt-6 flex items-center text-sm font-medium text-white/80 group-hover:text-cyan-neon transition-colors">
                Book Now <ChevronRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="w-full max-w-7xl mx-auto px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Engineered for <span className="text-gradient">Perfection</span></h2>
          <p className="text-white/50 max-w-2xl mx-auto">Every detail meticulously crafted to provide an unparalleled booking journey.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">
          {/* Feature 1 - Large */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 md:row-span-2 glass-card p-8 flex flex-col relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 w-full h-full bg-gradient-to-bl from-blue-electric/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Zap className="w-10 h-10 text-cyan-neon mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4 z-10">Lightning Fast Architecture</h3>
            <p className="text-white/60 text-lg max-w-md z-10">Powered by the latest edge computing technologies ensuring zero latency and instant confirmations.</p>
            
            {/* Abstract visual */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full border border-white/10 flex items-center justify-center">
               <div className="w-60 h-60 rounded-full border border-white/20 flex items-center justify-center">
                 <div className="w-40 h-40 rounded-full border border-cyan-neon/30 animate-[spin_10s_linear_infinite]" />
               </div>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 glass-card p-8 relative overflow-hidden group"
          >
             <Shield className="w-8 h-8 text-purple-neon mb-4" />
             <h3 className="text-xl font-bold text-white mb-2">Enterprise Security</h3>
             <p className="text-white/50">Military-grade encryption for all transactions and personal data.</p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 flex flex-col justify-end relative overflow-hidden group"
          >
             <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent z-0" />
             <div className="relative z-10">
               <Ticket className="w-8 h-8 text-blue-400 mb-4" />
               <h3 className="text-xl font-bold text-white mb-2">Smart Ticketing</h3>
               <p className="text-white/50 text-sm">Dynamic QR codes that update in real-time.</p>
             </div>
          </motion.div>

          {/* Feature 4 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 flex flex-col justify-end relative overflow-hidden group"
          >
             <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent z-0" />
             <div className="relative z-10">
               <Star className="w-8 h-8 text-yellow-400 mb-4" />
               <h3 className="text-xl font-bold text-white mb-2">VIP Access</h3>
               <p className="text-white/50 text-sm">Priority booking and exclusive lounge access.</p>
             </div>
          </motion.div>

        </div>
      </section>
      
      {/* Footer minimal */}
      <footer className="w-full border-t border-white/10 mt-20 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
           <div className="flex items-center gap-2 mb-4 md:mb-0">
             <Ticket className="w-5 h-5 text-blue-electric" />
             <span className="text-xl font-bold text-white">NovaTix</span>
           </div>
           <p className="text-white/30 text-sm">© 2026 NovaTix Inc. Designed for the Future.</p>
        </div>
      </footer>
    </div>
  );
}