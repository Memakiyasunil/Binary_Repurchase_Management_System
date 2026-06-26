import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Network, User as UserIcon, AlertCircle } from 'lucide-react';
import { logout } from '../features/auth/authSlice';
import { motion } from 'framer-motion';

const TreeNode = ({ node }) => {
  if (!node) {
    return (
      <div className="flex flex-col items-center mx-6">
        <div className="w-14 h-14 rounded-full bg-ivory border-2 border-dashed border-beige-soft flex items-center justify-center text-brown-dark/30 mb-2 shadow-sm">
          <UserIcon size={24} />
        </div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-brown-dark/40">Empty</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mx-6 relative group">
      <motion.div 
        whileHover={{ scale: 1.1 }}
        className={`w-16 h-16 rounded-full border-4 flex items-center justify-center mb-3 z-10 bg-ivory shadow-xl transition-all
        ${node.status === 'active' ? 'border-emerald-success text-emerald-success shadow-emerald-success/20' : 'border-ruby-red text-ruby-red shadow-ruby-red/20'}`}
      >
        <UserIcon size={28} />
      </motion.div>
      
      <div className="text-center glass-premium px-5 py-3 rounded-2xl z-10 shadow-lg min-w-[140px] opacity-90 group-hover:opacity-100 transition-opacity">
        <p className="text-sm font-bold text-brown-dark">{node.username}</p>
        <p className="text-xs text-brown-dark/60 font-medium mb-1">{node.name}</p>
        <div className="flex gap-3 mt-2 text-[10px] font-bold justify-center border-t border-beige-soft/50 pt-2">
          <span className="text-emerald-deep flex items-center gap-1">L: {node.leftBV || 0}</span>
          <span className="text-amber-gold flex items-center gap-1">R: {node.rightBV || 0}</span>
        </div>
      </div>
      
      {/* Children connector lines */}
      <div className="flex mt-10 relative">
        {/* Horizontal line */}
        <div className="absolute top-[-28px] left-1/4 right-1/4 h-[2px] bg-beige-soft"></div>
        {/* Vertical lines connecting to horizontal */}
        <div className="absolute top-[-28px] left-1/4 w-[2px] h-7 bg-beige-soft"></div>
        <div className="absolute top-[-28px] right-1/4 w-[2px] h-7 bg-beige-soft"></div>
        {/* Main vertical line from parent */}
        <div className="absolute top-[-46px] left-1/2 w-[2px] h-[18px] bg-beige-soft -translate-x-1/2"></div>
        
        <TreeNode node={node.left} />
        <TreeNode node={node.right} />
      </div>
    </div>
  );
};

const Tree = () => {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    const fetchTree = async () => {
      try {
        const res = await fetch('/api/tree', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        
        if (res.status === 401) {
          dispatch(logout());
          throw new Error('Session expired. Please log in again.');
        }

        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch genealogy tree');
        }

        if (isMounted) {
          setTreeData(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    if (user?.token) {
      fetchTree();
    } else {
      setLoading(false);
      setError('Not authenticated');
    }

    return () => { isMounted = false; };
  }, [user?.token, dispatch]); // Only run when token changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-emerald-deep/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-emerald-deep rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-premium p-8 rounded-[24px]">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0f766e] to-[#0d6059] flex items-center justify-center text-ivory shadow-lg shadow-emerald-deep/20">
            <Network size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-brown-dark tracking-wide">Genealogy Tree</h1>
            <p className="text-brown-dark/60 mt-1 font-medium">Visualize your network and monitor node volume.</p>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-ruby-red/10 border border-ruby-red/20 text-ruby-red p-6 rounded-2xl flex items-center gap-3 font-medium max-w-2xl mx-auto">
          <AlertCircle size={24} />
          <p>{error}</p>
        </div>
      )}

      {!error && (
        <div className="glass-card-luxury overflow-x-auto touch-scroll min-h-[600px] flex justify-center pt-20 pb-32">
          <div className="min-w-max px-8">
            {treeData ? <TreeNode node={treeData} /> : <p className="text-brown-dark/40 font-serif text-xl">No tree data available.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tree;
