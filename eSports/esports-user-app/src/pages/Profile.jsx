// src/pages/Profile.jsx
import React, { useState } from 'react';
import { userApi } from '../api/userApi';

export default function Profile({ user, onRefreshUser, onRequireAuth }) {
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    bgmi_ign: user?.bgmi_ign || '',
    bgmi_uid: user?.bgmi_uid || '',
    ffm_ign: user?.ffm_ign || '',
    ffm_uid: user?.ffm_uid || ''
  });
  const [loading, setLoading] = useState(false);

  if (!user) {
    onRequireAuth();
    return null;
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await userApi.updateGameIds(formData);
      if (res.success) {
        alert('🎉 In-Game IDs saved permanently!');
        onRefreshUser();
      } else {
        alert(res.message);
      }
    } catch (e) {
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div style={{ padding: '16px' }}>
      {/* Account Info Banner */}
      <div className="card" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '50px', height: '50px', borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--brand-primary), #ff7582)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.4rem', fontWeight: 'bold', color: '#fff'
        }}>
          👤
        </div>
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '2px' }}>
            {user.full_name || 'Esports Player'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>📞 {user.phone}</p>
        </div>
      </div>

      {/* Saved In-Game IDs */}
      <div className="card">
        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', marginBottom: '14px', color: 'var(--brand-primary)' }}>
          🎮 In-Game Character IDs
        </h4>

        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Your Full Name</label>
            <input
              type="text"
              placeholder="e.g. Subhankar Mondal"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              style={{ width: '100%', marginTop: '4px' }}
            />
          </div>

          {/* BGMI Card Section */}
          <div style={{
            background: 'var(--bg-input)', border: '1px solid rgba(245,158,11,0.25)',
            padding: '12px', borderRadius: '10px'
          }}>
            <strong style={{ fontSize: '0.85rem', color: 'var(--game-bgmi)', fontFamily: 'var(--font-heading)' }}>
              BGMI DETAILS
            </strong>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
              <input
                type="text"
                placeholder="BGMI IGN"
                value={formData.bgmi_ign}
                onChange={(e) => setFormData({ ...formData, bgmi_ign: e.target.value })}
              />
              <input
                type="text"
                placeholder="BGMI UID"
                value={formData.bgmi_uid}
                onChange={(e) => setFormData({ ...formData, bgmi_uid: e.target.value })}
              />
            </div>
          </div>

          {/* Free Fire MAX Card Section */}
          <div style={{
            background: 'var(--bg-input)', border: '1px solid rgba(56,189,248,0.25)',
            padding: '12px', borderRadius: '10px'
          }}>
            <strong style={{ fontSize: '0.85rem', color: 'var(--game-ffm)', fontFamily: 'var(--font-heading)' }}>
              FREE FIRE MAX DETAILS
            </strong>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
              <input
                type="text"
                placeholder="FFM IGN"
                value={formData.ffm_ign}
                onChange={(e) => setFormData({ ...formData, ffm_ign: e.target.value })}
              />
              <input
                type="text"
                placeholder="FFM UID"
                value={formData.ffm_uid}
                onChange={(e) => setFormData({ ...formData, ffm_uid: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="btn-block btn-brand" style={{ marginTop: '8px', height: '46px' }} disabled={loading}>
            {loading ? 'Saving IDs...' : 'Save In-Game IDs'}
          </button>
        </form>
      </div>

      <button
        onClick={handleLogout}
        className="btn-block"
        style={{
          background: 'rgba(218,54,51,0.15)', border: '1px solid #da3633',
          color: '#f85149', marginTop: '16px', height: '44px'
        }}
      >
        🚪 Logout Account
      </button>
    </div>
  );
}
