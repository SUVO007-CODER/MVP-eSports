// src/App.jsx
import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Matches from './pages/Matches';
import ResultEntry from './pages/ResultEntry';
import Withdrawals from './pages/Withdrawals';

export default function App() {
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState('matches');
  const [selectedMatchId, setSelectedMatchId] = useState(null); // Result entry-te redirect korar jonno

  // Check saved session on load
  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    const savedUser = localStorage.getItem('admin_user');
    if (savedToken && savedUser) {
      try {
        setAdmin(JSON.parse(savedUser));
      } catch (e) {
        localStorage.clear();
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setAdmin(null);
  };

  // Jodi admin logged in na thake, Login page show korbe
  if (!admin) {
    return <Login onLoginSuccess={(adminData) => setAdmin(adminData)} />;
  }

  return (
    <div className="admin-layout">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        admin={admin}
      />
      <main className="main-content">
        {activeTab === 'matches' && (
          <Matches
            onNavigateToResult={(matchId) => {
              setSelectedMatchId(matchId);
              setActiveTab('results');
            }}
          />
        )}
        {activeTab === 'results' && (
          <ResultEntry
            initialMatchId={selectedMatchId}
            onClearMatch={() => setSelectedMatchId(null)}
          />
        )}
        {activeTab === 'withdrawals' && <Withdrawals />}
      </main>
    </div>
  );
}
