import React, { useState } from 'react';
import { promptsData } from '../mockData';
import AssetCard from './AssetCard';
import { Sparkles, ChevronDown } from 'lucide-react';

export default function PromptMarketplace({ user }) {
  const [modelFilter, setModelFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Título (A-Z)');
  const [columnCount, setColumnCount] = useState(5);
  const [copiedId, setCopiedId] = useState(null);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const handleCopyPrompt = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getModelCount = (model) => {
    if (model === 'All') return promptsData.length;
    return promptsData.filter(p => p.model === model).length;
  };

  const models = [
    { name: "All Models", value: "All" },
    { name: "Midjourney v6", value: "Midjourney v6" },
    { name: "DALL-E 3", value: "DALL-E 3" }
  ];

  const categories = [
    "Todos",
    "UI Design",
    "Brutalist",
    "3D Elements",
    "Photography"
  ];

  const filteredPrompts = promptsData.filter(prompt => {
    const matchesModel = modelFilter === 'All' || prompt.model === modelFilter;
    const matchesCategory = categoryFilter === 'All' || prompt.category === categoryFilter;
    return matchesModel && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'Título (Z-A)') {
      return b.title.localeCompare(a.title);
    }
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="container-dalim" style={{ padding: '40px 24px 80px 24px' }}>
      
      {/* Title */}
      <div className="text-center" style={{ marginBottom: '40px' }}>
        <div 
          className="fade-up-item is-visible"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '9999px',
            backgroundColor: 'var(--card-bg-hover)',
            border: '1px dotted var(--border-color-dotted)',
            fontSize: '0.7rem',
            fontWeight: 600,
            color: 'var(--accent-color)',
            marginBottom: '16px'
          }}
        >
          <Sparkles size={12} />
          <span>Generative Prompts Marketplace</span>
        </div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 800, marginBottom: '12px' }}>
          Prompt Engine Hub
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto' }}>
          Copy verified prompts to create stunning iridescent chrome, glassmorphic interfaces, and brutalist art in Midjourney and DALL-E.
        </p>
      </div>

      {/* Double-Tier Filters Component */}
      <div style={{ marginBottom: '32px', position: 'relative', zIndex: 40 }}>
        
        {/* Glow */}
        <div className="radial-glow-gold" />

        {/* 1. Upper Bar: Model Selection */}
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
          {models.map((m) => {
            const isActive = modelFilter === m.value;
            return (
              <button
                key={m.value}
                onClick={() => setModelFilter(m.value)}
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
                <span>{m.name}</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.6, marginLeft: '2px' }}>{getModelCount(m.value)}</span>
              </button>
            );
          })}
        </div>

        {/* 2. Lower Bar: Category Pills */}
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
          border: '1px solid rgba(255,255,255,0.06)'
        }}>
          
          {/* Categories pills list (Scrollable) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            scrollbarWidth: 'none',
            flexGrow: 1,
            maxWidth: '100%'
          }} className="no-scrollbar">
            {categories.map((cat) => {
              const activeVal = cat === 'Todos' ? 'All' : cat;
              const isActive = categoryFilter === activeVal;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(activeVal)}
                  style={{
                    backgroundColor: isActive ? '#ffffff' : 'rgba(0,0,0,0.3)',
                    color: isActive ? '#000000' : '#fafaf9',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '9999px',
                    padding: '8px 16px',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Right Side Controls: Sort & Columns */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            {/* Sort Dropdown */}
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

            {/* Columns Toggle */}
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
      </div>

      {/* Prompts Grid */}
      {filteredPrompts.length === 0 ? (
        <div style={{ padding: '60px 0', color: 'var(--text-muted)', textAlign: 'center' }}>
          <p>No prompts found matching your criteria.</p>
        </div>
      ) : (
        <div className={`grid-container grid-cols-${columnCount}`}>
          {filteredPrompts.map(prompt => (
            <AssetCard
              key={prompt.id}
              asset={prompt}
              isPrompt={true}
              onCopyPrompt={handleCopyPrompt}
              copiedId={copiedId}
            />
          ))}
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
        .hover-bg-stone-900:hover {
          background-color: #1c1917 !important;
        }
      `}</style>
    </div>
  );
}
