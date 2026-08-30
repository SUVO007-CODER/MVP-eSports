// src/pages/Matches.jsx
import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';

export default function Matches({ onNavigateToResult }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [roomData, setRoomData] = useState({ room_id: '', room_password: '' });

  // Create match form state
  const [formData, setFormData] = useState({
    game_type: 'BGMI',
    match_type: 'SOLO',
    map_name: 'Erangel',
    entry_fee: 20,
    per_kill_prize: 10,
    total_prize_pool: 500,
    rank1: 200,
    rank2: 100,
    rank3: 50,
    total_slots: 100,
    match_time: ''
  });

  const loadMatches = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getMatches();
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
    loadMatches();
  }, []);

  const handleCreateMatch = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        game_type: formData.game_type,
        match_type: formData.match_type,
        map_name: formData.map_name,
        entry_fee: Number(formData.entry_fee),
        per_kill_prize: Number(formData.per_kill_prize),
        total_prize_pool: Number(formData.total_prize_pool),
        total_slots: Number(formData.total_slots),
        match_time: new Date(formData.match_time).toISOString(),
        rank_rewards: {
          "1": Number(formData.rank1),
          "2": Number(formData.rank2),
          "3": Number(formData.rank3)
        }
      };

      const res = await adminApi.createMatch(payload);
      if (res.success) {
        alert('Match created successfully!');
        loadMatches();
      } else {
        alert(res.message || 'Failed to create match');
      }
    } catch (err) {
      alert('Error creating match');
    }
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    if (!selectedMatch) return;
    try {
      const res = await adminApi.updateRoom(selectedMatch.id, roomData.room_id, roomData.room_password);
      if (res.success) {
        alert('Room details published!');
        setShowModal(false);
        setSelectedMatch(null);
        setRoomData({ room_id: '', room_password: '' });
        loadMatches();
      } else {
        alert(res.message || 'Failed to update room');
      }
    } catch (err) {
      alert('Error updating room details');
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: 'var(--accent-primary)' }}>🎮 Match Operations</h2>

      {/* Match Creation Form */}
      <div className="card">
        <h3 style={{ marginBottom: '15px' }}>Create New Match</h3>
        <form onSubmit={handleCreateMatch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
          <div className="form-group">
            <label>Game</label>
            <select value={formData.game_type} onChange={e => setFormData({ ...formData, game_type: e.target.value })}>
              <option value="BGMI">BGMI</option>
              <option value="FFM">Free Fire MAX</option>
            </select>
          </div>

          <div className="form-group">
            <label>Mode</label>
            <select value={formData.match_type} onChange={e => setFormData({ ...formData, match_type: e.target.value })}>
              <option value="SOLO">SOLO</option>
              <option value="DUO">DUO</option>
              <option value="SQUAD">SQUAD</option>
            </select>
          </div>

          <div className="form-group">
            <label>Map</label>
            <input type="text" value={formData.map_name} onChange={e => setFormData({ ...formData, map_name: e.target.value })} required />
          </div>

          <div className="form-group">
            <label>Entry Fee (₹)</label>
            <input type="number" value={formData.entry_fee} onChange={e => setFormData({ ...formData, entry_fee: e.target.value })} required />
          </div>

          <div className="form-group">
            <label>Per Kill (₹)</label>
            <input type="number" value={formData.per_kill_prize} onChange={e => setFormData({ ...formData, per_kill_prize: e.target.value })} required />
          </div>

          <div className="form-group">
            <label>Total Prize (₹)</label>
            <input type="number" value={formData.total_prize_pool} onChange={e => setFormData({ ...formData, total_prize_pool: e.target.value })} required />
          </div>

          <div className="form-group">
            <label>Rank 1 Prize (₹)</label>
            <input type="number" value={formData.rank1} onChange={e => setFormData({ ...formData, rank1: e.target.value })} required />
          </div>

          <div className="form-group">
            <label>Rank 2 Prize (₹)</label>
            <input type="number" value={formData.rank2} onChange={e => setFormData({ ...formData, rank2: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Rank 3 Prize (₹)</label>
            <input type="number" value={formData.rank3} onChange={e => setFormData({ ...formData, rank3: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Total Slots</label>
            <input type="number" value={formData.total_slots} onChange={e => setFormData({ ...formData, total_slots: e.target.value })} required />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Match Schedule Date & Time</label>
            <input type="datetime-local" value={formData.match_time} onChange={e => setFormData({ ...formData, match_time: e.target.value })} required />
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>➕ Schedule Match</button>
          </div>
        </form>
      </div>

      {/* Matches List */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>All Scheduled Matches</h3>
          <button className="btn btn-green" onClick={loadMatches}>🔄 Refresh</button>
        </div>

        {loading ? (
          <p style={{ marginTop: '15px', color: 'var(--text-muted)' }}>Loading matches...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Game</th>
                <th>Mode</th>
                <th>Map</th>
                <th>Fee</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {matches.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No matches found</td></tr>
              ) : (
                matches.map(m => (
                  <tr key={m.id}>
                    <td><span className={`badge badge-${m.game_type.toLowerCase()}`}>{m.game_type}</span></td>
                    <td>{m.match_type}</td>
                    <td>{m.map_name}</td>
                    <td>₹{m.entry_fee}</td>
                    <td>{m.joined_slots}/{m.total_slots}</td>
                    <td>
                      <span className={`badge ${m.status === 'COMPLETED' ? 'badge-success' : 'badge-pending'}`}>
                        {m.status}
                      </span>
                    </td>
                    <td style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-green"
                        style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                        onClick={() => { setSelectedMatch(m); setShowModal(true); }}
                      >
                        🔑 Set Room
                      </button>
                      <button
                        className="btn btn-primary"
                        style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                        onClick={() => onNavigateToResult(m.id)}
                      >
                        ⚡ Result
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Room ID/Password Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99
        }}>
          <div className="card" style={{ width: '380px' }}>
            <h3 style={{ marginBottom: '15px' }}>Publish Room Credentials</h3>
            <form onSubmit={handleUpdateRoom}>
              <div className="form-group">
                <label>Room ID</label>
                <input
                  type="text"
                  required
                  value={roomData.room_id}
                  onChange={e => setRoomData({ ...roomData, room_id: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Room Password</label>
                <input
                  type="text"
                  required
                  value={roomData.room_password}
                  onChange={e => setRoomData({ ...roomData, room_password: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save & Publish</button>
                <button type="button" className="btn btn-danger" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
