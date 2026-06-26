import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Users, Wallet, Target, Activity, FileSpreadsheet, Download, Filter } from 'lucide-react';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('income');

  // Mock Data for UI Visualization
  const reportTabs = [
    { id: 'income', label: 'Income Report', icon: TrendingUp },
    { id: 'wallet', label: 'Wallet Report', icon: Wallet },
    { id: 'team', label: 'Team Report', icon: Users },
    { id: 'referral', label: 'Referrals', icon: Target },
    { id: 'bv', label: 'BV Tracking', icon: Activity },
  ];

  const mockIncomeData = [
    { id: 'INC-1001', date: 'Oct 24, 2026', type: 'Binary Matching', amount: '$450.00', status: 'Credited' },
    { id: 'INC-1002', date: 'Oct 23, 2026', type: 'Direct Referral', amount: '$150.00', status: 'Credited' },
    { id: 'INC-1003', date: 'Oct 22, 2026', type: 'Repurchase Bonus', amount: '$25.50', status: 'Pending' },
    { id: 'INC-1004', date: 'Oct 20, 2026', type: 'Leadership Reward', amount: '$1,000.00', status: 'Credited' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-brown-dark tracking-wide">Analytics Hub</h1>
          <p className="text-brown-dark/60 mt-2 text-lg">Comprehensive financial and team performance reports.</p>
        </div>
        
        <div className="flex gap-4">
          <button className="glass-premium px-5 py-2.5 rounded-xl flex items-center gap-3 text-sm font-medium text-brown-dark hover:text-emerald-deep transition-colors">
            <Filter size={18} />
            <span>Advanced Filters</span>
          </button>
          <button className="luxury-button bg-emerald-deep text-white px-5 py-2.5 rounded-xl flex items-center gap-3 text-sm font-medium">
            <Download size={18} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Navigation Tabs */}
      <div className="flex flex-wrap gap-3">
        {reportTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-3.5 rounded-2xl flex items-center gap-3 text-sm font-bold transition-all duration-300 ${
                isActive 
                  ? 'bg-cream text-emerald-deep border border-emerald-deep/20 shadow-md' 
                  : 'bg-ivory/50 text-brown-dark/50 border border-beige-soft hover:bg-cream hover:text-brown-dark'
              }`}
            >
              <Icon size={18} />
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-emerald-deep rounded-t-full"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* KPI Summary Cards */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={item} className="glass-card-luxury p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-success/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
          <p className="text-[10px] font-bold text-brown-dark/50 uppercase tracking-widest mb-2">Total Generated</p>
          <h3 className="text-3xl font-serif font-bold text-emerald-deep mb-1">$1,625.50</h3>
          <p className="text-sm font-medium text-emerald-success flex items-center gap-1">
            <TrendingUp size={14} /> +12.5% this month
          </p>
        </motion.div>

        <motion.div variants={item} className="glass-card-luxury p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-gold/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
          <p className="text-[10px] font-bold text-brown-dark/50 uppercase tracking-widest mb-2">Matched BV</p>
          <h3 className="text-3xl font-serif font-bold text-amber-gold mb-1">4,500 BV</h3>
          <p className="text-sm font-medium text-amber-gold/80 flex items-center gap-1">
            <Activity size={14} /> 1,200 pending match
          </p>
        </motion.div>

        <motion.div variants={item} className="glass-card-luxury p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-copper/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
          <p className="text-[10px] font-bold text-brown-dark/50 uppercase tracking-widest mb-2">Active Referrals</p>
          <h3 className="text-3xl font-serif font-bold text-copper mb-1">24</h3>
          <p className="text-sm font-medium text-brown-dark/60 flex items-center gap-1">
            <Users size={14} /> 3 new this week
          </p>
        </motion.div>
      </motion.div>

      {/* Data Table */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="glass-premium rounded-[24px] overflow-hidden"
        >
          <div className="p-6 border-b border-beige-soft/50 flex items-center gap-3 bg-cream/30">
            <FileSpreadsheet size={20} className="text-emerald-deep" />
            <h2 className="text-lg font-bold text-brown-dark">{reportTabs.find(t => t.id === activeTab)?.label} Data</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-ivory/50 border-b border-beige-soft/50">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-brown-dark/50">Transaction ID</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-brown-dark/50">Date</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-brown-dark/50">Type</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-brown-dark/50">Amount</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-brown-dark/50">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockIncomeData.map((row, index) => (
                  <tr key={index} className="border-b border-beige-soft/20 hover:bg-cream/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-brown-dark">{row.id}</td>
                    <td className="px-6 py-4 text-sm text-brown-dark/70 font-medium">{row.date}</td>
                    <td className="px-6 py-4 text-sm text-brown-dark/80 font-semibold">{row.type}</td>
                    <td className="px-6 py-4 text-sm font-serif font-bold text-emerald-deep">{row.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        row.status === 'Credited' ? 'bg-emerald-success/10 text-emerald-success' : 'bg-amber-gold/10 text-amber-gold'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="p-4 border-t border-beige-soft/50 bg-cream/30 flex items-center justify-between text-sm text-brown-dark/60 font-medium">
            <span>Showing 1 to 4 of 4 entries</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded border border-beige-soft hover:bg-ivory transition-colors disabled:opacity-50" disabled>Prev</button>
              <button className="px-3 py-1 rounded border border-beige-soft bg-ivory text-emerald-deep font-bold shadow-sm">1</button>
              <button className="px-3 py-1 rounded border border-beige-soft hover:bg-ivory transition-colors disabled:opacity-50" disabled>Next</button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

    </div>
  );
};

export default Reports;
