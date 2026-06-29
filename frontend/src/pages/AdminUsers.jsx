import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Edit2, Trash2, Search, X, CheckCircle, Shield } from 'lucide-react';
import { adminService } from '../features/apiService';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    username: '', password: '', firstName: '', lastName: '', email: '', sponsorId: '', placement: 'left', role: 'user', status: 'active'
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers({ search: searchTerm });
      setUsers(data.users || []);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.createUser(formData);
      toast.success('User created successfully');
      setShowAddModal(false);
      setFormData({ username: '', password: '', firstName: '', lastName: '', email: '', sponsorId: '', placement: 'left', role: 'user', status: 'active' });
      fetchUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateUser(selectedUser._id, formData);
      toast.success('User updated successfully');
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminService.deleteUser(id);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setShowEditModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-olive-deep">User Management</h1>
          <p className="text-gray-500">Manage system users, roles, and statuses.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-amber-gold to-copper text-ivory rounded-xl font-medium hover:opacity-90 flex items-center gap-2"
        >
          <Plus size={18} /> Add User
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-sm">
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Search users by name, email or username..."
            className="w-full pl-10 pr-4 py-2 bg-white/50 border border-beige-soft rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-gold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-sm font-semibold text-olive-deep">
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Sponsor</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No users found</td></tr>
              ) : (
                users.map(user => (
                  <tr key={user._id} className="border-b border-gray-100 hover:bg-white/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-olive-deep/10 flex items-center justify-center text-olive-deep font-bold">
                          {user.firstName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-olive-deep">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-gray-500">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 w-max ${user.role === 'admin' ? 'bg-amber-gold/20 text-amber-gold border border-amber-gold/30' : 'bg-gray-100 text-gray-600'}`}>
                        {user.role === 'admin' && <Shield size={12} />}
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {user.sponsorId ? user.sponsorId.username : 'N/A'}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => openEditModal(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(user._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-olive-deep">Add New User</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
              </div>
              <form onSubmit={handleAddSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" name="username" placeholder="Username" required value={formData.username} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-xl" />
                <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-xl" />
                <input type="text" name="firstName" placeholder="First Name" required value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-xl" />
                <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-xl" />
                <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-xl" />
                <select name="role" value={formData.role} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-xl">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <input type="text" name="sponsorId" placeholder="Sponsor Username (Optional)" value={formData.sponsorId} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-xl" />
                <select name="placement" value={formData.placement} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-xl">
                  <option value="left">Left Leg</option>
                  <option value="right">Right Leg</option>
                </select>
                <div className="col-span-1 sm:col-span-2 mt-4">
                  <button type="submit" className="w-full py-3 bg-olive-deep text-white rounded-xl font-medium">Create User</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-olive-deep">Edit User</h3>
                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
              </div>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" name="firstName" placeholder="First Name" required value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-xl" />
                  <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-xl" />
                </div>
                <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-xl" />
                <div className="grid grid-cols-2 gap-4">
                  <select name="role" value={formData.role} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-xl">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-xl">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
                <div className="mt-6">
                  <button type="submit" className="w-full py-3 bg-olive-deep text-white rounded-xl font-medium">Update User</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsers;
