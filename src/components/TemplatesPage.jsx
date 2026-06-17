import React, { useState, useEffect } from 'react';
import { Eye, Download, ShoppingBag, Loader2, Bookmark } from 'lucide-react';
import { mockTemplates } from '../mockData';
import { GlowCard } from './GlowCard';

export default function TemplatesPage({ onOpenAuth, user, favoritesList, onToggleFavorite }) {
  const [selectedSoftware, setSelectedSoftware] = useState('PSD'); // PSD, Figma, Illustrator
  const [isLoading, setIsLoading] = useState(false);

  // Sync active software filter from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const soft = urlParams.get('software');
    if (soft) {
      setSelectedSoftware(soft);
    }
  }, [window.location.search]);

  const softwares = ['PSD', 'Figma', 'Illustrator'];

  const handleSoftwareChange = (soft) => {
    setIsLoading(true);
    setSelectedSoftware(soft);
    setTimeout(() => {
      setIsLoading(false);
    }, 450);
  };

  const clearFilters = () => {
    setSelectedSoftware('PSD');
  };

  // Filter templates
  const filteredTemplates = mockTemplates.filter(tpl => {
    return tpl.software === selectedSoftware;
  });

  return (
    <div className="container-dalim" style={{ padding: '40px 24px 80px 24px' }}>
      
      {/* Page Header */}
      <div style={{ textAlign: 'left', marginBottom: '32px' }}>
        <h1 className="metallic-text" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>Templates</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Recursos de alta qualidade prontos para editar no seu software favorito.
        </p>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: '32px' }}>
        
        {/* Primary Filter: Software Tabs */}
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
          scrollbarWidth: 'none'
        }} className="no-scrollbar">
          {softwares.map((soft) => {
            const isActive = selectedSoftware === soft;
            return (
              <button
                key={soft}
                onClick={() => handleSoftwareChange(soft)}
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
                {soft}
              </button>
            );
          })}
        </div>

      </div>

      {/* Grid of Cards */}
      {isLoading ? (
        <section style={{ paddingBottom: '80px' }}>
          <div className="grid-container">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-card skeleton-pulse">
                <div className="skeleton-image" />
                <div className="skeleton-content">
                  <div className="skeleton-line" style={{ width: '40%' }} />
                  <div className="skeleton-line" style={{ width: '90%', height: '18px' }} />
                  <div className="skeleton-line" style={{ width: '60%', marginTop: 'auto' }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : filteredTemplates.length === 0 ? (
        /* Empty State */
        <div style={{
          textAlign: 'center',
          padding: '80px 24px',
          backgroundColor: 'var(--card-bg)',
          borderRadius: 'var(--border-radius-lg)',
          border: '1px dotted var(--border-color-dotted)',
          maxWidth: '480px',
          margin: '40px auto 0 auto'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Nenhum resultado encontrado</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Tenta ajustar os filtros ou pesquisar por outro termo de software.
          </p>
          <button 
            onClick={clearFilters}
            className="btn-accent-ali hover-lift"
            style={{ padding: '10px 20px', borderRadius: 'var(--border-radius-md)' }}
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid-container" style={{ textAlign: 'left' }}>
          {filteredTemplates.map((tpl) => {
            const isPremium = tpl.price > 0;
            return (
              <GlowCard 
                key={tpl.id}
                className="asset-card hover-translate fade-up-item is-visible"
                customSize={true}
                glowColor={isPremium ? 'blue' : 'green'}
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                {/* Thumbnail */}
                <div className="asset-card-image-box" style={{ position: 'relative' }}>
                  <img 
                    src={tpl.image} 
                    alt={tpl.title} 
                    className="asset-card-img" 
                    loading="lazy"
                  />
                  {/* Bookmark/Favorite Overlay */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onToggleFavorite) onToggleFavorite(tpl);
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
                      color: favoritesList?.includes(tpl.id) ? 'var(--accent-color)' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'var(--transition-smooth)',
                      backdropFilter: 'blur(4px)',
                      zIndex: 10
                    }}
                    title={favoritesList?.includes(tpl.id) ? "Remover dos salvos" : "Salvar recurso"}
                  >
                    <Bookmark size={14} fill={favoritesList?.includes(tpl.id) ? "currentColor" : "none"} />
                  </button>
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
                    {isPremium ? `$ ${tpl.price.toFixed(2).replace('.', ',')}` : 'LIVRE'}
                  </div>
                </div>

                {/* Info */}
                <div className="asset-card-info" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div>
                    <div className="flex-between" style={{ marginBottom: '8px' }}>
                      <span className="badge-secondary">{tpl.software}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tpl.category}</span>
                    </div>
                    <h3 className="asset-card-title">{tpl.title}</h3>
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                    <div className="asset-card-meta" style={{ marginBottom: '12px' }}>
                      <span>📥 {tpl.downloads.toLocaleString()} downloads</span>
                      <span>Suporte VIP</span>
                    </div>

                    <div className="asset-card-actions">
                      <button 
                        className="btn-dotted-link"
                        style={{ flexGrow: 1, padding: '8px 12px', borderRadius: 'var(--border-radius-sm)', justifyContent: 'center' }}
                      >
                        <Eye size={13} />
                        <span>Visualizar</span>
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
                          onClick={() => {
                            if (onOpenAuth) onOpenAuth();
                          }}
                        >
                          <ShoppingBag size={13} />
                          <span>Compre o pacote</span>
                        </button>
                      ) : (
                        <button 
                          className="btn-accent-ali hover-lift"
                          style={{ 
                            flexGrow: 1, 
                            padding: '8px 12px', 
                            borderRadius: 'var(--border-radius-sm)',
                            fontSize: '0.75rem',
                            color: '#000000'
                          }}
                        >
                          <Download size={13} />
                          <span>Download</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </GlowCard>
            );
          })}
        </div>
      )}

      <style>{`
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
