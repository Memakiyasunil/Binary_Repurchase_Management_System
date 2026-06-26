import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { User, CreditCard, Lock, Building2, Heart, CheckCircle, AlertCircle, Edit3, Save, X } from 'lucide-react';
import { profileService } from '../features/apiService';

const tabs = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'bank', label: 'Bank Details', icon: CreditCard },
  { id: 'nominee', label: 'Nominee', icon: Heart },
  { id: 'security', label: 'Security', icon: Lock },
];

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('personal');
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', mobile: '', dob: '', gender: '',
    address: '', city: '', state: '', country: '', pincode: ''
  });
  const [bankData, setBankData] = useState({ bankName: '', accountNumber: '', ifscCode: '', branchName: '', accountHolderName: '' });
  const [nomineeData, setNomineeData] = useState({ name: '', relation: '' });
  const [passData, setPassData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setProfile(data);
      setFormData({
        firstName: data.firstName || '', lastName: data.lastName || '',
        mobile: data.mobile || '', dob: data.dob ? data.dob.split('T')[0] : '',
        gender: data.gender || '', address: data.address || '',
        city: data.city || '', state: data.state || '',
        country: data.country || '', pincode: data.pincode || ''
      });
      setBankData(data.bankDetails || { bankName: '', accountNumber: '', ifscCode: '', branchName: '', accountHolderName: '' });
      setNomineeData(data.nominee || { name: '', relation: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await profileService.updateProfile(formData);
      showMsg('success', 'Profile updated successfully!');
      setIsEditing(false);
      fetchProfile();
    } catch (err) { showMsg('error', err.message); }
    setIsLoading(false);
  };

  const handleBankUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await profileService.updateBankDetails(bankData);
      showMsg('success', 'Bank details updated successfully!');
    } catch (err) { showMsg('error', err.message); }
    setIsLoading(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      return showMsg('error', 'New passwords do not match');
    }
    if (passData.newPassword.length < 6) {
      return showMsg('error', 'Password must be at least 6 characters');
    }
    setIsLoading(true);
    try {
      await profileService.changePassword({ currentPassword: passData.currentPassword, newPassword: passData.newPassword });
      showMsg('success', 'Password changed successfully!');
      setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { showMsg('error', err.message); }
    setIsLoading(false);
  };

  const inputClass = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all disabled:bg-gray-50 disabled:text-gray-400";

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold text-brown-dark">My Profile</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage your personal information and account settings</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
          profile?.kycStatus === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {profile?.kycStatus === 'Approved' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
          KYC: {profile?.kycStatus || 'Not Submitted'}
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-r from-[#103A26] to-[#1a5c3d] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold">
            {profile?.firstName?.[0]}{profile?.lastName?.[0]}
          </div>
          <div>
            <h3 className="text-lg font-bold">{profile?.firstName} {profile?.lastName}</h3>
            <p className="text-white/70 text-sm">@{profile?.username}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-semibold">{profile?.rank}</span>
              <span className="text-xs text-white/60">{profile?.email}</span>
            </div>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-white/50">Referral Code</p>
            <p className="font-bold text-amber-300 text-lg tracking-widest">{profile?.referralCode}</p>
          </div>
        </div>
      </div>

      {/* Alert */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium border ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-[#103A26] text-white shadow-lg'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300'
            }`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        {/* Personal Info */}
        {activeTab === 'personal' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-brown-dark">Personal Information</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 text-sm text-emerald-700 font-semibold"
              >
                {isEditing ? <><X size={14} /> Cancel</> : <><Edit3 size={14} /> Edit</>}
              </button>
            </div>
            <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'First Name', key: 'firstName' },
                { label: 'Last Name', key: 'lastName' },
                { label: 'Mobile', key: 'mobile' },
                { label: 'Date of Birth', key: 'dob', type: 'date' },
                { label: 'Address', key: 'address' },
                { label: 'City', key: 'city' },
                { label: 'State', key: 'state' },
                { label: 'Country', key: 'country' },
                { label: 'Pincode', key: 'pincode' },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">{field.label}</label>
                  <input
                    type={field.type || 'text'}
                    value={formData[field.key]}
                    onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                    disabled={!isEditing}
                    className={inputClass}
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Gender</label>
                <select
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value })}
                  disabled={!isEditing}
                  className={inputClass}
                >
                  <option value="">Select gender</option>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              {isEditing && (
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-[#103A26] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#1a5c3d] transition-colors disabled:opacity-60"
                  >
                    <Save size={14} /> {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Bank Details */}
        {activeTab === 'bank' && (
          <div>
            <h3 className="font-bold text-brown-dark mb-6">Bank Account Details</h3>
            <form onSubmit={handleBankUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Account Holder Name', key: 'accountHolderName' },
                { label: 'Bank Name', key: 'bankName' },
                { label: 'Account Number', key: 'accountNumber' },
                { label: 'IFSC Code', key: 'ifscCode' },
                { label: 'Branch Name', key: 'branchName' },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">{field.label}</label>
                  <input
                    type="text"
                    value={bankData[field.key] || ''}
                    onChange={e => setBankData({ ...bankData, [field.key]: e.target.value })}
                    className={inputClass}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                </div>
              ))}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-[#103A26] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#1a5c3d] transition-colors disabled:opacity-60"
                >
                  <Save size={14} /> {isLoading ? 'Saving...' : 'Update Bank Details'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Nominee */}
        {activeTab === 'nominee' && (
          <div>
            <h3 className="font-bold text-brown-dark mb-6">Nominee Details</h3>
            <form onSubmit={async (e) => {
              e.preventDefault(); setIsLoading(true);
              try {
                const r = await fetch('http://localhost:5000/api/profile/nominee', {
                  method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
                  body: JSON.stringify(nomineeData)
                });
                const d = await r.json();
                if (!r.ok) throw new Error(d.message);
                showMsg('success', 'Nominee updated!');
              } catch (err) { showMsg('error', err.message); }
              setIsLoading(false);
            }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Nominee Name</label>
                <input type="text" value={nomineeData.name || ''} onChange={e => setNomineeData({ ...nomineeData, name: e.target.value })} className={inputClass} placeholder="Full name" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Relationship</label>
                <select value={nomineeData.relation || ''} onChange={e => setNomineeData({ ...nomineeData, relation: e.target.value })} className={inputClass}>
                  <option value="">Select relation</option>
                  {['Spouse', 'Parent', 'Child', 'Sibling', 'Other'].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <button type="submit" disabled={isLoading} className="flex items-center gap-2 bg-[#103A26] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#1a5c3d] transition-colors">
                  <Save size={14} /> {isLoading ? 'Saving...' : 'Save Nominee'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Security */}
        {activeTab === 'security' && (
          <div>
            <h3 className="font-bold text-brown-dark mb-6">Change Password</h3>
            <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
              {[
                { label: 'Current Password', key: 'currentPassword' },
                { label: 'New Password', key: 'newPassword' },
                { label: 'Confirm New Password', key: 'confirmPassword' },
              ].map(field => (
                <div key={field.key} className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">{field.label}</label>
                  <input
                    type="password"
                    value={passData[field.key]}
                    onChange={e => setPassData({ ...passData, [field.key]: e.target.value })}
                    className={inputClass}
                    placeholder="••••••••"
                    required
                  />
                </div>
              ))}
              <div className="md:col-span-2">
                <button type="submit" disabled={isLoading} className="flex items-center gap-2 bg-[#103A26] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#1a5c3d] transition-colors">
                  <Lock size={14} /> {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
