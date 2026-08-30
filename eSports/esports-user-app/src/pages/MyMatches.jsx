// src/pages/MyMatches.jsx
import React, { useState, useEffect } from 'react';
import { userApi } from '../api/userApi';

export default function MyMatches({ user, onRequireAuth }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomInfo, setRoomInfo] = useState({});
  const [activeSubTab, setActiveSubTab] = useState('UPCOMING');

  const loadMyMatches = async () => {
    if (!user) return setLoading(false);
    setLoading(true);
    try {
      const res = await userApi.getMatches();
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
    if (!user) {
      onRequireAuth();
    } else {
      loadMyMatches();
    }
  }, [user]);

  const handleRevealRoom = async (matchId) => {
    try {
      const res = await userApi.getRoomDetails(matchId);
      if (res.success) {
        setRoomInfo((prev) => ({ ...prev, [matchId]: res }));
      } else {
        alert(res.message || 'Room details not published yet by admin');
      }
    } catch (err) {
      alert('Error fetching room credentials');
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    alert(`✔ ${label} copied to clipboard!`);
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
        <p style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔒</p>
        <h4 style={{ color: 'var(--text-primary)', marginBottom: '6px' }}>Account Required</h4>
        <p style={{ fontSize: '0.85rem' }}>Please login to view your booked match slots & room details.</p>
      </div>
    );
  }

  const filteredMatches = matches.filter((m) =>
    activeSubTab === 'UPCOMING' ? m.status !== 'COMPLETED' : m.status === 'COMPLETED'
  );

  return (
    <div>
      {/* Sub tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }}>
        {[
          { id: 'UPCOMING', label: '⏳ Upcoming Matches' },
          { id: 'COMPLETED', label: '🏆 Completed Matches' }
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1, padding: '14px 0', background: 'none', border: 'none',
                borderBottom: isActive ? '3px solid var(--brand-primary)' : '3px solid transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '0.9rem',
                cursor: 'pointer', transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading tournaments...</p>
      ) : filteredMatches.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🎯</p>
          <p>No matches found in this category.</p>
        </div>
      ) : (
        filteredMatches.map((m) => {
          const room = roomInfo[m.id];
          const isBgmi = m.game_type === 'BGMI';

          return (
            <div key={m.id} className={`match-card ${isBgmi ? 'card-bgmi' : 'card-ffm'}`}>
              <div className="match-header">
                <span className={`game-tag ${m.game_type.toLowerCase()}`}>{m.game_type} • {m.match_type}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  {new Date(m.match_time).toLocaleDateString()} at {new Date(m.match_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="match-title">{m.map_name} Tournament</div>

              {/* Room Card Status Box */}
              {activeSubTab === 'UPCOMING' && (
                <div style={{
                  background: 'var(--bg-input)', border: '1px solid var(--border-subtle)',
                  padding: '14px', borderRadius: '10px', marginBottom: '14px'
                }}>
                  {room ? (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.85rem' }}>Room ID: <strong style={{ color: 'var(--accent-gold)', fontSize: '1rem' }}>{room.room_id}</strong></span>
                        <button
                          onClick={() => copyToClipboard(room.room_id, 'Room ID')}
                          style={{
                            background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.3)',
                            color: '#38bdf8', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700'
                          }}
                        >
                          📋 Copy
                        </button>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem' }}>Password: <strong style={{ color: 'var(--accent-gold)', fontSize: '1rem' }}>{room.room_password}</strong></span>
                        <button
                          onClick={() => copyToClipboard(room.room_password, 'Password')}
                          style={{
                            background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.3)',
                            color: '#38bdf8', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700'
                          }}
                        >
                          📋 Copy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRevealRoom(m.id)}
                      className="btn-block"
                      style={{
                        background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                        color: '#fff', padding: '10px', fontSize: '0.88rem'
                      }}
                    >
                      🔑 Unlock Room ID & Password
                    </button>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <span>Status: <strong style={{ color: 'var(--text-primary)' }}>{m.status}</strong></span>
                <span>Entry Fee: <strong style={{ color: 'var(--accent-gold)' }}>₹{m.entry_fee}</strong></span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
