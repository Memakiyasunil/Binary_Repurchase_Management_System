import { motion } from 'framer-motion';

const Splash = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-[#0a1e14] to-[#123122] overflow-hidden">
      
      {/* Luxury Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-gold/5 rounded-full blur-[100px]"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src="/logo.png" alt="Binary Repurchase Enterprise Logo" className="w-56 md:w-72 object-contain mb-8 drop-shadow-2xl" />
        </motion.div>
        
        {/* Luxury Spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-amber-gold/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-amber-gold border-t-transparent animate-spin"></div>
        </div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-6 text-amber-gold/70 text-[10px] font-bold uppercase tracking-[0.3em]"
        >
          Initializing Enterprise Environment
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Splash;
