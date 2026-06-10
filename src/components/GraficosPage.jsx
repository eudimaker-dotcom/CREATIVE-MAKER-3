import React, { useState, useEffect } from 'react';
import { Eye, Download, ShoppingBag, ChevronDown, Heart } from 'lucide-react';
import { assetsData } from '../mockData';
import { GlowCard } from './GlowCard';


export default function GraficosPage({ onOpenAuth, user, onSelectAsset, onPurchase, favoritesList, onToggleFavorite }) {
  const [selectedCategory, setSelectedCategory] = useState('Todos'); // Todos, Mockups, Flyers, Posters, Banners, Social Media, Logotipos, Cartões de Visita, Embalagens, Brochuras, Apresentações
  const [sortBy, setSortBy] = useState('Mais recentes'); // Mais recentes, Mais populares, Mais baixados, Gratuitos, Premium
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [dbAssets, setDbAssets] = useState(assetsData);

  // Listen to category filter parameters from the URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cat = urlParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
      setVisibleCount(8); // Reset page size
    }
  }, [window.location.search]);

  const categories = [
    'Todos', 'Mockups', 'Flyers', 'Social Media'
  ];

  const sortOptions = ['Mais recentes', 'Mais populares', 'Mais baixados', 'Gratuitos', 'Premium'];

  // Map filters
  const filterAssets = () => {
    return dbAssets.filter(item => {
      // Filter by category
      if (selectedCategory === 'Todos') return true;
      const c = selectedCategory.toLowerCase();
      
      if (c === 'mockups') return item.category?.toLowerCase() === 'mockups';
      if (c === 'flyers') return item.category?.toLowerCase() === 'flyers';
      if (c === 'social media') return item.category?.toLowerCase() === 'social media';
      
      // Match tags or name
      const matchesTag = item.tags?.some(t => t.toLowerCase() === c);
      const matchesTitle = item.title?.toLowerCase().includes(c);
      return matchesTag || matchesTitle;
    }).sort((a, b) => {
      // Sorting combining active filter
      if (sortBy === 'Mais populares') {
        return b.views - a.views;
      }
      if (sortBy === 'Mais baixados') {
        return b.downloads - a.downloads;
      }
      if (sortBy === 'Gratuitos') {
        // Free first
        return a.price - b.price;
      }
      if (sortBy === 'Premium') {
        // Paid first
        return b.price - a.price;
      }
      // Mais recentes (Default)
      return new Date(b.uploadedAt) - new Date(a.uploadedAt);
    });
  };

  const filteredAssets = filterAssets();
  const visibleAssets = filteredAssets.slice(0, visibleCount);
  const hasMore = filteredAssets.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  const isFavorited = (id) => favoritesList && favoritesList.includes(id);

  return (
    <div className="container-dalim" style={{ padding: '40px 24px 80px 24px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'left', marginBottom: '32px' }}>
        <h1 className="metallic-text" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>Gráficos</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Elementos visuais, maquetes realistas e assets gráficos selecionados para designers e estúdios criativos.
        </p>
      </div>

      {/* Filters & Sorting Controls */}
      <div style={{ marginBottom: '32px' }}>
        
        {/* Horizontal Category pills (Only one active at a time) */}
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
                onClick={() => {
                  setSelectedCategory(cat);
                  setVisibleCount(8); // Reset pagination
                }}
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

        {/* Lower Row: Sorting dropdown */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(28, 25, 23, 0.45)',
          backdropFilter: 'blur(12px)',
          borderRadius: '20px',
          padding: '12px 20px',
          border: '1px solid rgba(255,255,255,0.06)'
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Exibindo {filteredAssets.length} recursos gráficos
          </span>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              style={{
                backgroundColor: 'rgba(0,0,0,0.3)',
                color: '#fafaf9',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '9999px',
                padding: '8px 18px',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>Ordenar por: {sortBy}</span>
              <ChevronDown size={14} style={{ color: '#a8a29e', transform: showSortDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
            </button>

            {showSortDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                backgroundColor: '#0c0a09',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '4px',
                zIndex: 150,
                minWidth: '160px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
              }}>
                {sortOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSortBy(opt);
                      setShowSortDropdown(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      backgroundColor: 'transparent',
                      color: sortBy === opt ? '#adfa1d' : '#fafaf9',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Grid of Cards */}
      {filteredAssets.length === 0 ? (
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
            Tenta ajustar os filtros para encontrar elementos gráficos.
          </p>
          <button 
            onClick={() => setSelectedCategory('Todos')}
            className="btn-accent-ali hover-lift"
            style={{ padding: '10px 20px', borderRadius: 'var(--border-radius-md)' }}
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid-container" style={{ textAlign: 'left' }}>
          {visibleAssets.map((asset) => {
            const isPremium = asset.price > 0;
            const isFav = isFavorited(asset.id);
            return (
              <GlowCard 
                key={asset.id}
                className="asset-card hover-translate fade-up-item is-visible"
                customSize={true}
                glowColor={isPremium ? 'blue' : 'green'}
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                {/* Image */}
                <div className="asset-card-image-box">
                  <img 
                    src={asset.images[0]} 
                    alt={asset.title} 
                    className="asset-card-img"
                    onClick={() => onSelectAsset && onSelectAsset(asset)}
                    style={{ cursor: 'pointer' }}
                  />
                  
                  {/* Save/Favorite button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onToggleFavorite) onToggleFavorite(asset);
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
                      color: isFav ? '#ff3b30' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    <Heart size={14} fill={isFav ? "currentColor" : "none"} />
                  </button>

                  {/* FREE or PREMIUM label badge */}
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
                    {isPremium ? 'PREMIUM' : 'LIVRE'}
                  </div>
                </div>

                {/* Details */}
                <div className="asset-card-info" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div>
                    <div className="flex-between" style={{ marginBottom: '8px' }}>
                      <span className="badge-secondary">{asset.category}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>por {asset.author}</span>
                    </div>
                    <h3 
                      className="asset-card-title"
                      onClick={() => onSelectAsset && onSelectAsset(asset)}
                      style={{ cursor: 'pointer' }}
                    >
                      {asset.title}
                    </h3>
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                    <div className="asset-card-meta" style={{ marginBottom: '12px' }}>
                      <span>📥 {asset.downloads.toLocaleString()} downloads</span>
                      <span>👁 {asset.views.toLocaleString()} visualizações</span>
                    </div>

                    <div className="asset-card-actions">
                      <button 
                        onClick={() => onSelectAsset && onSelectAsset(asset)}
                        className="btn-dotted-link"
                        style={{ flexGrow: 1, padding: '8px 12px', borderRadius: 'var(--border-radius-sm)', justifyContent: 'center' }}
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
                          onClick={() => {
                            if (onPurchase) onPurchase(asset);
                          }}
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
          })}
        </div>
      )}

      {/* Infinite Scroll trigger */}
      {hasMore && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
          <button 
            onClick={handleLoadMore}
            className="btn-dotted-link hover-lift"
            style={{ padding: '12px 36px' }}
          >
            Carregar mais recursos
          </button>
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
