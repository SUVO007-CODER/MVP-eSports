// src/api/adminApi.js
const API_BASE_URL = 'http://localhost:5000/api/v1/admin';
const USER_API_BASE_URL = 'http://localhost:5000/api/v1/user';

export const adminApi = {
  async login(username, password, secret_pin) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, secret_pin })
    });
    return res.json();
  },

  async fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('admin_token');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers
    };

    const res = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });
    return res.json();
  },

  // Matches
  async getMatches() {
    const res = await fetch(`${USER_API_BASE_URL}/matches`);
    return res.json();
  },

  createMatch(data) {
    return this.fetchWithAuth('/matches', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  updateRoom(matchId, room_id, room_password) {
    return this.fetchWithAuth(`/matches/${matchId}/room`, {
      method: 'PUT',
      body: JSON.stringify({ room_id, room_password })
    });
  },

  getParticipants(matchId) {
    return this.fetchWithAuth(`/matches/${matchId}/participants`);
  },

  disburseResults(matchId, results) {
    return this.fetchWithAuth(`/matches/${matchId}/disburse`, {
      method: 'POST',
      body: JSON.stringify({ results })
    });
  },

  // Withdrawals
  getPendingWithdrawals() {
    return this.fetchWithAuth('/withdrawals/pending');
  },

  processWithdrawal(txId, action) {
    return this.fetchWithAuth(`/withdrawals/${txId}/process`, {
      method: 'POST',
      body: JSON.stringify({ action })
    });
  }
};
