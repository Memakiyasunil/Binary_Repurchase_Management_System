import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Network, User as UserIcon } from 'lucide-react';

const TreeNode = ({ node }) => {
  if (!node) {
    return (
      <div className="flex flex-col items-center mx-4">
        <div className="w-12 h-12 rounded-full bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-500 mb-2">
          <UserIcon size={20} />
        </div>
        <span className="text-xs text-gray-500">Empty</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mx-4 relative">
      <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center mb-2 z-10 bg-[#242424] 
        ${node.status === 'active' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
        <UserIcon size={28} />
      </div>
      <div className="text-center bg-gray-800 px-3 py-1 rounded-lg border border-gray-700 z-10 shadow-lg">
        <p className="text-sm font-bold text-white">{node.username}</p>
        <p className="text-xs text-gray-400">{node.name}</p>
        <div className="flex gap-2 mt-1 text-[10px] justify-center">
          <span className="text-blue-400">L: {node.leftBV || 0}</span>
          <span className="text-purple-400">R: {node.rightBV || 0}</span>
        </div>
      </div>
      
      {/* Children connector lines */}
      <div className="flex mt-8 relative">
        {/* Horizontal line */}
        <div className="absolute top-[-24px] left-1/4 right-1/4 h-[2px] bg-gray-600"></div>
        {/* Vertical lines connecting to horizontal */}
        <div className="absolute top-[-24px] left-1/4 w-[2px] h-6 bg-gray-600"></div>
        <div className="absolute top-[-24px] right-1/4 w-[2px] h-6 bg-gray-600"></div>
        {/* Main vertical line from parent */}
        <div className="absolute top-[-40px] left-1/2 w-[2px] h-[16px] bg-gray-600 -translate-x-1/2"></div>
        
        <TreeNode node={node.left} />
        <TreeNode node={node.right} />
      </div>
    </div>
  );
};

const Tree = () => {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/tree', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        const data = await res.json();
        setTreeData(data);
      } catch (error) {
        console.error("Error fetching tree", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchTree();
    }
  }, [user]);

  if (loading) return <div className="h-screen flex justify-center items-center text-white">Loading Tree...</div>;

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-8 overflow-x-auto">
      <div className="mb-8 flex items-center gap-3">
        <Network className="text-blue-500" size={32} />
        <h1 className="text-3xl font-bold text-white">Genealogy Tree</h1>
      </div>
      
      <div className="bg-[#242424] rounded-xl border border-gray-800 p-8 min-w-max flex justify-center pt-16">
        {treeData ? <TreeNode node={treeData} /> : <p className="text-gray-400">No tree data available.</p>}
      </div>
    </div>
  );
};

export default Tree;
