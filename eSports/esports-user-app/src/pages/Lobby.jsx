// src/pages/Lobby.jsx
import React, { useState, useEffect } from 'react';
import { userApi } from '../api/userApi';
import SlotPickerModal from '../components/SlotPickerModal';

export default function Lobby({ user, onRequireAuth }) {
  const [activeGame, setActiveGame] = useState('ALL');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await userApi.getMatches(activeGame === 'ALL' ? '' : activeGame);
      if (res.success) {
        setMatches(res.matches || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [activeGame]);

  return (
    <div>
      {/* Dynamic Game Switcher */}
      <div style={{ display: 'flex', gap: '8px', padding: '14px 16px', background: 'var(--bg-surface)' }}>
        {[
          { id: 'ALL', label: '🔥 All Arenas' },
          { id: 'BGMI', label: 'BGMI' },
          { id: 'FFM', label: 'Free Fire MAX' }
        ].map((tab) => {
          const isActive = activeGame === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveGame(tab.id)}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: '10px',
                border: isActive ? '1px solid var(--border-active)' : '1px solid var(--border-subtle)',
                background: isActive ? 'linear-gradient(135deg, rgba(255,70,85,0.2), rgba(255,70,85,0.05))' : 'var(--bg-input)',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                fontFamily: 'var(--font-heading)',
                fontWeight: '700',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Match Cards Stream */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          <p>⚡ Fetching live tournament lobbies...</p>
        </div>
      ) : matches.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎯</p>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>No Active Tournaments</h4>
          <p style={{ fontSize: '0.85rem' }}>Matches will appear once scheduled by admins.</p>
        </div>
      ) : (
        matches.map((m) => {
          const isFull = m.joined_slots >= m.total_slots;
          const fillPercentage = Math.min(100, Math.round((m.joined_slots / m.total_slots) * 100));
          const isBgmi = m.game_type === 'BGMI';

          return (
            <div key={m.id} className={`match-card ${isBgmi ? 'card-bgmi' : 'card-ffm'}`}>
              <div className="match-header">
                <span className={`game-tag ${m.game_type.toLowerCase()}`}>
                  {m.game_type} • {m.match_type}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  🕒 {new Date(m.match_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="match-title">{m.map_name} Tournament</div>

              <div className="match-stats-grid">
                <div>
                  <div className="stat-label">WIN PRIZE</div>
                  <div className="stat-value" style={{ color: 'var(--accent-gold)' }}>₹{m.total_prize_pool}</div>
                </div>
                <div>
                  <div className="stat-label">PER KILL</div>
                  <div className="stat-value" style={{ color: 'var(--accent-green)' }}>₹{m.per_kill_prize}</div>
                </div>
                <div>
                  <div className="stat-label">ENTRY FEE</div>
                  <div className="stat-value">₹{m.entry_fee}</div>
                </div>
              </div>

              {/* Progress & Slots Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  Registered: <strong style={{ color: 'var(--text-primary)' }}>{m.joined_slots}/{m.total_slots}</strong>
                </span>
                <span style={{ color: isFull ? '#ef4444' : '#34d399', fontWeight: '700' }}>
                  {isFull ? 'LOBBY FULL' : `${m.total_slots - m.joined_slots} Slots Left`}
                </span>
              </div>

              <div className="slot-progress-container">
                <div
                  className="slot-progress-bar"
                  style={{
                    width: `${fillPercentage}%`,
                    background: isBgmi
                      ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                      : 'linear-gradient(90deg, #0284c7, #38bdf8)'
                  }}
                />
              </div>

              <button
                onClick={() => setSelectedMatch(m)}
                className="btn-block btn-brand"
                disabled={isFull}
                style={{
                  opacity: isFull ? 0.4 : 1,
                  cursor: isFull ? 'not-allowed' : 'pointer'
                }}
              >
                {isFull ? 'LOBBY FILLED' : 'SELECT SLOT & JOIN'}
              </button>
            </div>
          );
        })
      )}

      {/* Visual Slot Picker Modal */}
      {selectedMatch && (
        <SlotPickerModal
          match={selectedMatch}
          user={user}
          onClose={() => setSelectedMatch(null)}
          onJoinSuccess={fetchMatches}
          onRequireAuth={onRequireAuth}
        />
      )}
    </div>
  );
}
