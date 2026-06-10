import React from 'react';
import { Download, ShoppingBag, Eye, Bookmark, Copy, Check } from 'lucide-react';
import { GlowCard } from './GlowCard';

export default function AssetCard({ asset, onSelect, onPurchase, user, isPrompt = false, onCopyPrompt, copiedId, onSelectAuthor, onToggleFavorite, isFavorited }) {
  const isPremium = asset.price > 0;

  if (isPrompt) {
    const isCopied = copiedId === asset.id;
    return (
      <GlowCard 
        className="asset-card fade-up-item is-visible hover-translate"
        customSize={true}
        glowColor={isPremium ? 'blue' : 'purple'}
      >
        <div className="asset-card-info" style={{ gap: '16px', padding: '24px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          
          {/* Tag & Model */}
          <div className="flex-between">
            <span className="badge-secondary" style={{ color: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}>
              {asset.model}
            </span>
            <span className="badge-secondary">{asset.aspectRatio}</span>
          </div>

          {/* Title */}
          <h3 className="asset-card-title" style={{ fontSize: '1rem', fontWeight: 700 }}>
            {asset.title}
          </h3>

          {/* Prompt Content */}
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            backgroundColor: 'var(--card-bg-hover)',
            padding: '12px',
            borderRadius: 'var(--border-radius-sm)',
            border: '1px dotted var(--border-color-dotted)',
            fontFamily: 'monospace',
            lineHeight: 1.4,
            maxHeight: '80px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical'
          }}>
            "{asset.promptText}"
          </div>

          {/* Actions */}
          <div className="flex-between" style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px dotted var(--border-color-dotted)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              por {asset.author}
            </span>
            <button
              onClick={() => onCopyPrompt(asset.promptText, asset.id)}
              className="btn-dotted-link"
              style={{
                padding: '6px 12px',
                borderRadius: '9999px',
                backgroundColor: isCopied ? 'var(--text-color)' : 'transparent',
                color: isCopied ? 'var(--bg-color)' : 'var(--text-color)',
                borderColor: isCopied ? 'var(--text-color)' : 'var(--border-color-dotted)',
                gap: '4px'
              }}
            >
              {isCopied ? <Check size={12} /> : <Copy size={12} />}
              <span>{isCopied ? 'Copiado' : 'Copiar Prompt'}</span>
            </button>
          </div>

        </div>
      </GlowCard>
    );
  }

  return (
    <GlowCard 
      className="asset-card fade-up-item is-visible hover-translate"
      customSize={true}
      glowColor={isPremium ? 'blue' : 'green'}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {/* Card Image Wrapper */}
      <div className="asset-card-image-box">
        <img 
          src={asset.images[0]} 
          alt={asset.title} 
          className="asset-card-img" 
          loading="lazy"
          style={{ cursor: 'pointer' }}
          onClick={() => onSelect(asset)}
        />
        
        {/* Bookmark/Favorite Overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(asset);
          }}
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: isFavorited ? 'var(--accent-color)' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'var(--transition-smooth)',
            backdropFilter: 'blur(4px)'
          }}
          title={isFavorited ? "Remover dos salvos" : "Salvar recurso"}
        >
          <Bookmark size={14} fill={isFavorited ? "currentColor" : "none"} />
        </button>

        {/* Price/Premium Tag */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          padding: '4px 10px',
          borderRadius: '9999px',
          fontSize: '0.7rem',
          fontWeight: 700,
          backgroundColor: isPremium ? '#0026ff' : 'var(--accent-color)',
          color: isPremium ? '#ffffff' : '#000000',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
        }}>
          {isPremium ? `$ ${asset.price.toFixed(2).replace('.', ',')}` : 'LIVRE'}
        </div>
      </div>

      {/* Card Content Info */}
      <div className="asset-card-info" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{ textAlign: 'left' }}>
          <div className="flex-between" style={{ marginBottom: '8px' }}>
            <span className="badge-secondary">
              {asset.category}
            </span>
            <span 
              onClick={() => onSelectAuthor(asset.authorUsername)}
              style={{ fontSize: '0.75rem', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}
              className="hover-lift"
            >
              por {asset.author}
            </span>
          </div>
          <h3 
            className="asset-card-title" 
            style={{ cursor: 'pointer' }} 
            onClick={() => onSelect(asset)}
          >
            {asset.title}
          </h3>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
          {/* Meta Info */}
          <div className="asset-card-meta" style={{ marginBottom: '12px' }}>
            <span>{asset.views.toLocaleString()} visualizações</span>
            <span>{asset.downloads.toLocaleString()} downloads</span>
          </div>

          {/* Action Buttons */}
          <div className="asset-card-actions">
            <button 
              className="btn-dotted-link"
              style={{ flexGrow: 1, padding: '8px 12px', borderRadius: 'var(--border-radius-sm)', justifyContent: 'center' }}
              onClick={() => onSelect(asset)}
            >
              <Eye size={13} />
              <span>Detalhes</span>
            </button>

            {isPremium ? (
              <button 
                className="btn-primary-ali hover-lift"
                style={{ 
                  flexGrow: 1, 
                  padding: '8px 12px', 
                  borderRadius: 'var(--border-radius-sm)',
                  fontSize: '0.75rem',
                  backgroundColor: '#0026ff',
                  color: '#ffffff'
                }}
                onClick={() => onPurchase(asset)}
              >
                <ShoppingBag size={13} />
                <span>Compre o pacote</span>
              </button>
            ) : (
              <a 
                href={asset.downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent-ali hover-lift"
                style={{ 
                  flexGrow: 1, 
                  padding: '8px 12px', 
                  borderRadius: 'var(--border-radius-sm)',
                  fontSize: '0.75rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000000'
                }}
              >
                <Download size={13} />
                <span>Download</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </GlowCard>
  );
}
