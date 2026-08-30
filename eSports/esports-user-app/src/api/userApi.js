// src/api/userApi.js
const API_BASE = 'http://localhost:5000/api/v1/user';

export const userApi = {
  // Auth
  async sendOtp(phone) {
    const res = await fetch(`${API_BASE}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    return res.json();
  },

  async verifyOtp(phone, otp) {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp })
    });
    return res.json();
  },

  // Auth fetch helper
  async authFetch(url, options = {}) {
    const token = localStorage.getItem('user_token');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers
    };
    const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
    return res.json();
  },

  // User Profile
  getProfile() {
    return this.authFetch('/profile');
  },

  updateGameIds(data) {
    return this.authFetch('/profile/game-ids', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  // Matches
  async getMatches(gameType = '') {
    const query = gameType ? `?game_type=${gameType}` : '';
    const res = await fetch(`${API_BASE}/matches${query}`);
    return res.json();
  },

  joinMatch(match_id, slot_no, player_ign, player_uid) {
    return this.authFetch('/matches/join', {
      method: 'POST',
      body: JSON.stringify({ match_id, slot_no, player_ign, player_uid })
    });
  },

  getRoomDetails(matchId) {
    return this.authFetch(`/matches/${matchId}/room-details`);
  },

  // Wallet
  addMoney(amount) {
    return this.authFetch('/wallet/deposit', {
      method: 'POST',
      body: JSON.stringify({ amount })
    });
  },

  requestWithdraw(amount, upi_id) {
    return this.authFetch('/wallet/withdraw', {
      method: 'POST',
      body: JSON.stringify({ amount, upi_id })
    });
  },

  getTransactions() {
    return this.authFetch('/wallet/transactions');
  }
};
