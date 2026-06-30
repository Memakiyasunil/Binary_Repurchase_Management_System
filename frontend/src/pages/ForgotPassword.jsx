import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';

const STEPS = { EMAIL: 'email', OTP: 'otp', PASSWORD: 'password', SUCCESS: 'success' };

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true); setError('');
    try {
      const r = await fetch(`http://${window.location.hostname}:5000/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message);
      setStep(STEPS.OTP);
    } catch (err) { setError(err.message); }
    setIsLoading(false);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otp.length !== 6) return setError('Please enter a valid 6-digit OTP');
    setError('');
    setStep(STEPS.PASSWORD);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return setError('Passwords do not match');
    if (newPassword.length < 6) return setError('Password must be at least 6 characters');
    setIsLoading(true); setError('');
    try {
      const r = await fetch(`http://${window.location.hostname}:5000/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message);
      setStep(STEPS.SUCCESS);
    } catch (err) { setError(err.message); }
    setIsLoading(false);
  };

  const inputClass = "w-full bg-white/80 border border-white/40 rounded-xl px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d2d1e] via-[#103A26] to-[#0a2016] flex items-center justify-center p-4">
      {/* Animated BG Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{ width: `${(i + 1) * 80}px`, height: `${(i + 1) * 80}px`, background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)', top: `${20 + i * 10}%`, left: `${10 + i * 15}%` }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.6 }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          
          {/* Back to Login */}
          <Link to="/login" className="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={14} /> Back to Login
          </Link>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/20 flex items-center justify-center">
              <ShieldCheck className="text-amber-400" size={28} />
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[STEPS.EMAIL, STEPS.OTP, STEPS.PASSWORD].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s ? 'bg-amber-400 text-white scale-110' :
                  (Object.values(STEPS).indexOf(step) > i ? 'bg-emerald-500 text-white' : 'bg-white/20 text-white/40')
                }`}>
                  {Object.values(STEPS).indexOf(step) > i ? '✓' : i + 1}
                </div>
                {i < 2 && <div className={`w-8 h-0.5 rounded ${Object.values(STEPS).indexOf(step) > i ? 'bg-emerald-500' : 'bg-white/20'}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Email */}
            {step === STEPS.EMAIL && (
              <motion.div key="email" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-serif font-bold text-white mb-2 text-center">Forgot Password?</h2>
                <p className="text-white/60 text-sm text-center mb-6">Enter your registered email to receive a reset OTP</p>
                {error && <div className="bg-red-500/20 text-red-300 text-sm p-3 rounded-xl mb-4 text-center">{error}</div>}
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required className={`${inputClass} pl-11 text-white`} />
                  </div>
                  <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3.5 rounded-xl font-bold text-sm hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-60 shadow-lg">
                    {isLoading ? 'Sending OTP...' : 'Send Reset OTP'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Step 2: OTP */}
            {step === STEPS.OTP && (
              <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-serif font-bold text-white mb-2 text-center">Enter OTP</h2>
                <p className="text-white/60 text-sm text-center mb-6">We sent a 6-digit code to <span className="text-amber-400 font-semibold">{email}</span></p>
                {error && <div className="bg-red-500/20 text-red-300 text-sm p-3 rounded-xl mb-4 text-center">{error}</div>}
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <input
                    type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className={`${inputClass} text-white text-center text-2xl tracking-[12px] font-bold`}
                  />
                  <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3.5 rounded-xl font-bold text-sm hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg">
                    Verify OTP
                  </button>
                  <button type="button" onClick={handleSendOTP} className="w-full text-white/50 hover:text-white text-xs py-2 transition-colors">
                    Resend OTP
                  </button>
                </form>
              </motion.div>
            )}

            {/* Step 3: New Password */}
            {step === STEPS.PASSWORD && (
              <motion.div key="pass" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-serif font-bold text-white mb-2 text-center">New Password</h2>
                <p className="text-white/60 text-sm text-center mb-6">Create a new strong password for your account</p>
                {error && <div className="bg-red-500/20 text-red-300 text-sm p-3 rounded-xl mb-4 text-center">{error}</div>}
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                    <input type={showPass ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password" required minLength={6} className={`${inputClass} pl-11 pr-11 text-white`} />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" required className={`${inputClass} pl-11 text-white`} />
                  </div>
                  <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3.5 rounded-xl font-bold text-sm hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-60 shadow-lg">
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === STEPS.SUCCESS && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                  className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="text-emerald-400" size={40} />
                </motion.div>
                <h2 className="text-2xl font-serif font-bold text-white mb-2">Password Reset!</h2>
                <p className="text-white/60 text-sm mb-8">Your password has been successfully reset. You can now log in with your new password.</p>
                <button onClick={() => navigate('/login')} className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg">
                  Back to Login
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
