import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { login } from '../api/auth';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Ticket, ArrowRight, Loader2, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login({ email, password });
      const profileRes = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${data.accessToken}` }
      });
      setAuth(data.accessToken, profileRes.data);
      navigate('/');
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#030303] overflow-hidden">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md glass-card p-10 relative overflow-hidden"
        >
          {/* Subtle glow inside card */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-electric/20 rounded-full blur-[60px]" />

          <Link to="/" className="inline-flex items-center gap-2 mb-10 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-neon to-blue-electric flex items-center justify-center">
              <Ticket className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">NovaTix</span>
          </Link>

          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/50 mb-8">Access your premium booking dashboard.</p>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="space-y-1">
              <label className="text-sm font-medium text-white/70 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-white/40 group-focus-within:text-cyan-neon transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-neon/50 focus:border-cyan-neon/50 transition-all"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-medium text-white/70">Password</label>
                <Link to="#" className="text-xs text-cyan-neon hover:text-cyan-300 transition-colors">Forgot password?</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/40 group-focus-within:text-cyan-neon transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-neon/50 focus:border-cyan-neon/50 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 relative group overflow-hidden rounded-xl bg-white text-black font-semibold py-3.5 transition-transform active:scale-[0.98] disabled:opacity-70"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center justify-center gap-2 group-hover:text-white transition-colors">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </div>
            </button>
          </form>

          <p className="text-center text-sm text-white/50 mt-8 relative z-10">
            Don't have an account?{' '}
            <Link to="/register" className="text-white hover:text-cyan-neon font-medium transition-colors">
              Request Access
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right side - Abstract Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-[#0a0a0a]">
        {/* Dynamic Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-electric/10 to-purple-neon/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-neon/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-neon/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '6s' }} />
        
        {/* Futuristic elements */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative w-[500px] h-[500px] flex items-center justify-center"
        >
          <div className="absolute inset-0 border border-white/5 rounded-full animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-10 border border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
          <div className="absolute inset-24 border border-cyan-neon/20 rounded-full animate-[spin_10s_linear_infinite]" />
          
          <div className="glass-card p-8 flex flex-col items-center justify-center relative z-10 animate-[bounce_4s_ease-in-out_infinite]">
             <Ticket className="w-16 h-16 text-white mb-4" />
             <div className="text-xl font-bold text-white text-center">Seamless Entry</div>
             <div className="text-sm text-white/50">To the world's best events</div>
          </div>
        </motion.div>

        {/* Floating cards */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-20 left-20 glass p-4 rounded-xl flex items-center gap-4"
        >
           <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
           </div>
           <div>
             <div className="text-white text-sm font-bold">System Online</div>
             <div className="text-white/50 text-xs">All nodes operational</div>
           </div>
        </motion.div>
      </div>
    </div>
  );
}