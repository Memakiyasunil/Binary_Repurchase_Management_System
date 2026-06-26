import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Users, Wallet, Target, Activity, Download, Filter, RefreshCw, BarChart3 } from 'lucide-react';
import { incomeService, profileService } from '../features/apiService';
import toast from 'react-hot-toast';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('income');
  const [incomes, setIncomes] = useState([]);
  const [summary, setSummary] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [referralInfo, setReferralInfo] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [incomeData, refData] = await Promise.all([
        incomeService.getUserIncome({ limit: 100 }),
        profileService.getReferralInfo()
      ]);
      setIncomes(incomeData.incomes || []);
      setSummary(incomeData.summary || []);
      setTotalIncome(incomeData.total || 0);
      setReferralInfo(refData);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load report data');
    }
    setIsLoading(false);
  };

  const reportTabs = [
    { id: 'income', label: 'Income Report', icon: TrendingUp },
    { id: 'bv', label: 'BV Tracking', icon: Activity },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 pt-6 max-w-6xl mx-auto">
        <div className="h-20 bg-white/50 animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-32 bg-white/50 animate-pulse rounded-2xl" />
          <div className="h-32 bg-white/50 animate-pulse rounded-2xl" />
        </div>
        <div className="h-64 bg-white/50 animate-pulse rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brown-dark tracking-wide flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-deep/10 flex items-center justify-center text-emerald-deep">
              <BarChart3 size={20} />
            </div>
            Analytics Hub
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Comprehensive financial and team performance reports.</p>
        </div>
        
        <div className="flex gap-4">
          <button className="bg-white border border-gray-200 px-5 py-2.5 rounded-xl flex items-center gap-3 text-sm font-medium text-brown-dark hover:bg-gray-50 transition-colors">
            <Download size={16} />
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
              className={`relative px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold transition-all duration-300 ${
                isActive 
                  ? 'bg-amber-gold text-white shadow-md shadow-amber-gold/20' 
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-amber-gold/30'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* KPI Summary Cards */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={item} className="bg-white border border-gray-100 rounded-[20px] p-6 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-success/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Total Income Generated</p>
          <h3 className="text-3xl font-serif font-bold text-emerald-600 mb-1">₹{totalIncome.toLocaleString('en-IN')}</h3>
          <p className="text-xs font-medium text-emerald-success flex items-center gap-1">
            Lifetime earnings from all sources
          </p>
        </motion.div>

        <motion.div variants={item} className="bg-white border border-gray-100 rounded-[20px] p-6 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-gold/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Matched BV Total</p>
          <h3 className="text-3xl font-serif font-bold text-amber-600 mb-1">
            {Math.min(referralInfo?.leftBusinessVolume || 0, referralInfo?.rightBusinessVolume || 0)} BV
          </h3>
          <p className="text-xs font-medium text-amber-600 flex items-center gap-1">
            Left: {referralInfo?.leftBusinessVolume || 0} BV | Right: {referralInfo?.rightBusinessVolume || 0} BV
          </p>
        </motion.div>
      </motion.div>

      {/* Data Table */}
      {activeTab === 'income' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)]"
        >
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="font-bold text-brown-dark text-lg flex items-center gap-2">
              <FileSpreadsheet size={18} className="text-emerald-deep" />
              Detailed Income Ledger
            </h3>
            <button className="text-xs text-emerald-deep font-bold flex items-center gap-1 hover:underline">
              <RefreshCw size={12} /> Sync
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-white border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Income Type</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {incomes.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-gray-500">No income records found</td>
                  </tr>
                ) : incomes.map((inc, index) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    key={inc._id} 
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-bold text-brown-dark">
                        {new Date(inc.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric'})}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {inc.incomeType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {inc.description || 'System Commission'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-emerald-600 text-base">+{inc.amount.toLocaleString('en-IN')}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {activeTab === 'bv' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] p-10 text-center"
        >
          <Activity size={48} className="mx-auto text-amber-gold mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-brown-dark mb-2">Business Volume Tracker</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            Your BV is tracked in real-time as your left and right teams make purchases. Matching bonuses are calculated automatically at midnight.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-8 items-center">
            <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl w-full max-w-xs">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Left Team BV</p>
              <p className="text-4xl font-serif font-bold text-emerald-600">{referralInfo?.leftBusinessVolume || 0}</p>
              <p className="text-xs text-gray-400 mt-2">New BV this week: 0</p>
            </div>
            <div className="h-12 w-px bg-gray-200 hidden md:block"></div>
            <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl w-full max-w-xs">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Right Team BV</p>
              <p className="text-4xl font-serif font-bold text-amber-600">{referralInfo?.rightBusinessVolume || 0}</p>
              <p className="text-xs text-gray-400 mt-2">New BV this week: 0</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Simple Lucide icon wrapper since FileSpreadsheet wasn't imported in original snippet above.
import { FileSpreadsheet } from 'lucide-react';

export default Reports;
