import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, TrendingUp, Globe2, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-ivory text-brown-dark font-sans selection:bg-emerald-deep/20 overflow-x-hidden">
      
      {/* Luxury Navbar */}
      <nav className="h-24 px-10 flex items-center justify-between border-b border-beige-soft/30 bg-ivory/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Enterprise Logo" className="w-32 object-contain" />
        </div>
        <div className="hidden md:flex gap-8 font-medium text-sm">
          <Link to="/about" className="hover:text-emerald-deep transition-colors">About Us</Link>
          <Link to="/plan" className="hover:text-emerald-deep transition-colors">Compensation Plan</Link>
          <Link to="/contact" className="hover:text-emerald-deep transition-colors">Contact</Link>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-6 py-2.5 rounded-full font-bold hover:bg-cream transition-colors">Sign In</Link>
          <Link to="/register" className="luxury-button bg-emerald-deep text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2">
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-40 px-6 lg:px-20 overflow-hidden">
        {/* Luxury Gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-gold/5 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-deep/5 rounded-full blur-[100px] -z-10 -translate-x-1/4 translate-y-1/4"></div>

        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="px-4 py-1.5 rounded-full border border-amber-gold/30 text-amber-gold text-xs font-bold tracking-widest uppercase mb-6 inline-block bg-amber-gold/5">
              The Future of Network Finance
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-brown-dark leading-[1.1] tracking-tight mb-8">
              Build Global Wealth With <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-deep to-[#0d6059]">Enterprise Precision.</span>
            </h1>
            <p className="text-xl text-brown-dark/70 max-w-2xl mx-auto mb-12 leading-relaxed">
              Experience the world's most advanced binary repurchase system. Secure, scalable, and designed for financial leaders who demand perfection.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link to="/register" className="luxury-button bg-gradient-to-r from-emerald-deep to-[#0d6059] text-white px-10 py-4 rounded-full text-lg font-bold w-full sm:w-auto shadow-emerald-deep/20">
                Start Building Today
              </Link>
              <Link to="/plan" className="px-10 py-4 rounded-full text-lg font-bold w-full sm:w-auto border-2 border-beige-soft hover:border-emerald-deep/50 hover:bg-emerald-deep/5 transition-all">
                View Compensation Plan
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-cream/50 border-y border-beige-soft/30 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card-luxury p-10">
            <div className="w-14 h-14 bg-emerald-success/10 rounded-2xl flex items-center justify-center text-emerald-success mb-6">
              <TrendingUp size={28} />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-3">Dynamic Binary Matching</h3>
            <p className="text-brown-dark/60 leading-relaxed">Our proprietary algorithm calculates real-time business volume (BV) matching to ensure instantaneous payout generation.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} viewport={{ once: true }} className="glass-card-luxury p-10">
            <div className="w-14 h-14 bg-amber-gold/10 rounded-2xl flex items-center justify-center text-amber-gold mb-6">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-3">Bank-Grade Security</h3>
            <p className="text-brown-dark/60 leading-relaxed">Encrypted KYC verification, role-based access control, and 256-bit wallet encryption keeps your team's assets secure.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} viewport={{ once: true }} className="glass-card-luxury p-10">
            <div className="w-14 h-14 bg-copper/10 rounded-2xl flex items-center justify-center text-copper mb-6">
              <Globe2 size={28} />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-3">Global Repurchase Store</h3>
            <p className="text-brown-dark/60 leading-relaxed">A luxury storefront built directly into the platform to drive recurring point volume (PV) and residual income.</p>
          </motion.div>
        </div>
      </section>

      {/* Footer Links */}
      <footer className="bg-olive-deep py-12 px-6 lg:px-20 text-ivory">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold tracking-widest">ENTERPRISE MLM</span>
          </div>
          <div className="flex gap-6 text-sm text-ivory/60">
            <Link to="/privacy" className="hover:text-ivory transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-ivory transition-colors">Terms & Conditions</Link>
            <Link to="/refund" className="hover:text-ivory transition-colors">Refund Policy</Link>
          </div>
          <p className="text-sm text-ivory/40">&copy; 2026 Enterprise. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
