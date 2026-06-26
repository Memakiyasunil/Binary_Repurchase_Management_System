import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, CheckCircle, Truck, Clock, X, Eye, ChevronRight } from 'lucide-react';
import { orderService } from '../features/apiService';

const statusConfig = {
  Pending: { color: 'text-amber-600 bg-amber-50 border-amber-200', icon: Clock },
  Processing: { color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Package },
  Dispatched: { color: 'text-purple-600 bg-purple-50 border-purple-200', icon: Truck },
  Completed: { color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle },
  Cancelled: { color: 'text-red-600 bg-red-50 border-red-200', icon: X },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [stats, setStats] = useState({ total: 0, totalSpent: 0, totalBV: 0 });

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getUserOrders({ limit: 50 });
      setOrders(data.orders || []);
      const totalSpent = (data.orders || []).reduce((acc, o) => acc + o.totalPrice, 0);
      const totalBV = (data.orders || []).reduce((acc, o) => acc + o.totalBV, 0);
      setStats({ total: data.total || 0, totalSpent, totalBV });
    } catch (err) { console.error(err); }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
            <div className="h-3 bg-gray-100 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-serif font-bold text-brown-dark">My Orders</h2>
        <p className="text-xs text-gray-500 mt-0.5">Track your repurchase orders and history</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Orders', value: stats.total, icon: ShoppingBag, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Total Spent', value: `₹${stats.totalSpent.toLocaleString('en-IN')}`, icon: Package, color: 'text-amber-600 bg-amber-50' },
          { label: 'Total BV', value: stats.totalBV.toLocaleString('en-IN'), icon: CheckCircle, color: 'text-purple-600 bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.color} mb-3`}>
              <stat.icon size={16} />
            </div>
            <p className="text-lg font-bold text-brown-dark">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="text-gray-400" size={24} />
          </div>
          <h3 className="font-bold text-gray-700 mb-1">No Orders Yet</h3>
          <p className="text-sm text-gray-500">Start shopping to see your orders here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order, i) => {
            const cfg = statusConfig[order.orderStatus] || statusConfig.Pending;
            const StatusIcon = cfg.icon;
            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-brown-dark text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${cfg.color}`}>
                      <StatusIcon size={11} /> {order.orderStatus}
                    </span>
                  </div>

                  <div className="flex gap-3 mb-4">
                    <div className="bg-gray-50 rounded-xl p-2 flex-1 text-center">
                      <p className="text-xs text-gray-400">Total Amount</p>
                      <p className="font-bold text-brown-dark">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2 flex-1 text-center">
                      <p className="text-xs text-gray-400">Business Volume</p>
                      <p className="font-bold text-brown-dark">{order.totalBV} BV</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2 flex-1 text-center">
                      <p className="text-xs text-gray-400">Items</p>
                      <p className="font-bold text-brown-dark">{order.orderItems?.length}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">Payment: <span className="font-semibold text-gray-600">{order.paymentMethod}</span></p>
                    <button
                      onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                      className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                    >
                      <Eye size={12} /> View Items <ChevronRight size={12} className={`transition-transform ${selectedOrder?._id === order._id ? 'rotate-90' : ''}`} />
                    </button>
                  </div>

                  {selectedOrder?._id === order._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-gray-100"
                    >
                      {order.orderItems?.map((item, j) => (
                        <div key={j} className="flex justify-between items-center py-2 text-sm">
                          <span className="text-gray-700">{item.name} × {item.qty}</span>
                          <span className="font-semibold text-brown-dark">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
