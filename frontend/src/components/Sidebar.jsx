import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, ShoppingBag, Network, Wallet, TrendingUp, CreditCard } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Store', path: '/store', icon: <ShoppingBag size={20} /> },
    { name: 'Genealogy', path: '/tree', icon: <Network size={20} /> },
    { name: 'Wallet', path: '/wallet', icon: <Wallet size={20} /> },
    { name: 'Income', path: '/reports', icon: <TrendingUp size={20} /> },
    { name: 'Withdrawals', path: '/withdrawals', icon: <CreditCard size={20} /> },
  ];

  return (
    <div className="w-68 h-screen bg-olive-deep text-ivory flex flex-col hidden md:flex sticky top-0 shadow-[4px_0_24px_rgba(15,118,110,0.1)] z-50">
      
      {/* Brand Logo Area */}
      <div className="p-8 flex items-center justify-center border-b border-beige-soft/20">
        <h2 className="text-2xl font-bold tracking-widest flex items-center gap-3">
          <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-amber-gold to-copper flex items-center justify-center text-ivory shadow-lg shadow-amber-gold/20">
            <span className="font-serif text-lg">E</span>
          </div>
          <span className="font-serif font-light text-cream">ENTERPRISE</span>
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-8">
        <ul className="space-y-1.5 px-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.name} className="relative">
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-cream/10 rounded-2xl border border-beige-soft/20"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Link
                  to={item.path}
                  className={`relative flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-colors duration-300 font-medium z-10 ${
                    isActive
                      ? 'text-amber-gold'
                      : 'text-ivory/80 hover:text-ivory hover:bg-cream/5'
                  }`}
                >
                  <span className={`${isActive ? 'text-amber-gold drop-shadow-md' : 'text-ivory/60'}`}>
                    {item.icon}
                  </span>
                  <span className="tracking-wide text-[15px]">{item.name}</span>
                  
                  {isActive && (
                    <motion.div
                      className="absolute right-4 w-1.5 h-1.5 rounded-full bg-amber-gold"
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
      <div className="p-6 mt-auto">
        <div className="bg-gradient-to-br from-[#2d470d] to-olive-deep border border-beige-soft/20 p-5 rounded-[20px] shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-gold/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
          
          <p className="text-[11px] text-ivory/60 uppercase tracking-widest mb-2 font-semibold">Current Rank</p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-gold to-copper flex items-center justify-center shadow-md">
              <span className="text-ivory font-bold text-xs">G</span>
            </div>
            <span className="font-serif text-lg text-cream">Gold Executive</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
