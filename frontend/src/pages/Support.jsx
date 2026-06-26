import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LifeBuoy, PlusCircle, MessageSquare, Clock, CheckCircle2, AlertCircle, ArrowLeft, Send } from 'lucide-react';
import { ticketService } from '../features/apiService';
import toast from 'react-hot-toast';

const Support = () => {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'create' | 'view'
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Create Form State
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [department, setDepartment] = useState('General');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reply State
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await ticketService.getUserTickets();
      setTickets(data.tickets || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load tickets');
    }
    setIsLoading(false);
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!subject || !message) return;
    
    setIsSubmitting(true);
    const loadingToast = toast.loading('Creating ticket...');
    
    try {
      await ticketService.createTicket({ subject, department, message });
      toast.dismiss(loadingToast);
      toast.success('Ticket created successfully');
      setSubject('');
      setMessage('');
      fetchTickets();
      setActiveTab('list');
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.message || 'Failed to create ticket');
    }
    setIsSubmitting(false);
  };

  const handleAddReply = async (e) => {
    e.preventDefault();
    if (!replyText || !selectedTicket) return;
    
    setIsReplying(true);
    try {
      const data = await ticketService.addReply(selectedTicket._id, { message: replyText });
      setSelectedTicket(data.ticket); // Update the active ticket view
      setReplyText('');
      toast.success('Reply added');
      // Also update in list
      setTickets(tickets.map(t => t._id === data.ticket._id ? data.ticket : t));
    } catch (err) {
      toast.error(err.message || 'Failed to add reply');
    }
    setIsReplying(false);
  };

  const renderStatus = (status) => {
    const styles = {
      'Open': 'bg-emerald-100 text-emerald-700',
      'In Progress': 'bg-amber-100 text-amber-700',
      'Pending Customer': 'bg-blue-100 text-blue-700',
      'Closed': 'bg-gray-100 text-gray-500'
    };
    return <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${styles[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>;
  };

  if (isLoading) {
    return (
      <div className="space-y-4 pt-6 max-w-6xl mx-auto">
        <div className="h-24 bg-white/50 animate-pulse rounded-[24px]" />
        <div className="h-[500px] bg-white/50 animate-pulse rounded-[24px]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-10 mt-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[24px] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] border border-gray-100">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#103A26] to-[#1a5c3d] flex items-center justify-center text-white shadow-lg">
            <LifeBuoy size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-brown-dark tracking-wide">Help Desk</h1>
            <p className="text-gray-500 mt-1 font-medium">Create and manage your enterprise support tickets.</p>
          </div>
        </div>
        
        {activeTab === 'list' && (
          <button 
            onClick={() => setActiveTab('create')}
            className="bg-[#103A26] text-white px-6 py-3.5 rounded-xl flex items-center gap-2 shadow-lg hover:-translate-y-0.5 transition-all hover:bg-[#1a5c3d]"
          >
            <PlusCircle size={20} />
            <span className="font-bold">New Ticket</span>
          </button>
        )}
        {activeTab !== 'list' && (
          <button 
            onClick={() => { setActiveTab('list'); setSelectedTicket(null); fetchTickets(); }}
            className="px-6 py-3.5 rounded-xl border border-gray-200 text-brown-dark hover:bg-gray-50 transition-colors font-bold flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Back to Tickets
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        
        {/* Ticket List View */}
        {activeTab === 'list' && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-[24px] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-brown-dark flex items-center gap-2">
                <MessageSquare size={18} className="text-emerald-deep" /> My Tickets
              </h2>
            </div>
            
            {tickets.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                  <LifeBuoy size={24} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-brown-dark mb-1">No Tickets Found</h3>
                <p className="text-gray-500 text-sm">You haven't submitted any support requests yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {tickets.map((ticket) => (
                  <div 
                    key={ticket._id} 
                    onClick={() => { setSelectedTicket(ticket); setActiveTab('view'); }}
                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <MessageSquare size={18} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-brown-dark group-hover:text-emerald-600 transition-colors">{ticket.subject}</h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-500 font-medium">
                          <span className="text-gray-400">ID: {ticket._id.slice(-6).toUpperCase()}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span>{ticket.department}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span className="flex items-center gap-1"><Clock size={12} /> {new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 self-start md:self-auto mt-2 md:mt-0 ml-14 md:ml-0">
                      {renderStatus(ticket.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Create Ticket View */}
        {activeTab === 'create' && (
          <motion.div key="create" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-[24px] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] border border-gray-100 p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-brown-dark mb-6">Open New Ticket</h2>
            
            <form onSubmit={handleCreateTicket} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Department</label>
                  <select 
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-gray-50 text-brown-dark"
                  >
                    <option>General Inquiry</option>
                    <option>Billing & Withdrawals</option>
                    <option>KYC Verification</option>
                    <option>Technical Support</option>
                    <option>Compliance</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Priority</label>
                  <select className="w-full px-4 py-3.5 rounded-xl border border-gray-200 outline-none bg-gray-50 text-brown-dark">
                    <option>Normal</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Subject</label>
                <input 
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary of your issue" 
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Description</label>
                <textarea 
                  rows="6" 
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide detailed information to help us resolve your issue quickly..."
                  className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none resize-none"
                ></textarea>
              </div>
              
              <div className="pt-4 flex justify-end gap-4 border-t border-gray-100">
                <button type="button" onClick={() => setActiveTab('list')} className="px-6 py-3.5 rounded-xl text-gray-500 hover:bg-gray-50 font-bold transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-[#103A26] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#1a5c3d] shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50">
                  {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* View Ticket View */}
        {activeTab === 'view' && selectedTicket && (
          <motion.div key="view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-[24px] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
            {/* Ticket Header */}
            <div className="p-8 border-b border-gray-100 bg-gray-50/30 flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ticket #{selectedTicket._id.slice(-6).toUpperCase()}</span>
                  {renderStatus(selectedTicket.status)}
                </div>
                <h2 className="text-2xl font-serif font-bold text-brown-dark">{selectedTicket.subject}</h2>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5"><Clock size={16} /> Created: {new Date(selectedTicket.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Conversation Thread */}
            <div className="p-8 space-y-6 bg-gray-50/50">
              
              {selectedTicket.messages.map((msg, index) => (
                <div key={index} className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                  {msg.sender !== 'user' && (
                    <div className="w-10 h-10 rounded-full bg-[#103A26] flex items-center justify-center shrink-0">
                      <LifeBuoy size={18} className="text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] rounded-2xl p-5 ${
                    msg.sender === 'user' 
                      ? 'bg-amber-gold text-white shadow-lg shadow-amber-gold/20 rounded-tr-none' 
                      : 'bg-white border border-gray-200 text-brown-dark shadow-sm rounded-tl-none'
                  }`}>
                    <div className={`text-xs font-bold mb-2 ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                      {msg.sender === 'user' ? 'You' : 'Support Team'} • {new Date(msg.timestamp).toLocaleString()}
                    </div>
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </div>
              ))}
              
            </div>

            {/* Reply Area */}
            {selectedTicket.status !== 'Closed' && (
              <div className="p-8 border-t border-gray-100 bg-white">
                <form onSubmit={handleAddReply}>
                  <textarea 
                    rows="4" 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    required
                    placeholder="Type your reply here..."
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-amber-gold focus:ring-1 focus:ring-amber-gold outline-none resize-none mb-4"
                  ></textarea>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Our support team typically responds within 24 hours.</span>
                    <button 
                      type="submit" 
                      disabled={isReplying}
                      className="bg-amber-gold text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#c26a05] shadow-lg shadow-amber-gold/20 transition-all hover:-translate-y-0.5 disabled:opacity-50"
                    >
                      <Send size={18} />
                      {isReplying ? 'Sending...' : 'Send Reply'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {selectedTicket.status === 'Closed' && (
              <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
                <CheckCircle2 className="mx-auto text-gray-400 mb-2" size={24} />
                <p className="text-gray-500 font-medium">This ticket is closed. Please open a new ticket if you need further assistance.</p>
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default Support;
