import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, BarChart3, Wallet, Clock, ShoppingBag, 
  ChevronDown, Bell, CheckCircle2, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { walletService, incomeService, profileService, notificationService, withdrawalService } from '../features/apiService';

const COLORS = ['#10B981', '#3F6212', '#D97706', '#B45309', '#E7D7B1'];

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  
  const [wallet, setWallet] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [incomeSummary, setIncomeSummary] = useState([]);
  const [referralInfo, setReferralInfo] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [walletData, incomeData, refData, notifData, wdData] = await Promise.all([
        walletService.getWallet(),
        incomeService.getUserIncome({ limit: 10 }),
        profileService.getReferralInfo(),
        notificationService.getNotifications(),
        withdrawalService.getUserWithdrawals({ limit: 5 })
      ]);

      setWallet(walletData.wallet);
      setIncomes(incomeData.incomes);
      setIncomeSummary(incomeData.summary || []);
      setReferralInfo(refData);
      setRecentActivities(notifData.notifications?.slice(0, 5) || []);
      setWithdrawals(wdData.withdrawals || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
    setIsLoading(false);
  };

  const pieData = incomeSummary.length > 0 
    ? incomeSummary.map((item, i) => ({
        name: item._id,
        value: item.total,
        color: COLORS[i % COLORS.length]
      }))
    : [{ name: 'No Data', value: 1, color: '#e5e7eb' }];

  if (isLoading) {
    return (
      <div className="space-y-4 pt-6">
        <div className="h-24 bg-white/50 animate-pulse rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white/50 animate-pulse rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      
      {/* Overview Header */}
      <div className="flex items-center justify-between mb-4 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg">
            {user?.firstName?.[0]}
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-brown-dark">Welcome back, {user?.firstName}!</h2>
            <p className="text-xs text-gray-500">Rank: <span className="font-bold text-amber-600">{user?.rank}</span></p>
          </div>
        </div>
        <Link to="/reports" className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-brown-dark shadow-sm hover:bg-gray-50">
          <BarChart3 size={14} className="text-gray-400" />
          View Reports
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { title: 'Wallet Balance', value: `₹${(wallet?.balance || 0).toLocaleString('en-IN')}`, desc: 'Available for withdrawal', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { title: 'Total Earnings', value: `₹${(wallet?.totalEarnings || 0).toLocaleString('en-IN')}`, desc: 'Lifetime earnings', icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-50' },
          { title: 'Pending Withdrawals', value: `₹${(wallet?.pendingWithdrawals || 0).toLocaleString('en-IN')}`, desc: 'Awaiting admin approval', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Direct Referrals', value: referralInfo?.totalDirectReferrals || 0, desc: 'Total active referrals', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-[20px] p-5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-semibold text-gray-500">{stat.title}</p>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon size={14} />
              </div>
            </div>
            <h3 className="text-2xl font-serif font-bold text-brown-dark mb-1">{stat.value}</h3>
            <p className="text-[10px] text-gray-400">{stat.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Network Stats */}
        <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] border border-gray-100 lg:col-span-5 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Users className="text-amber-600" size={16} />
              <h3 className="font-bold text-brown-dark text-sm">Binary Network</h3>
            </div>
            <Link to="/tree" className="text-xs text-emerald-600 font-semibold hover:underline">View Tree</Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4 flex-1">
            <div className="bg-gray-50 rounded-xl p-4 flex flex-col justify-center items-center text-center border border-gray-100">
              <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Left Leg</p>
              <p className="text-2xl font-bold text-brown-dark">{referralInfo?.totalLeftMembers || 0}</p>
              <p className="text-[10px] text-gray-400 mt-1">Members</p>
              <div className="w-full h-px bg-gray-200 my-2" />
              <p className="text-sm font-bold text-emerald-600">{referralInfo?.leftBusinessVolume || 0} BV</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex flex-col justify-center items-center text-center border border-gray-100">
              <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Right Leg</p>
              <p className="text-2xl font-bold text-brown-dark">{referralInfo?.totalRightMembers || 0}</p>
              <p className="text-[10px] text-gray-400 mt-1">Members</p>
              <div className="w-full h-px bg-gray-200 my-2" />
              <p className="text-sm font-bold text-amber-600">{referralInfo?.rightBusinessVolume || 0} BV</p>
            </div>
          </div>
        </div>

        {/* Income Donut */}
        <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] border border-gray-100 lg:col-span-4 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="text-amber-600" size={16} />
            <h3 className="font-bold text-brown-dark text-sm">Income Breakdown</h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="h-[180px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full mt-2 space-y-2">
              {pieData.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-gray-600 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold" style={{ color: item.color }}>
                    {item.name === 'No Data' ? '-' : `₹${item.value.toLocaleString()}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] border border-gray-100 lg:col-span-3 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="text-amber-600" size={16} />
              <h3 className="font-bold text-brown-dark text-sm">Recent Activity</h3>
            </div>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            {recentActivities.length === 0 ? (
              <p className="text-xs text-gray-400 text-center mt-10">No recent activity</p>
            ) : recentActivities.map((activity, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-brown-dark line-clamp-1">{activity.title}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{activity.message}</p>
                  <span className="text-[9px] text-gray-400">{new Date(activity.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Incomes */}
        <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-brown-dark text-sm">Recent Earnings</h3>
            <Link to="/reports" className="text-[10px] text-emerald-600 font-bold hover:underline">VIEW ALL</Link>
          </div>
          <div className="space-y-3">
            {incomes.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No earnings yet</p>
            ) : incomes.slice(0, 5).map((inc, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-brown-dark">{inc.incomeType}</p>
                  <p className="text-[10px] text-gray-500">{new Date(inc.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="text-sm font-bold text-emerald-600">+₹{inc.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Withdrawals */}
        <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-brown-dark text-sm">Recent Withdrawals</h3>
            <Link to="/withdrawals" className="text-[10px] text-emerald-600 font-bold hover:underline">VIEW ALL</Link>
          </div>
          <div className="space-y-3">
            {withdrawals.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No withdrawals yet</p>
            ) : withdrawals.slice(0, 5).map((wd, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-brown-dark">₹{wd.amount.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-500">{new Date(wd.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-md font-bold ${
                  wd.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                  wd.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {wd.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

