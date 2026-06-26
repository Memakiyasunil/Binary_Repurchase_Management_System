import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { logout, reset } from '../features/auth/authSlice';
import { ShoppingCart, LogOut, User, Bell, Search, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ setIsMobileMenuOpen }) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
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
    <header className="h-[max(6rem,calc(6rem+env(safe-area-inset-top)))] safe-p-top bg-ivory/80 backdrop-blur-2xl border-b border-beige-soft/50 sticky top-0 z-40 flex items-center justify-between px-4 md:px-10 transition-all duration-300">
      
      <div className="flex items-center gap-4 md:gap-8">
        <button 
          className="lg:hidden p-2 text-brown-dark bg-cream border border-beige-soft rounded-xl hover:bg-beige-soft/50 transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>

        <motion.h1
          key={location.pathname}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-serif font-bold text-brown-dark tracking-wide"
        >
          {getPageTitle()}
        </motion.h1>

        {/* Global Search Bar (Luxury style) */}
        <div className="hidden lg:flex items-center bg-cream border border-beige-soft rounded-full px-4 py-2.5 w-64 xl:w-80 shadow-sm focus-within:ring-2 focus-within:ring-emerald-deep/20 focus-within:border-emerald-deep/50 transition-all">
          <Search size={18} className="text-brown-dark/50 mr-3" />
          <input 
            type="text" 
            placeholder="Search transactions, products..." 
            className="bg-transparent border-none outline-none w-full text-sm text-brown-dark placeholder-brown-dark/40"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        
        {/* Mobile Search Icon */}
        <button className="lg:hidden p-2.5 rounded-full text-brown-dark/70 hover:bg-beige-soft/50 transition-colors">
          <Search size={20} />
        </button>

        {/* Cart */}
        <Link to="/cart" className="relative p-2.5 rounded-full bg-cream border border-beige-soft text-brown-dark/70 hover:text-emerald-deep hover:border-emerald-deep/30 transition-all shadow-sm hover:shadow-md min-h-[48px] min-w-[48px] flex items-center justify-center">
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
        <div className="relative">
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative p-2.5 rounded-full border transition-all shadow-sm hover:shadow-md min-h-[48px] min-w-[48px] flex items-center justify-center ${isNotifOpen ? 'bg-emerald-deep/10 text-emerald-deep border-emerald-deep/30' : 'bg-cream border-beige-soft text-brown-dark/70 hover:text-emerald-deep hover:border-emerald-deep/30'}`}
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-ruby-red rounded-full shadow-[0_0_8px_rgba(190,18,60,0.6)]"></span>
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-16 right-[-60px] md:right-0 w-[320px] md:w-[380px] glass-premium rounded-2xl shadow-2xl border border-beige-soft overflow-hidden z-50"
              >
                <div className="p-4 border-b border-beige-soft/50 bg-cream/50 flex justify-between items-center">
                  <h3 className="font-serif font-bold text-brown-dark">Notifications</h3>
                  <button className="text-[10px] uppercase font-bold tracking-widest text-emerald-deep hover:text-[#0d6059]">Mark all read</button>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {/* Mock Notifications */}
                  <div className="p-4 border-b border-beige-soft/30 hover:bg-ivory/50 transition-colors cursor-pointer flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-gold/10 text-amber-gold flex items-center justify-center shrink-0 mt-0.5">
                      <span className="font-bold text-xs">R</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brown-dark">Rank Achievement!</p>
                      <p className="text-xs text-brown-dark/60 mt-0.5 line-clamp-2">Congratulations, you have achieved the Gold Executive rank.</p>
                      <p className="text-[10px] text-brown-dark/40 mt-1 font-bold">2 mins ago</p>
                    </div>
                  </div>
                  <div className="p-4 border-b border-beige-soft/30 hover:bg-ivory/50 transition-colors cursor-pointer flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-success/10 text-emerald-success flex items-center justify-center shrink-0 mt-0.5">
                      <span className="font-bold text-xs">$</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brown-dark">Income Generated</p>
                      <p className="text-xs text-brown-dark/60 mt-0.5 line-clamp-2">You earned $450.00 from Binary Matching Bonus.</p>
                      <p className="text-[10px] text-brown-dark/40 mt-1 font-bold">1 hour ago</p>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-ivory/50 transition-colors cursor-pointer flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="font-bold text-xs">P</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brown-dark">New Referral</p>
                      <p className="text-xs text-brown-dark/60 mt-0.5 line-clamp-2">User janesmith joined your left leg.</p>
                      <p className="text-[10px] text-brown-dark/40 mt-1 font-bold">Yesterday</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t border-beige-soft/50 bg-cream/50 text-center">
                  <button className="text-xs font-bold text-brown-dark/60 hover:text-emerald-deep transition-colors">View All Activity</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
          className="p-2.5 md:ml-2 text-brown-dark/40 hover:text-ruby-red hover:bg-ruby-red/10 rounded-xl transition-all min-h-[48px] min-w-[48px] flex items-center justify-center"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
