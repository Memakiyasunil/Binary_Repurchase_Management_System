import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Tree from './pages/Tree';
import Store from './pages/Store';
import Cart from './pages/Cart';
import Wallet from './pages/Wallet';
import Withdrawals from './pages/Withdrawals';
import KycUpload from './pages/KycUpload';
import Reports from './pages/Reports';
import Support from './pages/Support';
import Home from './pages/Home';
import CmsPage from './pages/CmsPage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Notifications from './pages/Notifications';
import Referral from './pages/Referral';
import AdminUsers from './pages/AdminUsers';
import Layout from './components/Layout';
import Background from './components/Background';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import Splash from './components/Splash';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <Background />
      <Toaster
        position="top-right"
        toastOptions={{
          className: '',
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(231, 215, 177, 0.5)',
            color: '#3A2F2A',
            boxShadow: '0 4px 24px -4px rgba(0, 0, 0, 0.05)',
            borderRadius: '16px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: { primary: '#10B981', secondary: '#FFFFFF' },
            style: { borderLeft: '4px solid #10B981' }
          },
          error: {
            iconTheme: { primary: '#BE123C', secondary: '#FFFFFF' },
            style: { borderLeft: '4px solid #BE123C' }
          },
        }}
      />
      <Router>
        <AnimatePresence mode="wait">
          {showSplash ? (
            <motion.div
              key="splash"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Splash />
            </motion.div>
          ) : (
            <motion.div
              key="app-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-transparent min-h-screen text-brown-dark font-sans selection:bg-emerald-deep/20"
            >
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* CMS Public Routes */}
                <Route path="/about" element={<CmsPage title="About Us" lastUpdated="Oct 20, 2026" content="<p>We are a global enterprise focused on democratizing wealth building through our proprietary binary matching algorithms.</p><h3>Our Mission</h3><p>To provide secure, scalable financial infrastructure to independent distributors worldwide.</p>" />} />
                <Route path="/plan" element={<CmsPage title="Compensation Plan" lastUpdated="Oct 18, 2026" content="<p>Our hybrid binary repurchase plan features:</p><ul><li><strong>Direct Referral Bonus:</strong> ₹200 instantly upon onboarding new members.</li><li><strong>Binary Matching Bonus:</strong> 10% of matched BV from your Left and Right Leg.</li><li><strong>Repurchase Bonus:</strong> 5% of every repurchase order goes to your sponsor.</li><li><strong>Leadership Rewards:</strong> Unlock exclusive tiers (Silver to Crown Diamond).</li></ul>" />} />
                <Route path="/privacy" element={<CmsPage title="Privacy Policy" lastUpdated="Sep 15, 2026" content="<p>We take your data security seriously. We employ 256-bit AES encryption for all sensitive KYC and wallet data.</p>" />} />
                <Route path="/terms" element={<CmsPage title="Terms &amp; Conditions" lastUpdated="Sep 10, 2026" content="<p>By participating in the Enterprise MLM program, you agree to abide by all compliance regulations. Misrepresentation of income is strictly prohibited.</p>" />} />
                <Route path="/refund" element={<CmsPage title="Refund Policy" lastUpdated="Sep 01, 2026" content="<p>All product purchases via the Repurchase Store are subject to a 14-day return window provided they are unopened and in original condition.</p>" />} />
                <Route path="/contact" element={<CmsPage title="Contact Us" lastUpdated="Oct 26, 2026" content="<p>Reach out to our global support team 24/7 at support@eshop.com or call +1-800-ENTERPRISE.</p>" />} />

                {/* Protected Routes inside Layout */}
                <Route element={<Layout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/store" element={<Store />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/tree" element={<Tree />} />
                  <Route path="/wallet" element={<Wallet />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/withdrawals" element={<Withdrawals />} />
                  <Route path="/kyc" element={<KycUpload />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/referral" element={<Referral />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                </Route>
              </Routes>
            </motion.div>
          )}
        </AnimatePresence>
      </Router>
    </ThemeProvider>
  );
}

export default App;
