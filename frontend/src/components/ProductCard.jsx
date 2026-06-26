import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';
import { ShoppingCart, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, qty: 1 }));
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card-luxury group flex flex-col h-full overflow-hidden relative"
    >
      {/* Product Image Placeholder */}
      <div className="h-56 bg-ivory/50 relative flex items-center justify-center p-8 border-b border-beige-soft/30 overflow-hidden">
        {/* Luxury Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-gold/5 to-emerald-deep/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="h-full object-contain drop-shadow-xl transition-all duration-700 group-hover:scale-105 group-hover:-translate-y-2 relative z-10" 
          />
        ) : (
          <motion.div 
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
            className="text-brown-dark/20 text-7xl relative z-10"
          >
            ⚜️
          </motion.div>
        )}
        
        {/* Product Code Badge */}
        <div className="absolute top-4 right-4 bg-cream/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-beige-soft/80 text-[10px] font-bold text-brown-dark tracking-widest uppercase shadow-sm z-20">
          {product.code}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow bg-cream/30">
        <div className="mb-3">
          <span className="text-[10px] font-black text-amber-gold uppercase tracking-widest">{product.category}</span>
          <h3 className="text-xl font-serif font-bold text-brown-dark mt-1.5 leading-tight line-clamp-2">{product.name}</h3>
        </div>
        
        <p className="text-brown-dark/60 text-sm mb-6 line-clamp-2 flex-grow font-medium leading-relaxed">{product.description}</p>

        {/* BV & PV Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-ivory rounded-2xl p-3 border border-beige-soft/50 shadow-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-success/10 text-emerald-success flex items-center justify-center">
              <Award size={16} />
            </div>
            <div>
              <p className="text-[9px] text-brown-dark/50 uppercase font-bold tracking-widest">Business Vol</p>
              <p className="text-sm font-bold text-emerald-success">{product.bv} BV</p>
            </div>
          </div>
          <div className="bg-ivory rounded-2xl p-3 border border-beige-soft/50 shadow-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-copper/10 text-copper flex items-center justify-center">
              <Award size={16} />
            </div>
            <div>
              <p className="text-[9px] text-brown-dark/50 uppercase font-bold tracking-widest">Point Value</p>
              <p className="text-sm font-bold text-copper">{product.pv} PV</p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between mt-auto pt-5 border-t border-beige-soft/40">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-brown-dark/50 font-bold mb-0.5">Price</span>
            <span className="text-2xl font-serif font-bold text-emerald-deep">${product.price.toFixed(2)}</span>
          </div>
          <button 
            onClick={handleAddToCart}
            className="luxury-button flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-deep to-[#0d6059] text-white px-5 py-3 rounded-2xl shadow-emerald-deep/20"
          >
            <ShoppingCart size={18} />
            <span className="font-semibold tracking-wide text-sm">Add to Cart</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
