import React, { useState, useEffect } from 'react';
import { X, Download, ShieldCheck, ShoppingBag, Eye, Calendar, Sparkles, AlertCircle, Bookmark, Share2, Check } from 'lucide-react';
import { assetsData } from '../mockData';

export default function AssetDetailModal({ isOpen, onClose, asset, onPurchase, user, onSelectAsset, favoritesList, onToggleFavorite }) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    setActiveImageIdx(0);
    setShared(false);
  }, [asset]);

  if (!isOpen || !asset) return null;

  const isPremium = asset.price > 0;
  const isPurchased = user && user.downloads && user.downloads.includes(asset.id);
  const isFavorited = favoritesList && favoritesList.includes(asset.id);

  // Find related assets (same category, different ID)
  const relatedAssets = assetsData.filter(item => 
    item.category === asset.category && item.id !== asset.id
  ).slice(0, 3);

  const handleShareClick = () => {
    navigator.clipboard.writeText(`https://creativemaker3.com/asset/${asset.id}`);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container glass-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{ border: '1px dotted var(--border-color-dotted)', padding: '24px', maxWidth: '780px', width: '95%' }}
      >
        {/* Header */}
        <div className="flex-between" style={{ marginBottom: '20px' }}>
          <div>
            <span className="badge-secondary" style={{ marginRight: '8px' }}>{asset.category}</span>
            <span className="badge-secondary" style={{ color: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}>
              {isPremium ? 'Premium Pack' : 'Free Resource'}
            </span>
          </div>

          <div className="flex-center" style={{ gap: '8px' }}>
            {/* Bookmark Save */}
            <button
              onClick={() => onToggleFavorite(asset)}
              className="btn-dotted-link"
              style={{ padding: '6px 12px', borderRadius: 'var(--border-radius-sm)', color: isFavorited ? 'var(--accent-color)' : 'var(--text-color)', borderColor: isFavorited ? 'var(--accent-color)' : 'var(--border-color-dotted)' }}
              title={isFavorited ? "Remover dos salvos" : "Salvar recurso"}
            >
              <Bookmark size={14} fill={isFavorited ? "currentColor" : "none"} />
            </button>

            {/* Share */}
            <button
              onClick={handleShareClick}
              className="btn-dotted-link"
              style={{ padding: '6px 12px', borderRadius: 'var(--border-radius-sm)', gap: '4px' }}
              title="Share link"
            >
              {shared ? <Check size={14} style={{ color: 'var(--accent-color)' }} /> : <Share2 size={14} />}
              <span>{shared ? 'Copied' : 'Share'}</span>
            </button>

            <button 
              onClick={onClose} 
              className="btn-dotted-link" 
              style={{ padding: '6px', borderRadius: '50%' }}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Content Panel */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
          gap: '24px',
          marginBottom: '24px'
        }} className="md:grid-cols-2">
          
          {/* Left Column: Image Slider */}
          <div>
            <div style={{ 
              borderRadius: 'var(--border-radius-md)', 
              overflow: 'hidden', 
              aspectRatio: '4/3', 
              backgroundColor: 'var(--card-bg-hover)',
              border: '1px dotted var(--border-color-dotted)',
              position: 'relative'
            }}>
              <img 
                src={asset.images[activeImageIdx]} 
                alt={asset.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Slide Indicators */}
            {asset.images.length > 1 && (
              <div className="flex-center" style={{ gap: '8px', marginTop: '12px' }}>
                {asset.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    style={{
                      width: '60px',
                      height: '45px',
                      borderRadius: 'var(--border-radius-sm)',
                      overflow: 'hidden',
                      border: activeImageIdx === idx ? '2px solid var(--text-color)' : '1px solid var(--border-color)',
                      opacity: activeImageIdx === idx ? 1 : 0.6,
                      cursor: 'pointer'
                    }}
                  >
                    <img src={img} alt="indicator" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px', lineHeight: 1.2 }}>
                {asset.title}
              </h2>
              <div className="flex-center" style={{ gap: '12px', fontSize: '0.75rem', color: 'var(--text-muted)', justifyContent: 'flex-start' }}>
                <span className="flex-center" style={{ gap: '4px' }}>
                  <Calendar size={12} />
                  <span>{new Date(asset.uploadedAt).toLocaleDateString()}</span>
                </span>
                <span>•</span>
                <span>{asset.views.toLocaleString()} views</span>
                <span>•</span>
                <span>{asset.downloads.toLocaleString()} downloads</span>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {asset.description}
            </p>

            {/* License details */}
            <div style={{
              backgroundColor: 'var(--card-bg-hover)',
              padding: '12px',
              borderRadius: 'var(--border-radius-md)',
              border: '1px dotted var(--border-color-dotted)',
              fontSize: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <span className="flex-center" style={{ gap: '6px', justifyContent: 'flex-start', fontWeight: 600 }}>
                <ShieldCheck size={14} style={{ color: 'var(--accent-color)' }} />
                <span>Commercial Use Allowed</span>
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                Use this asset in personal and client projects without attributions. Reselling or distributing source files is prohibited.
              </span>
            </div>

            {/* Action Area */}
            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px dotted var(--border-color-dotted)' }}>
              {isPremium ? (
                isPurchased ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '6px', fontSize: '0.75rem', color: 'var(--accent-color)', alignItems: 'center' }}>
                      <AlertCircle size={14} />
                      <span>Purchased & Licensed (Unlocked)</span>
                    </div>
                    <a 
                      href={asset.downloadLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-accent-ali hover-translate"
                      style={{ padding: '14px', borderRadius: 'var(--border-radius-md)', width: '100%', textDecoration: 'none' }}
                    >
                      <Download size={16} />
                      <span>Download Unlocked Source Files</span>
                    </a>
                  </div>
                ) : (
                  <button 
                    onClick={() => onPurchase(asset)}
                    className="btn-primary-ali hover-translate"
                    style={{ 
                      padding: '14px', 
                      borderRadius: 'var(--border-radius-md)', 
                      width: '100%', 
                      gap: '8px', 
                      backgroundColor: '#0026ff',
                      color: '#ffffff'
                    }}
                  >
                    <ShoppingBag size={16} />
                    <span>Purchase Pack License — ${asset.price.toFixed(2)}</span>
                  </button>
                )
              ) : (
                <a 
                  href={asset.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-accent-ali hover-translate"
                  style={{ padding: '14px', borderRadius: 'var(--border-radius-md)', width: '100%', textDecoration: 'none' }}
                >
                  <Download size={16} />
                  <span>Download Free Asset (PSD/FIGMA)</span>
                </a>
              )}
            </div>

          </div>
        </div>

        {/* Related Assets Section */}
        {relatedAssets.length > 0 && (
          <div style={{ borderTop: '1px dotted var(--border-color-dotted)', paddingTop: '20px', textAlign: 'left' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '12px' }}>
              Related Creative Resources
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
              gap: '16px'
            }} className="md:grid-cols-3">
              {relatedAssets.map((rel) => (
                <div 
                  key={rel.id} 
                  className="flex-center border-dotted-ali hover-translate"
                  onClick={() => onSelectAsset(rel)}
                  style={{ 
                    padding: '8px', 
                    borderRadius: 'var(--border-radius-md)', 
                    backgroundColor: 'var(--card-bg-hover)',
                    cursor: 'pointer',
                    gap: '10px',
                    justifyContent: 'flex-start'
                  }}
                >
                  <img 
                    src={rel.images[0]} 
                    alt={rel.title} 
                    style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: 'var(--border-radius-sm)' }}
                  />
                  <div style={{ overflow: 'hidden' }}>
                    <h5 style={{ fontSize: '0.75rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rel.title}</h5>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{rel.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <style>{`
        @media (min-width: 768px) {
          .md\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          .md\\:grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
        }
      `}</style>
    </div>
  );
}
