import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-ivory font-sans">
      <Sidebar />
      
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden selection:bg-emerald-deep/20">
        <Header />
        
        <main className="flex-grow p-10 relative">
          {/* Subtle background luxury accents */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-amber-gold/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-emerald-deep/5 rounded-full blur-3xl"></div>
          </div>

          <div className="w-full max-w-7xl mx-auto h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
