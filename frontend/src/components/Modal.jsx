import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const Modal = ({ isOpen, onClose, type = 'info', title, message }) => {
  if (!isOpen) return null;

  const getStyle = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="w-12 h-12 text-emerald-success" />,
          bg: 'bg-emerald-success/10',
          border: 'border-emerald-success/30',
          button: 'bg-emerald-success hover:bg-emerald-success/90',
        };
      case 'error':
        return {
          icon: <XCircle className="w-12 h-12 text-ruby-red" />,
          bg: 'bg-ruby-red/10',
          border: 'border-ruby-red/30',
          button: 'bg-ruby-red hover:bg-ruby-red/90',
        };
      default:
        return {
          icon: <Info className="w-12 h-12 text-amber-gold" />,
          bg: 'bg-amber-gold/10',
          border: 'border-amber-gold/30',
          button: 'bg-amber-gold hover:bg-amber-gold/90',
        };
    }
  };

  const style = getStyle();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Blurred Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brown-dark/20 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className={`relative w-full max-w-sm glass-premium rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl ${style.border}`}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-brown-dark/40 hover:text-brown-dark transition-colors"
            >
              <X size={20} />
            </button>

            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
              className={`w-24 h-24 rounded-full ${style.bg} flex items-center justify-center mb-6`}
            >
              {style.icon}
            </motion.div>

            <h3 className="text-2xl font-serif font-bold text-brown-dark mb-2">
              {title}
            </h3>
            <p className="text-brown-dark/70 mb-8">
              {message}
            </p>

            <button
              onClick={onClose}
              className={`w-full py-3.5 rounded-xl text-white font-medium shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 ${style.button}`}
            >
              Continue
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
