import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight, ShieldCheck, CreditCard, Home } from 'lucide-react';
import { removeFromCart, clearCartItems } from '../features/cart/cartSlice';
import { orderService } from '../features/apiService';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: 'India'
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate totals
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalBV = cartItems.reduce((acc, item) => acc + (item.bv * item.qty), 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    toast.success('Item removed from cart');
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    
    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
      toast.error('Please fill in all shipping details');
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading('Processing payment securely...');

    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id,
          qty: item.qty
        })),
        shippingAddress,
        paymentMethod: 'Wallet' // Default for this MLM
      };

      await orderService.createOrder(orderData);
      
      toast.dismiss(loadingToast);
      toast.success('Order placed successfully! Commissions processed.', { icon: '🎉' });
      
      dispatch(clearCartItems());
      navigate('/orders'); // Redirect to orders page
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Payment failed. Check your wallet balance.');
    }
    setIsProcessing(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-6xl mx-auto px-4">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart size={40} className="text-gray-300" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-brown-dark mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">Browse our premium enterprise collection to generate BV and unlock leadership rewards.</p>
        <Link 
          to="/store" 
          className="bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
        >
          Return to Store <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-10 mt-4 px-4 lg:px-0">
      
      {/* Header */}
      <div className="bg-white p-6 md:p-8 rounded-[24px] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm">
            <ShoppingCart size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-brown-dark tracking-wide">Secure Checkout</h1>
            <p className="text-gray-500 mt-1 font-medium">Review your items and complete your purchase.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Items Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="font-bold text-brown-dark text-lg">Order Items ({totalItems})</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <div key={item._id} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <div className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center p-2 border border-gray-100 shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <span className="text-4xl text-gray-200">⚜️</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{item.category}</span>
                    <h4 className="text-lg font-bold text-brown-dark mt-1">{item.name}</h4>
                    <div className="flex flex-wrap gap-3 mt-3">
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs font-bold">{item.bv} BV</span>
                      <span className="bg-copper/10 text-copper px-2 py-1 rounded text-xs font-bold">{item.pv} PV</span>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 mt-4 sm:mt-0">
                    <div className="text-xl font-bold text-emerald-700">${item.price.toFixed(2)}</div>
                    <button 
                      onClick={() => handleRemove(item._id)}
                      className="text-red-400 hover:text-red-600 transition-colors bg-red-50 p-2 rounded-lg"
                      title="Remove Item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form id="checkout-form" onSubmit={handleCheckout} className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8">
            <h3 className="font-bold text-brown-dark text-lg flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
              <Home size={20} className="text-amber-500" /> Shipping Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Street Address</label>
                <input 
                  type="text" 
                  required
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  placeholder="e.g. 123 Enterprise Avenue"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">City</label>
                <input 
                  type="text" 
                  required
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Postal Code</label>
                <input 
                  type="text" 
                  required
                  value={shippingAddress.postalCode}
                  onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  placeholder="Postal Code"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <motion.div 
            className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 sticky top-28"
          >
            <h3 className="font-bold text-brown-dark text-lg mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Subtotal ({totalItems} items)</span>
                <span className="font-bold text-brown-dark">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Total BV Generated</span>
                <span className="font-bold text-emerald-600">{totalBV} BV</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="font-bold text-emerald-600">Free</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-brown-dark">Total</span>
                <span className="text-2xl font-serif font-bold text-emerald-700">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6 flex gap-3">
              <CreditCard className="text-emerald-600 shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-bold text-emerald-800">Wallet Payment</p>
                <p className="text-xs text-emerald-700/80 mt-1">Funds will be securely deducted from your Enterprise Wallet balance.</p>
              </div>
            </div>

            <button 
              type="submit"
              form="checkout-form"
              disabled={isProcessing}
              className="w-full bg-[#103A26] text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg shadow-emerald-900/20 hover:bg-[#1a5c3d] transition-all hover:-translate-y-0.5 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Complete Purchase'}
            </button>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-gray-400">
              <ShieldCheck size={14} />
              <span className="text-[10px] uppercase tracking-widest font-bold">Encrypted Transaction</span>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Cart;
