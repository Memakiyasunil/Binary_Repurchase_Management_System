import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../features/auth/authSlice';
import Modal from '../components/Modal';
import { UserPlus, Mail, Lock, User, Hash, AlertCircle, EyeOff, Eye, CheckCircle2, ShieldCheck, Globe, ChevronDown, BarChart3, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    sponsorId: '',
    placement: 'Left',
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    otp: ''
  });

  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const { sponsorId, placement, username, firstName, lastName, email, password, otp } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message, isOtpSent } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Registration Error',
        message: message
      });
      dispatch(reset());
    }

    if (isSuccess && user) {
      navigate('/dashboard');
    }
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      sponsorId,
      placement,
      username,
      firstName,
      lastName,
      email,
      password,
      ...(isOtpSent && { otp })
    };

    dispatch(register(userData));
  };

  return (
    <>
      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
      />

      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 font-sans bg-[#FDFBF7]">

        {/* Left Side: Graphic Banner (Hidden on Mobile/Tablet) */}
        <div className="hidden lg:flex flex-col relative bg-gradient-to-br from-[#0a1e14] to-[#123122] overflow-hidden justify-between p-12">

          {/* Subtle World Map / Network Background overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #D97706 0%, transparent 70%)', mixBlendMode: 'screen' }}></div>

          <div className="relative z-10 flex flex-col items-center justify-center flex-grow">
            <motion.img
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              src="/logo.png"
              alt="Binary Repurchase Logo"
              className="w-48 xl:w-64 object-contain mb-8 drop-shadow-2xl"
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-center mb-12"
            >
              <h1 className="text-3xl xl:text-4xl font-serif font-bold text-white tracking-widest mb-2">BINARY REPURCHASE</h1>
              <p className="text-amber-gold tracking-[0.2em] text-[10px] xl:text-xs font-bold uppercase mb-4">MLM Management System</p>
              <p className="text-white/60 tracking-widest text-[8px] xl:text-[10px] font-bold uppercase">Grow Together • Earn Together • Succeed Together</p>
            </motion.div>

            {/* Podium Graphic Placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="w-full max-w-sm h-48 relative mb-10 flex items-end justify-center"
            >
              {/* Gold Podium */}
              <div className="w-[80%] h-12 bg-gradient-to-t from-amber-gold/20 to-amber-gold/50 rounded-[50%] absolute bottom-0 blur-[2px]"></div>
              <div className="w-[70%] h-8 bg-gradient-to-t from-amber-gold to-copper rounded-[50%] absolute bottom-4 shadow-[0_0_40px_rgba(217,119,6,0.5)]"></div>

              {/* Trending Arrow */}
              <svg className="absolute bottom-12 w-[120%] h-32 left-[-10%] pointer-events-none" viewBox="0 0 200 100" fill="none">
                <path d="M10 80 Q 50 60 90 70 T 180 20" stroke="#D97706" strokeWidth="4" strokeLinecap="round" fill="none" />
                <polygon points="175,15 190,15 185,30" fill="#D97706" transform="rotate(15 180 20)" />
              </svg>
            </motion.div>
          </div>

          {/* Bottom Features */}
          <div className="relative z-10 grid grid-cols-3 gap-4 text-center mt-auto">
            <div className="flex flex-col items-center">
              <ShieldCheck className="text-amber-gold mb-2" size={24} />
              <p className="text-white font-bold text-xs uppercase tracking-wider mb-1">Secure</p>
              <p className="text-white/50 text-[10px]">Advanced Security Protection</p>
            </div>
            <div className="flex flex-col items-center">
              <BarChart3 className="text-amber-gold mb-2" size={24} />
              <p className="text-white font-bold text-xs uppercase tracking-wider mb-1">Reliable</p>
              <p className="text-white/50 text-[10px]">Real-time Analytics & Reports</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="text-amber-gold mb-2" size={24} />
              <p className="text-white font-bold text-xs uppercase tracking-wider mb-1">Grow Together</p>
              <p className="text-white/50 text-[10px]">Strong Network Stronger Future</p>
            </div>
          </div>

          {/* Floating Security Badge */}
          <div className="absolute bottom-6 right-6 bg-[#E8F0E8] rounded-xl px-4 py-2 flex items-center gap-3 shadow-xl">
            <ShieldCheck className="text-[#2F523B]" size={20} />
            <div>
              <p className="text-[#2F523B] font-bold text-[10px] leading-tight">Your security is our priority</p>
              <p className="text-[#2F523B]/70 text-[9px] font-medium leading-tight">256-bit SSL Encrypted Connection</p>
            </div>
          </div>
        </div>

        {/* Right Side: The Form Engine */}
        <div className="flex flex-col relative overflow-y-auto w-full max-w-[100vw]">

          {/* Top Right Language Selector */}
          {/* <div className="absolute top-6 right-6 z-20 hidden sm:block">
            <button className="bg-white border border-beige-soft px-4 py-2 rounded-full flex items-center gap-2 text-sm text-brown-dark font-medium shadow-sm hover:bg-ivory transition-colors">
              <Globe size={16} className="text-amber-gold" />
              English
              <ChevronDown size={14} className="text-brown-dark/50" />
            </button>
          </div> */}

          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 w-full mt-6 lg:mt-0">

            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-6">
              <img src="/logo.png" alt="Binary Repurchase Logo" className="h-16 mx-auto object-contain mb-2" />
            </div>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white w-full max-w-[560px] rounded-[32px] p-6 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-beige-soft/30 relative"
            >

              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#103A26] mb-2">Apply for Access</h2>
                <p className="text-gray-500 text-sm">Join the world's leading enterprise MLM platform.</p>
                <div className="flex items-center justify-center gap-4 mt-4 mb-2">
                  <div className="h-px w-12 bg-beige-soft"></div>
                  <div className="w-2 h-2 rotate-45 bg-amber-gold"></div>
                  <div className="h-px w-12 bg-beige-soft"></div>
                </div>
              </div>

              {isOtpSent && (
                <div className="mb-6 p-4 bg-amber-gold/10 border border-amber-gold/30 rounded-2xl flex items-center gap-3 animate-fade-in">
                  <AlertCircle className="text-amber-gold shrink-0" size={20} />
                  <p className="text-xs font-medium text-[#103A26]/80 leading-tight">
                    Verification email sent to <strong className="text-[#103A26]">{email}</strong>. Enter OTP below.
                  </p>
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#103A26]/70 pl-1">Sponsor ID</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <div className="bg-[#F4EFE6] p-1.5 rounded-lg text-amber-gold group-focus-within:bg-amber-gold group-focus-within:text-white transition-colors">
                          <Hash size={14} />
                        </div>
                      </div>
                      <input
                        type="text"
                        name="sponsorId"
                        value={sponsorId}
                        onChange={onChange}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-[#103A26] focus:border-emerald-deep focus:ring-1 focus:ring-emerald-deep transition-all font-medium text-[16px] sm:text-sm outline-none"
                        placeholder="e.g. USER123"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#103A26]/70 pl-1">Placement</label>
                    <select
                      name="placement"
                      value={placement}
                      onChange={onChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#103A26] focus:border-emerald-deep focus:ring-1 focus:ring-emerald-deep transition-all font-medium text-[16px] sm:text-sm outline-none appearance-none bg-white"
                    >
                      <option value="Left">Left Leg</option>
                      <option value="Right">Right Leg</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#103A26]/70 pl-1">Username</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <div className="bg-[#F4EFE6] p-1.5 rounded-lg text-amber-gold group-focus-within:bg-amber-gold group-focus-within:text-white transition-colors">
                        <User size={14} />
                      </div>
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={username}
                      onChange={onChange}
                      className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 text-[#103A26] focus:border-emerald-deep focus:ring-1 focus:ring-emerald-deep transition-all font-medium text-[16px] sm:text-sm outline-none"
                      placeholder="Choose a unique username"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-emerald-success">
                      {username.length > 2 && <CheckCircle2 size={16} />}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#103A26]/70 pl-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={firstName}
                      onChange={onChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#103A26] focus:border-emerald-deep focus:ring-1 focus:ring-emerald-deep transition-all font-medium text-[16px] sm:text-sm outline-none"
                      placeholder="First Name"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#103A26]/70 pl-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={lastName}
                      onChange={onChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#103A26] focus:border-emerald-deep focus:ring-1 focus:ring-emerald-deep transition-all font-medium text-[16px] sm:text-sm outline-none"
                      placeholder="Last Name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#103A26]/70 pl-1">Email</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <div className="bg-[#F4EFE6] p-1.5 rounded-lg text-amber-gold group-focus-within:bg-amber-gold group-focus-within:text-white transition-colors">
                        <Mail size={14} />
                      </div>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={onChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-[#103A26] focus:border-emerald-deep focus:ring-1 focus:ring-emerald-deep transition-all font-medium text-[16px] sm:text-sm outline-none"
                      placeholder="Enter your email address"
                      required
                      disabled={isOtpSent}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#103A26]/70 pl-1">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <div className="bg-[#F4EFE6] p-1.5 rounded-lg text-amber-gold group-focus-within:bg-amber-gold group-focus-within:text-white transition-colors">
                        <Lock size={14} />
                      </div>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={onChange}
                      className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 text-[#103A26] focus:border-emerald-deep focus:ring-1 focus:ring-emerald-deep transition-all font-medium text-[16px] sm:text-sm outline-none"
                      placeholder="Create a strong password"
                      required
                      disabled={isOtpSent}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                </div>

                {isOtpSent && (
                  <div className="space-y-1.5 animate-fade-in pt-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-deep pl-1">One-Time Password (OTP)</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <div className="bg-emerald-deep/10 p-1.5 rounded-lg text-emerald-deep">
                          <Lock size={14} />
                        </div>
                      </div>
                      <input
                        type="text"
                        name="otp"
                        value={otp}
                        onChange={onChange}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-emerald-deep/30 bg-emerald-deep/5 text-[#103A26] focus:border-emerald-deep focus:ring-1 focus:ring-emerald-deep transition-all font-bold tracking-[0.3em] text-[16px] sm:text-sm outline-none"
                        placeholder="••••••"
                        required
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#0d3422] to-[#124d33] text-white py-3.5 mt-2 rounded-xl font-bold flex justify-center items-center gap-3 shadow-[0_10px_20px_rgba(13,52,34,0.2)] hover:shadow-[0_15px_25px_rgba(13,52,34,0.3)] hover:-translate-y-0.5 transition-all min-h-[48px]"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <UserPlus size={18} />
                      <span className="tracking-widest">{isOtpSent ? 'VERIFY OTP & REGISTER' : 'APPLY FOR ACCESS'}</span>
                    </>
                  )}
                </button>
              </form>

            </motion.div>

            {/* Existing Users */}
            <div className="mt-6 text-center">
              <p className="text-brown-dark/60 font-medium text-sm">
                Already have an enterprise account?{' '}
                <Link to="/login" className="text-emerald-deep hover:text-emerald-deep/80 font-bold transition-colors">
                  Authorize Here
                </Link>
              </p>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center pb-2">
              <p className="text-[10px] text-gray-400 font-medium">
                © 2025 Binary Repurchase MLM System. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
