import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../features/auth/authSlice';
import Modal from '../components/Modal';
import { LogIn, Mail, Lock, EyeOff, CheckCircle2, ShieldCheck, Globe, ChevronDown, BarChart3, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  const { username, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Authentication Failed',
        message: message
      });
      dispatch(reset());
    }

    if (isSuccess || user) {
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
      username,
      password,
    };

    dispatch(login(userData));
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
          {/* <div className="absolute bottom-6 right-6 bg-[#E8F0E8] rounded-xl px-4 py-2 flex items-center gap-3 shadow-xl">
            <ShieldCheck className="text-[#2F523B]" size={20} />
            <div>
              <p className="text-[#2F523B] font-bold text-[10px] leading-tight">Your security is our priority</p>
              <p className="text-[#2F523B]/70 text-[9px] font-medium leading-tight">256-bit SSL Encrypted Connection</p>
            </div>
          </div> */}
        </div>

        {/* Right Side: The Form Engine */}
        <div className="flex flex-col relative overflow-y-auto w-full max-w-[100vw]">

          {/* Top Right Language Selector */}
          {/* <div className="absolute top-6 right-6 z-20">
            <button className="bg-white border border-beige-soft px-4 py-2 rounded-full flex items-center gap-2 text-sm text-brown-dark font-medium shadow-sm hover:bg-ivory transition-colors">
              <Globe size={16} className="text-amber-gold" />
              English
              <ChevronDown size={14} className="text-brown-dark/50" />
            </button>
          </div> */}

          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 w-full mt-12 lg:mt-0">

            {/* Mobile Header (Only visible on small screens) */}
            <div className="lg:hidden text-center mb-8">
              <img src="/logo.png" alt="Binary Repurchase Logo" className="h-16 mx-auto object-contain mb-4" />
            </div>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white w-full max-w-[480px] rounded-[32px] p-6 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-beige-soft/30 relative"
            >

              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-[#103A26] mb-2">Welcome Back!</h2>
                <p className="text-gray-500 text-sm">Sign in to your enterprise account</p>
                <div className="flex items-center justify-center gap-4 mt-6 mb-2">
                  <div className="h-px w-12 bg-beige-soft"></div>
                  <div className="w-2 h-2 rotate-45 bg-amber-gold"></div>
                  <div className="h-px w-12 bg-beige-soft"></div>
                </div>
              </div>

              <form onSubmit={onSubmit} className="space-y-5">

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#103A26]/70 pl-1">Email / User ID</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <div className="bg-[#F4EFE6] p-1.5 rounded-lg text-amber-gold group-focus-within:bg-amber-gold group-focus-within:text-white transition-colors">
                        <Users size={14} />
                      </div>
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={username}
                      onChange={onChange}
                      className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-200 text-[#103A26] focus:border-emerald-deep focus:ring-1 focus:ring-emerald-deep transition-all font-medium text-[16px] sm:text-sm outline-none"
                      placeholder="Enter your email or user id"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-emerald-success">
                      {username.length > 2 && <CheckCircle2 size={16} />}
                    </div>
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
                      type="password"
                      name="password"
                      value={password}
                      onChange={onChange}
                      className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-200 text-[#103A26] focus:border-emerald-deep focus:ring-1 focus:ring-emerald-deep transition-all font-medium text-[16px] sm:text-sm outline-none"
                      placeholder="Enter your password"
                      required
                    />
                    <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                      <EyeOff size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#103A26] focus:ring-[#103A26]/30 cursor-pointer" />
                    <span className="text-xs font-bold text-gray-500 group-hover:text-gray-700 transition-colors">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-xs font-bold text-[#103A26] hover:text-[#103A26]/70 transition-colors self-start sm:self-auto">Forgot Password?</Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#0d3422] to-[#124d33] text-white py-3.5 mt-2 rounded-xl font-bold flex justify-center items-center gap-3 shadow-[0_10px_20px_rgba(13,52,34,0.2)] hover:shadow-[0_15px_25px_rgba(13,52,34,0.3)] hover:-translate-y-0.5 transition-all min-h-[48px]"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <LogIn size={18} />
                      <span className="tracking-widest">SIGN IN</span>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Or Continue With</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Social Logins */}
              <div className="flex justify-center gap-3">
                <button className="flex-1 py-2.5 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                </button>
                <button className="flex-1 py-2.5 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm text-black">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.365 14.618c-.021 3.232 2.766 4.3 2.8 4.316-.026.082-.435 1.488-1.442 2.955-.87 1.266-1.782 2.528-3.197 2.553-1.393.024-1.849-.824-3.447-.824-1.6 0-2.1.8-3.424.848-1.37.047-2.42-1.37-3.313-2.658C2.526 19.167.973 15.352 2.846 12.11c.928-1.606 2.585-2.637 4.38-2.662 1.35-.024 2.628.91 3.448.91.82 0 2.378-1.127 4.024-1.048.69.016 2.63.278 3.882 2.115-.102.064-2.235 1.298-2.215 3.193M14.985 6.78c.755-.91 1.264-2.174 1.125-3.435-1.077.044-2.423.717-3.2 1.623-.695.807-1.306 2.096-1.144 3.344 1.205.093 2.464-.617 3.219-1.532" />
                  </svg>
                </button>
                <button className="flex-1 py-2.5 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
                  <ShieldCheck size={20} className="text-emerald-deep" />
                </button>
              </div>

              <div className="mt-6 text-center flex items-center justify-center gap-2">
                <ShieldCheck size={14} className="text-amber-gold" />
                <p className="text-[9px] text-gray-400 font-medium">Secure Login Protected by Advanced Encryption</p>
              </div>

            </motion.div>

            {/* New to Platform */}
            <div className="mt-6 text-center">
              <p className="text-brown-dark/60 font-medium text-sm">
                New to the platform?{' '}
                <Link to="/register" className="text-emerald-deep hover:text-emerald-deep/80 font-bold transition-colors">
                  Apply for an account
                </Link>
              </p>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center pb-4">
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

export default Login;
