import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, ArrowRight, Loader2, Mail, Lock, User, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pwdStrength, setPwdStrength] = useState(0);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    let score = 0;
    if (password.length > 5) score += 25;
    if (password.length > 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 25;
    setPwdStrength(score);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await register({ fullName, email, password });
      const profileRes = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${data.accessToken}` }
      });
      setAuth(data.accessToken, profileRes.data);
      navigate('/');
    } catch {
      setError('Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#030303] overflow-hidden">
      
      {/* Left side - Abstract Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-[#0a0a0a] order-2 lg:order-1 border-r border-white/5">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-neon/10 to-blue-electric/10" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-neon/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '5s' }} />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-cyan-neon/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '7s' }} />
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 w-full max-w-lg px-12"
        >
          <div className="glass-card p-10 border-white/10 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 w-full h-full bg-gradient-to-bl from-white/5 to-transparent pointer-events-none" />
             <ShieldCheck className="w-12 h-12 text-purple-neon mb-6" />
             <h2 className="text-3xl font-bold text-white mb-4">Elite Access</h2>
             <p className="text-white/60 mb-8 text-lg">Join the world's most exclusive ticketing platform. Secure, fast, and beautifully designed.</p>
             
             <div className="space-y-4">
                {[
                  { label: "Military-grade encryption", active: true },
                  { label: "Zero-latency booking", active: true },
                  { label: "Priority VIP access", active: true }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-neon/20 flex items-center justify-center border border-cyan-neon/50">
                      <div className="w-2 h-2 rounded-full bg-cyan-neon" />
                    </div>
                    <span className="text-white/80">{item.label}</span>
                  </div>
                ))}
             </div>
          </div>
        </motion.div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10 order-1 lg:order-2">
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md glass-card p-10 relative overflow-hidden"
        >
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-neon/20 rounded-full blur-[60px]" />

          <div className="flex justify-between items-center mb-10">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-neon to-cyan-neon flex items-center justify-center">
                <Ticket className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">NovaTix</span>
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">Request Access</h1>
          <p className="text-white/50 mb-8">Create your premium account.</p>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="space-y-1">
              <label className="text-sm font-medium text-white/70 ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-white/40 group-focus-within:text-purple-neon transition-colors" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-neon/50 focus:border-purple-neon/50 transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-white/70 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-white/40 group-focus-within:text-purple-neon transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-neon/50 focus:border-purple-neon/50 transition-all"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-white/70 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/40 group-focus-within:text-purple-neon transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-neon/50 focus:border-purple-neon/50 transition-all"
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
                />
              </div>
              
              {/* Password Strength Indicator */}
              <div className="pt-2 px-1">
                <div className="flex gap-1 h-1.5 w-full">
                  {[25, 50, 75, 100].map((step) => (
                    <div 
                      key={step} 
                      className={`flex-1 rounded-full transition-all duration-500 ${
                        pwdStrength >= step 
                          ? step <= 25 ? 'bg-red-500' : step <= 50 ? 'bg-yellow-500' : step <= 75 ? 'bg-blue-500' : 'bg-cyan-neon'
                          : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 relative group overflow-hidden rounded-xl bg-white text-black font-semibold py-3.5 transition-transform active:scale-[0.98] disabled:opacity-70"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center justify-center gap-2 group-hover:text-white transition-colors">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </div>
            </button>
          </form>

          <p className="text-center text-sm text-white/50 mt-8 relative z-10">
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:text-purple-neon font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}