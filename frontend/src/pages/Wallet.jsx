import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet as WalletIcon, ArrowUpRight, ArrowDownRight,
  Send, Plus, ShieldCheck, History, Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import { walletService } from '../features/apiService';

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const data = await walletService.getWallet();
      setWallet(data.wallet);
      setHistory(data.history || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load wallet data');
    }
    setIsLoading(false);
  };
  
  const handleAddFunds = () => {
    toast.success('Fund request initiated. Awaiting gateway redirect.', { icon: '💳' });
  };
  
  const handleTransfer = () => {
    toast('P2P Transfer module locked until KYC verification.', { icon: '🔒' });
  };

  if (isLoading) {
    return (
      <div className="space-y-4 pt-6 max-w-6xl mx-auto">
        <div className="h-48 bg-white/50 animate-pulse rounded-[24px]" />
        <div className="h-64 bg-white/50 animate-pulse rounded-[24px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 mt-4">
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
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
                  ₹{(wallet?.balance || 0).toLocaleString('en-IN')}
                </h2>
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
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Total Earnings</p>
              <p className="text-xl font-bold text-emerald-600">₹{(wallet?.totalEarnings || 0).toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Pending Withdrawals</p>
              <p className="text-xl font-bold text-amber-600">₹{(wallet?.pendingWithdrawals || 0).toLocaleString('en-IN')}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Transactions History */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-[24px] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2">
            <History className="text-amber-gold" size={18} />
            <h3 className="font-bold text-brown-dark text-lg">Transaction History</h3>
          </div>
          <button className="flex items-center gap-2 text-xs font-bold text-emerald-deep bg-emerald-deep/10 px-4 py-2 rounded-lg hover:bg-emerald-deep/20 transition-colors">
            <Download size={14} /> Download Statement
          </button>
        </div>
        
        <div className="p-6">
          {history.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No transactions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((txn, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-emerald-success/30 hover:shadow-md transition-all group bg-white">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      txn.type === 'credit' ? 'bg-emerald-success/10 text-emerald-success' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {txn.type === 'credit' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-brown-dark text-sm mb-1">{txn.description}</p>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                        <span>{new Date(txn.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric'})}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="uppercase tracking-widest text-amber-gold">{txn.transactionType || txn.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${txn.type === 'credit' ? 'text-emerald-success' : 'text-red-500'}`}>
                      {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase">ID: {txn._id.slice(-6).toUpperCase()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Wallet;
