import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet as WalletIcon, ArrowUpRight, ArrowDownRight, RefreshCw, 
  Send, Plus, ShieldCheck, History
} from 'lucide-react';
import toast from 'react-hot-toast';

const transactions = [
  { id: 'TXN-9823', type: 'credit', amount: '₹12,500', desc: 'Binary Matching Bonus', date: 'Oct 24, 2026', time: '14:30' },
  { id: 'TXN-9822', type: 'credit', amount: '₹5,000', desc: 'Direct Referral (User BR882)', date: 'Oct 23, 2026', time: '09:15' },
  { id: 'TXN-9821', type: 'debit', amount: '₹8,000', desc: 'Withdrawal to Bank ****4455', date: 'Oct 21, 2026', time: '11:45' },
  { id: 'TXN-9820', type: 'credit', amount: '₹2,500', desc: 'Repurchase Commission', date: 'Oct 20, 2026', time: '16:20' },
  { id: 'TXN-9819', type: 'debit', amount: '₹1,500', desc: 'Store Purchase (Order #992)', date: 'Oct 18, 2026', time: '10:05' },
];

const Wallet = () => {
  const [activeTab, setActiveTab] = useState('history');
  
  const handleAddFunds = () => {
    toast.success('Fund request initiated. Awaiting gateway redirect.', { icon: '💳' });
  };
  
  const handleTransfer = () => {
    toast('P2P Transfer module locked until KYC verification.', { icon: '🔒' });
  };

  return (
    <div className="space-y-6 pb-10 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brown-dark flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-gold/10 flex items-center justify-center text-amber-gold">
              <WalletIcon size={20} />
            </div>
            Enterprise Wallet
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage your funds, track history, and initiate transfers securely.</p>
        </div>
      </div>

      {/* Top Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Balance Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-gradient-to-br from-[#0a1e14] to-[#123122] rounded-[24px] p-8 relative overflow-hidden shadow-2xl"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-amber-gold/10 rounded-full blur-[80px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-emerald-deep/20 rounded-full blur-[60px] pointer-events-none -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-ivory/60 text-sm font-medium tracking-wide uppercase mb-1">Available Balance</p>
                <h2 className="text-5xl font-serif font-bold text-white tracking-tight">₹1,45,250<span className="text-2xl text-ivory/50">.00</span></h2>
              </div>
              <div className="flex items-center gap-2 bg-emerald-success/20 text-emerald-success px-3 py-1 rounded-full text-xs font-bold border border-emerald-success/30">
                <ArrowUpRight size={14} /> +12.5% This Week
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={handleAddFunds}
                className="bg-amber-gold text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-amber-gold/20 hover:bg-[#c26a05] transition-all hover:-translate-y-0.5"
              >
                <Plus size={18} /> Add Funds
              </button>
              <button 
                onClick={handleTransfer}
                className="bg-white/10 text-white border border-white/20 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white/20 transition-all hover:-translate-y-0.5 backdrop-blur-sm"
              >
                <Send size={18} /> P2P Transfer
              </button>
            </div>
          </div>
        </motion.div>

        {/* Security / Status Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[24px] p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-success/10 flex items-center justify-center text-emerald-success">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-bold text-brown-dark">Wallet Security</h3>
              <p className="text-xs text-emerald-success font-medium">Protected (256-bit AES)</p>
            </div>
          </div>
          
          <div className="space-y-4 flex-1">
            <div className="flex justify-between items-center pb-3 border-b border-gray-50">
              <span className="text-sm text-gray-500">2FA Status</span>
              <span className="text-sm font-bold text-brown-dark bg-gray-100 px-3 py-1 rounded-full">Enabled</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-50">
              <span className="text-sm text-gray-500">KYC Status</span>
              <span className="text-sm font-bold text-amber-gold bg-amber-gold/10 px-3 py-1 rounded-full">Pending</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Daily Limit</span>
              <span className="text-sm font-bold text-brown-dark">₹1,00,000</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[24px] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-2 overflow-x-auto touch-scroll whitespace-nowrap">
          <button 
            className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'history' ? 'border-amber-gold text-amber-gold' : 'border-transparent text-gray-400 hover:text-brown-dark'}`}
            onClick={() => setActiveTab('history')}
          >
            Transaction History
          </button>
          <button 
            className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'statements' ? 'border-amber-gold text-amber-gold' : 'border-transparent text-gray-400 hover:text-brown-dark'}`}
            onClick={() => setActiveTab('statements')}
          >
            Monthly Statements
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'history' && (
            <div className="space-y-1">
              <div className="flex justify-between items-center mb-6 px-2">
                <h3 className="font-bold text-brown-dark flex items-center gap-2">
                  <History size={16} className="text-amber-gold" />
                  Recent Activity
                </h3>
                <button className="text-xs text-amber-gold font-bold flex items-center gap-1 hover:underline">
                  <RefreshCw size={12} /> Refresh
                </button>
              </div>

              <div className="overflow-x-auto touch-scroll">
                <table className="w-full text-sm text-left min-w-[600px]">
                  <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 rounded-t-xl">
                    <tr>
                      <th className="px-6 py-4 font-medium rounded-tl-xl">Transaction ID</th>
                      <th className="px-6 py-4 font-medium">Date & Time</th>
                      <th className="px-6 py-4 font-medium">Description</th>
                      <th className="px-6 py-4 font-medium">Amount</th>
                      <th className="px-6 py-4 font-medium rounded-tr-xl">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((txn, index) => (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={txn.id} 
                        className="border-b border-gray-50 hover:bg-cream/30 transition-colors group"
                      >
                        <td className="px-6 py-4 font-bold text-brown-dark">{txn.id}</td>
                        <td className="px-6 py-4">
                          <div className="text-brown-dark font-medium">{txn.date}</div>
                          <div className="text-[10px] text-gray-400">{txn.time}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{txn.desc}</td>
                        <td className="px-6 py-4">
                          <span className={`font-bold flex items-center gap-1 ${txn.type === 'credit' ? 'text-emerald-success' : 'text-brown-dark'}`}>
                            {txn.type === 'credit' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                            {txn.amount}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-emerald-success/10 text-emerald-success px-3 py-1 rounded-full text-[10px] font-bold">
                            Completed
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'statements' && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                <History size={24} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-brown-dark mb-2">No Statements Generated Yet</h3>
              <p className="text-gray-500 text-sm max-w-md">Monthly statements are generated automatically on the 1st of every month summarizing all your wallet activity.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
