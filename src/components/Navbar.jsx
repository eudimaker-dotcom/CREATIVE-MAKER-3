import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Search, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import StarButton from './StarButton';
import { assetsData, mockFonts, promptsData, mockTemplates, mockAssets, mockImages } from '../mockData';

export default function Navbar({ currentPath, navigate, searchQuery, setSearchQuery, onOpenAuth, user, onLogOut, isDarkMode, setIsDarkMode }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navContainerRef = useRef(null);
  const searchWrapperRef = useRef(null);

  // Click outside to close dropdown and search suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navContainerRef.current && !navContainerRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getQuickSearchResults = () => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase().trim();
    const results = [];
    
    // Check graphics
    assetsData.forEach(item => {
      if (item.title?.toLowerCase().includes(q)) {
        results.push({ id: item.id, title: item.title, type: 'Gráfico', icon: '🎨' });
      }
    });
    
    // Check templates
    mockTemplates.forEach(item => {
      if (item.title?.toLowerCase().includes(q)) {
        results.push({ id: item.id, title: item.title, type: 'Template', icon: '💻' });
      }
    });

    // Check fonts
    mockFonts.forEach(item => {
      if (item.name?.toLowerCase().includes(q)) {
        results.push({ id: item.id, title: item.name, type: 'Fonte', icon: '🔤' });
      }
    });

    // Check core assets
    mockAssets.forEach(item => {
      if (item.title?.toLowerCase().includes(q)) {
        results.push({ id: item.id, title: item.title, type: 'Ativo', icon: '📐' });
      }
    });

    // Check images
    mockImages.forEach(item => {
      if (item.title?.toLowerCase().includes(q)) {
        results.push({ id: item.id, title: item.title, type: 'Imagem', icon: '📷' });
      }
    });

    // Check prompts
    promptsData.forEach(item => {
      if (item.title?.toLowerCase().includes(q)) {
        results.push({ id: item.id, title: item.title, type: 'Prompt', icon: '✨' });
      }
    });

    return results.slice(0, 4);
  };

  const navItems = [
    {
      id: 'graficos',
      title: 'Gráficos',
      url: '/graficos',
      dropdown: true,
      items: [
        { id: 'g-todos', title: 'Todos os Gráficos', url: '/graficos?category=Todos' },
        { id: 'g-mockups', title: 'Mockups', url: '/graficos?category=Mockups' },
        { id: 'g-flyers', title: 'Flyers', url: '/graficos?category=Flyers' },
        { id: 'g-social', title: 'Social Media', url: '/graficos?category=Social%20Media' }
      ]
    },
    {
      id: 'templates',
      title: 'Modelos',
      url: '/templates',
      dropdown: true,
      items: [
        { id: 't-psd', title: 'Templates PSD (Photoshop)', url: '/templates?software=PSD' },
        { id: 't-figma', title: 'Templates Figma', url: '/templates?software=Figma' },
        { id: 't-ai', title: 'Templates Illustrator', url: '/templates?software=Illustrator' }
      ]
    },
    {
      id: 'fontes',
      title: 'Fontes',
      url: '/fontes',
      dropdown: false
    },
    {
      id: 'assets',
      title: 'Ativos',
      url: '/assets',
      dropdown: true,
      items: [
        { id: 'a-svg', title: 'Arquivos SVG', url: '/assets?type=SVG' },
        { id: 'a-icons', title: 'Ícones Vetoriais', url: '/assets?type=Icons' },
        { id: 'a-3d', title: 'Elementos 3D', url: '/assets?type=3D' }
      ]
    }
  ];

  const handleNavClick = (item) => {
    navigate(item.url);
    if (item.dropdown) {
      setActiveDropdown(activeDropdown === item.id ? null : item.id);
    } else {
      setActiveDropdown(null);
    }
  };

  const handleSubItemClick = (url) => {
    navigate(url);
    setActiveDropdown(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(window.scrollY / totalScroll);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    navigate('/');
    setActiveDropdown(null);
    if (setSearchQuery) setSearchQuery('');
  };

  return (
    <>

      {/* Top Scroll Progress bar */}
      <div className="scroll-progress-container">
        <div 
          className="scroll-progress-bar" 
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>

      {/* Sticky Rounded Navigation Bar */}
      <header className="glass-panel" style={{ position: 'sticky', top: '8px', zIndex: 1000, borderRadius: 'var(--border-radius-lg)', margin: '12px', backgroundColor: 'rgba(12, 10, 9, 0.95)' }}>
        <div className="container-dalim flex-between" style={{ height: '64px', padding: '0 20px' }}>
          
          {/* Left Area: Logo & Brand links */}
          <div className="flex-center" style={{ gap: '32px' }}>
            
            {/* Logo: Solid red semi-circle + brand name 'Designali' */}
            <div 
              className="flex-center" 
              style={{ gap: '12px', cursor: 'pointer' }}
              onClick={handleLogoClick}
            >
              {/* Semi-circular D solid red shape */}
              <div style={{
                width: '15px', 
                height: '24px', 
                backgroundColor: '#ff003c',
                borderTopRightRadius: '12px',
                borderBottomRightRadius: '12px'
              }} />
              <span style={{ 
                fontFamily: 'var(--font-heading)', 
                fontWeight: 600, 
                fontSize: '1.05rem', 
                color: '#ffffff',
                letterSpacing: '-0.02em'
              }}>
                Designali
              </span>
            </div>

            {/* Middle Area: Navigation Links with dropdown filters */}
            <MotionConfig transition={{ bounce: 0, type: 'tween' }}>
              <nav 
                ref={navContainerRef}
                className="flex-center" 
                style={{ gap: '20px', position: 'relative' }}
              >
                {navItems.map((item) => {
                  const isActive = 
                    item.id === 'graficos' ? (currentPath === '/graficos' || currentPath === '/') :
                    currentPath === item.url;
                  
                  return (
                    <div key={item.id} style={{ position: 'relative' }}>
                      <button 
                        onClick={() => handleNavClick(item)}
                        className="hover-lift"
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.85rem',
                          fontWeight: item.id === 'studio-ai' ? 600 : 500,
                          color: item.id === 'studio-ai' ? 'var(--accent-color)' : (isActive ? '#ffffff' : '#a8a29e'),
                          textShadow: item.id === 'studio-ai' ? '0 0 8px var(--glow-color)' : 'none',
                          transition: 'var(--transition-smooth)',
                          padding: '6px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>{item.title}</span>
                        {item.dropdown && (
                          <span style={{ 
                            fontSize: '0.5rem', 
                            opacity: 0.6,
                            transform: activeDropdown === item.id ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease',
                            display: 'inline-block'
                          }}>
                            ▼
                          </span>
                        )}
                      </button>

                      {/* Cursor Underline Indicator */}
                      {isActive && !activeDropdown && (
                        <motion.div
                          layout
                          layoutId="navbar-active-indicator"
                          style={{
                            position: 'absolute',
                            bottom: '-4px',
                            left: '10px',
                            right: '10px',
                            height: '2px',
                            backgroundColor: item.id === 'studio-ai' ? 'var(--accent-color)' : '#ffffff',
                            borderRadius: '9999px',
                            zIndex: 10
                          }}
                        />
                      )}

                      {/* Dropdown Menu on Click */}
                      <AnimatePresence>
                        {item.dropdown && activeDropdown === item.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            style={{
                              position: 'absolute',
                              top: '100%',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              zIndex: 9999,
                              paddingTop: '8px'
                            }}
                          >
                            <motion.div
                              layout
                              layoutId="navbar-active-indicator"
                              style={{
                                backgroundColor: 'var(--card-bg)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '12px',
                                padding: '8px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                                width: '210px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px'
                              }}
                            >
                              {item.items.map((subItem) => (
                                <button
                                  key={subItem.id}
                                  onClick={() => handleSubItemClick(subItem.url)}
                                  style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '8px 12px',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: '#a8a29e',
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'var(--transition-smooth)'
                                  }}
                                  className="hover-action-item"
                                >
                                  {subItem.title}
                                </button>
                              ))}
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </nav>
            </MotionConfig>

          </div>

          {/* Right Area: Actions */}
          <div className="flex-center" style={{ gap: '12px' }}>
            
            {/* ABRIR STUDIO AI Star Button */}
            <StarButton onClick={() => navigate('/studio-ai')}>
              <Sparkles size={14} style={{ marginRight: '6px', flexShrink: 0 }} />
              ABRIR STUDIO AI
            </StarButton>

            {/* Search Input wrapper */}
            <div ref={searchWrapperRef} style={{ position: 'relative' }}>
              <div className="flex-center" style={{ 
                border: '1px solid rgba(255,255,255,0.08)', 
                borderRadius: '9999px', 
                padding: '6px 14px',
                backgroundColor: 'rgba(255,255,255,0.03)',
                gap: '8px'
              }}>
                <Search size={14} style={{ color: '#a8a29e' }} />
                <input 
                  type="text" 
                  placeholder="Search resources..." 
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearchQuery(val);
                    if (val.trim() !== '') {
                      if (currentPath !== '/pesquisa') {
                        navigate('/pesquisa');
                      }
                    } else {
                      if (currentPath === '/pesquisa') {
                        navigate('/graficos');
                      }
                    }
                  }}
                  style={{ 
                    border: 'none', 
                    background: 'transparent', 
                    outline: 'none', 
                    fontSize: '0.75rem',
                    color: '#ffffff',
                    width: '110px'
                  }}
                />
              </div>

              {/* Autocomplete / Suggestions Popover */}
              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      width: '280px',
                      backgroundColor: 'rgba(12, 10, 9, 0.98)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      padding: '12px',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7)',
                      zIndex: 1000,
                      textAlign: 'left'
                    }}
                  >
                    {!searchQuery.trim() ? (
                      <>
                        <div style={{ fontSize: '0.7rem', color: '#a8a29e', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Sugestões de Busca
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {['Mockup', 'Figma', 'PSD', 'Serif', '3D', 'Cyberpunk'].map(term => (
                            <button
                              key={term}
                              onClick={() => {
                                setSearchQuery(term);
                                navigate('/pesquisa');
                                setIsSearchFocused(false);
                              }}
                              className="hover-action-item"
                              style={{
                                border: '1px solid rgba(255,255,255,0.06)',
                                backgroundColor: 'rgba(255,255,255,0.02)',
                                color: '#ffffff',
                                fontSize: '0.7rem',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: '0.7rem', color: '#a8a29e', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Resultados Rápidos
                        </div>
                        {getQuickSearchResults().length === 0 ? (
                          <div style={{ fontSize: '0.7rem', color: '#78716c', padding: '4px 0' }}>
                            Sem resultados rápidos. Pressione Enter para busca profunda.
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {getQuickSearchResults().map(res => (
                              <button
                                key={res.id + res.type}
                                onClick={() => {
                                  setSearchQuery(res.title);
                                  navigate('/pesquisa');
                                  setIsSearchFocused(false);
                                }}
                                className="hover-action-item"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  width: '100%',
                                  padding: '6px 8px',
                                  border: 'none',
                                  backgroundColor: 'transparent',
                                  borderRadius: '6px',
                                  color: '#ffffff',
                                  cursor: 'pointer',
                                  textAlign: 'left'
                                }}
                              >
                                <span style={{ fontSize: '0.9rem' }}>{res.icon}</span>
                                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                  <span style={{ fontSize: '0.7rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {res.title}
                                  </span>
                                  <span style={{ fontSize: '0.6rem', color: '#78716c' }}>{res.type}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dark Mode toggler */}
            <button 
              className="btn-dotted-link" 
              style={{ padding: '8px', borderRadius: '50%', color: '#ffffff', borderColor: 'rgba(255,255,255,0.1)' }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              title="Toggle theme"
            >
              {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* Authentication / Dashboard */}
            {user ? (
              <div className="flex-center" style={{ gap: '8px' }}>
                <button 
                  className={`btn-dotted-link ${currentPath === '/dashboard' ? 'active' : ''}`}
                  style={{ 
                    padding: '8px', 
                    borderRadius: '50%',
                    border: currentPath === '/dashboard' ? '1px solid #ffffff' : '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: currentPath === '/dashboard' ? '#ffffff' : 'transparent',
                    color: currentPath === '/dashboard' ? '#000000' : '#ffffff'
                  }}
                  onClick={() => navigate('/dashboard')}
                  title="Dashboard"
                >
                  <User size={14} />
                </button>
                <button 
                  onClick={onLogOut}
                  className="btn-dotted-link"
                  style={{ padding: '6px 12px', borderRadius: '9999px', fontSize: '0.7rem', color: '#ffffff', borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="btn-accent-ali hover-lift"
                style={{ padding: '8px 16px', borderRadius: '9999px', fontSize: '0.75rem' }}
              >
                Sign In
              </button>
            )}

          </div>

        </div>
      </header>
    </>
  );
}
