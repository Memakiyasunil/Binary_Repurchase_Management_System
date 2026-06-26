import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

const KycUpload = () => {
  const [documents, setDocuments] = useState({
    aadhaar: null,
    pan: null,
    photo: null,
    passbook: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('Not Submitted'); // 'Pending', 'Approved', 'Rejected'

  const handleFileChange = (e, docType) => {
    if (e.target.files && e.target.files[0]) {
      setDocuments({
        ...documents,
        [docType]: e.target.files[0]
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API upload
    setTimeout(() => {
      setIsSubmitting(false);
      setStatus('Pending');
    }, 2000);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const DocumentUploadCard = ({ title, type, description, icon: Icon }) => (
    <motion.div variants={item} className="glass-card-luxury p-6 flex flex-col items-center justify-center relative overflow-hidden group">
      <input 
        type="file" 
        accept="image/*,.pdf" 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        onChange={(e) => handleFileChange(e, type)}
        disabled={status === 'Pending' || status === 'Approved'}
      />
      
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${documents[type] ? 'bg-emerald-success/10 text-emerald-success' : 'bg-beige-soft/30 text-brown-dark/40 group-hover:bg-amber-gold/10 group-hover:text-amber-gold'}`}>
        {documents[type] ? <CheckCircle2 size={32} /> : <Icon size={32} />}
      </div>
      
      <h3 className="text-lg font-serif font-bold text-brown-dark mb-1">{title}</h3>
      <p className="text-xs text-brown-dark/50 text-center px-4 font-medium h-8">
        {documents[type] ? <span className="text-emerald-success font-bold">{documents[type].name}</span> : description}
      </p>
      
      <div className={`mt-4 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold ${documents[type] ? 'bg-emerald-success text-white shadow-md' : 'bg-cream border border-beige-soft text-brown-dark/50'}`}>
        {documents[type] ? 'Ready to Upload' : 'Click to Browse'}
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in">
      
      {/* Header */}
      <div className="glass-premium p-8 rounded-[24px] flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-l-emerald-deep">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-deep to-[#0d6059] rounded-2xl flex items-center justify-center text-ivory shadow-lg shadow-emerald-deep/20">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-brown-dark tracking-wide">Identity Verification</h1>
            <p className="text-brown-dark/60 mt-1 font-medium">Complete your KYC to unlock full withdrawal capabilities and tier upgrades.</p>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-brown-dark/50 font-bold mb-1">Current Status</span>
          {status === 'Not Submitted' && (
             <span className="px-4 py-2 rounded-xl bg-amber-gold/10 text-amber-gold border border-amber-gold/20 font-bold flex items-center gap-2">
               <AlertCircle size={16} /> Action Required
             </span>
          )}
          {status === 'Pending' && (
             <span className="px-4 py-2 rounded-xl bg-blue-500/10 text-blue-600 border border-blue-500/20 font-bold flex items-center gap-2">
               <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div> Under Review
             </span>
          )}
          {status === 'Approved' && (
             <span className="px-4 py-2 rounded-xl bg-emerald-success/10 text-emerald-success border border-emerald-success/20 font-bold flex items-center gap-2">
               <CheckCircle2 size={16} /> Fully Verified
             </span>
          )}
        </div>
      </div>

      {status === 'Approved' ? (
        <div className="glass-card-luxury p-12 text-center flex flex-col items-center">
          <ShieldCheck size={64} className="text-emerald-success mb-6" />
          <h2 className="text-2xl font-serif font-bold text-brown-dark">Your account is fully verified</h2>
          <p className="text-brown-dark/60 mt-2 max-w-lg">Thank you for submitting your KYC documents. Your identity has been verified by our enterprise compliance team.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <DocumentUploadCard 
              title="Aadhaar Card" 
              type="aadhaar" 
              description="Front and back scan (PDF/JPG)"
              icon={FileText} 
            />
            <DocumentUploadCard 
              title="PAN Card" 
              type="pan" 
              description="Clear photo of physical card"
              icon={FileText} 
            />
            <DocumentUploadCard 
              title="Passport Photo" 
              type="photo" 
              description="Recent color photograph"
              icon={Upload} 
            />
            <DocumentUploadCard 
              title="Bank Passbook" 
              type="passbook" 
              description="Front page with account details"
              icon={FileText} 
            />
          </motion.div>

          {/* Actions */}
          <div className="mt-10 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || status === 'Pending'}
              className="luxury-button bg-gradient-to-r from-emerald-deep to-[#0d6059] text-white px-10 py-4 text-lg flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Encrypting & Uploading...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={20} />
                  <span>Submit Documents for Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

    </div>
  );
};

export default KycUpload;
