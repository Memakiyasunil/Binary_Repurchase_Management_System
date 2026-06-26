import { useState, useEffect } from 'react';
import { Network, User as UserIcon, AlertCircle, RefreshCw } from 'lucide-react';
import { profileService } from '../features/apiService';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const TreeNode = ({ node }) => {
  if (!node) {
    return (
      <div className="flex flex-col items-center mx-4 md:mx-6">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 mb-2">
          <UserIcon size={24} />
        </div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Empty</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mx-2 md:mx-6 relative group">
      <motion.div 
        whileHover={{ scale: 1.1 }}
        className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-4 flex items-center justify-center mb-3 z-10 bg-white shadow-lg transition-all
        ${node.status === 'active' ? 'border-emerald-500 text-emerald-500 shadow-emerald-500/20' : 'border-red-400 text-red-400 shadow-red-400/20'}`}
      >
        <UserIcon size={24} className="md:w-7 md:h-7" />
      </motion.div>
      
      <div className="text-center bg-white border border-gray-100 px-4 py-3 rounded-2xl z-10 shadow-lg min-w-[120px] md:min-w-[140px]">
        <p className="text-sm font-bold text-brown-dark">{node.username || 'User'}</p>
        <p className="text-[10px] text-gray-500 font-medium mb-1 truncate max-w-[100px] mx-auto">{node.name || 'N/A'}</p>
        <div className="flex gap-2 justify-center border-t border-gray-100 pt-2 mt-1">
          <div className="bg-emerald-50 px-2 py-1 rounded text-[10px] font-bold text-emerald-700">
            L: {node.leftBV || 0}
          </div>
          <div className="bg-amber-50 px-2 py-1 rounded text-[10px] font-bold text-amber-700">
            R: {node.rightBV || 0}
          </div>
        </div>
      </div>
      
      {/* Children connector lines */}
      <div className="flex mt-8 md:mt-10 relative">
        {/* Horizontal line */}
        <div className="absolute top-[-24px] md:top-[-28px] left-1/4 right-1/4 h-[2px] bg-gray-200"></div>
        {/* Vertical lines connecting to horizontal */}
        <div className="absolute top-[-24px] md:top-[-28px] left-1/4 w-[2px] h-6 md:h-7 bg-gray-200"></div>
        <div className="absolute top-[-24px] md:top-[-28px] right-1/4 w-[2px] h-6 md:h-7 bg-gray-200"></div>
        {/* Main vertical line from parent */}
        <div className="absolute top-[-40px] md:top-[-46px] left-1/2 w-[2px] h-[16px] md:h-[18px] bg-gray-200 -translate-x-1/2"></div>
        
        <TreeNode node={node.left} />
        <TreeNode node={node.right} />
      </div>
    </div>
  );
};

const Tree = () => {
  const [treeData, setTreeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchTree();
  }, []);

  const fetchTree = async () => {
    setIsLoading(true);
    try {
      const data = await profileService.getTree();
      setTreeData(data.tree || data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load genealogy tree');
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 pt-6 max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-amber-gold border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 font-medium">Loading network topology...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-[1400px] mx-auto pb-10 mt-4 overflow-x-hidden">
      
      {/* Header */}
      <div className="bg-white p-6 md:p-8 rounded-[24px] flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] border border-gray-100 mx-4 md:mx-0">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm">
            <Network size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-brown-dark tracking-wide">Genealogy Network</h1>
            <p className="text-gray-500 mt-1 text-sm font-medium">Visualize your downline and track BV across branches.</p>
          </div>
        </div>
        
        <button 
          onClick={fetchTree}
          className="bg-white border border-gray-200 text-brown-dark px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-gray-50 transition-colors text-sm font-bold shadow-sm w-full md:w-auto justify-center"
        >
          <RefreshCw size={16} /> Refresh Tree
        </button>
      </div>

      {/* Tree Visualization Area */}
      <div className="bg-gray-50/50 rounded-[24px] border border-gray-100 p-4 md:p-10 mx-4 md:mx-0 overflow-x-auto overflow-y-hidden shadow-inner min-h-[600px] flex items-start justify-center pt-16">
        {treeData ? (
          <div className="transform scale-75 md:scale-100 origin-top">
            <TreeNode node={treeData} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto mt-20">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Network Data Available</h2>
            <p className="text-gray-500">We couldn't load your genealogy tree. Start referring users to build your network.</p>
          </div>
        )}
      </div>
      
      {/* Legend */}
      <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 flex flex-wrap justify-center gap-8 mx-4 md:mx-0">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-emerald-500 bg-white"></div>
          <span className="text-sm font-bold text-gray-600">Active User</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-red-400 bg-white"></div>
          <span className="text-sm font-bold text-gray-600">Inactive User</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-dashed border-gray-300 bg-gray-50"></div>
          <span className="text-sm font-bold text-gray-600">Empty Position</span>
        </div>
      </div>
      
    </div>
  );
};

export default Tree;
