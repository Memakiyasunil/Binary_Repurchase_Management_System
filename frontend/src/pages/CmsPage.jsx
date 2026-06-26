import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const CmsPage = ({ title, content, lastUpdated }) => {
  return (
    <div className="min-h-screen bg-ivory text-brown-dark font-sans selection:bg-emerald-deep/20">
      
      {/* Minimal Header */}
      <nav className="h-20 px-10 border-b border-beige-soft/30 bg-ivory/80 backdrop-blur-xl sticky top-0 z-50 flex items-center">
        <Link to="/" className="flex items-center gap-2 text-brown-dark/60 hover:text-emerald-deep transition-colors font-bold text-sm uppercase tracking-widest">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </nav>

      {/* Page Content */}
      <main className="pt-20 pb-32 px-6 lg:px-20 relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-gold/5 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brown-dark mb-6">{title}</h1>
            {lastUpdated && (
              <p className="text-sm text-brown-dark/50 font-medium mb-12">Last Updated: {lastUpdated}</p>
            )}
            
            <div className="glass-card-luxury p-10 md:p-16 prose prose-lg prose-headings:font-serif prose-headings:text-brown-dark prose-p:text-brown-dark/80 prose-p:leading-relaxed prose-a:text-emerald-deep max-w-none bg-cream/50">
              {/* If we had HTML from DB, we'd use dangerouslySetInnerHTML. For now, we render children or string */}
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </motion.div>
        </div>
      </main>

    </div>
  );
};

export default CmsPage;
