// src/App.jsx
import React, { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import AuthModal from './pages/AuthModal';
import Lobby from './pages/Lobby';
import MyMatches from './pages/MyMatches';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';
import { userApi } from './api/userApi';

export default function App() {
  const [activeTab, setActiveTab] = useState('lobby');
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Sync user profile on mount
  const syncProfile = async () => {
    const token = localStorage.getItem('user_token');
    if (!token) return;
    try {
      const res = await userApi.getProfile();
      if (res.success) {
        setUser(res.user);
      }
    } catch (e) {
      localStorage.clear();
      setUser(null);
    }
  };

  useEffect(() => {
    syncProfile();
  }, []);

  const totalBalance = ((user?.deposit_balance || 0) + (user?.winning_balance || 0)).toFixed(2);

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="app-header">
        <div className="brand-title">🔥 ESPORTS ARENA</div>
        {user ? (
          <div className="wallet-badge" onClick={() => setActiveTab('wallet')}>
            ₹{totalBalance}
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            style={{
              background: 'var(--brand-accent)', color: '#fff', border: 'none',
              padding: '6px 12px', borderRadius: '16px', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer'
            }}
          >
            Login
          </button>
        )}
      </header>

      {/* Active Tab Screen */}
      <main>
        {activeTab === 'lobby' && (
          <Lobby user={user} onRequireAuth={() => setShowAuthModal(true)} />
        )}
        {activeTab === 'my-matches' && (
          <MyMatches user={user} onRequireAuth={() => setShowAuthModal(true)} />
        )}
        {activeTab === 'wallet' && (
          <Wallet user={user} onRefreshUser={syncProfile} onRequireAuth={() => setShowAuthModal(true)} />
        )}
        {activeTab === 'profile' && (
          <Profile user={user} onRefreshUser={syncProfile} onRequireAuth={() => setShowAuthModal(true)} />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={(userData) => setUser(userData)}
      />
    </div>
  );
}
