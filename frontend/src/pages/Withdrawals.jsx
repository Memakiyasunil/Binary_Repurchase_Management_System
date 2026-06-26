import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowDownToLine, Banknote, Clock, CheckCircle2, 
  AlertCircle, ChevronRight, Lock, Building
} from 'lucide-react';
import toast from 'react-hot-toast';
import { withdrawalService, walletService } from '../features/apiService';

const Withdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [wdData, walletData] = await Promise.all([
        withdrawalService.getUserWithdrawals({ limit: 50 }),
        walletService.getWallet()
      ]);
      setWithdrawals(wdData.withdrawals || []);
      setWallet(walletData.wallet);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch withdrawal data');
    }
    setIsLoading(false);
  };

  const handleRequestWithdrawal = async (e) => {
    e.preventDefault();
    if (!amount || amount < 1000) {
      toast.error('Minimum withdrawal amount is ₹1,000');
      return;
    }
    if (amount > (wallet?.balance || 0)) {
      toast.error('Insufficient wallet balance');
      return;
    }
    
    setIsSubmitting(true);
    const loadingToast = toast.loading('Initiating secure withdrawal...');
    
    try {
      await withdrawalService.requestWithdrawal({ amount: Number(amount) });
      toast.dismiss(loadingToast);
      toast.success('Withdrawal request submitted successfully! It is now pending admin approval.');
      setAmount('');
      fetchData(); // Refresh list and balance
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.message || 'Failed to submit withdrawal');
    }
    setIsSubmitting(false);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Approved':
        return <span className="bg-emerald-success/10 text-emerald-success px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-max"><CheckCircle2 size={12}/> Approved</span>;
      case 'Pending':
        return <span className="bg-amber-gold/10 text-amber-gold px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-max"><Clock size={12}/> Pending</span>;
      case 'Rejected':
        return <span className="bg-ruby-red/10 text-ruby-red px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-max"><AlertCircle size={12}/> Rejected</span>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 pt-6 max-w-6xl mx-auto">
        <div className="h-20 bg-white/50 animate-pulse rounded-2xl" />
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
            <div className="w-10 h-10 rounded-xl bg-copper/10 flex items-center justify-center text-copper">
              <ArrowDownToLine size={20} />
            </div>
            Payout Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Request withdrawals, view payout history, and track processing status.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Withdrawal Form Widget */}
        <div className="lg:col-span-1">
          <motion.div 
            className="bg-white rounded-[24px] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden sticky top-32"
          >
            <div className="p-6 border-b border-gray-50 bg-gradient-to-br from-ivory to-white">
              <h2 className="font-bold text-brown-dark flex items-center gap-2">
                <Banknote size={18} className="text-emerald-deep" />
                Request Payout
              </h2>
              <p className="text-xs text-gray-400 mt-1">Available Balance: <strong className="text-emerald-deep">₹{(wallet?.balance || 0).toLocaleString('en-IN')}</strong></p>
            </div>
            
            <div className="p-6 relative overflow-hidden min-h-[250px]">
              <AnimatePresence mode="wait">
                <motion.form 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleRequestWithdrawal} 
                  className="space-y-5"
                >
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-brown-dark/70 pl-1">Withdrawal Amount (₹)</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-gold font-bold">
                        ₹
                      </div>
                      <input
                        type="number"
                        min="1000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-brown-dark focus:bg-white focus:border-amber-gold focus:ring-1 focus:ring-amber-gold transition-all font-bold text-[18px] outline-none"
                        placeholder="Enter amount"
                        required
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 pl-1 flex items-center gap-1">
                      <AlertCircle size={10} /> Minimum withdrawal: ₹1,000
                    </p>
                  </div>

                  <div className="bg-amber-gold/5 border border-amber-gold/10 p-3 rounded-xl flex gap-3 items-start">
                    <Building className="text-amber-gold shrink-0 mt-0.5" size={16} />
                    <div>
                      <p className="text-xs font-bold text-brown-dark">Bank Transfer Setup</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Funds will be transferred to your verified primary bank account on file.</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !amount}
                    className="w-full bg-gradient-to-r from-amber-gold to-[#c26a05] text-white py-3.5 mt-2 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg shadow-amber-gold/20 hover:shadow-xl hover:shadow-amber-gold/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Processing...' : 'Proceed to Withdraw'} <ChevronRight size={16} />
                  </button>
                </motion.form>
              </AnimatePresence>
            </div>
            <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-center justify-center gap-2">
              <Lock size={12} className="text-gray-400" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">End-to-End Encrypted</span>
            </div>
          </motion.div>
        </div>

        {/* Withdrawals List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[24px] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="font-bold text-brown-dark text-lg">Withdrawal History</h3>
            </div>
            
            <div className="p-6">
              {withdrawals.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                    <Banknote size={24} className="text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-brown-dark mb-1">No Withdrawals Yet</h3>
                  <p className="text-gray-500 text-sm">You haven't made any withdrawal requests.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {withdrawals.map((wd, index) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={wd._id} 
                      className="border border-gray-100 rounded-2xl p-5 hover:border-emerald-deep/20 hover:shadow-md transition-all group bg-white relative overflow-hidden"
                    >
                      {/* Left color bar accent */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                        wd.status === 'Approved' ? 'bg-emerald-success' : 
                        wd.status === 'Rejected' ? 'bg-ruby-red' : 'bg-amber-gold'
                      }`}></div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-bold text-lg text-brown-dark">₹{wd.amount.toLocaleString('en-IN')}</span>
                            {getStatusBadge(wd.status)}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-500 font-medium">
                            <span>Req ID: {wd._id.slice(-8).toUpperCase()}</span>
                            <span className="hidden sm:inline w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>{new Date(wd.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric'})}</span>
                            <span className="hidden sm:inline w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>{wd.paymentMethod || 'Bank Transfer'}</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <button className="text-[10px] font-bold uppercase tracking-widest text-emerald-deep bg-emerald-deep/5 px-3 py-1.5 rounded-lg hover:bg-emerald-deep/10 transition-colors">
                            View Details
                          </button>
                        </div>
                      </div>
                      
                      {wd.status === 'Rejected' && wd.adminNote && (
                        <div className="mt-4 bg-ruby-red/5 border border-ruby-red/10 rounded-xl p-3 flex gap-2 items-start">
                          <AlertCircle size={14} className="text-ruby-red shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] font-bold text-ruby-red uppercase tracking-wider block mb-0.5">Rejection Reason</span>
                            <span className="text-xs text-gray-600">{wd.adminNote}</span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Withdrawals;
