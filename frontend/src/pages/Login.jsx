import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../features/auth/authSlice';
import Modal from '../components/Modal';
import { LogIn, Mail, Lock } from 'lucide-react';
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
      
      <div className="min-h-screen flex items-center justify-center bg-ivory p-6 font-sans relative overflow-hidden">
        {/* Luxury Background Accents */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-deep/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-amber-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-[440px] z-10"
        >
          {/* Logo Area */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-deep to-green-forest shadow-2xl shadow-emerald-deep/20 mb-6 transform -rotate-3">
              <span className="font-serif text-4xl text-ivory font-bold">E</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-brown-dark tracking-wide">Welcome Back</h2>
            <p className="text-brown-dark/60 mt-3 font-medium">Sign in to your enterprise account</p>
          </div>

          <div className="glass-premium rounded-[32px] p-10">
            <form onSubmit={onSubmit} className="space-y-6">
              
              <div className="relative group">
                <label className="block text-xs font-bold uppercase tracking-widest text-brown-dark/50 mb-2 pl-1">Identifier</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-brown-dark/40 group-focus-within:text-emerald-deep transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={onChange}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-ivory/50 border border-beige-soft text-brown-dark focus:bg-ivory focus:border-emerald-deep/50 focus:ring-4 focus:ring-emerald-deep/10 transition-all font-medium"
                    placeholder="Email or Username"
                    required
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="block text-xs font-bold uppercase tracking-widest text-brown-dark/50 mb-2 pl-1">Security Key</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-brown-dark/40 group-focus-within:text-emerald-deep transition-colors" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-ivory/50 border border-beige-soft text-brown-dark focus:bg-ivory focus:border-emerald-deep/50 focus:ring-4 focus:ring-emerald-deep/10 transition-all font-medium"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-beige-soft text-emerald-deep focus:ring-emerald-deep/30 cursor-pointer" />
                  <span className="text-sm font-medium text-brown-dark/70 group-hover:text-brown-dark transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-sm font-bold text-emerald-deep hover:text-emerald-deep/80 transition-colors">Recover Access</a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full luxury-button bg-gradient-to-r from-emerald-deep to-[#0d6059] text-white py-4 mt-8 flex justify-center items-center gap-3 text-lg"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn size={20} />
                    <span>Authorize</span>
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-brown-dark/60 font-medium">
              New to the platform?{' '}
              <Link to="/register" className="text-amber-gold hover:text-amber-gold/80 font-bold transition-colors">
                Apply for an account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
