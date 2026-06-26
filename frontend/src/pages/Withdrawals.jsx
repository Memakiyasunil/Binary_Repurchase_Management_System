import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowDownToLine, Banknote, Clock, CheckCircle2, 
  AlertCircle, ChevronRight, Lock, Building
} from 'lucide-react';
import toast from 'react-hot-toast';

const withdrawals = [
  { id: 'WD-5542', amount: '₹15,000', method: 'Bank Transfer (HDFC ****4455)', date: 'Oct 24, 2026', status: 'Pending' },
  { id: 'WD-5521', amount: '₹25,000', method: 'Bank Transfer (HDFC ****4455)', date: 'Oct 18, 2026', status: 'Approved' },
  { id: 'WD-5410', amount: '₹8,500', method: 'Bank Transfer (HDFC ****4455)', date: 'Oct 05, 2026', status: 'Approved' },
  { id: 'WD-5201', amount: '₹50,000', method: 'Bank Transfer (HDFC ****4455)', date: 'Sep 28, 2026', status: 'Rejected', reason: 'KYC not verified at time of request.' },
];

const Withdrawals = () => {
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');

  const handleRequestWithdrawal = (e) => {
    e.preventDefault();
    if (!amount || amount < 1000) {
      toast.error('Minimum withdrawal amount is ₹1,000');
      return;
    }
    
    const loadingToast = toast.loading('Initiating secure withdrawal...');
    
    setTimeout(() => {
      toast.dismiss(loadingToast);
      setStep(2); // Move to OTP step
      toast.success('OTP sent to registered email.', { icon: '📧' });
    }, 1500);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    
    const loadingToast = toast.loading('Verifying secure token...');
    
    setTimeout(() => {
      toast.dismiss(loadingToast);
      setStep(1);
      setAmount('');
      setOtp('');
      toast.success('Withdrawal request submitted successfully! It is now pending admin approval.');
    }, 2000);
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

  return (
    <div className="space-y-6 pb-10 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
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
              <p className="text-xs text-gray-400 mt-1">Available Balance: <strong className="text-emerald-deep">₹1,45,250.00</strong></p>
            </div>
            
            <div className="p-6 relative overflow-hidden min-h-[300px]">
              <AnimatePresence mode="wait">
                
                {step === 1 && (
                  <motion.form 
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-5"
                    onSubmit={handleRequestWithdrawal}
                  >
                    <div className="relative group">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-brown-dark/50 mb-2 pl-1">Amount to Withdraw (₹)</label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-2xl bg-ivory/50 border border-beige-soft text-brown-dark focus:bg-white focus:border-emerald-deep/50 focus:ring-4 focus:ring-emerald-deep/10 transition-all font-bold text-lg"
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-brown-dark/50 mb-2">Payout Method</p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 border border-gray-100">
                          <Building size={14} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-brown-dark">HDFC Bank</p>
                          <p className="text-xs text-gray-500">**** **** **** 4455</p>
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-emerald-deep text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-deep/20 hover:bg-[#0c5c56] transition-all"
                    >
                      Continue <ChevronRight size={16} />
                    </button>
                    <p className="text-[10px] text-center text-gray-400">Standard processing time: 24-48 business hours.</p>
                  </motion.form>
                )}

                {step === 2 && (
                  <motion.form 
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-5 flex flex-col h-full justify-center"
                    onSubmit={handleVerifyOtp}
                  >
                    <div className="text-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-amber-gold/10 text-amber-gold flex items-center justify-center mx-auto mb-3">
                        <Lock size={20} />
                      </div>
                      <h3 className="font-bold text-brown-dark">Security Verification</h3>
                      <p className="text-xs text-gray-500 mt-1">Enter the 6-digit OTP sent to your registered email address to authorize ₹{amount}.</p>
                    </div>

                    <div className="relative group">
                      <input
                        type="text"
                        maxLength="6"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full px-4 py-4 rounded-2xl bg-ivory/50 border border-amber-gold/30 text-brown-dark focus:bg-white focus:border-amber-gold focus:ring-4 focus:ring-amber-gold/10 transition-all font-bold text-2xl tracking-[0.5em] text-center"
                        placeholder="••••••"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button 
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 bg-gray-100 text-gray-600 py-3.5 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="flex-[2] bg-amber-gold text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-amber-gold/20 hover:bg-[#c26a05] transition-colors"
                      >
                        Verify & Submit
                      </button>
                    </div>
                  </motion.form>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* History Table Widget */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[24px] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden h-full">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h2 className="font-bold text-brown-dark">Recent Withdrawals</h2>
              <button className="text-xs text-emerald-deep font-bold hover:underline">View All</button>
            </div>
            
            <div className="overflow-x-auto touch-scroll">
              <table className="w-full text-sm text-left min-w-[500px]">
                <thead className="text-[10px] uppercase tracking-widest text-gray-400 bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 font-bold">Req ID</th>
                    <th className="px-6 py-4 font-bold">Amount</th>
                    <th className="px-6 py-4 font-bold">Date</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((wd, index) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={wd.id} 
                      className="border-b border-gray-50 hover:bg-cream/30 transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <div className="font-bold text-brown-dark">{wd.id}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{wd.method}</div>
                      </td>
                      <td className="px-6 py-5 font-bold text-brown-dark text-base">{wd.amount}</td>
                      <td className="px-6 py-5 text-gray-500 font-medium">{wd.date}</td>
                      <td className="px-6 py-5">
                        {getStatusBadge(wd.status)}
                        {wd.reason && <p className="text-[10px] text-ruby-red mt-1 max-w-[150px] leading-tight">{wd.reason}</p>}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Withdrawals;
