import React, { useState, useEffect } from 'react';
import { Sparkles, Download, Copy, Check, Type, Sliders, ArrowUpRight, ChevronDown, Heart } from 'lucide-react';
import { mockFonts } from '../mockData';


export default function FontsGallery({ onOpenAuth, user, onPurchase }) {
  const [fontsList, setFontsList] = useState(mockFonts);
  const [initialDownloads] = useState(() => user?.downloads || []);
  const [previewText, setPreviewText] = useState('Aa Bb Cc — O design fala');
  const [fontSize, setFontSize] = useState(36);
  const [copiedId, setCopiedId] = useState(null);
  const [classificationFilter, setClassificationFilter] = useState('All');
  const [selectedDesigner, setSelectedDesigner] = useState('Todos');
  const [sortBy, setSortBy] = useState('Título (A-Z)');
  const [columnCount, setColumnCount] = useState(3);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [letterFilter, setLetterFilter] = useState('Todos');

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Sync font classification filter from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const styleParam = urlParams.get('style');
    if (styleParam) {
      setClassificationFilter(styleParam);
    }
  }, [window.location.search]);

  // Reactively increment downloads for premium fonts when purchased
  useEffect(() => {
    if (user && user.downloads) {
      setFontsList(prev => prev.map(f => {
        if (user.downloads.includes(f.id) && !initialDownloads.includes(f.id) && !f.incremented) {
          return { ...f, downloads: (f.downloads || 0) + 1, incremented: true };
        }
        return f;
      }));
    }
  }, [user?.downloads, initialDownloads]);

  const handleIncrementDownload = (fontId) => {
    setFontsList(prev => prev.map(f => {
      if (f.id === fontId) {
        return { ...f, downloads: (f.downloads || 0) + 1 };
      }
      return f;
    }));
  };

  const handleCopyCode = (fontName, id) => {
    navigator.clipboard.writeText(`font-family: "${fontName}", sans-serif;`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const classifications = [
    { name: "All", label: "Todos" },
    { name: "Sans Serif", label: "Sans Serif" },
    { name: "Serif", label: "Serif" },
    { name: "Display", label: "Display" },
    { name: "Script", label: "Script" },
    { name: "Luxury", label: "Luxury" },
    { name: "Corporate", label: "Corporate" },
    { name: "Minimalista", label: "Minimalista" },
    { name: "Moderna", label: "Moderna" }
  ];

  const matchFontClassification = (font, filter) => {
    if (filter === 'All') return true;
    const normFilter = filter.toLowerCase();
    
    if (normFilter === 'sans serif') return font.classification === 'sem serifa';
    if (normFilter === 'serif') return font.classification === 'serifa';
    if (normFilter === 'display') return font.classification === 'exibição';
    if (normFilter === 'script') return font.classification === 'roteiro';
    if (normFilter === 'luxury') return font.tags?.some(t => t.toLowerCase() === 'luxo' || t.toLowerCase() === 'luxury');
    if (normFilter === 'corporate') return font.tags?.some(t => t.toLowerCase() === 'corporate' || t.toLowerCase() === 'corporativa');
    if (normFilter === 'minimalista') return font.tags?.some(t => t.toLowerCase() === 'minimalista' || t.toLowerCase() === 'minimal');
    if (normFilter === 'moderna') return font.tags?.some(t => t.toLowerCase() === 'moderno' || t.toLowerCase() === 'moderna');
    
    return font.classification?.toLowerCase() === normFilter || 
           font.tags?.some(t => t.toLowerCase() === normFilter);
  };

  const getClassificationCount = (cls) => {
    return fontsList.filter(f => matchFontClassification(f, cls)).length;
  };

  // Get unique designers from fontsList dynamically
  const designers = ["Todos", ...new Set(fontsList.map(f => f.designer))];

  const filteredFonts = fontsList.filter(font => {
    const matchesClassification = matchFontClassification(font, classificationFilter);
    const matchesDesigner = selectedDesigner === 'Todos' || font.designer === selectedDesigner;
    const matchesLetter = letterFilter === 'Todos' || !letterFilter || font.name.toUpperCase().startsWith(letterFilter);
    return matchesClassification && matchesDesigner && matchesLetter;
  }).sort((a, b) => {
    if (sortBy === 'Título (Z-A)') {
      return b.name.localeCompare(a.name);
    }
    return a.name.localeCompare(b.name);
  });

  // Pagination Logic
  const fontsPerPage = 3; // 3 items per page so pagination is visible with 7 mock fonts
  const totalPages = Math.ceil(filteredFonts.length / fontsPerPage);
  const activePage = Math.min(currentPage, totalPages || 1);
  const startIndex = (activePage - 1) * fontsPerPage;
  const paginatedFonts = filteredFonts.slice(startIndex, startIndex + fontsPerPage);

  return (
    <div className="container-dalim" style={{ padding: '40px 24px 80px 24px' }}>
      
      {/* 1. Fonts Hero Section */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        textAlign: 'center', 
        marginBottom: '48px', 
        position: 'relative', 
        width: '100%' 
      }}>
        <div className="radial-glow-layer" style={{ height: '200px' }}>
          <div className="radial-glow-green" />
        </div>

        <h1 className="metallic-text" style={{ 
          fontSize: 'clamp(3.5rem, 8vw, 6rem)', 
          fontWeight: 900, 
          margin: '24px 0', 
          lineHeight: 1.1,
          fontFamily: "'Space Grotesk', 'Courier New', monospace",
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          textAlign: 'center'
        }}>
          FONTES
        </h1>
      </div>

      {/* 2. MainFontPreviewControls */}
      <div 
        className="glass-panel"
        style={{
          padding: '24px',
          borderRadius: 'var(--border-radius-lg)',
          border: '1px dotted var(--border-color-dotted)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginBottom: '40px',
          textAlign: 'left'
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
          gap: '20px'
        }} className="md:grid-cols-3">
          
          {/* Custom preview text input */}
          <div className="md:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Type size={12} />
              <span>Texto de Exemplo e Visualização</span>
            </label>
            <input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              className="input-ali"
              placeholder="Digite o texto personalizado para visualizar as fontes..."
            />
          </div>

          {/* Size slider controller */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div className="flex-between" style={{ alignItems: 'center' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Sliders size={12} />
                <span>Tamanho da Fonte</span>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}
                >
                  -
                </button>
                <input
                  type="number"
                  min="14"
                  max="120"
                  value={fontSize}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) setFontSize(Math.min(120, Math.max(14, val)));
                  }}
                  style={{
                    width: '45px',
                    height: '24px',
                    backgroundColor: '#0c0a09',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    outline: 'none'
                  }}
                />
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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}
                >
                  +
                </button>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '2px' }}>px</span>
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
                height: '6px',
                borderRadius: '9999px',
                cursor: 'pointer',
                accentColor: 'var(--accent-color)',
                marginTop: '16px'
              }}
            />
          </div>

        </div>

      </div>

      {/* Single-Tier Filters Component */}
      <div style={{ marginBottom: '32px', position: 'relative', zIndex: 40 }}>
        
        {/* Glow */}
        <div className="radial-glow-gold" />

        {/* 1. Upper Bar: Classification Selection with Counts */}
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
          {classifications.map((c) => {
            const isActive = classificationFilter === c.name;
            return (
              <button
                key={c.name}
                onClick={() => setClassificationFilter(c.name)}
                style={{
                  backgroundColor: isActive ? '#000000' : 'transparent',
                  color: isActive ? '#ffffff' : '#a8a29e',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{c.label}</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.6, marginLeft: '2px' }}>{getClassificationCount(c.name)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Fonts Gallery Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
        
        {paginatedFonts.map((font) => {
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
              {/* Upper Box: Specimen Preview */}
              <div 
                onClick={() => handleCopyCode(font.name, font.id)}
                title="Clique para copiar a classe CSS"
                style={{ 
                  backgroundColor: '#0c0a09',
                  border: isCopied ? '1px solid var(--accent-color)' : '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '16px',
                  padding: '24px 20px',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)',
                  ...font.style, 
                  fontSize: `${fontSize}px`, 
                  lineHeight: 1.15,
                  wordBreak: 'break-word',
                  color: '#ffffff',
                  minHeight: '80px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {previewText || font.name}

                {/* Copied Badge overlay */}
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

              {/* Lower Section: Font Info & Download */}
              <div className="flex-between" style={{ flexWrap: 'wrap', gap: '12px', padding: '2px 4px' }}>
                {/* Left Side: Meta info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                  <strong style={{ color: 'var(--text-color)', fontWeight: 700, fontSize: '0.95rem' }}>{font.name}</strong>
                  
                  {/* Badge de categoria */}
                  <span className="badge-secondary" style={{ textTransform: 'capitalize' }}>
                    {font.classification}
                  </span>
                  
                  <span style={{ color: 'var(--border-color-glass)', fontSize: '0.75rem' }}>•</span>
                  
                  {/* Downloads count com ícone */}
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Download size={12} />
                    {font.downloads || 0}
                  </span>
                  
                  <span style={{ color: 'var(--border-color-glass)', fontSize: '0.75rem' }}>•</span>
                  
                  {/* Likes count com ícone */}
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Heart size={12} style={{ color: '#ff3b30' }} fill="#ff3b30" />
                    {Math.floor((font.views || 0) * 0.4) + 12}
                  </span>
                  
                  {font.tags && font.tags.map(tag => (
                    <span 
                      key={tag} 
                      style={{
                        backgroundColor: 'var(--card-bg-hover)',
                        color: 'var(--text-color)',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        border: '1px solid var(--border-color-glass)',
                        marginLeft: '2px'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Right Side: Download Button (Free/Premium state) */}
                {(font.price > 0 || font.id === 'f3' || font.id === 'f7') ? (
                  user ? (
                    user.downloads && user.downloads.includes(font.id) ? (
                      <a 
                        href={font.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleIncrementDownload(font.id)}
                        className="hover-translate"
                        style={{ 
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.8rem',
                          color: '#000000',
                          backgroundColor: 'var(--accent-color)',
                          textDecoration: 'none',
                          borderRadius: 'var(--border-radius-sm)',
                          padding: '6px 14px',
                          fontWeight: 600
                        }}
                      >
                        <Download size={13} style={{ color: '#000000' }} />
                        <span>Download (Adquirido)</span>
                      </a>
                    ) : (
                      <button 
                        onClick={() => {
                          if (onPurchase) onPurchase(font);
                        }}
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
                          padding: '6px 14px',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        <span>Comprar (${font.price || '2.99'})</span>
                      </button>
                    )
                  ) : (
                    <button 
                      onClick={() => {
                        if (onOpenAuth) onOpenAuth();
                      }}
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
                        padding: '6px 14px',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      <span>Premium (${font.price || '2.99'})</span>
                    </button>
                  )
                ) : (
                  <a 
                    href={font.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleIncrementDownload(font.id)}
                    className="hover-translate"
                    style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.8rem',
                      color: '#000000',
                      backgroundColor: 'var(--accent-color)',
                      textDecoration: 'none',
                      borderRadius: 'var(--border-radius-sm)',
                      padding: '6px 14px',
                      fontWeight: 600
                    }}
                  >
                    <Download size={13} style={{ color: '#000000' }} />
                    <span>Download (Grátis)</span>
                  </a>
                )}
              </div>

            </div>
          );
        })}

      </div>

      {/* 4. Controls Bar at the Bottom (below the last font card) */}
      <div style={{
        marginTop: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        backgroundColor: 'rgba(28, 25, 23, 0.45)',
        backdropFilter: 'blur(12px)',
        borderRadius: '24px',
        padding: '24px',
        border: '1px solid rgba(255,255,255,0.06)',
        textAlign: 'left'
      }}>
        
        {/* Alphabet Filter (A-Z) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Filtrar por inicial (A-Z):
          </span>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            alignItems: 'center'
          }} className="no-scrollbar">
            <button
              onClick={() => {
                setLetterFilter('Todos');
                setCurrentPage(1);
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.08)',
                backgroundColor: letterFilter === 'Todos' || !letterFilter ? 'var(--accent-color)' : 'rgba(0,0,0,0.3)',
                color: letterFilter === 'Todos' || !letterFilter ? '#000000' : '#fafaf9',
                transition: 'var(--transition-smooth)'
              }}
            >
              Todos
            </button>
            {alphabet.map(letter => {
              const hasFonts = fontsList.some(f => f.name.toUpperCase().startsWith(letter) && matchFontClassification(f, classificationFilter));
              const isActive = letterFilter === letter;
              return (
                <button
                  key={letter}
                  onClick={() => {
                    if (hasFonts) {
                      setLetterFilter(letter);
                      setCurrentPage(1);
                    }
                  }}
                  disabled={!hasFonts}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: hasFonts ? 'pointer' : 'default',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backgroundColor: isActive 
                      ? 'var(--accent-color)' 
                      : hasFonts 
                        ? 'rgba(255,255,255,0.05)' 
                        : 'rgba(255,255,255,0.01)',
                    color: isActive 
                      ? '#000000' 
                      : hasFonts 
                        ? '#fafaf9' 
                        : 'rgba(255,255,255,0.15)',
                    opacity: hasFonts ? 1 : 0.4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', borderTop: '1px solid rgba(255,255,255,0.06)' }} />

        {/* Lower Row: Pagination & Sort */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          {/* Result Count */}
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Exibindo {filteredFonts.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + fontsPerPage, filteredFonts.length)} de {filteredFonts.length} fontes
          </span>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
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
                <span>{sortBy}</span>
                <ChevronDown size={14} style={{ color: '#a8a29e', transform: showSortDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
              </button>

              {showSortDropdown && (
                <div style={{
                  position: 'absolute',
                  bottom: '100%', // Open upwards since it's at the bottom
                  right: 0,
                  marginBottom: '6px',
                  backgroundColor: '#0c0a09',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '4px',
                  zIndex: 150,
                  minWidth: '150px',
                  boxShadow: '0 -10px 25px rgba(0,0,0,0.5)'
                }}>
                  {['Título (A-Z)', 'Título (Z-A)'].map((opt) => (
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
                      className="hover-bg-stone-900"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={activePage === 1}
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    color: activePage === 1 ? '#a8a29e' : '#fafaf9',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: activePage === 1 ? 'default' : 'pointer',
                    opacity: activePage === 1 ? 0.5 : 1
                  }}
                >
                  Anterior
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  const isPageActive = activePage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: '1px solid rgba(255,255,255,0.08)',
                        backgroundColor: isPageActive ? '#ffffff' : 'rgba(0,0,0,0.3)',
                        color: isPageActive ? '#000000' : '#fafaf9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'var(--transition-smooth)'
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={activePage === totalPages}
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    color: activePage === totalPages ? '#a8a29e' : '#fafaf9',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: activePage === totalPages ? 'default' : 'pointer',
                    opacity: activePage === totalPages ? 0.5 : 1
                  }}
                >
                  Próxima
                </button>
              </div>
            )}
          </div>
        </div>
      </div>


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
        @media (min-width: 768px) {
          .md\\:grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
        }
      `}</style>

    </div>
  );
}
