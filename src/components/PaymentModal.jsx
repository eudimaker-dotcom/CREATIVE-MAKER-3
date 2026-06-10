import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, HelpCircle, Loader2 } from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, asset, onPaymentSuccess }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !asset) return null;

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvc) return;

    setLoading(true);
    // Simulate payment transaction process
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onPaymentSuccess(asset);
        onClose();
        setSuccess(false);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container glass-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{ border: '1px dotted var(--border-color-dotted)', padding: '32px', maxWidth: '460px' }}
      >
        
        {/* Header */}
        <div className="flex-between" style={{ marginBottom: '24px' }}>
          <div className="flex-center" style={{ gap: '8px' }}>
            <CreditCard size={18} style={{ color: 'var(--accent-color)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Stripe Secure Checkout</h3>
          </div>
          <button 
            onClick={onClose} 
            className="btn-dotted-link" 
            style={{ padding: '6px', borderRadius: '50%' }}
            disabled={loading}
          >
            <X size={14} />
          </button>
        </div>

        {success ? (
          <div className="text-center" style={{ padding: '32px 0' }}>
            <div className="flex-center" style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(173,250,29,0.1)', 
              margin: '0 auto 16px auto',
              color: 'var(--accent-color)'
            }}>
              <ShieldCheck size={36} />
            </div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>Payment Approved</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Updating your download license...</p>
          </div>
        ) : (
          <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Asset Summary */}
            <div style={{ 
              backgroundColor: 'var(--card-bg-hover)', 
              padding: '16px', 
              borderRadius: 'var(--border-radius-md)',
              border: '1px dotted var(--border-color-dotted)',
              textAlign: 'left'
            }}>
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Purchasing Item</p>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '4px 0' }}>{asset.title || asset.name}</h4>
              <div className="flex-between" style={{ marginTop: '12px', borderTop: '1px dotted var(--border-color-dotted)', paddingTop: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Amount</span>
                <span style={{ fontSize: '1rem', fontWeight: 800 }}>${asset.price.toFixed(2)}</span>
              </div>
            </div>

            {/* Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Card Number</label>
              <input 
                type="text" 
                placeholder="4242 4242 4242 4242"
                maxLength="19"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="input-ali"
                disabled={loading}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Expiration Date</label>
                <input 
                  type="text" 
                  placeholder="MM/YY"
                  maxLength="5"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="input-ali"
                  disabled={loading}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>CVC / CVV</label>
                <input 
                  type="password" 
                  placeholder="•••"
                  maxLength="4"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  className="input-ali"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Shield disclaimer */}
            <div className="flex-center" style={{ gap: '6px', fontSize: '0.7rem', color: 'var(--text-muted)', justifyContent: 'flex-start' }}>
              <ShieldCheck size={14} style={{ color: 'var(--accent-color)' }} />
              <span>Secure checkout powered by Stripe. Encrypted SSL connection.</span>
            </div>

            <button 
              type="submit" 
              className="btn-accent-ali hover-translate"
              style={{ width: '100%', padding: '14px', borderRadius: 'var(--border-radius-md)', gap: '8px', marginTop: '8px' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing secure payment...</span>
                </>
              ) : (
                <span>Pay ${asset.price.toFixed(2)} USD</span>
              )}
            </button>

          </form>
        )}

      </div>

      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
