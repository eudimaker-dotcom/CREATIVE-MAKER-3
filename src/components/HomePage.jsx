import React, { useState } from 'react';
import { Download, Heart, ArrowRight } from 'lucide-react';
import AssetCard from './AssetCard';
import { mockFonts } from '../mockData';

export default function HomePage({ 
  dbAssets, 
  onSelectAsset, 
  onPurchase, 
  favoritesList, 
  onToggleFavorite, 
  user,
  navigate 
}) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyCode = (fontName, id) => {
    navigator.clipboard.writeText(`font-family: "${fontName}", sans-serif;`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isFavorited = (id) => favoritesList && favoritesList.includes(id);

  // Filter Graphics (Mockups, UI/UX, Posters, Social Media, etc., that are not classified as Templates)
  const recentGraphics = dbAssets
    .filter(item => {
      const cat = item.category?.toLowerCase() || '';
      const isTemplate = cat === 'templates' || item.tags?.some(t => t.toLowerCase() === 'template' || t.toLowerCase() === 'pack');
      return !isTemplate && cat !== 'fontes';
    })
    .slice(0, 4);

  // Filter Templates (Templates, Branding or tags with psd/figma/canva)
  const recentTemplates = dbAssets
    .filter(item => {
      const cat = item.category?.toLowerCase() || '';
      const isTemplate = cat === 'templates' || cat === 'branding' || item.tags?.some(t => t.toLowerCase() === 'template' || t.toLowerCase() === 'figma' || t.toLowerCase() === 'psd');
      return isTemplate;
    })
    .slice(0, 4);

  // Get first 3 Fonts
  const recentFonts = mockFonts.slice(0, 3);

  return (
    <div className="container-dalim" style={{ padding: '0 24px 80px 24px' }}>
      
      {/* 1. SECTION: Gráficos Recentes */}
      <div style={{ marginBottom: '60px' }}>
        <div className="flex-between" style={{ marginBottom: '24px', alignItems: 'flex-end' }}>
          <div style={{ textAlign: 'left' }}>
            <span className="badge-secondary" style={{ color: 'var(--accent-color)', borderColor: 'var(--accent-color)', marginBottom: '8px' }}>
              Novidades
            </span>
            <h2 className="metallic-text" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              Gráficos Recentes
            </h2>
          </div>
          <button 
            onClick={() => navigate('/graficos')}
            className="btn-dotted-link hover-translate"
            style={{ padding: '8px 16px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <span>Ver Todos</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid-container" style={{ textAlign: 'left' }}>
          {recentGraphics.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onSelect={onSelectAsset}
              onPurchase={onPurchase}
              user={user}
              onToggleFavorite={onToggleFavorite}
              isFavorited={isFavorited(asset.id)}
            />
          ))}
        </div>
      </div>

      {/* 2. SECTION: Modelos Recentes */}
      <div style={{ marginBottom: '60px' }}>
        <div className="flex-between" style={{ marginBottom: '24px', alignItems: 'flex-end' }}>
          <div style={{ textAlign: 'left' }}>
            <span className="badge-secondary" style={{ color: '#0026ff', borderColor: '#0026ff', marginBottom: '8px' }}>
              Layouts
            </span>
            <h2 className="metallic-text" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              Modelos Recentes
            </h2>
          </div>
          <button 
            onClick={() => navigate('/templates')}
            className="btn-dotted-link hover-translate"
            style={{ padding: '8px 16px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <span>Ver Todos</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid-container" style={{ textAlign: 'left' }}>
          {recentTemplates.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onSelect={onSelectAsset}
              onPurchase={onPurchase}
              user={user}
              onToggleFavorite={onToggleFavorite}
              isFavorited={isFavorited(asset.id)}
            />
          ))}
        </div>
      </div>

      {/* 3. SECTION: Fontes Recentes */}
      <div style={{ marginBottom: '40px' }}>
        <div className="flex-between" style={{ marginBottom: '24px', alignItems: 'flex-end' }}>
          <div style={{ textAlign: 'left' }}>
            <span className="badge-secondary" style={{ color: '#ff003c', borderColor: '#ff003c', marginBottom: '8px' }}>
              Tipografia
            </span>
            <h2 className="metallic-text" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              Fontes Recentes
            </h2>
          </div>
          <button 
            onClick={() => navigate('/fontes')}
            className="btn-dotted-link hover-translate"
            style={{ padding: '8px 16px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <span>Ver Todas</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
          {recentFonts.map((font) => {
            const isCopied = copiedId === font.id;
            return (
              <div 
                key={font.id}
                className="glass-panel"
                style={{
                  padding: '16px',
                  borderRadius: 'var(--border-radius-lg)',
                  border: '1px dotted var(--border-color-dotted)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {/* Specimen Preview */}
                <div 
                  onClick={() => handleCopyCode(font.name, font.id)}
                  title="Clique para copiar a classe CSS"
                  style={{ 
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    border: isCopied ? '1px solid var(--accent-color)' : '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '16px',
                    padding: '20px 20px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)',
                    ...font.style, 
                    fontSize: '28px', 
                    lineHeight: 1.15,
                    wordBreak: 'break-word',
                    color: '#ffffff',
                    minHeight: '60px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  Aa Bb Cc — {font.name} Font Specimen
                  
                  {isCopied && (
                    <span style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: 'var(--accent-color)',
                      color: '#000000',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-body)',
                      textTransform: 'none',
                      letterSpacing: 'normal'
                    }}>
                      CSS Copiado!
                    </span>
                  )}
                </div>

                {/* Font Info & Downloads */}
                <div className="flex-between" style={{ flexWrap: 'wrap', gap: '12px', padding: '2px 4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                    <strong style={{ color: 'var(--text-color)', fontWeight: 700 }}>{font.name}</strong>
                    <span className="badge-secondary" style={{ textTransform: 'capitalize' }}>
                      {font.classification}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>by {font.designer}</span>
                    
                    <span style={{ color: 'var(--border-color-glass)', fontSize: '0.75rem' }}>•</span>
                    
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Download size={12} />
                      {font.downloads || 0}
                    </span>
                    
                    <span style={{ color: 'var(--border-color-glass)', fontSize: '0.75rem' }}>•</span>
                    
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Heart size={12} style={{ color: '#ff3b30' }} fill="#ff3b30" />
                      {Math.floor((font.views || 0) * 0.4) + 12}
                    </span>
                  </div>
                  
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {font.license}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
