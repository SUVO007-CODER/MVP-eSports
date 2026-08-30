// src/components/SlotPickerModal.jsx
import React, { useState } from 'react';
import { userApi } from '../api/userApi';

export default function SlotPickerModal({ match, user, onClose, onJoinSuccess, onRequireAuth }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [ign, setIgn] = useState(
    match.game_type === 'BGMI' ? user?.bgmi_ign || '' : user?.ffm_ign || ''
  );
  const [uid, setUid] = useState(
    match.game_type === 'BGMI' ? user?.bgmi_uid || '' : user?.ffm_uid || ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalSlots = match.total_slots || 100;
  const slotsArray = Array.from({ length: totalSlots }, (_, i) => i + 1);

  const handleJoin = async () => {
    if (!user) {
      onRequireAuth();
      return;
    }

    if (!selectedSlot) return setError('Please choose a slot number from grid');
    if (!ign.trim() || !uid.trim()) return setError(`Enter your in-game ${match.game_type} IGN and UID`);

    setError('');
    setLoading(true);

    try {
      const res = await userApi.joinMatch(match.id, selectedSlot, ign, uid);
      if (res.success) {
        alert(`🎉 Slot #${selectedSlot} booked successfully!`);
        onJoinSuccess();
        onClose();
      } else {
        setError(res.message || 'Failed to book slot');
      }
    } catch (err) {
      setError('Error joining match. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100
    }}>
      <div style={{
        background: 'var(--bg-surface)', borderTop: '1px solid var(--border-active)',
        borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px 20px',
        width: '100%', maxWidth: '480px', maxHeight: '88vh', overflowY: 'auto',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.8)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: '800' }}>
              CHOOSE YOUR SLOT
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Entry Fee: <strong style={{ color: 'var(--accent-gold)' }}>₹{match.entry_fee}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-input)', border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)', width: '32px', height: '32px',
              borderRadius: '50%', cursor: 'pointer', fontWeight: '700'
            }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#f87171', padding: '10px 14px', borderRadius: '8px',
            fontSize: '0.82rem', marginBottom: '14px', fontWeight: '500'
          }}>
            {error}
          </div>
        )}

        {/* Slot Grid Indicator */}
        <div style={{ display: 'flex', gap: '16px', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '10px', height: '10px', background: 'rgba(16,185,129,0.3)', borderRadius: '2px' }} /> Available
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '10px', height: '10px', background: 'var(--accent-gold)', borderRadius: '2px' }} /> Selected
          </span>
        </div>

        {/* 1-100 Slot Visual Grid */}
        <div className="slot-grid" style={{ marginBottom: '18px', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
          {slotsArray.map((slotNo) => {
            const isSelected = selectedSlot === slotNo;
            return (
              <div
                key={slotNo}
                onClick={() => setSelectedSlot(slotNo)}
                className={`slot-box ${isSelected ? 'slot-selected' : 'slot-available'}`}
                style={{
                  padding: '8px 0',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-heading)',
                  borderRadius: '6px',
                  transition: 'transform 0.15s ease'
                }}
              >
                #{slotNo}
              </div>
            );
          })}
        </div>

        {/* Player Game Details Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              In-Game Name ({match.game_type} IGN)
            </label>
            <input
              type="text"
              placeholder={`Exact ${match.game_type} IGN`}
              value={ign}
              onChange={(e) => setIgn(e.target.value)}
              style={{ width: '100%', marginTop: '4px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              Character UID ({match.game_type} UID)
            </label>
            <input
              type="text"
              placeholder={`Exact ${match.game_type} UID`}
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              style={{ width: '100%', marginTop: '4px' }}
            />
          </div>
        </div>

        <button
          onClick={handleJoin}
          className="btn-block btn-brand"
          disabled={loading}
          style={{ height: '48px' }}
        >
          {loading ? 'Confirming Slot...' : `Pay ₹${match.entry_fee} & Confirm Slot ${selectedSlot ? `#${selectedSlot}` : ''}`}
        </button>
      </div>
    </div>
  );
}
