import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, ShoppingBag, Network, Wallet, TrendingUp, CreditCard, ShieldCheck, LifeBuoy, X, User, Bell, Share2, ClipboardList } from 'lucide-react';

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Store', path: '/store', icon: <ShoppingBag size={20} /> },
    { name: 'My Orders', path: '/orders', icon: <ClipboardList size={20} /> },
    { name: 'Genealogy', path: '/tree', icon: <Network size={20} /> },
    { name: 'Referral', path: '/referral', icon: <Share2 size={20} /> },
    { name: 'Wallet', path: '/wallet', icon: <Wallet size={20} /> },
    { name: 'Income', path: '/reports', icon: <TrendingUp size={20} /> },
    { name: 'Withdrawals', path: '/withdrawals', icon: <CreditCard size={20} /> },
    { name: 'KYC Verification', path: '/kyc', icon: <ShieldCheck size={20} /> },
    { name: 'Support Desk', path: '/support', icon: <LifeBuoy size={20} /> },
    { name: 'Notifications', path: '/notifications', icon: <Bell size={20} /> },
    { name: 'My Profile', path: '/profile', icon: <User size={20} /> },
  ];


  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className={`fixed lg:static inset-y-0 left-0 w-72 h-screen bg-olive-deep text-ivory flex flex-col z-[70] transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} shadow-[4px_0_24px_rgba(15,118,110,0.1)]`}>
        
        {/* Brand Logo Area */}
        <div className="p-8 flex items-center justify-between border-b border-beige-soft/20">
          <h2 className="text-2xl font-bold tracking-widest flex items-center gap-3">
            <img src="/logo.png" alt="Enterprise Logo" className="w-40 object-contain" />
          </h2>
          <button 
            className="lg:hidden text-ivory/60 hover:text-ivory"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6 overflow-y-auto overflow-x-hidden">
        <ul className="space-y-1 px-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.name} className="relative group">
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-gradient-to-r from-amber-gold/20 to-transparent rounded-xl border border-amber-gold/10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Link
                  to={item.path}
                  className={`relative flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-300 font-medium z-10 ${
                    isActive
                      ? 'text-amber-gold'
                      : 'text-ivory/60 hover:text-ivory hover:bg-white/5'
                  }`}
                >
                  <span className={`${isActive ? 'text-amber-gold drop-shadow-md' : 'text-ivory/60 group-hover:text-ivory'}`}>
                    {item.icon}
                  </span>
                  <span className="tracking-wide text-[14px]">{item.name}</span>
                  
                  {isActive && (
                    <motion.div
                      className="absolute right-4 w-1.5 h-1.5 rounded-full bg-amber-gold shadow-[0_0_8px_rgba(217,119,6,0.8)]"
                      layoutId="active-dot"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Footer / Rank Badge */}
      <div className="p-5 mt-auto border-t border-white/5">
        <div className="bg-gradient-to-b from-[#112a1c] to-[#0a1e14] border border-white/5 p-4 rounded-[16px] relative overflow-hidden mb-4">
          <p className="text-[10px] text-ivory/50 uppercase tracking-widest mb-1 font-semibold">Current Rank</p>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-gold to-copper flex items-center justify-center shadow-lg shadow-amber-gold/20">
              <span className="text-ivory font-bold text-xs">G</span>
            </div>
            <span className="font-serif text-base text-ivory font-bold tracking-wide">Gold Executive</span>
          </div>
          
          <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-amber-gold to-copper h-full w-[72%]"></div>
          </div>
          <p className="text-[9px] text-ivory/40 mt-1.5">72% to Diamond</p>
        </div>

        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-ivory/60 text-sm font-medium">
            <div className="w-4 h-4 rounded-full border-2 border-ivory/40 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-ivory/40 rounded-full"></div>
            </div>
            Dark Mode
          </div>
          <div 
            className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${isDarkMode ? 'bg-amber-gold' : 'bg-white/20'}`}
            onClick={toggleTheme}
          >
            <motion.div 
              className="absolute top-0.5 w-4 h-4 bg-ivory rounded-full shadow-sm"
              animate={{ left: isDarkMode ? 'auto' : '4px', right: isDarkMode ? '4px' : 'auto' }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Sidebar;
