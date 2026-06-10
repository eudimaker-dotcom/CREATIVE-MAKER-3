import React, { useState } from 'react';
import { ChevronDown, Smartphone } from 'lucide-react';

export default function TabsFilter({
  selectedPrimaryCategory,
  setSelectedPrimaryCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  sortBy,
  setSortBy,
  columnCount,
  setColumnCount
}) {
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Fictional count numbers for primary categories representing the total available resources
  const primaryCategories = [
    { name: "Gráficos", count: 350 },
    { name: "Inspirações", count: 1200 },
    { name: "Anúncios", count: 450 },
    { name: "Ícones SVG", count: 800 },
    { name: "Designers", count: 116 },
    { name: "Imagens de banco de imagens", count: 640 },
    { name: "Logotipos", count: 190 },
    { name: "Ferramentas", count: 120 }
  ];

  // Sub-categories matching existing mock items in the site (removed "Avatares")
  const subCategories = [
    { label: "Todos", value: "Todos" },
    { label: "PhoneIcon", value: "Mobile" },
    { label: "3D", value: "3D" },
    { label: "Maçã", value: "Maçã" },
    { label: "Fundos", value: "Fundos" },
    { label: "Bolsa", value: "Bolsa" },
    { label: "Maquete de banner", value: "Maquete de banner" }
  ];

  const sortOptions = ["Mais recente", "Mais visualizados", "Mais baixados"];

  return (
    <div className="container-dalim" style={{ marginBottom: '20px', marginTop: '12px', position: 'relative', zIndex: 50 }}>
      
      {/* Glow layer directly behind filters */}
      <div className="radial-glow-gold" />

      {/* 1. Upper Bar: Primary Category Menu with Fictional Counts */}
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
        marginBottom: '20px',
        scrollbarWidth: 'none' /* Firefox */
      }} className="no-scrollbar">
        {primaryCategories.map((cat) => {
          const isActive = selectedPrimaryCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setSelectedPrimaryCategory(cat.name)}
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
              {cat.name === "Designers" ? (
                <>
                  <span>Designers</span>
                  <span style={{ color: '#ff003c', fontWeight: 700 }}>116</span>
                  <span style={{
                    backgroundColor: '#adfa1d',
                    color: '#000000',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    lineHeight: 1
                  }}>
                    Novo
                  </span>
                </>
              ) : (
                <>
                  <span>{cat.name}</span>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    opacity: 0.6,
                    fontWeight: 400,
                    marginLeft: '2px'
                  }}>
                    {cat.count}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* 2. Lower Bar: Sub-filters Control Bar (Scrollable horizontally) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        width: '100%',
        backgroundColor: 'rgba(28, 25, 23, 0.45)',
        backdropFilter: 'blur(12px)',
        borderRadius: '20px',
        padding: '12px 20px',
        border: '1px solid rgba(255,255,255,0.06)'
      }}>
        
        {/* Left Side: Sub-categories scroll wrapper */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none',
          flexGrow: 1,
          maxWidth: '100%',
          padding: '2px 0'
        }} className="no-scrollbar">
          {subCategories.map((sub) => {
            const isActive = selectedSubCategory === sub.value;
            return (
              <button
                key={sub.value}
                onClick={() => setSelectedSubCategory(sub.value)}
                style={{
                  backgroundColor: isActive ? '#ffffff' : 'rgba(0,0,0,0.3)',
                  color: isActive ? '#000000' : '#fafaf9',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '9999px',
                  padding: '8px 16px',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: sub.value === 'Mobile' ? '42px' : 'auto'
                }}
                title={sub.value === 'Mobile' ? 'Celular' : sub.label}
              >
                {sub.value === 'Mobile' ? (
                  <Smartphone size={13} style={{ color: isActive ? '#000000' : '#fafaf9' }} />
                ) : (
                  sub.label
                )}
              </button>
            );
          })}
        </div>

        {/* Right Side: Sorting Dropdown + Grid columns toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexShrink: 0
        }}>
          {/* Sorting Dropdown */}
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
                gap: '6px',
                transition: 'var(--transition-smooth)'
              }}
            >
              <span>{sortBy}</span>
              <ChevronDown size={14} style={{ color: '#a8a29e', transform: showSortDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
            </button>

            {/* Dropdown Items overlay */}
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
                minWidth: '150px',
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
                      cursor: 'pointer',
                      transition: 'var(--transition-smooth)'
                    }}
                    className="hover-bg-stone-900"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grid columns toggle: 3, 5, 6 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '9999px',
            padding: '3px'
          }}>
            {[3, 5, 6].map((cols) => {
              const isColsActive = columnCount === cols;
              return (
                <button
                  key={cols}
                  onClick={() => setColumnCount(cols)}
                  style={{
                    backgroundColor: isColsActive ? '#ffffff' : 'transparent',
                    color: isColsActive ? '#000000' : '#a8a29e',
                    border: 'none',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)',
                    ...(isColsActive ? {
                      backgroundColor: '#ffffff',
                      color: '#000000'
                    } : {})
                  }}
                >
                  {cols}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .hover-bg-stone-900:hover {
          background-color: #1c1917 !important;
        }
      `}</style>
    </div>
  );
}
