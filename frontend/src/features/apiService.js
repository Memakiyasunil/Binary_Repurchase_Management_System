const BASE = 'http://localhost:5000/api/';

const getAuthConfig = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` } };
};

// Income service
export const incomeService = {
  getUserIncome: async (params = {}) => {
    const q = new URLSearchParams(params).toString();
    const r = await fetch(`${BASE}income?${q}`, getAuthConfig());
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    return d;
  }
};

// Withdrawal service
export const withdrawalService = {
  requestWithdrawal: async (data) => {
    const r = await fetch(`${BASE}withdrawals`, { method: 'POST', body: JSON.stringify(data), ...getAuthConfig() });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    return d;
  },
  getUserWithdrawals: async (params = {}) => {
    const q = new URLSearchParams(params).toString();
    const r = await fetch(`${BASE}withdrawals?${q}`, getAuthConfig());
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    return d;
  }
};

// Order service
export const orderService = {
  createOrder: async (data) => {
    const r = await fetch(`${BASE}orders`, { method: 'POST', body: JSON.stringify(data), ...getAuthConfig() });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    return d;
  },
  getUserOrders: async (params = {}) => {
    const q = new URLSearchParams(params).toString();
    const r = await fetch(`${BASE}orders?${q}`, getAuthConfig());
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    return d;
  },
  getOrderById: async (id) => {
    const r = await fetch(`${BASE}orders/${id}`, getAuthConfig());
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    return d;
  }
};

// Notification service
export const notificationService = {
  getNotifications: async () => {
    const r = await fetch(`${BASE}notifications`, getAuthConfig());
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    return d;
  },
  markAsRead: async (id) => {
    const r = await fetch(`${BASE}notifications/${id}/read`, { method: 'PUT', ...getAuthConfig() });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    return d;
  },
  markAllAsRead: async () => {
    const r = await fetch(`${BASE}notifications/read-all`, { method: 'PUT', ...getAuthConfig() });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    return d;
  }
};

// Profile service
export const profileService = {
  getProfile: async () => {
    const r = await fetch(`${BASE}auth/me`, getAuthConfig());
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    return d;
  },
  updateProfile: async (data) => {
    const r = await fetch(`${BASE}profile`, { method: 'PUT', body: JSON.stringify(data), ...getAuthConfig() });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    return d;
  },
  updateBankDetails: async (data) => {
    const r = await fetch(`${BASE}profile/bank`, { method: 'PUT', body: JSON.stringify(data), ...getAuthConfig() });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    return d;
  },
  changePassword: async (data) => {
    const r = await fetch(`${BASE}profile/change-password`, { method: 'PUT', body: JSON.stringify(data), ...getAuthConfig() });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    return d;
  },
  getReferralInfo: async () => {
    const r = await fetch(`${BASE}profile/referral`, getAuthConfig());
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    return d;
  }
};

// Ticket service
export const ticketService = {
  createTicket: async (data) => {
    const r = await fetch(`${BASE}tickets`, { method: 'POST', body: JSON.stringify(data), ...getAuthConfig() });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    return d;
  },
  getUserTickets: async () => {
    const r = await fetch(`${BASE}tickets`, getAuthConfig());
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    return d;
  },
  getTicketById: async (id) => {
    const r = await fetch(`${BASE}tickets/${id}`, getAuthConfig());
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    return d;
  },
  addReply: async (id, message) => {
    const r = await fetch(`${BASE}tickets/${id}/reply`, { method: 'POST', body: JSON.stringify({ message }), ...getAuthConfig() });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    return d;
  },
  closeTicket: async (id) => {
    const r = await fetch(`${BASE}tickets/${id}/close`, { method: 'PUT', ...getAuthConfig() });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    return d;
  }
};

// KYC service
export const kycService = {
  getKycStatus: async () => {
    const r = await fetch(`${BASE}kyc`, getAuthConfig());
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    return d;
  },
  submitKyc: async (data) => {
    const r = await fetch(`${BASE}kyc`, { method: 'POST', body: JSON.stringify(data), ...getAuthConfig() });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    return d;
  }
};

// Admin service
export const adminService = {
  getDashboardStats: async () => {
    const r = await fetch(`${BASE}admin/stats`, getAuthConfig());
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    return d;
  },
  getAllUsers: async (params = {}) => {
    const q = new URLSearchParams(params).toString();
    const r = await fetch(`${BASE}admin/users?${q}`, getAuthConfig());
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    return d;
  },
  updateUserStatus: async (id, status) => {
    const r = await fetch(`${BASE}admin/users/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }), ...getAuthConfig() });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    return d;
  },
  getAllWithdrawals: async (params = {}) => {
    const q = new URLSearchParams(params).toString();
    const r = await fetch(`${BASE}admin/withdrawals?${q}`, getAuthConfig());
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    return d;
  },
  processWithdrawal: async (id, data) => {
    const r = await fetch(`${BASE}admin/withdrawals/${id}`, { method: 'PUT', body: JSON.stringify(data), ...getAuthConfig() });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    return d;
  }
};

// Wallet service
export const walletService = {
  getWallet: async () => {
    const r = await fetch(`${BASE}wallet`, getAuthConfig());
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    return d;
  }
};
