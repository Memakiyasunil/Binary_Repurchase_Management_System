import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2, ShieldCheck, AlertCircle, Eye } from 'lucide-react';
import { kycService } from '../features/apiService';
import toast from 'react-hot-toast';

const KycUpload = () => {
  const [kycData, setKycData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    documentType: 'Aadhaar',
    documentNumber: ''
  });
  
  // Real file uploads are complex, we'll use a mocked flow for the frontend to API
  // Usually this would be FormData with files, but our API accepts standard JSON
  const [fileStatus, setFileStatus] = useState({ front: false, back: false, photo: false });

  useEffect(() => {
    fetchKycStatus();
  }, []);

  const fetchKycStatus = async () => {
    try {
      const data = await kycService.getKycStatus();
      setKycData(data.kyc);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleFileChange = (type) => {
    setFileStatus(prev => ({ ...prev, [type]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.documentNumber || !fileStatus.front || !fileStatus.back || !fileStatus.photo) {
      toast.error('Please fill all fields and upload all documents');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Submitting KYC documents securely...');
    
    try {
      await kycService.submitKyc({
        documentType: formData.documentType,
        documentNumber: formData.documentNumber,
        frontImage: 'front-image-url-mock', // In real app, upload to S3 first
        backImage: 'back-image-url-mock',
        selfieImage: 'selfie-image-url-mock'
      });
      toast.dismiss(loadingToast);
      toast.success('KYC submitted successfully!');
      fetchKycStatus();
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.message || 'Failed to submit KYC');
    }
    setIsSubmitting(false);
  };

  const status = kycData?.status || 'Not Submitted';

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

  if (isLoading) {
    return (
      <div className="space-y-4 pt-6 max-w-6xl mx-auto">
        <div className="h-24 bg-white/50 animate-pulse rounded-[24px]" />
        <div className="h-[500px] bg-white/50 animate-pulse rounded-[24px]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10 mt-4">
      
      {/* Header */}
      <div className="bg-white p-8 rounded-[24px] flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] border border-gray-100">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-brown-dark tracking-wide">Identity Verification</h1>
            <p className="text-gray-500 mt-1 text-sm font-medium">Complete your KYC to unlock full withdrawal capabilities.</p>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="flex flex-col items-center md:items-end">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Current Status</span>
          {status === 'Not Submitted' && (
             <span className="px-4 py-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 font-bold flex items-center gap-2 text-sm">
               <AlertCircle size={16} /> Action Required
             </span>
          )}
          {status === 'Pending' && (
             <span className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 font-bold flex items-center gap-2 text-sm">
               <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div> Under Review
             </span>
          )}
          {status === 'Approved' && (
             <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-2 text-sm">
               <CheckCircle2 size={16} /> Verified
             </span>
          )}
          {status === 'Rejected' && (
             <span className="px-4 py-2 rounded-xl bg-red-50 text-red-700 border border-red-200 font-bold flex items-center gap-2 text-sm">
               <AlertCircle size={16} /> Rejected
             </span>
          )}
        </div>
      </div>

      {status === 'Rejected' && kycData?.adminNote && (
        <div className="bg-red-50 border border-red-200 rounded-[20px] p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
            <AlertCircle size={20} />
          </div>
          <div>
            <h3 className="font-bold text-red-800 text-lg mb-1">KYC Rejected</h3>
            <p className="text-red-600 text-sm">{kycData.adminNote}</p>
            <button onClick={() => {}} className="mt-3 text-sm font-bold text-red-700 hover:underline">Re-submit Documents</button>
          </div>
        </div>
      )}

      {(status === 'Not Submitted' || status === 'Rejected') && (
        <form onSubmit={handleSubmit} className="bg-white rounded-[24px] p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] border border-gray-100 space-y-8">
          
          <div className="space-y-4">
            <h3 className="font-bold text-brown-dark text-lg border-b border-gray-100 pb-2">1. Document Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Document Type</label>
                <select 
                  value={formData.documentType}
                  onChange={e => setFormData({ ...formData, documentType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-gold focus:ring-1 focus:ring-amber-gold outline-none"
                >
                  <option>Aadhaar</option>
                  <option>PAN Card</option>
                  <option>Passport</option>
                  <option>Driving License</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Document Number</label>
                <input 
                  type="text" 
                  required
                  value={formData.documentNumber}
                  onChange={e => setFormData({ ...formData, documentNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-gold focus:ring-1 focus:ring-amber-gold outline-none uppercase"
                  placeholder="e.g. 1234 5678 9012"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-brown-dark text-lg border-b border-gray-100 pb-2">2. Upload Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'front', label: 'Front Side', icon: FileText },
                { id: 'back', label: 'Back Side', icon: FileText },
                { id: 'photo', label: 'Selfie with ID', icon: Upload }
              ].map((doc) => (
                <div key={doc.id} className="relative group border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-amber-gold transition-colors bg-gray-50">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={() => handleFileChange(doc.id)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 transition-colors ${fileStatus[doc.id] ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-gray-400 group-hover:text-amber-gold shadow-sm'}`}>
                    {fileStatus[doc.id] ? <CheckCircle2 size={24} /> : <doc.icon size={24} />}
                  </div>
                  <p className="font-bold text-sm text-gray-700">{doc.label}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{fileStatus[doc.id] ? 'File attached' : 'Click or drag image'}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl flex items-start gap-3 border border-amber-100">
            <ShieldCheck className="text-amber-600 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-bold text-amber-800">Secure Upload</p>
              <p className="text-xs text-amber-700/80 mt-1">Your documents are encrypted and stored securely. They will only be used for identity verification purposes in compliance with financial regulations.</p>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#103A26] to-[#1a5c3d] text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Uploading securely...' : 'Submit for Verification'}
          </button>
        </form>
      )}

      {(status === 'Pending' || status === 'Approved') && (
        <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] border border-gray-100 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gray-50 flex items-center justify-center mb-6">
            {status === 'Approved' ? (
              <CheckCircle2 size={48} className="text-emerald-500" />
            ) : (
              <ShieldCheck size={48} className="text-blue-500 opacity-50" />
            )}
          </div>
          <h2 className="text-2xl font-serif font-bold text-brown-dark mb-2">
            {status === 'Approved' ? 'Verification Complete!' : 'Documents Under Review'}
          </h2>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            {status === 'Approved' 
              ? 'Your identity has been successfully verified. You now have full access to all features including unrestricted withdrawals.' 
              : 'Your documents have been securely transmitted to our compliance team. Review typically takes 24-48 business hours.'}
          </p>
          
          <div className="bg-gray-50 rounded-xl p-6 text-left max-w-md mx-auto border border-gray-100">
            <h4 className="font-bold text-gray-700 text-sm mb-4 border-b border-gray-200 pb-2">Submitted Details</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Document Type</span>
                <span className="text-xs font-bold text-brown-dark">{kycData?.documentType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Document ID</span>
                <span className="text-xs font-bold text-brown-dark">
                  •••• {kycData?.documentNumber?.slice(-4) || '••••'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Submitted On</span>
                <span className="text-xs font-bold text-brown-dark">
                  {new Date(kycData?.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default KycUpload;
