// src/pages/Withdrawals.jsx
import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';

export default function Withdrawals() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWithdrawals = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getPendingWithdrawals();
      if (res.success) {
        setList(res.withdrawals || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const handleAction = async (txId, action) => {
    const confirmMsg = action === 'APPROVE'
      ? 'Confirm approving this withdrawal (Mark as Paid)?'
      : 'Reject this request and refund money back to user winning balance?';

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await adminApi.processWithdrawal(txId, action);
      if (res.success) {
        alert(`Withdrawal successfully ${action}D!`);
        loadWithdrawals();
      } else {
        alert(res.message || 'Action failed');
      }
    } catch (err) {
      alert('Error updating withdrawal');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--accent-primary)' }}>💳 Pending UPI Withdrawals</h2>
        <button className="btn btn-green" onClick={loadWithdrawals}>🔄 Refresh</button>
      </div>

      <div className="card">
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading pending requests...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>User Phone</th>
                <th>Requested Amount</th>
                <th>Target UPI ID</th>
                <th>Requested Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    No pending withdrawals found.
                  </td>
                </tr>
              ) : (
                list.map(item => (
                  <tr key={item.id}>
                    <td>{item.users?.phone || 'N/A'}</td>
                    <td style={{ color: '#3fb950', fontWeight: 'bold' }}>₹{item.amount}</td>
                    <td>
                      <code style={{ background: 'var(--bg-input)', padding: '4px 8px', borderRadius: '4px' }}>
                        {item.upi_id}
                      </code>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                    <td style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-green"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                        onClick={() => handleAction(item.id, 'APPROVE')}
                      >
                        ✔ Mark Paid
                      </button>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                        onClick={() => handleAction(item.id, 'REJECT')}
                      >
                        ✖ Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
