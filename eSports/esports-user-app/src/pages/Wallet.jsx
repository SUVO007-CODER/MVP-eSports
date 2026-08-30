// src/pages/Wallet.jsx
import React, { useState, useEffect } from 'react';
import { userApi } from '../api/userApi';

export default function Wallet({ user, onRefreshUser, onRequireAuth }) {
  const [transactions, setTransactions] = useState([]);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      onRequireAuth();
    } else {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    try {
      const res = await userApi.getTransactions();
      if (res.success) {
        setTransactions(res.transactions || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!depositAmount || Number(depositAmount) <= 0) return alert('Enter a valid deposit amount');
    setLoading(true);
    try {
      const res = await userApi.addMoney(Number(depositAmount));
      if (res.success) {
        alert(res.message);
        setDepositAmount('');
        onRefreshUser();
        loadHistory();
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert('Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!withdrawAmount || Number(withdrawAmount) < 50) return alert('Minimum withdrawal amount is ₹50');
    if (!upiId.includes('@')) return alert('Please enter a valid UPI ID (e.g. mobile@okhdfcbank)');

    setLoading(true);
    try {
      const res = await userApi.requestWithdraw(Number(withdrawAmount), upiId);
      if (res.success) {
        alert('🎉 Withdrawal request submitted successfully!');
        setWithdrawAmount('');
        onRefreshUser();
        loadHistory();
      } else {
        alert(res.message || 'Withdrawal failed');
      }
    } catch (err) {
      alert('Withdrawal request failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div style={{ padding: '16px' }}>
      {/* Wallet Balance Display */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
          borderRadius: '14px', padding: '16px', textAlign: 'center'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-heading)', fontWeight: '700', letterSpacing: '0.5px' }}>
            DEPOSIT BALANCE
          </span>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginTop: '4px', fontSize: '1.6rem' }}>
            ₹{user.deposit_balance || 0}
          </h2>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>For Match Entry Fees</span>
        </div>

        <div style={{
          background: 'var(--bg-card)', border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: '14px', padding: '16px', textAlign: 'center',
          boxShadow: '0 0 20px rgba(16,185,129,0.08)'
        }}>
          <span style={{ fontSize: '0.75rem', color: '#34d399', fontFamily: 'var(--font-heading)', fontWeight: '700', letterSpacing: '0.5px' }}>
            WINNING BALANCE
          </span>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent-green)', marginTop: '4px', fontSize: '1.6rem' }}>
            ₹{user.winning_balance || 0}
          </h2>
          <span style={{ fontSize: '0.68rem', color: '#34d399' }}>100% Withdrawable</span>
        </div>
      </div>

      {/* Add Money Form */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '12px', color: 'var(--brand-primary)' }}>
          ➕ Add Deposit Money (UPI)
        </h4>
        <form onSubmit={handleDeposit} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            placeholder="Amount (₹)"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            style={{ flex: 1 }}
            required
          />
          <button type="submit" className="btn-block btn-brand" style={{ width: 'auto', padding: '0 24px' }} disabled={loading}>
            Add Money
          </button>
        </form>
      </div>

      {/* Instant UPI Withdrawal */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '12px', color: 'var(--accent-green)' }}>
          🏦 Instant UPI Withdrawal
        </h4>
        <form onSubmit={handleWithdraw} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="number"
            placeholder="Withdrawal Amount (Min ₹50)"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Your UPI ID (e.g. mobile@okhdfcbank)"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            required
          />
          <button
            type="submit"
            className="btn-block"
            style={{
              background: 'linear-gradient(135deg, var(--accent-green), #059669)',
              color: '#fff', height: '44px'
            }}
            disabled={loading}
          >
            Request Instant Payout
          </button>
        </form>
      </div>

      {/* Passbook History */}
      <div className="card">
        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '14px' }}>
          📜 Transaction Passbook
        </h4>
        {transactions.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No transaction history found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {transactions.map((tx) => {
              const isPositive = tx.type === 'MATCH_WIN' || tx.type === 'DEPOSIT';
              return (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'var(--bg-input)', padding: '10px 14px', borderRadius: '8px'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{tx.type}</strong>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {new Date(tx.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontWeight: '800',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1rem',
                      color: isPositive ? 'var(--accent-green)' : '#ef4444'
                    }}>
                      {isPositive ? `+₹${tx.amount}` : `-₹${tx.amount}`}
                    </div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{tx.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
