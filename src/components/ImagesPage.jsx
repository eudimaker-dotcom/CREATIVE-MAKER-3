import React, { useState } from 'react';
import { Eye, Download, ShoppingBag, Grid, Bookmark } from 'lucide-react';
import { mockImages } from '../mockData';
import { GlowCard } from './GlowCard';

export default function ImagesPage({ onOpenAuth, user, favoritesList, onToggleFavorite }) {
  const [selectedCategory, setSelectedCategory] = useState('Negócios'); // Negócios, Tecnologia, Natureza, Saúde, Educação, Moda, Arquitectura, Comida, Viagens
  const [selectedFormat, setSelectedFormat] = useState('Todos'); // Todos, Horizontal, Vertical, Quadrado
  const [selectedAccess, setSelectedAccess] = useState('Todos'); // Todos, Gratuito, Premium

  const categories = ['Negócios', 'Tecnologia', 'Natureza', 'Saúde', 'Educação', 'Moda', 'Arquitectura', 'Comida', 'Viagens'];
  const formats = ['Horizontal', 'Vertical', 'Quadrado'];
  const accesses = ['Gratuito', 'Premium'];

  // Filter images
  const filteredImages = mockImages.filter(img => {
    const matchesCategory = img.category === selectedCategory;
    const matchesFormat = selectedFormat === 'Todos' || img.format === selectedFormat;
    const matchesAccess = selectedAccess === 'Todos' || img.access === selectedAccess;
    return matchesCategory && matchesFormat && matchesAccess;
  });

  return (
    <div className="container-dalim" style={{ padding: '40px 24px 80px 24px' }}>
      
      {/* Page Header */}
      <div style={{ textAlign: 'left', marginBottom: '32px' }}>
        <h1 className="metallic-text" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>Imagens</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Banco de imagens premium para composições e portfólios realistas.
        </p>
      </div>

      {/* Primary Row: Category pills */}
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
        marginBottom: '16px',
        scrollbarWidth: 'none'
      }} className="no-scrollbar">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
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

      {/* Secondary Row: Format & Access Filters */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        width: '100%',
        backgroundColor: 'rgba(28, 25, 23, 0.45)',
        backdropFilter: 'blur(12px)',
        borderRadius: '20px',
        padding: '12px 20px',
        border: '1px solid rgba(255,255,255,0.06)',
        marginBottom: '32px'
      }}>
        
        {/* Format Selectors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }} className="no-scrollbar">
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '4px' }}>Formato:</span>
          <button
            onClick={() => setSelectedFormat('Todos')}
            style={{
              backgroundColor: selectedFormat === 'Todos' ? '#ffffff' : 'rgba(0,0,0,0.3)',
              color: selectedFormat === 'Todos' ? '#000000' : '#fafaf9',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '9999px',
              padding: '6px 14px',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            Todos
          </button>
          {formats.map((fmt) => {
            const isActive = selectedFormat === fmt;
            return (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                style={{
                  backgroundColor: isActive ? '#ffffff' : 'rgba(0,0,0,0.3)',
                  color: isActive ? '#000000' : '#fafaf9',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '9999px',
                  padding: '6px 14px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
              >
                {fmt}
              </button>
            );
          })}
        </div>

        {/* Separador Visual / Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)', opacity: 0.5 }} />

          {/* Access selectors */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '4px' }}>Licença:</span>
            <button
              onClick={() => setSelectedAccess('Todos')}
              style={{
                backgroundColor: selectedAccess === 'Todos' ? 'var(--accent-color)' : 'rgba(0,0,0,0.3)',
                color: selectedAccess === 'Todos' ? '#000000' : '#fafaf9',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '9999px',
                padding: '6px 14px',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              Todos
            </button>
            {accesses.map((acc) => {
              const isActive = selectedAccess === acc;
              return (
                <button
                  key={acc}
                  onClick={() => setSelectedAccess(acc)}
                  style={{
                    backgroundColor: isActive ? 'var(--accent-color)' : 'rgba(0,0,0,0.3)',
                    color: isActive ? '#000000' : '#fafaf9',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '9999px',
                    padding: '6px 14px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  {acc}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Grid of images */}
      {filteredImages.length === 0 ? (
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
            Tenta ajustar os filtros para encontrar as fotos adequadas.
          </p>
          <button 
            onClick={() => {
              setSelectedFormat('Todos');
              setSelectedAccess('Todos');
            }}
            className="btn-accent-ali hover-lift"
            style={{ padding: '10px 20px', borderRadius: 'var(--border-radius-md)' }}
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid-container" style={{ textAlign: 'left' }}>
          {filteredImages.map((img) => {
            const isPremium = img.access === 'Premium';
            return (
              <GlowCard 
                key={img.id}
                className="asset-card hover-translate fade-up-item is-visible"
                customSize={true}
                glowColor={isPremium ? 'blue' : 'green'}
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                {/* Image Container with Format Specimen Aspect ratio */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: img.format === 'Vertical' ? '3/4' : img.format === 'Quadrado' ? '1/1' : '4/3',
                  overflow: 'hidden',
                  backgroundColor: 'var(--card-bg-hover)',
                  borderBottom: '1px dotted var(--border-color-dotted)'
                }}>
                  <img 
                    src={img.url} 
                    alt={img.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Bookmark/Favorite Overlay */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onToggleFavorite) onToggleFavorite(img);
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
                      color: favoritesList?.includes(img.id) ? 'var(--accent-color)' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'var(--transition-smooth)',
                      backdropFilter: 'blur(4px)',
                      zIndex: 10
                    }}
                    title={favoritesList?.includes(img.id) ? "Remover dos salvos" : "Salvar recurso"}
                  >
                    <Bookmark size={14} fill={favoritesList?.includes(img.id) ? "currentColor" : "none"} />
                  </button>

                  {/* Licensing label overlay */}
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
                    {isPremium ? `$ ${img.price.toFixed(2).replace('.', ',')}` : 'LIVRE'}
                  </div>
                </div>

                {/* Footer Info */}
                <div className="asset-card-info" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div>
                    <h3 className="asset-card-title">{img.title}</h3>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                      <span className="badge-secondary">{img.format}</span>
                      <span className="badge-secondary">{img.category}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                    <div className="asset-card-meta" style={{ marginBottom: '12px' }}>
                      <span>📥 {img.downloads.toLocaleString()} downloads</span>
                      <span>JPG Alta Res</span>
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
