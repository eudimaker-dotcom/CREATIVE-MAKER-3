import React, { useState, useEffect } from 'react';
import { Eye, Download, Info, Sun, Moon } from 'lucide-react';
import { mockAssets } from '../mockData';
import { GlowCard } from './GlowCard';

export default function AssetsPage({ onOpenAuth, user }) {
  const [activeCategory, setActiveCategory] = useState('SVG'); // SVG, Ícones, Vetores, Texturas, Padrões, Ilustrações, Backgrounds, Elementos 3D
  const [svgTheme, setSvgTheme] = useState('dark'); // 'dark' or 'light' for SVG & Ícones

  // Sync category selection from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const typeParam = urlParams.get('type');
    if (typeParam) {
      if (typeParam === 'Icons') {
        setActiveCategory('Ícones');
      } else if (typeParam === '3D') {
        setActiveCategory('Elementos 3D');
      } else {
        setActiveCategory(typeParam);
      }
    }
  }, [window.location.search]);

  const categories = ['SVG', 'Ícones', 'Vetores', 'Texturas', 'Padrões', 'Ilustrações', 'Backgrounds', 'Elementos 3D'];

  const filteredAssets = mockAssets.filter(item => item.category === activeCategory);

  return (
    <div className="container-dalim" style={{ padding: '40px 24px 80px 24px' }}>
      
      {/* Page Header */}
      <div style={{ textAlign: 'left', marginBottom: '32px' }}>
        <h1 className="metallic-text" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>Assets</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Elementos gráficos fundamentais e texturas prontas para impulsionar seus layouts.
        </p>
      </div>

      {/* Tabs horizontais */}
      <div style={{
        backgroundColor: 'rgba(28, 25, 23, 0.65)',
        backdropFilter: 'blur(12px)',
        borderRadius: '9999px',
        padding: '6px 12px',
        border: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        marginBottom: '32px',
        scrollbarWidth: 'none'
      }} className="no-scrollbar">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                backgroundColor: isActive ? '#000000' : 'transparent',
                color: isActive ? '#ffffff' : '#a8a29e',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid de Cards com Previews Customizados */}
      <div className="grid-container" style={{ textAlign: 'left' }}>
        {filteredAssets.map((asset) => {
          
          // Rendering per category
          if (activeCategory === 'SVG' || activeCategory === 'Ícones') {
            return (
              <GlowCard 
                key={asset.id}
                className="asset-card hover-translate fade-up-item is-visible"
                customSize={true}
                glowColor="purple"
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                {/* SVG/Icon View Box with Theme Toggle */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4/3',
                  backgroundColor: svgTheme === 'dark' ? '#0c0a09' : '#ffffff',
                  color: svgTheme === 'dark' ? '#ffffff' : '#0c0a09',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '32px',
                  transition: 'background-color 0.3s ease, color 0.3s ease',
                  borderBottom: '1px dotted var(--border-color-dotted)'
                }}>
                  {/* Render simulated raw SVG string */}
                  <div 
                    style={{ width: '60px', height: '60px' }}
                    dangerouslySetInnerHTML={{ __html: asset.svgContent }}
                  />

                  {/* Inside card SVG theme toggler */}
                  <button
                    onClick={() => setSvgTheme(prev => prev === 'dark' ? 'light' : 'dark')}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      padding: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Mudar contraste de fundo"
                  >
                    {svgTheme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
                  </button>

                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    fontSize: '0.65rem',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: '#ffffff',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    SVG
                  </div>
                </div>

                <div className="asset-card-info" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div>
                    <h3 className="asset-card-title">{asset.title}</h3>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                      <span className="badge-secondary">{asset.dimensions}</span>
                      <span className="badge-secondary">{asset.fileSize}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                    <button 
                      className="btn-accent-ali hover-lift"
                      style={{ width: '100%', padding: '8px', fontSize: '0.75rem', gap: '4px', color: '#000000' }}
                    >
                      <Download size={13} />
                      <span>Baixar SVG</span>
                    </button>
                  </div>
                </div>
              </GlowCard>
            );
          }

          if (activeCategory === 'Gradientes') {
            return (
              <GlowCard 
                key={asset.id}
                className="asset-card hover-translate fade-up-item is-visible"
                customSize={true}
                glowColor="blue"
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                {/* Gradient Swatch Viewport */}
                <div 
                  className="group"
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '4/3',
                    background: asset.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    borderBottom: '1px dotted var(--border-color-dotted)'
                  }}
                >
                  {/* Hex codes appearing on hover */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    opacity: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'opacity 0.25s ease',
                  }} className="hex-codes-overlay">
                    {asset.hexCodes.map(code => (
                      <span 
                        key={code} 
                        style={{ 
                          fontFamily: 'monospace', 
                          color: '#ffffff', 
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          backgroundColor: '#000000',
                          padding: '3px 8px',
                          borderRadius: '4px'
                        }}
                      >
                        {code}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="asset-card-info" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div>
                    <h3 className="asset-card-title">{asset.title}</h3>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Passe o mouse para ver os códigos HEX.
                    </p>
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                    <button 
                      className="btn-primary-ali hover-lift"
                      style={{ width: '100%', padding: '8px', fontSize: '0.75rem', gap: '4px' }}
                      onClick={() => navigator.clipboard.writeText(asset.hexCodes.join(', '))}
                    >
                      <span>Copiar HEX CSS</span>
                    </button>
                  </div>
                </div>
              </GlowCard>
            );
          }

          if (activeCategory === 'Texturas' || activeCategory === 'Padrões') {
            return (
              <GlowCard 
                key={asset.id}
                className="asset-card hover-translate fade-up-item is-visible"
                customSize={true}
                glowColor="green"
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                {/* Textures and Patterns repeatable background tile view */}
                <div style={{
                  width: '100%',
                  aspectRatio: '4/3',
                  backgroundImage: `url(${asset.image})`,
                  backgroundRepeat: 'repeat',
                  backgroundSize: activeCategory === 'Padrões' ? '32px' : 'auto',
                  borderBottom: '1px dotted var(--border-color-dotted)'
                }} />

                <div className="asset-card-info" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div>
                    <h3 className="asset-card-title">{asset.title}</h3>
                    <span className="badge-secondary" style={{ marginTop: '6px', display: 'inline-block' }}>
                      {activeCategory === 'Padrões' ? 'Repeat Seamless Grid' : 'Textura Tiled'}
                    </span>
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                    <button 
                      className="btn-accent-ali hover-lift"
                      style={{ width: '100%', padding: '8px', fontSize: '0.75rem', gap: '4px', color: '#000000' }}
                    >
                      <Download size={13} />
                      <span>Baixar Textura</span>
                    </button>
                  </div>
                </div>
              </GlowCard>
            );
          }

          // Default styling (Vectors, Illustrations, 3D, Backgrounds)
          return (
            <GlowCard 
                key={asset.id}
                className="asset-card hover-translate fade-up-item is-visible"
                customSize={true}
                glowColor="orange"
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                {/* Image box with transparent / dark backing for 3D elements */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4/3',
                  backgroundColor: activeCategory === 'Elementos 3D' ? 'rgba(12, 10, 9, 0.95)' : 'var(--card-bg-hover)',
                  overflow: 'hidden',
                  borderBottom: '1px dotted var(--border-color-dotted)'
                }}>
                  <img 
                    src={asset.image} 
                    alt={asset.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div className="asset-card-info" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div>
                    <h3 className="asset-card-title">{asset.title}</h3>
                    <span className="badge-secondary" style={{ marginTop: '6px', display: 'inline-block' }}>
                      {asset.category}
                    </span>
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                    <button 
                      className="btn-accent-ali hover-lift"
                      style={{ width: '100%', padding: '8px', fontSize: '0.75rem', gap: '4px', color: '#000000' }}
                    >
                      <Download size={13} />
                      <span>Baixar Recurso</span>
                    </button>
                  </div>
                </div>
              </GlowCard>
            );
        })}
      </div>

      <style>{`
        /* CSS hack to make gradient HEX codes show up on card hover */
        .asset-card:hover .hex-codes-overlay {
          opacity: 1 !important;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

    </div>
  );
}
