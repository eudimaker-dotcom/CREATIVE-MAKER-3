import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { authService } from '../supabase';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [view, setView] = useState('login'); // 'login', 'register', 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAuthAction = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (view === 'login') {
        if (!email || !password) {
          throw new Error('Please fill in all fields.');
        }
        const loggedUser = await authService.signIn(email, password);
        onLoginSuccess(loggedUser);
        onClose();
      } else if (view === 'register') {
        if (!email || !password || !name) {
          throw new Error('Please fill in all fields.');
        }
        const registeredUser = await authService.signUp(email, password, name);
        onLoginSuccess(registeredUser);
        onClose();
      } else if (view === 'forgot') {
        if (!email) {
          throw new Error('Please enter your email address.');
        }
        await authService.resetPassword(email);
        setSuccess(
          authService.isRealSupabase 
            ? 'Password reset email sent! Check your inbox.' 
            : 'Password reset simulation successful! (Email check simulated in LocalStorage)'
        );
      }
    } catch (err) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const googleUser = await authService.signInWithGoogle();
      // If it's mock flow, log them in directly
      if (!authService.isRealSupabase) {
        onLoginSuccess(googleUser);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#0c0b14', // dark base fallback
        backgroundImage: 'url("/lavender_login_bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '24px',
        boxSizing: 'border-box'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '400px', // slightly smaller width for perfect proportion
          borderRadius: '24px', // slightly tighter corners
          background: 'rgba(20, 17, 34, 0.5)', 
          backdropFilter: 'blur(30px) saturate(130%)',
          WebkitBackdropFilter: 'blur(30px) saturate(130%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
          padding: '28px 24px', // reduced padding
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          color: '#ffffff',
          fontFamily: "'Inter', sans-serif",
          boxSizing: 'border-box'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          style={{ 
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
          }}
        >
          <X size={14} />
        </button>

        {/* Minimal Sun Logo/Icon */}
        <div style={{
          color: '#c3b4fc',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="M4.93 4.93l1.41 1.41" />
            <path d="M17.66 17.66l1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="M6.34 17.66l-1.41 1.41" />
            <path d="M19.07 4.93l-1.41 1.41" />
          </svg>
        </div>

        {/* Header Titles */}
        <h2 style={{ 
          fontSize: '1.75rem', 
          fontWeight: 400, 
          letterSpacing: '-0.02em',
          margin: '0 0 6px 0',
          color: '#ffffff',
          fontFamily: "'Outfit', sans-serif"
        }}>
          {view === 'login' && 'Welcome back!'}
          {view === 'register' && 'Crie sua conta'}
          {view === 'forgot' && 'Recuperar senha'}
        </h2>
        
        <p style={{ 
          fontSize: '0.78rem', 
          lineHeight: '1.4',
          color: 'rgba(255, 255, 255, 0.55)', 
          maxWidth: '280px',
          margin: '0 auto 20px auto',
          fontWeight: 400
        }}>
          {view === 'login' && 'Sign in to access your guided meditations, daily practices, and personal journey'}
          {view === 'register' && 'Sign up to create your account and access all mockups, templates and fonts'}
          {view === 'forgot' && 'Insira seu e-mail cadastrado para enviarmos um link de redefinição de senha'}
        </p>

        {error && (
          <div style={{
            fontSize: '0.72rem',
            color: '#fda4af',
            backgroundColor: 'rgba(244, 63, 94, 0.15)',
            padding: '10px 14px',
            borderRadius: '10px',
            marginBottom: '16px',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            width: '100%',
            textAlign: 'left',
            boxSizing: 'border-box'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            fontSize: '0.72rem',
            color: '#a7f3d0',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            padding: '10px 14px',
            borderRadius: '10px',
            marginBottom: '16px',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            width: '100%',
            textAlign: 'left',
            boxSizing: 'border-box'
          }}>
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuthAction} style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', boxSizing: 'border-box' }}>
          
          {view === 'register' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.7)' }}>Name</label>
              <input 
                type="text" 
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#c3b4fc'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.7)' }}>Email</label>
            <input 
              type="email" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#c3b4fc'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
            />
          </div>

          {view !== 'forgot' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.7)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '10px 42px 10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#c3b4fc'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.4)',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          )}

          {/* Remember Me and Forgot Password */}
          {view === 'login' && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              fontSize: '0.78rem',
              marginTop: '2px'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'rgba(255, 255, 255, 0.7)' }}>
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  style={{
                    accentColor: '#c3b4fc',
                    cursor: 'pointer',
                    width: '13px',
                    height: '13px',
                    borderRadius: '3px'
                  }}
                />
                <span>Remember me</span>
              </label>
              <span 
                style={{ color: '#c3b4fc', cursor: 'pointer', textDecoration: 'none' }}
                onClick={() => {
                  setError('');
                  setSuccess('');
                  setView('forgot');
                }}
              >
                Forgot password?
              </span>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '11px', 
              borderRadius: '9999px', 
              backgroundColor: '#ffffff',
              color: '#0e0c15',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '4px',
              transition: 'all 0.2s ease',
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (loading) return;
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              if (loading) return;
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {loading ? 'Processando...' : (
              view === 'login' ? 'Log In' : 
              view === 'register' ? 'Sign Up' : 'Enviar Link'
            )}
          </button>
        </form>

        {/* OAuth Divider */}
        {view !== 'forgot' && (
          <>
            <div style={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              margin: '14px 0', 
              color: 'rgba(255, 255, 255, 0.35)', 
              fontSize: '0.75rem' 
            }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }}></div>
              <span style={{ padding: '0 10px' }}>Or</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }}></div>
            </div>

            {/* Google OAuth Button */}
            <button 
              onClick={handleGoogleSignIn}
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '10px', 
                borderRadius: '9999px', 
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (loading) return;
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                if (loading) return;
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.19-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Sign In with Google</span>
            </button>
          </>
        )}

        {/* Footer Toggle */}
        <div style={{ marginTop: '16px', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.45)' }}>
          {view === 'login' && (
            <p>
              Don't have an account?{' '}
              <span 
                onClick={() => {
                  setError('');
                  setSuccess('');
                  setView('register');
                }} 
                style={{ color: '#c3b4fc', cursor: 'pointer', fontWeight: 500 }}
              >
                Sign Up
              </span>
            </p>
          )}
          {view === 'register' && (
            <p>
              Already have an account?{' '}
              <span 
                onClick={() => {
                  setError('');
                  setSuccess('');
                  setView('login');
                }} 
                style={{ color: '#c3b4fc', cursor: 'pointer', fontWeight: 500 }}
              >
                Sign In
              </span>
            </p>
          )}
          {view === 'forgot' && (
            <p>
              <span 
                onClick={() => {
                  setError('');
                  setSuccess('');
                  setView('login');
                }} 
                style={{ color: '#c3b4fc', cursor: 'pointer', fontWeight: 500 }}
              >
                Back to Log In
              </span>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
