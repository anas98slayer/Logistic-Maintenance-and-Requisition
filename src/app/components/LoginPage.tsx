import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { LogIn, Loader2, AlertCircle, UserPlus, Truck, Lock, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginPageProps {
  onSwitchToSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await api.post<any>('/auth/login', { email, password });
      login(response.token, response.user);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background font-['Outfit',sans-serif]">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 -left-40 h-96 w-96 rounded-full bg-primary/20 blur-[100px]" />
      <div className="absolute bottom-0 -right-40 h-96 w-96 rounded-full bg-primary/20 blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[80px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 w-full max-w-[440px] px-6"
      >
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-2xl backdrop-blur-xl sm:p-12">
          {/* Subtle reflection effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

          <div className="relative space-y-8">
            <div className="text-center">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30"
              >
                <Truck size={32} />
              </motion.div>
              <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-900 leading-none">
                FLEET<br/><span className="text-indigo-600">PRO</span>
              </h2>
              <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                Logistics & Maintenance
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-3 rounded-xl bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20"
                  >
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                <div className="group relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground transition-colors group-focus-within:text-primary">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    className="block w-full rounded-2xl border border-border bg-input-background py-3.5 pl-12 pr-4 text-foreground placeholder:text-muted-foreground outline-none ring-1 ring-transparent transition-all hover:bg-accent focus:border-primary/50 focus:ring-primary/20 sm:text-sm"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="group relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground transition-colors group-focus-within:text-primary">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-2xl border border-border bg-input-background py-3.5 pl-12 pr-4 text-foreground placeholder:text-muted-foreground outline-none ring-1 ring-transparent transition-all hover:bg-accent focus:border-primary/50 focus:ring-primary/20 sm:text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="h-4 w-4 rounded border-border bg-input-background text-primary focus:ring-primary focus:ring-offset-0" />
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                  Forgot password?
                </a>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="relative flex w-full justify-center rounded-2xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 outline-none transition-all hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-70 disabled:grayscale-[0.5]"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Sign In to Account"
                )}
              </motion.button>
            </form>
          </div>
        </div>
        
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Not access authorized? <a href="#" onClick={onSwitchToSignup} className="font-semibold text-primary hover:text-primary/80">Join Technical Fleet</a>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;

