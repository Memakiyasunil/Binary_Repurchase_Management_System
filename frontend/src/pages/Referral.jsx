import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Copy, Share2, CheckCircle, QrCode, TrendingUp, ArrowRight, Gift } from 'lucide-react';
import { profileService } from '../features/apiService';

export default function Referral() {
  const [referralData, setReferralData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState('');

  useEffect(() => { fetchReferral(); }, []);

  const fetchReferral = async () => {
    try {
      const data = await profileService.getReferralInfo();
      setReferralData(data);
    } catch (err) { console.error(err); }
    setIsLoading(false);
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2500);
  };

  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join Binary Repurchase MLM',
        text: `Join me on Binary Repurchase and start your journey to financial freedom! Use my Sponsor ID: ${referralData?.referralCode}`,
        url: referralData?.referralLink
      });
    } else {
      copyToClipboard(referralData?.referralLink, 'link');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse h-24" />
        ))}
      </div>
    );
  }

  const stats = [
    { label: 'Direct Referrals', value: referralData?.totalDirectReferrals || 0, icon: Users, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Left Team', value: referralData?.totalLeftMembers || 0, icon: TrendingUp, color: 'text-blue-600 bg-blue-50' },
    { label: 'Right Team', value: referralData?.totalRightMembers || 0, icon: TrendingUp, color: 'text-purple-600 bg-purple-50' },
    { label: 'Left BV', value: `${(referralData?.leftBusinessVolume || 0).toLocaleString('en-IN')}`, icon: Gift, color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-serif font-bold text-brown-dark">Referral Program</h2>
        <p className="text-xs text-gray-500 mt-0.5">Invite friends and earn ₹200 per direct referral</p>
      </div>

      {/* Hero Referral Card */}
      <div className="bg-gradient-to-br from-[#103A26] to-[#1e5c3c] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full -translate-y-24 translate-x-24" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-300/10 rounded-full translate-y-16 -translate-x-16" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Gift className="text-amber-400" size={18} />
            <span className="text-amber-400 font-semibold text-sm">Referral Bonus</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">₹200 Per Referral</h3>
          <p className="text-white/60 text-sm">Earn instantly when your referral joins and verifies their account</p>
          
          {/* Referral Code / Sponsor ID */}
          <div className="mt-6 bg-white/10 rounded-xl p-4">
            <p className="text-white/50 text-xs mb-1">Your Sponsor ID</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold tracking-widest text-amber-400">{referralData?.referralCode}</span>
              <button
                onClick={() => copyToClipboard(referralData?.referralCode, 'code')}
                className="flex items-center gap-2 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              >
                {copied === 'code' ? <><CheckCircle size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Link */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <p className="text-xs font-semibold text-gray-500 mb-2">Your Referral Link</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-600 truncate font-mono">
            {referralData?.referralLink}
          </div>
          <button
            onClick={() => copyToClipboard(referralData?.referralLink, 'link')}
            className={`flex items-center gap-1.5 px-4 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              copied === 'link' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {copied === 'link' ? <><CheckCircle size={12} /> Copied!</> : <><Copy size={12} /> Copy Link</>}
          </button>
          <button
            onClick={shareReferral}
            className="flex items-center gap-1.5 bg-[#103A26] text-white px-4 py-3 rounded-xl text-xs font-bold hover:bg-[#1a5c3d] transition-all whitespace-nowrap"
          >
            <Share2 size={12} /> Share
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.color} mb-3`}>
              <stat.icon size={16} />
            </div>
            <p className="text-xl font-bold text-brown-dark">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-brown-dark mb-4">How Referral Works</h3>
        <div className="space-y-4">
          {[
            { step: '1', title: 'Share Your Referral Link', desc: 'Share your unique Sponsor ID or link with friends and family' },
            { step: '2', title: 'Friend Registers', desc: 'Your friend registers using your Sponsor ID and verifies their email' },
            { step: '3', title: 'You Get ₹200', desc: 'Instantly receive ₹200 in your wallet as Direct Referral Bonus' },
            { step: '4', title: 'Build Your Tree', desc: 'Build your binary network and earn Binary Matching bonuses on their purchases' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#103A26] to-[#1a5c3d] flex items-center justify-center text-white text-xs font-bold shrink-0">{item.step}</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              {i < 3 && <ArrowRight className="text-gray-300 shrink-0 mt-1" size={14} />}
            </div>
          ))}
        </div>
      </div>

      {/* Direct Referrals List */}
      {referralData?.directReferrals?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-brown-dark mb-4">Your Direct Referrals ({referralData.directReferrals.length})</h3>
          <div className="space-y-3">
            {referralData.directReferrals.map((member, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold">
                  {member.firstName?.[0]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">{member.firstName} {member.lastName}</p>
                  <p className="text-xs text-gray-400">@{member.username} • {member.rank}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  member.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                }`}>{member.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
