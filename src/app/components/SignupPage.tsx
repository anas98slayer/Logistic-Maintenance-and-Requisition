import React, { useState } from 'react';
import { api } from '../lib/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { UserPlus, Loader2, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface SignupPageProps {
  onSwitchToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await api.post('/auth/register', { ...formData, role: 'TECHNICIAN' });
      setIsSuccess(true);
      setTimeout(() => onSwitchToLogin(), 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. The technician limit may have been reached.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 font-sans">
        <Card className="w-full max-w-md p-8 border-none shadow-2xl rounded-3xl text-center space-y-6 animate-in zoom-in duration-500">
           <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
           </div>
           <div>
              <h2 className="text-2xl font-bold text-slate-900">FleetPro Registered!</h2>
              <p className="text-slate-500 mt-2">Your technician profile has been created successfully. Redirecting to login...</p>
           </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <Card className="w-full max-w-md p-0 border-none shadow-2xl rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-500">
        {/* Banner */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <UserPlus className="w-24 h-24 rotate-12 text-white" />
          </div>
          <div className="relative z-10">
             <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
                <UserPlus className="w-8 h-8" />
             </div>
             <h2 className="text-2xl font-bold tracking-tight">Technician Enrollment</h2>
             <p className="text-blue-100 text-sm mt-1">Join the FleetPro Maintenance Network</p>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-600 animate-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Full Operator Name</Label>
              <Input
                type="text"
                required
                className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:ring-blue-500"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Fleet Email</Label>
              <Input
                type="email"
                required
                className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:ring-blue-500"
                placeholder="operator@company.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Security Passcode</Label>
              <Input
                type="password"
                required
                className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:ring-blue-500"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Digital Enrollment"}
            </Button>
          </form>

          <div className="pt-4 text-center">
             <Button 
                variant="ghost" 
                onClick={onSwitchToLogin}
                className="text-slate-500 hover:text-slate-900 font-bold text-sm h-11 w-full rounded-xl gap-2"
             >
                <ArrowLeft className="w-4 h-4" />
                Return to Login
             </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SignupPage;
