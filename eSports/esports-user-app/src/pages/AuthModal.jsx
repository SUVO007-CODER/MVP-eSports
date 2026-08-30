// src/pages/AuthModal.jsx
import React, { useState } from 'react';
import { userApi } from '../api/userApi';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [step, setStep] = useState('PHONE');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phone.length < 10) return setError('Enter a valid 10-digit mobile number');
    setError('');
    setLoading(true);

    try {
      const res = await userApi.sendOtp(phone);
      if (res.success) {
        setStep('OTP');
      } else {
        setError(res.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Server connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await userApi.verifyOtp(phone, otp);
      if (res.success) {
        localStorage.setItem('user_token', res.token);
        localStorage.setItem('user_data', JSON.stringify(res.user));
        onAuthSuccess(res.user);
        onClose();
      } else {
        setError(res.message || 'Incorrect OTP');
      }
    } catch (err) {
      setError('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px'
    }}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-active)',
        borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '380px',
        boxShadow: '0 0 40px var(--brand-glow)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--brand-primary)', letterSpacing: '0.5px' }}>
            ⚡ INSTANT GAMER LOGIN
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', color: 'var(--text-secondary)',
              fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold'
            }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#f87171', padding: '8px 12px', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '14px'
          }}>
            {error}
          </div>
        )}

        {step === 'PHONE' ? (
          <form onSubmit={handleSendOtp}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '14px' }}>
              Enter your mobile number to get instant verification OTP:
            </p>
            <input
              type="tel"
              maxLength="10"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: '100%', marginBottom: '16px' }}
              required
            />
            <button type="submit" className="btn-block btn-brand" disabled={loading} style={{ height: '46px' }}>
              {loading ? 'Sending OTP...' : 'Send Verification OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '14px' }}>
              Enter the OTP sent to <strong>{phone}</strong> (Check Server Console):
            </p>
            <input
              type="text"
              maxLength="4"
              placeholder="••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{
                width: '100%', textAlign: 'center', fontSize: '1.4rem',
                letterSpacing: '8px', marginBottom: '16px', fontFamily: 'var(--font-heading)'
              }}
              required
            />
            <button type="submit" className="btn-block btn-brand" disabled={loading} style={{ height: '46px' }}>
              {loading ? 'Verifying...' : 'Verify & Enter Arena'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
