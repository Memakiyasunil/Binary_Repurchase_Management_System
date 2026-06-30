import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, Trash2, Package, DollarSign, ShieldCheck, MessageSquare, Sparkles } from 'lucide-react';
import { notificationService } from '../features/apiService';

const typeConfig = {
  Income: { icon: DollarSign, bg: 'bg-emerald-100', color: 'text-emerald-700' },
  Purchase: { icon: Package, bg: 'bg-blue-100', color: 'text-blue-700' },
  KYC: { icon: ShieldCheck, bg: 'bg-purple-100', color: 'text-purple-700' },
  Withdrawal: { icon: DollarSign, bg: 'bg-amber-100', color: 'text-amber-700' },
  System: { icon: Sparkles, bg: 'bg-gray-100', color: 'text-gray-600' },
  Registration: { icon: Bell, bg: 'bg-emerald-100', color: 'text-emerald-700' },
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) { console.error(err); }
    setIsLoading(false);
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) { console.error(err); }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await fetch(`http://${window.location.hostname}:5000/api/notifications/${id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${user?.token}` }
      });
      const wasUnread = notifications.find(n => n._id === id && !n.isRead);
      setNotifications(prev => prev.filter(n => n._id !== id));
      if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold text-brown-dark">Notifications</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 text-sm text-emerald-700 font-semibold hover:text-emerald-900 bg-emerald-50 px-4 py-2 rounded-xl"
          >
            <CheckCheck size={14} /> Mark All Read
          </button>
        )}
      </div>

      {/* Notifications */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bell className="text-gray-400" size={24} />
          </div>
          <h3 className="font-bold text-gray-700 mb-1">No Notifications</h3>
          <p className="text-sm text-gray-500">You're all caught up! Notifications will appear here.</p>
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-2">
            {notifications.map((notif, i) => {
              const cfg = typeConfig[notif.type] || typeConfig.System;
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={notif._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${
                    notif.isRead ? 'bg-white border-gray-100' : 'bg-amber-50/50 border-amber-100'
                  }`}
                  onClick={() => !notif.isRead && handleMarkRead(notif._id)}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg} ${cfg.color}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-bold ${notif.isRead ? 'text-gray-700' : 'text-brown-dark'}`}>{notif.title}</p>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">
                        {new Date(notif.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notif.message}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${cfg.bg} ${cfg.color}`}>{notif.type}</span>
                      {!notif.isRead && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                    </div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); handleDelete(notif._id); }}
                    className="text-gray-300 hover:text-red-400 transition-colors shrink-0 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
