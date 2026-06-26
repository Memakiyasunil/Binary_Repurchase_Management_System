import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Background = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none transition-colors duration-500" style={{ backgroundColor: 'var(--theme-bg)' }}>
      
      {/* Optimized Performance Blobs - NO CSS BLUR */}
      <motion.div 
        animate={{ 
          x: [0, 50, -20, 0], 
          y: [0, -30, 40, 0],
          scale: [1, 1.1, 0.9, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px]"
        style={{
          background: isDarkMode 
            ? 'radial-gradient(circle, rgba(15, 118, 110, 0.08) 0%, rgba(15, 118, 110, 0) 70%)' 
            : 'radial-gradient(circle, rgba(15, 118, 110, 0.04) 0%, rgba(15, 118, 110, 0) 70%)',
          willChange: 'transform'
        }}
      />
      
      <motion.div 
        animate={{ 
          x: [0, -40, 30, 0], 
          y: [0, 50, -20, 0],
          scale: [1, 1.2, 0.8, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-15%] left-[-10%] w-[900px] h-[900px]"
        style={{
          background: isDarkMode
            ? 'radial-gradient(circle, rgba(217, 119, 6, 0.06) 0%, rgba(217, 119, 6, 0) 70%)'
            : 'radial-gradient(circle, rgba(217, 119, 6, 0.03) 0%, rgba(217, 119, 6, 0) 70%)',
          willChange: 'transform'
        }}
      />

      {/* Lightweight Grid Pattern instead of expensive SVG Noise */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `radial-gradient(var(--theme-text) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 10%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 10%, transparent 100%)'
        }}
      ></div>
    </div>
  );
};

export default Background;
