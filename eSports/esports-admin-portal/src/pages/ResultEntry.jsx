// src/pages/ResultEntry.jsx
import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';

export default function ResultEntry({ initialMatchId, onClearMatch }) {
  const [matchId, setMatchId] = useState(initialMatchId || '');
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialMatchId) {
      setMatchId(initialMatchId);
      loadParticipants(initialMatchId);
    }
  }, [initialMatchId]);

  const loadParticipants = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await adminApi.getParticipants(id);
      if (res.success) {
        // Initialize editable fields
        const formatted = (res.participants || []).map(p => ({
          ...p,
          kills: p.kills ?? 0,
          rank_position: p.rank_position ?? ''
        }));
        setParticipants(formatted);
      } else {
        alert(res.message || 'Failed to fetch participants');
      }
    } catch (err) {
      alert('Error fetching participants');
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (index, field, value) => {
    const updated = [...participants];
    updated[index][field] = value === '' ? '' : Number(value);
    setParticipants(updated);
  };

  const handleDisburse = async () => {
    if (!matchId) return alert('Select a Match ID first');
    if (participants.length === 0) return alert('No players found in this match');

    const confirmAction = window.confirm(
      'Are you sure you want to calculate winnings and credit player wallets? This action cannot be reversed.'
    );
    if (!confirmAction) return;

    setSubmitting(true);
    try {
      const payload = participants.map(p => ({
        user_id: p.user_id,
        kills: Number(p.kills) || 0,
        rank_position: p.rank_position ? Number(p.rank_position) : null
      }));

      const res = await adminApi.disburseResults(matchId, payload);
      if (res.success) {
        alert('🎉 Results disbursed & player wallets credited successfully!');
        loadParticipants(matchId);
      } else {
        alert(res.message || 'Failed to disburse results');
      }
    } catch (err) {
      alert('Error processing disbursal');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: 'var(--accent-primary)' }}>⚡ Fast Result Entry & Disbursal</h2>

      <div className="card" style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
        <div className="form-group" style={{ flex: 1, margin: 0 }}>
          <label>Target Match UUID</label>
          <input
            type="text"
            placeholder="Paste Match ID"
            value={matchId}
            onChange={e => setMatchId(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={() => loadParticipants(matchId)} disabled={loading}>
          {loading ? 'Fetching...' : 'Fetch Joined Players'}
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3>Joined Participants Scorecard ({participants.length} Players)</h3>
          <button
            className="btn btn-green"
            onClick={handleDisburse}
            disabled={submitting || participants.length === 0}
            style={{ fontSize: '0.95rem', padding: '10px 20px' }}
          >
            {submitting ? 'Calculating & Crediting...' : '🚀 Calculate & Disburse Payouts'}
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Slot</th>
              <th>Player IGN</th>
              <th>UID</th>
              <th style={{ width: '130px' }}>Kills Input</th>
              <th style={{ width: '130px' }}>Rank Input</th>
              <th>Won (₹)</th>
            </tr>
          </thead>
          <tbody>
            {participants.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  No participants found. Please enter a valid Match ID.
                </td>
              </tr>
            ) : (
              participants.map((p, idx) => (
                <tr key={p.id}>
                  <td><strong>#{p.slot_no}</strong></td>
                  <td>{p.player_ign}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{p.player_uid}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={p.kills}
                      onChange={e => handleScoreChange(idx, 'kills', e.target.value)}
                      style={{ width: '90px', padding: '6px' }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 1"
                      value={p.rank_position}
                      onChange={e => handleScoreChange(idx, 'rank_position', e.target.value)}
                      style={{ width: '90px', padding: '6px' }}
                    />
                  </td>
                  <td style={{ color: '#3fb950', fontWeight: 'bold' }}>
                    ₹{p.total_winnings || 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
