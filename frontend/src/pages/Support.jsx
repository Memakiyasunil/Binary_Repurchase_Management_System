import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LifeBuoy, PlusCircle, MessageSquare, Paperclip, Clock, CheckCircle2 } from 'lucide-react';

const Support = () => {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'create' | 'view'
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Mock Tickets
  const tickets = [
    { id: 'TKT-8921', subject: 'Withdrawal not credited yet', department: 'Billing', status: 'In Progress', priority: 'High', date: 'Oct 24, 2026' },
    { id: 'TKT-8904', subject: 'How to upgrade to Platinum?', department: 'General', status: 'Closed', priority: 'Low', date: 'Oct 20, 2026' },
    { id: 'TKT-8855', subject: 'KYC Document Rejected', department: 'KYC Verification', status: 'Awaiting User Reply', priority: 'Medium', date: 'Oct 15, 2026' },
  ];

  const renderStatus = (status) => {
    const styles = {
      'Open': 'bg-emerald-deep/10 text-emerald-deep',
      'In Progress': 'bg-amber-gold/10 text-amber-gold',
      'Awaiting User Reply': 'bg-copper/10 text-copper',
      'Closed': 'bg-beige-soft text-brown-dark/50'
    };
    return <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${styles[status]}`}>{status}</span>;
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-premium p-8 rounded-[24px]">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3f6212] to-[#2d470d] flex items-center justify-center text-ivory shadow-lg shadow-olive-deep/20">
            <LifeBuoy size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-brown-dark tracking-wide">Help Desk</h1>
            <p className="text-brown-dark/60 mt-1 font-medium">Create and manage your enterprise support tickets.</p>
          </div>
        </div>
        
        {activeTab === 'list' && (
          <button 
            onClick={() => setActiveTab('create')}
            className="luxury-button bg-emerald-deep text-white px-6 py-3.5 rounded-xl flex items-center gap-2"
          >
            <PlusCircle size={20} />
            <span className="font-semibold">New Ticket</span>
          </button>
        )}
        {activeTab !== 'list' && (
          <button 
            onClick={() => { setActiveTab('list'); setSelectedTicket(null); }}
            className="px-6 py-3.5 rounded-xl border border-beige-soft text-brown-dark hover:bg-cream transition-colors font-semibold"
          >
            Back to Tickets
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        
        {/* Ticket List View */}
        {activeTab === 'list' && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card-luxury overflow-hidden">
            <div className="p-6 border-b border-beige-soft/50 bg-cream/30">
              <h2 className="text-lg font-bold text-brown-dark">Recent Tickets</h2>
            </div>
            <div className="divide-y divide-beige-soft/40">
              {tickets.map((ticket) => (
                <div 
                  key={ticket.id} 
                  onClick={() => { setSelectedTicket(ticket); setActiveTab('view'); }}
                  className="p-6 hover:bg-ivory/60 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-cream border border-beige-soft flex items-center justify-center text-brown-dark/40 group-hover:text-emerald-deep group-hover:border-emerald-deep/30 transition-colors mt-1 shrink-0">
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-brown-dark group-hover:text-emerald-deep transition-colors">{ticket.subject}</h3>
                      <div className="flex items-center gap-3 mt-2 text-sm text-brown-dark/60 font-medium">
                        <span className="text-emerald-deep">#{ticket.id}</span>
                        <span className="w-1 h-1 rounded-full bg-beige-soft"></span>
                        <span>{ticket.department}</span>
                        <span className="w-1 h-1 rounded-full bg-beige-soft"></span>
                        <span className="flex items-center gap-1"><Clock size={14} /> {ticket.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {renderStatus(ticket.status)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Create Ticket View */}
        {activeTab === 'create' && (
          <motion.div key="create" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card-luxury p-8">
            <h2 className="text-2xl font-serif font-bold text-brown-dark mb-6">Open New Ticket</h2>
            <form className="space-y-6 max-w-3xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brown-dark/50 mb-2 pl-1">Department</label>
                  <select className="w-full px-4 py-3.5 rounded-2xl bg-ivory border border-beige-soft text-brown-dark focus:border-emerald-deep/50 focus:ring-4 focus:ring-emerald-deep/10 font-medium appearance-none">
                    <option>General Support</option>
                    <option>Billing & Payments</option>
                    <option>Technical Issue</option>
                    <option>KYC Verification</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brown-dark/50 mb-2 pl-1">Priority</label>
                  <select className="w-full px-4 py-3.5 rounded-2xl bg-ivory border border-beige-soft text-brown-dark focus:border-emerald-deep/50 focus:ring-4 focus:ring-emerald-deep/10 font-medium appearance-none">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-brown-dark/50 mb-2 pl-1">Subject</label>
                <input type="text" className="w-full px-4 py-3.5 rounded-2xl bg-ivory border border-beige-soft text-brown-dark focus:border-emerald-deep/50 focus:ring-4 focus:ring-emerald-deep/10 font-medium" placeholder="Brief summary of your issue" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-brown-dark/50 mb-2 pl-1">Message</label>
                <textarea rows="6" className="w-full px-4 py-3.5 rounded-2xl bg-ivory border border-beige-soft text-brown-dark focus:border-emerald-deep/50 focus:ring-4 focus:ring-emerald-deep/10 font-medium" placeholder="Describe your issue in detail..."></textarea>
              </div>

              <div className="flex items-center justify-between border-t border-beige-soft/50 pt-6 mt-6">
                <button type="button" className="flex items-center gap-2 text-sm font-bold text-brown-dark/60 hover:text-emerald-deep transition-colors px-4 py-2 rounded-lg hover:bg-cream">
                  <Paperclip size={18} /> Attach File (Max 5MB)
                </button>
                <button type="button" className="luxury-button bg-gradient-to-r from-emerald-deep to-[#0d6059] text-white px-8 py-3 rounded-xl font-bold">
                  Submit Ticket
                </button>
              </div>
            </form>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default Support;
