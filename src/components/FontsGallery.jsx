import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Sparkles, Download, Copy, Check, Type, Sliders, ChevronDown, Heart, Search, Grid, List, RefreshCw, AlertCircle } from 'lucide-react';
import { mockFonts } from '../mockData';

// Cache for loaded Google Font families to avoid duplicate requests
const loadedFontsCache = new Set();

// Dynamic loader for Google Fonts using correct font weight parameters
const loadGoogleFont = (query) => {
  if (!query || loadedFontsCache.has(query)) return;
  const linkId = `gfont-${query.replace(/[^a-zA-Z0-9]/g, '-')}`;
  if (document.getElementById(linkId)) return;
  
  const link = document.createElement('link');
  link.id = linkId;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${query}&display=swap`;
  document.head.appendChild(link);
  loadedFontsCache.add(query);
};

// Helper to escape RegExp special characters to prevent search bar crashes
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Shimmer Skeleton Loader Card Component
const SkeletonCard = ({ viewMode }) => (
  <div 
    className="glass-panel pulse-skeleton" 
    style={{ 
      padding: '24px', 
      borderRadius: 'var(--border-radius-lg)', 
      border: '1px dotted var(--border-color-dotted)', 
      minHeight: viewMode === 'list' ? 'auto' : '230px', 
      display: 'flex', 
      flexDirection: viewMode === 'list' ? 'row' : 'column', 
      gap: '20px',
      alignItems: viewMode === 'list' ? 'center' : 'stretch',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(28, 25, 23, 0.45)'
    }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: viewMode === 'list' ? '200px' : 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ height: '20px', width: '120px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}></div>
        <div style={{ height: '16px', width: '50px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '9999px' }}></div>
      </div>
      <div style={{ height: '12px', width: '80px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '4px' }}></div>
    </div>
    <div style={{ height: '70px', flexGrow: 1, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', width: '100%' }}></div>
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', minWidth: viewMode === 'list' ? '140px' : 'auto', marginTop: viewMode === 'list' ? '0' : '8px' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ height: '32px', width: '32px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}></div>
        <div style={{ height: '32px', width: '32px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}></div>
      </div>
      <div style={{ height: '32px', width: '100px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}></div>
    </div>
  </div>
);

// Individual Font Specimen Card Component
const FontCard = React.memo(({ 
  font, 
  previewText, 
  fontSize, 
  fontWeight, 
  isItalic, 
  textTransform, 
  textAlign, 
  letterSpacing, 
  viewMode, 
  isFavorite, 
  onToggleFavorite, 
  onCopyName, 
  onCopyCSS, 
  onDownload, 
  downloadingId, 
  user,
  highlightText,
  searchQuery
}) => {
  
  // Lazy-load Google Fonts stylesheet on demand when the card is rendered
  useEffect(() => {
    if (font.googleFontQuery) {
      loadGoogleFont(font.googleFontQuery);
    }
  }, [font.googleFontQuery]);

  const isDownloading = downloadingId === font.id;
  const isPremium = font.price > 0;
  const isPurchased = user && user.downloads && user.downloads.includes(font.id);

  // Combine custom typography overrides with fallback default styles of the font
  const previewStyle = {
    fontFamily: font.style?.fontFamily || 'sans-serif',
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight !== 600 ? fontWeight : (font.style?.fontWeight || fontWeight),
    fontStyle: isItalic ? 'italic' : (font.style?.fontStyle || 'normal'),
    textTransform: textTransform !== 'none' ? textTransform : (font.style?.textTransform || 'none'),
    textAlign: textAlign,
    letterSpacing: letterSpacing !== 0 ? `${letterSpacing}px` : (font.style?.letterSpacing || 'normal'),
    lineHeight: 1.25,
    wordBreak: 'break-word',
    transition: 'font-size 0.15s ease, letter-spacing 0.15s ease, font-weight 0.15s ease',
    width: '100%',
    color: '#ffffff',
  };

  return (
    <div 
      className="glass-panel font-card-hover"
      style={{
        padding: '20px',
        borderRadius: 'var(--border-radius-lg)',
        border: '1px dotted var(--border-color-dotted)',
        display: 'flex',
        flexDirection: viewMode === 'list' ? 'row' : 'column',
        gap: '20px',
        alignItems: viewMode === 'list' ? 'center' : 'stretch',
        justifyContent: 'space-between',
        textAlign: 'left',
        minHeight: viewMode === 'list' ? 'auto' : '230px',
        backgroundColor: 'rgba(28, 25, 23, 0.45)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
      }}
    >
      {/* Upper/Left Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: viewMode === 'list' ? '200px' : 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <h3 
            style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-color)', cursor: 'pointer', outline: 'none' }}
            tabIndex={0}
            onClick={() => onCopyName(font.name)}
            onKeyDown={(e) => e.key === 'Enter' && onCopyName(font.name)}
            title="Clique para copiar o nome da fonte"
            aria-label={`Nome da fonte: ${font.name}. Pressione Enter para copiar.`}
          >
            {highlightText(font.name, searchQuery)}
          </h3>
          <span className="badge-secondary" style={{ fontSize: '0.65rem', textTransform: 'capitalize' }}>
            {font.classification}
          </span>
          {isPremium && (
            <span className="badge-secondary" style={{ fontSize: '0.65rem', borderColor: 'var(--accent-color)', color: 'var(--accent-color)', fontWeight: 700 }}>
              Premium
            </span>
          )}
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Por {font.designer}</p>
      </div>

      {/* Main Specimen Preview */}
      <div 
        style={{ 
          backgroundColor: '#0c0a09',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '20px',
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          minHeight: '90px',
          overflow: 'hidden',
          width: '100%'
        }}
      >
        <div style={previewStyle}>
          {previewText || font.name}
        </div>
      </div>

      {/* Actions and Controls */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: '12px',
          flexDirection: viewMode === 'list' ? 'column' : 'row',
          minWidth: viewMode === 'list' ? '140px' : 'auto',
          marginTop: viewMode === 'list' ? '0' : '8px'
        }}
      >
        {/* Favorite heart & Copy CSS Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Favorite */}
          <button
            onClick={onToggleFavorite}
            className="btn-dotted-link"
            style={{ 
              padding: '8px', 
              borderRadius: '8px', 
              color: isFavorite ? '#ff3b30' : 'var(--text-color)', 
              borderColor: isFavorite ? '#ff3b30' : 'var(--border-color-dotted)',
              cursor: 'pointer',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent'
            }}
            tabIndex={0}
            title={isFavorite ? "Remover dos favoritos" : "Salvar nas favoritas"}
            aria-label={isFavorite ? "Remover dos favoritos" : "Salvar nas favoritas"}
          >
            <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
          </button>

          {/* Copy CSS code */}
          <button
            onClick={() => onCopyCSS(font.name)}
            className="btn-dotted-link"
            style={{ 
              padding: '8px', 
              borderRadius: '8px', 
              cursor: 'pointer',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent'
            }}
            tabIndex={0}
            title="Copiar código CSS font-family"
            aria-label="Copiar CSS font-family"
          >
            <Copy size={14} />
          </button>
        </div>

        {/* Download State Button */}
        <div>
          {isPremium ? (
            isPurchased ? (
              <button 
                onClick={() => onDownload(font)}
                disabled={isDownloading}
                className="hover-translate"
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  color: '#000000',
                  backgroundColor: 'var(--accent-color)',
                  border: 'none',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '8px 14px',
                  fontWeight: 600,
                  cursor: isDownloading ? 'default' : 'pointer',
                  opacity: isDownloading ? 0.7 : 1,
                  outline: 'none'
                }}
                tabIndex={0}
                aria-label={`Baixar fonte premium adquirida: ${font.name}`}
              >
                {isDownloading ? (
                  <span className="spinner-loader" />
                ) : (
                  <Download size={13} style={{ color: '#000000' }} />
                )}
                <span>{isDownloading ? 'Baixando...' : 'Download'}</span>
              </button>
            ) : (
              <button 
                onClick={() => onDownload(font)}
                className="hover-translate"
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  color: '#ffffff',
                  backgroundColor: '#0026ff',
                  border: 'none',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '8px 14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  outline: 'none'
                }}
                tabIndex={0}
                aria-label={`Comprar licença da fonte premium: ${font.name}`}
              >
                <span>Comprar (${font.price || '2.99'})</span>
              </button>
            )
          ) : (
            <button 
              onClick={() => onDownload(font)}
              disabled={isDownloading}
              className="hover-translate"
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                color: '#000000',
                backgroundColor: 'var(--accent-color)',
                border: 'none',
                borderRadius: 'var(--border-radius-sm)',
                padding: '8px 14px',
                fontWeight: 600,
                cursor: isDownloading ? 'default' : 'pointer',
                opacity: isDownloading ? 0.7 : 1,
                outline: 'none'
              }}
              tabIndex={0}
              aria-label={`Baixar fonte gratuita: ${font.name}`}
            >
              {isDownloading ? (
                <span className="spinner-loader" />
              ) : (
                <Download size={13} style={{ color: '#000000' }} />
              )}
              <span>{isDownloading ? 'Baixando...' : 'Download (Grátis)'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default function FontsGallery({ onOpenAuth, user, onPurchase }) {
  const [fontsList, setFontsList] = useState(mockFonts);
  
  // Custom Typography & Preview States
  const [typedText, setTypedText] = useState('Aa Bb Cc — O design fala');
  const [previewText, setPreviewText] = useState('Aa Bb Cc — O design fala');
  const [fontSize, setFontSize] = useState(36);
  const [fontWeight, setFontWeight] = useState(600);
  const [isItalic, setIsItalic] = useState(false);
  const [textTransform, setTextTransform] = useState('none'); // 'none', 'uppercase', 'lowercase'
  const [textAlign, setTextAlign] = useState('left'); // 'left', 'center', 'right'
  const [letterSpacing, setLetterSpacing] = useState(0); // -3px to 15px
  
  // Layout and Search States
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStyles, setActiveStyles] = useState([]); // Multiple selected styles
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState('Título (A-Z)');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4); // Load more increments
  
  // Loading & Feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  // Favorites state backed by LocalStorage
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('cm3_favorite_fonts');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist favorites
  useEffect(() => {
    localStorage.setItem('cm3_favorite_fonts', JSON.stringify(favorites));
  }, [favorites]);

  // Debounce effect for custom preview text to ensure high performance
  useEffect(() => {
    const handler = setTimeout(() => {
      setPreviewText(typedText);
    }, 250);
    return () => clearTimeout(handler);
  }, [typedText]);

  // Shimmer loading trigger when filters or query changes to simulate API search
  useEffect(() => {
    setIsLoading(true);
    const handler = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery, activeStyles, showOnlyFavorites, sortBy]);

  // Reactively increment downloads for premium fonts when purchased successfully
  const prevDownloads = useRef(user?.downloads || []);
  useEffect(() => {
    const currentDownloads = user?.downloads || [];
    // Find newly added downloads in this session
    const newlyAdded = currentDownloads.filter(id => !prevDownloads.current.includes(id));
    if (newlyAdded.length > 0) {
      setFontsList(prev => prev.map(f => {
        if (newlyAdded.includes(f.id) && !f.incremented) {
          return { ...f, downloads: (f.downloads || 0) + 1, incremented: true };
        }
        return f;
      }));
    }
    prevDownloads.current = currentDownloads;
  }, [user?.downloads]);

  // Toggle favorite font ID
  const handleToggleFavorite = (fontId) => {
    setFavorites(prev => {
      const exists = prev.includes(fontId);
      if (exists) {
        triggerToast("Removida dos favoritos.");
        return prev.filter(id => id !== fontId);
      } else {
        triggerToast("Adicionada aos favoritos!");
        return [...prev, fontId];
      }
    });
  };

  // Toast feedback trigger
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Action callbacks
  const handleCopyName = (name) => {
    navigator.clipboard.writeText(name);
    triggerToast(`Nome "${name}" copiado!`);
  };

  const handleCopyCSS = (name) => {
    const cssCode = `font-family: "${name}", sans-serif;`;
    navigator.clipboard.writeText(cssCode);
    triggerToast("Código CSS font-family copiado!");
  };

  // Free/Premium Download trigger
  const handleDownload = (font) => {
    const isPremium = font.price > 0;
    const isPurchased = user && user.downloads && user.downloads.includes(font.id);

    if (isPremium && !isPurchased) {
      if (!user) {
        onOpenAuth();
      } else {
        onPurchase(font);
      }
      return;
    }

    // Free Font or Purchased Font: trigger simulated packaging loader
    setDownloadingId(font.id);
    setTimeout(() => {
      setDownloadingId(null);
      // Increment local download count state
      setFontsList(prev => prev.map(f => f.id === font.id ? { ...f, downloads: (f.downloads || 0) + 1 } : f));
      
      // Open official URL safely in new tab
      window.open(font.downloadUrl, '_blank', 'noopener,noreferrer');
      triggerToast(`Download de "${font.name}" iniciado!`);
    }, 1200);
  };

  // Text highlighting helper for search matching
  const highlightText = (text, search) => {
    if (!search.trim()) return <span>{text}</span>;
    try {
      const escapedSearch = escapeRegExp(search);
      const regex = new RegExp(`(${escapedSearch})`, 'gi');
      const parts = text.split(regex);
      return (
        <span>
          {parts.map((part, i) => 
            regex.test(part) 
              ? <mark key={i} style={{ backgroundColor: 'var(--accent-color)', color: '#000000', borderRadius: '3px', padding: '0 2px', fontWeight: 800 }}>{part}</mark>
              : part
          )}
        </span>
      );
    } catch (err) {
      return <span>{text}</span>;
    }
  };

  // Classifications filters static mapping
  const classifications = [
    { name: "Serif", label: "Serif", norm: "serifa" },
    { name: "Sans Serif", label: "Sans Serif", norm: "sem serifa" },
    { name: "Display", label: "Display", norm: "exibição" },
    { name: "Script", label: "Script", norm: "roteiro" },
    { name: "Monospace", label: "Monospace", norm: "monoespaçada" },
    { name: "Handwriting", label: "Handwriting", norm: "escrita" }
  ];

  // Combined filters logic
  const filteredFonts = useMemo(() => {
    return fontsList.filter(font => {
      // 1. Search filter (Name or designer)
      const matchesSearch = !searchQuery.trim() || 
        font.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        font.designer.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Multi-select Styles filter
      const matchesStyles = activeStyles.length === 0 || activeStyles.some(styleName => {
        const targetClass = classifications.find(c => c.name === styleName);
        if (!targetClass) return false;
        
        // Handle specific normalization matches
        if (targetClass.norm === 'exibição') {
          return font.classification === 'exibição' || font.classification === 'decorativa';
        }
        return font.classification === targetClass.norm;
      });

      // 3. Favorites toggle filter
      const matchesFavorites = !showOnlyFavorites || favorites.includes(font.id);

      return matchesSearch && matchesStyles && matchesFavorites;
    }).sort((a, b) => {
      if (sortBy === 'Título (Z-A)') {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === 'Popularidade') {
        return (b.downloads || 0) - (a.downloads || 0);
      }
      return a.name.localeCompare(b.name);
    });
  }, [fontsList, searchQuery, activeStyles, showOnlyFavorites, favorites, sortBy]);

  // Toggle filter style function
  const handleToggleStyleFilter = (name) => {
    setActiveStyles(prev => 
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  };

  // Get active count helper
  const getClassificationCount = (clsObj) => {
    return fontsList.filter(font => {
      if (clsObj.norm === 'exibição') {
        return font.classification === 'exibição' || font.classification === 'decorativa';
      }
      return font.classification === clsObj.norm;
    }).length;
  };

  const paginatedFonts = filteredFonts.slice(0, visibleCount);
  const hasMore = filteredFonts.length > paginatedFonts.length;

  return (
    <div className="container-dalim" style={{ padding: '40px 24px 80px 24px' }}>
      
      {/* 1. Header Hero */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        textAlign: 'center', 
        marginBottom: '40px', 
        position: 'relative', 
        width: '100%' 
      }}>
        <div className="radial-glow-layer" style={{ height: '180px' }}>
          <div className="radial-glow-green" />
        </div>

        <h1 className="metallic-text" style={{ 
          fontSize: 'clamp(3.5rem, 8vw, 6rem)', 
          fontWeight: 900, 
          margin: '20px 0', 
          lineHeight: 1.1,
          fontFamily: "'Space Grotesk', sans-serif",
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          textAlign: 'center'
        }}>
          FONTES
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '500px', marginTop: '-10px' }}>
          Explore, experimente e adquira tipografias premium e gratuitas com renderização avançada.
        </p>
      </div>

      {/* 2. Main Search & Filters Panel */}
      <div 
        className="glass-panel"
        style={{
          padding: '24px',
          borderRadius: 'var(--border-radius-lg)',
          border: '1px dotted var(--border-color-dotted)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          marginBottom: '32px',
          textAlign: 'left'
        }}
      >
        {/* Row 1: Search & Basic preview text */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
          gap: '20px'
        }} className="md:grid-cols-3">
          
          {/* Search bar input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Search size={12} />
              <span>Pesquisar Fontes</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-ali"
                placeholder="Busque por nome ou designer..."
                style={{ paddingRight: '30px', width: '100%' }}
                aria-label="Pesquisar fontes pelo nome ou designer"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}
                  aria-label="Limpar pesquisa"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Custom specimen text */}
          <div className="md:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Type size={12} />
              <span>Texto de Exemplo e Visualização</span>
            </label>
            <input
              type="text"
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              className="input-ali"
              placeholder="Digite o texto personalizado para visualizar as fontes..."
              aria-label="Digite texto personalizado para visualizar as fontes"
            />
          </div>
        </div>

        {/* Row 2: Advanced Typography Controls */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
          gap: '24px'
        }} className="md:grid-cols-4">
          
          {/* Font Size slider */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div className="flex-between" style={{ alignItems: 'center' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Sliders size={12} />
                <span>Tamanho: <strong style={{ color: '#ffffff' }}>{fontSize}px</strong></span>
              </label>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: '#ffffff',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 800
                  }}
                  aria-label="Diminuir tamanho da fonte"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize(prev => Math.min(120, prev + 2))}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: '#ffffff',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 800
                  }}
                  aria-label="Aumentar tamanho da fonte"
                >
                  A+
                </button>
              </div>
            </div>
            <input
              type="range"
              min="14"
              max="120"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              style={{
                width: '100%',
                height: '5px',
                borderRadius: '9999px',
                cursor: 'pointer',
                accentColor: 'var(--accent-color)',
                marginTop: '10px'
              }}
              aria-label="Ajustar tamanho da fonte"
            />
          </div>

          {/* Font Weight slider */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Peso (Weight): <strong style={{ color: '#ffffff' }}>{fontWeight}</strong>
            </label>
            <input
              type="range"
              min="100"
              max="900"
              step="100"
              value={fontWeight}
              onChange={(e) => setFontWeight(parseInt(e.target.value))}
              style={{
                width: '100%',
                height: '5px',
                borderRadius: '9999px',
                cursor: 'pointer',
                accentColor: 'var(--accent-color)',
                marginTop: '16px'
              }}
              aria-label="Ajustar peso da fonte"
            />
          </div>

          {/* Letter Spacing slider */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Espaçamento: <strong style={{ color: '#ffffff' }}>{letterSpacing}px</strong>
            </label>
            <input
              type="range"
              min="-3"
              max="15"
              step="1"
              value={letterSpacing}
              onChange={(e) => setLetterSpacing(parseInt(e.target.value))}
              style={{
                width: '100%',
                height: '5px',
                borderRadius: '9999px',
                cursor: 'pointer',
                accentColor: 'var(--accent-color)',
                marginTop: '16px'
              }}
              aria-label="Ajustar espaçamento de letras"
            />
          </div>

          {/* Text alignment & transform options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Alinhamento e Estilo</span>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Italic Toggle */}
              <button
                type="button"
                onClick={() => setIsItalic(!isItalic)}
                style={{
                  backgroundColor: isItalic ? 'var(--accent-color)' : 'rgba(255,255,255,0.04)',
                  color: isItalic ? '#000000' : '#ffffff',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  fontStyle: 'italic',
                  cursor: 'pointer'
                }}
                aria-label="Alternar itálico"
              >
                I
              </button>

              {/* Text Transform selector */}
              <div style={{ display: 'flex', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', overflow: 'hidden' }}>
                {['none', 'uppercase', 'lowercase'].map((mode) => {
                  const label = mode === 'none' ? 'Aa' : mode === 'uppercase' ? 'AA' : 'aa';
                  const isActive = textTransform === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setTextTransform(mode)}
                      style={{
                        backgroundColor: isActive ? '#ffffff' : 'rgba(0,0,0,0.2)',
                        color: isActive ? '#000000' : '#8c8a89',
                        border: 'none',
                        padding: '4px 8px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Text align selector */}
              <div style={{ display: 'flex', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', overflow: 'hidden' }}>
                {['left', 'center', 'right'].map((align) => {
                  const label = align === 'left' ? '⬅' : align === 'center' ? '⏺' : '➡';
                  const isActive = textAlign === align;
                  return (
                    <button
                      key={align}
                      type="button"
                      onClick={() => setTextAlign(align)}
                      style={{
                        backgroundColor: isActive ? '#ffffff' : 'rgba(0,0,0,0.2)',
                        color: isActive ? '#000000' : '#8c8a89',
                        border: 'none',
                        padding: '4px 8px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                      title={`Alinhar à ${align === 'left' ? 'esquerda' : align === 'center' ? 'centro' : 'direita'}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Combined Filter Bar & Layout selector */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        gap: '20px', 
        marginBottom: '24px', 
        flexWrap: 'wrap' 
      }}>
        
        {/* Style pills (Multi-select) */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', maxWidth: '100%' }} className="no-scrollbar">
          
          {/* "Todos" selector */}
          <button
            type="button"
            onClick={() => {
              setActiveStyles([]);
              setShowOnlyFavorites(false);
            }}
            style={{
              backgroundColor: (activeStyles.length === 0 && !showOnlyFavorites) ? 'var(--accent-color)' : 'rgba(255,255,255,0.03)',
              color: (activeStyles.length === 0 && !showOnlyFavorites) ? '#000000' : '#a8a29e',
              border: '1px solid rgba(255,255,255,0.06)',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Todos ({fontsList.length})
          </button>

          {/* Active category style pills */}
          {classifications.map((c) => {
            const isActive = activeStyles.includes(c.name);
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => handleToggleStyleFilter(c.name)}
                style={{
                  backgroundColor: isActive ? '#ffffff' : 'rgba(255,255,255,0.03)',
                  color: isActive ? '#000000' : '#a8a29e',
                  border: '1px solid rgba(255,255,255,0.06)',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{c.label}</span>
                <span style={{ fontSize: '0.65rem', opacity: isActive ? 0.8 : 0.5 }}>{getClassificationCount(c)}</span>
              </button>
            );
          })}

          {/* Favorites filter tab */}
          <button
            type="button"
            onClick={() => {
              setShowOnlyFavorites(!showOnlyFavorites);
              setActiveStyles([]); // reset classifications when viewing favorites to keep it clear
            }}
            style={{
              backgroundColor: showOnlyFavorites ? '#ff3b30' : 'rgba(255,255,255,0.03)',
              color: showOnlyFavorites ? '#ffffff' : '#a8a29e',
              border: '1px solid rgba(255,255,255,0.06)',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Heart size={10} fill={showOnlyFavorites ? "currentColor" : "none"} />
            <span>Favoritas ({favorites.length})</span>
          </button>
        </div>

        {/* View Mode Toggle and Sorting dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Sorting */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              style={{
                backgroundColor: 'rgba(0,0,0,0.3)',
                color: '#fafaf9',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{sortBy}</span>
              <ChevronDown size={12} style={{ transform: showSortDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {showSortDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '4px',
                backgroundColor: '#0c0a09',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '4px',
                zIndex: 150,
                minWidth: '140px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
              }}>
                {['Título (A-Z)', 'Título (Z-A)', 'Popularidade'].map((opt) => (
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
                      color: sortBy === opt ? 'var(--accent-color)' : '#fafaf9',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                    className="hover-bg-stone-900"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* List/Grid toggler buttons */}
          <div style={{ display: 'flex', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', overflow: 'hidden' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '6px 10px',
                backgroundColor: viewMode === 'grid' ? 'rgba(255,255,255,0.08)' : 'transparent',
                border: 'none',
                color: viewMode === 'grid' ? 'var(--accent-color)' : '#8c8a89',
                cursor: 'pointer'
              }}
              title="Visualização em Grade"
              aria-label="Grade"
            >
              <Grid size={14} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '6px 10px',
                backgroundColor: viewMode === 'list' ? 'rgba(255,255,255,0.08)' : 'transparent',
                border: 'none',
                color: viewMode === 'list' ? 'var(--accent-color)' : '#8c8a89',
                cursor: 'pointer'
              }}
              title="Visualização em Lista"
              aria-label="Lista"
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Font Grid / List Display */}
      {isLoading ? (
        // Loading Skeleton state
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: viewMode === 'grid' ? 'repeat(1, minmax(0, 1fr))' : '1fr', 
          gap: '24px' 
        }} className={viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : ''}>
          {[...Array(viewMode === 'grid' ? 6 : 4)].map((_, i) => (
            <SkeletonCard key={i} viewMode={viewMode} />
          ))}
        </div>
      ) : filteredFonts.length === 0 ? (
        // Empty State visual representation
        <div 
          className="glass-panel"
          style={{
            padding: '48px 24px',
            borderRadius: 'var(--border-radius-lg)',
            border: '1px dotted var(--border-color-dotted)',
            textAlign: 'center',
            backgroundColor: 'rgba(28, 25, 23, 0.45)',
            maxWidth: '500px',
            margin: '40px auto'
          }}
        >
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            color: 'var(--text-muted)'
          }}>
            <AlertCircle size={24} />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>Nenhuma fonte encontrada</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Nenhum resultado corresponde à sua pesquisa ou filtros ativos. Tente redefini-los para buscar novamente.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setActiveStyles([]);
              setShowOnlyFavorites(false);
            }}
            className="btn-accent-ali hover-translate"
            style={{ 
              marginTop: '16px', 
              padding: '6px 14px', 
              fontSize: '0.75rem', 
              borderRadius: 'var(--border-radius-sm)',
              cursor: 'pointer'
            }}
          >
            Redefinir Filtros
          </button>
        </div>
      ) : (
        // Render Font cards
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: viewMode === 'grid' ? 'repeat(1, minmax(0, 1fr))' : '1fr', 
          gap: '24px' 
        }} className={viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : ''}>
          {paginatedFonts.map((font) => (
            <FontCard 
              key={font.id}
              font={font}
              previewText={previewText}
              fontSize={fontSize}
              fontWeight={fontWeight}
              isItalic={isItalic}
              textTransform={textTransform}
              textAlign={textAlign}
              letterSpacing={letterSpacing}
              viewMode={viewMode}
              isFavorite={favorites.includes(font.id)}
              onToggleFavorite={() => handleToggleFavorite(font.id)}
              onCopyName={handleCopyName}
              onCopyCSS={handleCopyCSS}
              onDownload={handleDownload}
              downloadingId={downloadingId}
              user={user}
              highlightText={highlightText}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}

      {/* 5. Load More Button */}
      {hasMore && !isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
          <button
            type="button"
            onClick={() => setVisibleCount(prev => prev + 4)}
            className="btn-dotted-link hover-translate"
            style={{
              padding: '10px 24px',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: 'rgba(255,255,255,0.02)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
            aria-label="Carregar mais fontes"
          >
            <RefreshCw size={12} />
            <span>Carregar Mais</span>
          </button>
        </div>
      )}

      {/* 6. Success Toast Alert Overlay */}
      {showToast && (
        <div 
          className="toast-slide-in"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: 'var(--accent-color)',
            color: '#000000',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            zIndex: 9999,
            fontWeight: 700,
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backdropFilter: 'blur(8px)'
          }}
        >
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Custom Styles Injection */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hover-bg-stone-900:hover {
          background-color: #1c1917 !important;
        }
        
        /* Font Card hover zoom effects */
        .font-card-hover:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.15) !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }
        
        /* Shimmer loading skeleton effect */
        @keyframes skeleton-pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
        .pulse-skeleton {
          animation: skeleton-pulse 1.5s ease-in-out infinite;
        }

        /* Toast slide animation */
        @keyframes toast-in {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .toast-slide-in {
          animation: toast-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Spinner rotation Loader for download button */
        .spinner-loader {
          width: 13px;
          height: 13px;
          border: 2px solid #000000;
          border-bottom-color: transparent;
          border-radius: 50%;
          display: inline-block;
          box-sizing: border-box;
          animation: rotation 1s linear infinite;
        }
        @keyframes rotation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Keyboard focus visible outline override */
        button:focus-visible, h3:focus-visible {
          outline: 2px solid var(--accent-color) !important;
          outline-offset: 2px;
        }

        @media (min-width: 768px) {
          .md\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          .md\\:grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
          .md\\:grid-cols-4 {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          }
        }
      `}</style>

    </div>
  );
}
