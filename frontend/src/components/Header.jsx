import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { logout, reset } from '../features/auth/authSlice';
import { ShoppingCart, LogOut, User, Bell, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  // Extract page title from route
  const getPageTitle = () => {
    const path = location.pathname.split('/')[1];
    if (!path) return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="h-24 bg-ivory/80 backdrop-blur-2xl border-b border-beige-soft/50 sticky top-0 z-40 flex items-center justify-between px-10 transition-all duration-300">
      
      <div className="flex items-center gap-8">
        <motion.h1 
          key={location.pathname}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-serif font-bold text-brown-dark tracking-wide"
        >
          {getPageTitle()}
        </motion.h1>

        {/* Global Search Bar (Luxury style) */}
        <div className="hidden lg:flex items-center bg-cream border border-beige-soft rounded-full px-4 py-2.5 w-80 shadow-sm focus-within:ring-2 focus-within:ring-emerald-deep/20 focus-within:border-emerald-deep/50 transition-all">
          <Search size={18} className="text-brown-dark/50 mr-3" />
          <input 
            type="text" 
            placeholder="Search transactions, products..." 
            className="bg-transparent border-none outline-none w-full text-sm text-brown-dark placeholder-brown-dark/40"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        
        {/* Cart */}
        <Link to="/cart" className="relative p-2.5 rounded-full bg-cream border border-beige-soft text-brown-dark/70 hover:text-emerald-deep hover:border-emerald-deep/30 transition-all shadow-sm hover:shadow-md">
          <ShoppingCart size={20} />
          {cartItems.length > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-white bg-gradient-to-r from-amber-gold to-copper rounded-full shadow-md"
            >
              {cartItems.reduce((acc, item) => acc + item.qty, 0)}
            </motion.span>
          )}
        </Link>
        
        {/* Notifications */}
        <button className="relative p-2.5 rounded-full bg-cream border border-beige-soft text-brown-dark/70 hover:text-emerald-deep hover:border-emerald-deep/30 transition-all shadow-sm hover:shadow-md">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-ruby-red rounded-full shadow-[0_0_8px_rgba(190,18,60,0.6)]"></span>
        </button>

        <div className="h-10 w-px bg-beige-soft/80 mx-2"></div>

        {/* User Profile */}
        <div className="flex items-center gap-4 cursor-pointer group">
          <div className="hidden sm:flex flex-col items-end">
            <p className="font-semibold text-sm text-brown-dark group-hover:text-emerald-deep transition-colors">{user?.firstName || 'User'}</p>
            <p className="text-[10px] text-brown-dark/50 uppercase tracking-widest font-bold">{user?.role || 'Member'}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-deep to-green-forest flex items-center justify-center overflow-hidden shadow-lg shadow-emerald-deep/20 group-hover:shadow-emerald-deep/40 transition-all">
            <User size={20} className="text-ivory" />
          </div>
        </div>

        {/* Logout */}
        <button 
          onClick={onLogout}
          className="p-2.5 ml-2 text-brown-dark/40 hover:text-ruby-red hover:bg-ruby-red/10 rounded-xl transition-all"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
