const API_URL = 'http://localhost:5000/api/wallet/';

const getAuthConfig = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` }
  };
};

const getWallet = async () => {
  const response = await fetch(API_URL, getAuthConfig());
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch wallet');
  return data;
};

const getTransactions = async (page = 1, limit = 20) => {
  const response = await fetch(`${API_URL}transactions?page=${page}&limit=${limit}`, getAuthConfig());
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch transactions');
  return data;
};

const walletService = { getWallet, getTransactions };
export default walletService;
