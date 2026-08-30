// src/components/Sidebar.jsx
import React from 'react';

export default function Sidebar({ activeTab, setActiveTab, onLogout, admin }) {
  const menuItems = [
    { id: 'matches', label: '🎮 Matches & Rooms' },
    { id: 'results', label: '⚡ Result Entry' },
    { id: 'withdrawals', label: '💳 Withdrawals (UPI)' }
  ];

  return (
    <aside className="sidebar">
      <div className="brand-logo">
        ESPORTS <span style={{ color: '#fff' }}>ADMIN</span>
      </div>

      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        Logged in as: <strong style={{ color: 'var(--text-main)' }}>{admin?.username || 'Admin'}</strong>
      </div>

      <ul className="nav-links">
        {menuItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => setActiveTab(item.id)}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              style={{
                width: '100%',
                textAlign: 'left',
                border: 'none',
                background: activeTab === item.id ? 'var(--bg-input)' : 'transparent',
                outline: 'none'
              }}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 'auto' }}>
        <button
          onClick={onLogout}
          className="btn btn-danger"
          style={{ width: '100%', fontSize: '0.85rem', padding: '8px' }}
        >
          🔒 Secure Logout
        </button>
      </div>
    </aside>
  );
}
