import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../features/products/productSlice';
import ProductCard from '../components/ProductCard';
import { PackageSearch, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const Store = () => {
  const dispatch = useDispatch();
  const { products, isLoading, isError, message } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-emerald-deep/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-emerald-deep rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-ruby-red/10 border border-ruby-red/20 text-ruby-red p-6 rounded-2xl text-center max-w-2xl mx-auto mt-10">
        <p className="font-medium">{message}</p>
      </div>
    );
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-cream/50 p-8 rounded-[24px] border border-beige-soft/50 shadow-sm">
        <div>
          <h1 className="text-4xl font-serif font-bold text-brown-dark tracking-wide">Enterprise Store</h1>
          <p className="text-brown-dark/60 mt-3 text-lg">Acquire exclusive products to generate Business Volume (BV).</p>
        </div>
        
        <div className="flex gap-4">
          <button className="glass-premium px-5 py-2.5 rounded-xl flex items-center gap-3 text-sm font-medium text-brown-dark hover:text-emerald-deep transition-colors">
            <SlidersHorizontal size={18} />
            <span>Filter</span>
          </button>
          <div className="glass-premium px-5 py-2.5 rounded-xl flex items-center gap-3 text-sm font-medium text-brown-dark">
            <PackageSearch size={18} className="text-amber-gold" />
            <span>{products.length} Products</span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="glass-card-luxury p-16 text-center flex flex-col items-center justify-center max-w-2xl mx-auto mt-12">
          <div className="w-24 h-24 bg-beige-soft/20 rounded-full flex items-center justify-center mb-6">
            <PackageSearch size={40} className="text-brown-dark/30" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-brown-dark">Inventory Updating</h3>
          <p className="text-brown-dark/60 mt-3">Please check back shortly for new premium products.</p>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {products.map((product) => (
            <motion.div key={product._id} variants={item}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Store;
