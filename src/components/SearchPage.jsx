import React, { useState } from 'react';
import { Download, Heart, Search, ArrowRight, Copy, Check, Sparkles, FileCode, ImageIcon, Layers } from 'lucide-react';
import AssetCard from './AssetCard';
import { mockFonts, promptsData, mockTemplates, mockAssets, mockImages } from '../mockData';
import { GlowCard } from './GlowCard';

export default function SearchPage({ 
  query, 
  setSearchQuery,
  dbAssets, 
  onSelectAsset, 
  onPurchase, 
  favoritesList, 
  onToggleFavorite,
  user
}) {
  const [copiedId, setCopiedId] = useState(null);
  const [copiedPromptId, setCopiedPromptId] = useState(null);

  const handleCopyCode = (fontName, id) => {
    navigator.clipboard.writeText(`font-family: "${fontName}", sans-serif;`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyPrompt = (promptText, id) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const isFavorited = (id) => favoritesList && favoritesList.includes(id);

  // Popular search suggestions
  const suggestions = ["Mockup", "Figma", "PSD", "Serif", "3D", "Moderno", "Minimalista", "Abstract", "Brutalist", "Cyberpunk", "Chrome"];

  // 1. Basic Levenshtein distance for spelling suggestions
  const editDistance = (a, b) => {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            Math.min(
              matrix[i][j - 1] + 1, // insertion
              matrix[i - 1][j] + 1  // deletion
            )
          );
        }
      }
    }
    return matrix[b.length][a.length];
  };

  // 2. Gather spelling suggestions based on query
  const getFuzzySuggestions = () => {
    if (!query) return [];
    const q = query.toLowerCase().trim();
    if (q.length < 2) return [];

    const allKeywords = new Set([
      "mockup", "figma", "psd", "serif", "sans serif", "display", "3d", "moderno", "minimalista", "poster", "flyer", "vector",
      "tshirt", "box", "apple", "iphone", "watch", "cyberpunk", "holographic", "iridescent", "chrome",
      "concrete", "retro", "glassmorphism", "abstract", "brutalist", "metal", "noise", "grid", "packaging"
    ]);

    const matches = Array.from(allKeywords).filter(word => {
      return word !== q && (word.includes(q) || q.includes(word) || editDistance(word, q) <= 2);
    });

    return matches.slice(0, 4);
  };

  // 3. Generalized Relevance-based Search Algorithm
  const performSearch = (dataSet, fieldsExtractor) => {
    if (!query) return [];
    const q = query.toLowerCase().trim();
    const keywords = q.split(/\s+/).filter(k => k.length > 0);
    if (keywords.length === 0) return [];

    return dataSet
      .map(item => {
        let score = 0;
        const fields = fieldsExtractor(item);
        
        keywords.forEach(word => {
          fields.forEach(({ text, weight }) => {
            if (!text) return;
            const lowerText = text.toLowerCase();
            if (lowerText.includes(word)) {
              score += weight;
              if (lowerText.startsWith(word)) score += Math.floor(weight * 0.4); // word start match bonus
            }
          });
        });

        return { item, score };
      })
      .filter(entry => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(entry => entry.item);
  };

  // Run Search Across All Databases
  const assetResults = performSearch(dbAssets, (item) => [
    { text: item.title, weight: 15 },
    { text: item.category, weight: 10 },
    { text: item.description, weight: 3 },
    { text: item.author, weight: 5 },
    { text: item.authorUsername, weight: 5 },
    { text: item.tags?.join(' '), weight: 8 }
  ]);

  const fontResults = performSearch(mockFonts, (item) => [
    { text: item.name, weight: 15 },
    { text: item.classification, weight: 10 },
    { text: item.designer, weight: 8 },
    { text: item.tags?.join(' '), weight: 8 }
  ]);

  const templateResults = performSearch(mockTemplates, (item) => [
    { text: item.title, weight: 15 },
    { text: item.software, weight: 12 },
    { text: item.category, weight: 10 },
    { text: item.tags?.join(' '), weight: 8 }
  ]);

  const coreAssetResults = performSearch(mockAssets, (item) => [
    { text: item.title, weight: 15 },
    { text: item.category, weight: 10 },
    { text: item.tags?.join(' '), weight: 8 }
  ]);

  const imageResults = performSearch(mockImages, (item) => [
    { text: item.title, weight: 15 },
    { text: item.category, weight: 10 },
    { text: item.tags?.join(' '), weight: 8 }
  ]);

  const promptResults = performSearch(promptsData, (item) => [
    { text: item.title, weight: 15 },
    { text: item.promptText, weight: 6 },
    { text: item.model, weight: 8 },
    { text: item.category, weight: 10 },
    { text: item.tags?.join(' '), weight: 8 }
  ]);

  const totalResults = assetResults.length + fontResults.length + templateResults.length + coreAssetResults.length + imageResults.length + promptResults.length;
  const fuzzySuggestions = getFuzzySuggestions();

  // Get 4 most popular assets as recommendations if search is empty or has no results
  const recommendations = [...dbAssets]
    .sort((a, b) => (b.views + b.downloads) - (a.views + a.downloads))
    .slice(0, 4);

  return (
    <div className="container-dalim" style={{ padding: '40px 24px 80px 24px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'left', marginBottom: '32px' }}>
        <span className="badge-secondary" style={{ color: 'var(--accent-color)', borderColor: 'var(--accent-color)', marginBottom: '8px' }}>
          Busca Inteligente & Profunda
        </span>
        <h1 className="metallic-text" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>
          Resultados da Pesquisa
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {query ? (
            <>
              Encontramos {totalResults} {totalResults === 1 ? 'resultado' : 'resultados'} para <strong style={{ color: 'var(--text-color)' }}>"{query}"</strong>
            </>
          ) : (
            'Digite algo no campo de busca para pesquisar recursos no site'
          )}
        </p>
      </div>

      {/* Grid of Results */}
      {totalResults === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          {/* Empty State Card */}
          <div style={{
            textAlign: 'center',
            padding: '60px 24px',
            backgroundColor: 'var(--card-bg)',
            borderRadius: 'var(--border-radius-lg)',
            border: '1px dotted var(--border-color-dotted)',
            maxWidth: '580px',
            margin: '0 auto 60px auto'
          }}>
            <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', backgroundColor: 'rgba(255,0,60,0.06)', color: '#ff003c', marginBottom: '16px' }}>
              <Search size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Nenhum recurso encontrado</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.5 }}>
              Não encontramos nenhum ativo correspondente a "{query}". Tente ajustar os termos ou use as nossas sugestões:
            </p>

            {/* Spelling Correction Suggestions (Fuzzy Matches) */}
            {fuzzySuggestions.length > 0 && (
              <div style={{ marginBottom: '24px', padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '8px' }}>Você quis dizer?</span>
                <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '6px' }}>
                  {fuzzySuggestions.map(word => (
                    <button
                      key={word}
                      onClick={() => setSearchQuery && setSearchQuery(word)}
                      style={{
                        backgroundColor: 'rgba(255, 0, 60, 0.1)',
                        color: '#ff003c',
                        border: '1px solid rgba(255, 0, 60, 0.2)',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clickable Suggestions Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => setSearchQuery && setSearchQuery(s)}
                  className="hover-lift"
                  style={{
                    backgroundColor: 'var(--card-bg-hover)',
                    color: 'var(--text-color)',
                    border: '1px solid var(--border-color)',
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Recommended Resources Row */}
          <div style={{ textAlign: 'left' }}>
            <h2 className="metallic-text" style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>
              Recomendados para Você
            </h2>
            <div className="grid-container">
              {recommendations.map((asset) => (
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

        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          
          {/* 1. Ativos & Modelos (Gráficos) results section */}
          {assetResults.length > 0 && (
            <div>
              <h2 className="metallic-text" style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', textAlign: 'left' }}>
                Gráficos & Mockups ({assetResults.length})
              </h2>
              <div className="grid-container" style={{ textAlign: 'left' }}>
                {assetResults.map((asset) => (
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
          )}

          {/* 2. Modelos / Templates Editáveis results section */}
          {templateResults.length > 0 && (
            <div>
              <h2 className="metallic-text" style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', textAlign: 'left' }}>
                Modelos Editáveis (Figma, PSD, AI) ({templateResults.length})
              </h2>
              <div className="grid-container" style={{ textAlign: 'left' }}>
                {templateResults.map((tpl) => {
                  const isPremium = tpl.price > 0;
                  return (
                    <GlowCard 
                      key={tpl.id}
                      className="asset-card hover-translate"
                      customSize={true}
                      glowColor={isPremium ? 'blue' : 'green'}
                      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                    >
                      <div className="asset-card-image-box">
                        <img src={tpl.image} alt={tpl.title} className="asset-card-img" />
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          backgroundColor: isPremium ? '#0026ff' : 'var(--accent-color)',
                          color: isPremium ? '#ffffff' : '#000000'
                        }}>
                          {isPremium ? `$ ${tpl.price.toFixed(2).replace('.', ',')}` : 'LIVRE'}
                        </div>
                      </div>
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
                          </div>
                        </div>
                      </div>
                    </GlowCard>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Font results section */}
          {fontResults.length > 0 && (
            <div>
              <h2 className="metallic-text" style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', textAlign: 'left' }}>
                Fontes Tipográficas ({fontResults.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
                {fontResults.map((font) => {
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
                            fontFamily: 'var(--font-body)'
                          }}>
                            CSS Copiado!
                          </span>
                        )}
                      </div>
                      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '12px', padding: '2px 4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                          <strong style={{ color: 'var(--text-color)', fontWeight: 700 }}>{font.name}</strong>
                          <span className="badge-secondary" style={{ textTransform: 'capitalize' }}>
                            {font.classification}
                          </span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>por {font.designer}</span>
                          <span style={{ color: 'var(--border-color-glass)', fontSize: '0.75rem' }}>•</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Download size={12} />
                            {font.downloads || 0}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{font.license}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Core Graphic Assets / Vectors results section */}
          {coreAssetResults.length > 0 && (
            <div>
              <h2 className="metallic-text" style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', textAlign: 'left' }}>
                Ativos Gráficos & Vetores ({coreAssetResults.length})
              </h2>
              <div className="grid-container" style={{ textAlign: 'left' }}>
                {coreAssetResults.map((asset) => {
                  const isSvg = asset.category === 'SVG' || asset.category === 'Ícones';
                  return (
                    <GlowCard 
                      key={asset.id}
                      className="asset-card hover-translate"
                      customSize={true}
                      glowColor="purple"
                      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                    >
                      <div style={{
                        width: '100%',
                        aspectRatio: '4/3',
                        backgroundColor: '#0c0a09',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        position: 'relative'
                      }}>
                        {isSvg ? (
                          <div 
                            style={{ width: '50px', height: '50px', color: '#ffffff' }}
                            dangerouslySetInnerHTML={{ __html: asset.svgContent }}
                          />
                        ) : (
                          <img src={asset.image} alt={asset.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
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
                          {asset.category}
                        </div>
                      </div>
                      <div className="asset-card-info" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <h3 className="asset-card-title">{asset.title}</h3>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                          {asset.fileSize && <span className="badge-secondary">{asset.fileSize}</span>}
                          {asset.dimensions && <span className="badge-secondary">{asset.dimensions}</span>}
                        </div>
                      </div>
                    </GlowCard>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. Images / Photos results section */}
          {imageResults.length > 0 && (
            <div>
              <h2 className="metallic-text" style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', textAlign: 'left' }}>
                Imagens & Fotos ({imageResults.length})
              </h2>
              <div className="grid-container" style={{ textAlign: 'left' }}>
                {imageResults.map((img) => {
                  const isPremium = img.access === 'Premium';
                  return (
                    <GlowCard 
                      key={img.id}
                      className="asset-card hover-translate"
                      customSize={true}
                      glowColor={isPremium ? 'blue' : 'green'}
                      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                    >
                      <div style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '4/3',
                        overflow: 'hidden'
                      }}>
                        <img src={img.url} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          backgroundColor: isPremium ? '#0026ff' : 'var(--accent-color)',
                          color: isPremium ? '#ffffff' : '#000000'
                        }}>
                          {isPremium ? `$ ${img.price.toFixed(2).replace('.', ',')}` : 'LIVRE'}
                        </div>
                      </div>
                      <div className="asset-card-info" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <h3 className="asset-card-title">{img.title}</h3>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                          <span className="badge-secondary">{img.format}</span>
                          <span className="badge-secondary">{img.category}</span>
                        </div>
                      </div>
                    </GlowCard>
                  );
                })}
              </div>
            </div>
          )}

          {/* 6. AI Prompts results section */}
          {promptResults.length > 0 && (
            <div>
              <h2 className="metallic-text" style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', textAlign: 'left' }}>
                Prompts de Inteligência Artificial ({promptResults.length})
              </h2>
              <div className="grid-container" style={{ textAlign: 'left' }}>
                {promptResults.map((prompt) => {
                  const isCopied = copiedPromptId === prompt.id;
                  return (
                    <GlowCard 
                      key={prompt.id} 
                      className="asset-card hover-translate"
                      customSize={true}
                      glowColor="orange"
                    >
                      <div className="asset-card-info" style={{ gap: '14px', padding: '20px', minHeight: '220px', display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
                        <div className="flex-between">
                          <span className="badge-secondary" style={{ color: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}>
                            {prompt.model}
                          </span>
                          <span className="badge-secondary">{prompt.aspectRatio}</span>
                        </div>
                        <h3 className="asset-card-title" style={{ fontSize: '0.95rem', fontWeight: 700 }}>{prompt.title}</h3>
                        <div style={{
                          fontSize: '0.72rem',
                          color: 'var(--text-muted)',
                          backgroundColor: 'rgba(0,0,0,0.3)',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px dotted var(--border-color-dotted)',
                          fontFamily: 'monospace',
                          lineHeight: 1.4,
                          flexGrow: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          "{prompt.promptText}"
                        </div>
                        <div className="flex-between" style={{ paddingTop: '10px', borderTop: '1px dotted rgba(255,255,255,0.06)' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>por {prompt.author}</span>
                          <button
                            onClick={() => handleCopyPrompt(prompt.promptText, prompt.id)}
                            className="btn-dotted-link"
                            style={{
                              padding: '4px 10px',
                              borderRadius: '9999px',
                              backgroundColor: isCopied ? 'var(--text-color)' : 'transparent',
                              color: isCopied ? 'var(--bg-color)' : 'var(--text-color)',
                              borderColor: isCopied ? 'var(--text-color)' : 'rgba(255,255,255,0.1)',
                              fontSize: '0.7rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            {isCopied ? <Check size={11} /> : <Copy size={11} />}
                            <span>{isCopied ? 'Copiado!' : 'Copiar'}</span>
                          </button>
                        </div>
                      </div>
                    </GlowCard>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
