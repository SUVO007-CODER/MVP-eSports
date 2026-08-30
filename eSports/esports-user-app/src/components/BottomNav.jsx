// src/components/BottomNav.jsx
import React from 'react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'lobby', label: 'LOBBY', icon: '🎮' },
    { id: 'my-matches', label: 'MY MATCHES', icon: '🏆' },
    { id: 'wallet', label: 'WALLET', icon: '💳' },
    { id: 'profile', label: 'PROFILE', icon: '👤' }
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`nav-tab ${isActive ? 'active' : ''}`}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              height: '100%',
              background: 'none',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              color: isActive ? 'var(--brand-primary)' : 'var(--text-muted)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* Active Top Glow Line */}
            {isActive && (
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  width: '36px',
                  height: '3px',
                  background: 'var(--brand-primary)',
                  borderRadius: '0 0 4px 4px',
                  boxShadow: '0 2px 10px var(--brand-glow)'
                }}
              />
            )}

            <span
              style={{
                fontSize: '1.25rem',
                transform: isActive ? 'scale(1.15) translateY(-2px)' : 'scale(1)',
                transition: 'transform 0.2s ease',
                filter: isActive ? 'drop-shadow(0 0 6px var(--brand-glow))' : 'none'
              }}
            >
              {tab.icon}
            </span>

            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.72rem',
                fontWeight: isActive ? '800' : '600',
                letterSpacing: '0.8px',
                marginTop: '3px'
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
