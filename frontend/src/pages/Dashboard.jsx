import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Users, BarChart3, Wallet, Clock, ShoppingBag, 
  ChevronDown, Search, Bell, MessageSquare, ShoppingCart, User as UserIcon,
  Sparkles, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight, MoreHorizontal
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const areaData = [
  { name: '15 May', value: 20 },
  { name: '16 May', value: 35 },
  { name: '17 May', value: 25 },
  { name: '18 May', value: 45 },
  { name: '19 May', value: 65 },
  { name: '20 May', value: 55 },
  { name: '21 May', value: 85 }
];

const pieData = [
  { name: 'Direct Income', value: 45, color: '#10B981' },
  { name: 'Binary Income', value: 25, color: '#3F6212' },
  { name: 'Matching Bonus', value: 15, color: '#D97706' },
  { name: 'Leadership Bonus', value: 10, color: '#B45309' },
  { name: 'Others', value: 5, color: '#E7D7B1' }
];

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      
      {/* Overview Header */}
      <div className="flex items-center justify-between mb-4 mt-6">
        <div className="flex items-center gap-2">
          <Sparkles className="text-amber-gold" size={18} />
          <div>
            <h2 className="text-lg font-serif font-bold text-brown-dark">Dashboard Overview</h2>
            <p className="text-xs text-gray-500">Real-time overview of your MLM business</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-brown-dark shadow-sm">
          <Clock size={14} className="text-gray-400" />
          May 15 - May 21, 2025
          <ChevronDown size={14} className="text-gray-400" />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {[
          { title: 'Total Users', value: '12,568', desc: 'Total registered users', icon: Users, color: 'text-emerald-success', bg: 'bg-emerald-success/10', trend: '+18.5%', trendUp: true },
          { title: 'Total Business Volume', value: '₹4,58,75,000', desc: 'Total BV this week', icon: BarChart3, color: 'text-amber-gold', bg: 'bg-amber-gold/10', trend: '+24.8%', trendUp: true },
          { title: 'Total Earnings', value: '₹1,25,78,000', desc: 'Total earnings paid', icon: Wallet, color: 'text-emerald-success', bg: 'bg-emerald-success/10', trend: '+22.4%', trendUp: true },
          { title: 'Pending Withdrawals', value: '₹18,45,000', desc: 'Pending approval', icon: Clock, color: 'text-amber-gold', bg: 'bg-amber-gold/10', trend: '-5.6%', trendUp: false },
          { title: 'Total Products Sold', value: '25,487', desc: 'Products this week', icon: ShoppingBag, color: 'text-purple-500', bg: 'bg-purple-500/10', trend: '+16.7%', trendUp: true }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-[20px] p-5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-semibold text-gray-500">{stat.title}</p>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon size={14} />
              </div>
            </div>
            <div className="flex items-end gap-2 mb-1">
              <h3 className="text-2xl font-serif font-bold text-brown-dark">{stat.value}</h3>
              <span className={`text-[10px] font-bold flex items-center mb-1 ${stat.trendUp ? 'text-emerald-success' : 'text-amber-gold'}`}>
                {stat.trendUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {stat.trend}
              </span>
            </div>
            <p className="text-[10px] text-gray-400">{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Area Chart */}
        <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] border border-gray-100 lg:col-span-5 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-amber-gold" size={16} />
              <h3 className="font-bold text-brown-dark text-sm">Business Volume Overview</h3>
            </div>
            <button className="flex items-center gap-1 text-xs border border-gray-200 px-3 py-1 rounded text-gray-500">
              This Week <ChevronDown size={12} />
            </button>
          </div>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} tickFormatter={(val) => `${val}L`} />
                <CartesianGrid vertical={false} stroke="#F3F4F6" strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorBv)" dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#10B981' }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] border border-gray-100 lg:col-span-4 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-amber-gold" size={16} />
            <h3 className="font-bold text-brown-dark text-sm">Income Summary</h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="h-[200px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                <span className="text-lg font-bold text-brown-dark">₹1,25,78,000</span>
                <span className="text-[9px] text-gray-500">Total Income</span>
              </div>
            </div>
            
            <div className="w-full mt-4 space-y-2">
              {pieData.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-bold" style={{ color: item.color }}>₹{item.value},45,000</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] border border-gray-100 lg:col-span-3 flex flex-col w-full overflow-hidden">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="text-amber-gold" size={16} />
            <h3 className="font-bold text-brown-dark text-sm">Recent Activities</h3>
          </div>
          <div className="space-y-6">
            {[
              { icon: UserIcon, title: 'New user registered', desc: 'John Doe', time: '2 mins ago', bg: 'bg-emerald-deep/10', color: 'text-emerald-deep' },
              { icon: Wallet, title: 'Withdrawal request', desc: '₹15,000 by User ID: BR1234', time: '10 mins ago', bg: 'bg-ruby-red/10', color: 'text-ruby-red' },
              { icon: ShoppingBag, title: 'Product purchased', desc: 'Wellness Package', time: '15 mins ago', bg: 'bg-amber-gold/10', color: 'text-amber-gold' },
              { icon: CheckCircle2, title: 'KYC approved', desc: 'User ID: BR5678', time: '30 mins ago', bg: 'bg-emerald-success/10', color: 'text-emerald-success' }
            ].map((activity, i) => (
              <div key={i} className="flex gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${activity.bg} ${activity.color}`}>
                  <activity.icon size={14} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-bold text-brown-dark">{activity.title}</p>
                    <span className="text-[9px] text-gray-400">{activity.time}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5">{activity.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-auto py-2 border border-amber-gold/30 text-amber-gold text-xs font-bold rounded-full hover:bg-amber-gold/5 transition-colors">
            View All Activities
          </button>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Sponsors */}
        <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="text-amber-gold" size={16} />
            <h3 className="font-bold text-brown-dark text-sm">Top Sponsors This Week</h3>
          </div>
          <div className="space-y-4 mb-4">
            {[
              { rank: 1, name: 'Sarah Johnson', level: 'Diamond', amount: '₹8,75,000' },
              { rank: 2, name: 'Michael Smith', level: 'Crown Diamond', amount: '₹7,25,000' },
              { rank: 3, name: 'David Brown', level: 'Platinum', amount: '₹6,50,000' },
            ].map((sponsor, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 font-bold w-4">{sponsor.rank}</span>
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=${sponsor.name}&background=random`} alt={sponsor.name} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brown-dark">{sponsor.name}</p>
                    <p className="text-[10px] text-gray-500">{sponsor.level}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-brown-dark">{sponsor.amount}</span>
              </div>
            ))}
          </div>
          <button className="w-max mx-auto px-6 py-1.5 border border-amber-gold/30 text-amber-gold text-xs font-bold rounded-full hover:bg-amber-gold/5 transition-colors">
            View All Sponsors
          </button>
        </div>

        {/* Recent Withdrawals */}
        <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Wallet className="text-amber-gold" size={16} />
            <h3 className="font-bold text-brown-dark text-sm">Recent Withdrawals</h3>
          </div>
          <div className="space-y-4 mb-4">
            {[
              { id: 'BR1234', amount: '₹25,000', status: 'Pending', date: 'May 21, 2025' },
              { id: 'BR5678', amount: '₹15,000', status: 'Pending', date: 'May 21, 2025' },
              { id: 'BR9101', amount: '₹35,000', status: 'Approved', date: 'May 20, 2025' },
            ].map((wd, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 font-bold w-4">{i + 1}</span>
                  <div>
                    <p className="text-xs font-bold text-brown-dark">{wd.id}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-brown-dark">{wd.amount}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${wd.status === 'Approved' ? 'bg-emerald-success/10 text-emerald-success' : 'bg-amber-gold/10 text-amber-gold'}`}>
                  {wd.status}
                </span>
                <span className="text-[10px] text-gray-400">{wd.date}</span>
              </div>
            ))}
          </div>
          <button className="w-max mx-auto px-6 py-1.5 border border-amber-gold/30 text-amber-gold text-xs font-bold rounded-full hover:bg-amber-gold/5 transition-colors">
            View All Withdrawals
          </button>
        </div>

        {/* Banner Card */}
        <div className="bg-gradient-to-br from-[#0a1e14] to-[#123122] rounded-[20px] p-8 shadow-xl relative overflow-hidden flex flex-col justify-center">
          <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none">
            {/* Using a generic SVG path to simulate the golden arrow chart in the image */}
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 180L80 120L120 150L180 60" stroke="#D97706" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M180 60V100M180 60H140" stroke="#D97706" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h2 className="text-3xl font-serif font-bold text-white leading-tight mb-2 relative z-10">
            Grow Together <br/>
            Earn Together <br/>
            Succeed Together
          </h2>
          <p className="text-sm text-ivory/60 mb-6 relative z-10">Building a better future together</p>
          
          <button className="bg-amber-gold text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-amber-gold/20 w-max hover:bg-[#c26a05] transition-colors relative z-10">
            Learn More
          </button>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
