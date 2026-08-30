// src/pages/Login.jsx
import React, { useState } from 'react';
import { adminApi } from '../api/adminApi';

export default function Login({ onLoginSuccess }) {
  const [form, setForm] = useState({ username: '', password: '', secret_pin: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await adminApi.login(form.username, form.password, form.secret_pin);
      if (res.success) {
        localStorage.setItem('admin_token', res.token);
        localStorage.setItem('admin_user', JSON.stringify(res.admin));
        onLoginSuccess(res.admin);
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError('Server connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'radial-gradient(circle at center, #1b222d 0%, #0d1117 100%)'
    }}>
      <div className="card" style={{ width: '380px', padding: '30px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px', color: 'var(--accent-primary)' }}>
          ESPORTS ADMIN
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
          Restricted Portal Access
        </p>

        {error && (
          <div style={{
            background: 'rgba(218, 54, 51, 0.15)',
            border: '1px solid #da3633',
            color: '#f85149',
            padding: '10px',
            borderRadius: '6px',
            fontSize: '0.85rem',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="e.g. superadmin"
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Admin Security PIN</label>
            <input
              type="password"
              maxLength="6"
              placeholder="4-6 Digit PIN"
              required
              value={form.secret_pin}
              onChange={(e) => setForm({ ...form, secret_pin: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Secure Access'}
          </button>
        </form>
      </div>
    </div>
  );
}
