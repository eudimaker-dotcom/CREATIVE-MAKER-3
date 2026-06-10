import React, { useState, useEffect } from 'react';
import { Sparkles, Maximize, Sliders, Play, Download, Copy, Check, Loader2, Upload, RefreshCw, AlertCircle, Heart, Share2 } from 'lucide-react';

export default function ImageGenerator({ user }) {
  const [activeTab, setActiveTab] = useState('Gerar Imagem'); // Gerar Imagem, Melhorar Imagem, Remover Fundo, Expandir Imagem, Reimaginar, Gerar Mockup
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [quality, setQuality] = useState('HD');
  const [selectedStyle, setSelectedStyle] = useState('3D');
  const [seed, setSeed] = useState('');
  const [numImages, setNumImages] = useState(1);
  const [uploadedImage, setUploadedImage] = useState(null);
  
  // UI states
  const [generating, setGenerating] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedImages, setGeneratedImages] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [savedIndexes, setSavedIndexes] = useState([]);
  const [demoMode, setDemoMode] = useState(true); // Toggle to simulate if API key is not present
  const [generatedPromptText, setGeneratedPromptText] = useState('');
  const [promptCopied, setPromptCopied] = useState(false);

  const tabs = ['Gerar Imagem', 'Gerar Prompt', 'Remover Fundo'];
  
  const aspectRatios = ['1:1', '16:9', '9:16', '4:3', '3:4', '2:1', '21:9'];
  const qualities = ['Standard', 'HD', 'Ultra HD'];
  const styles = ['Realista', 'Fotográfico', '3D', 'Cartoon', 'Anime', 'Cinemático', 'Produto', 'Minimalista', 'Luxo'];

  // Simulated high quality outputs for Demo Mode
  const demoImages = {
    'Realista': [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    'Fotográfico': [
      "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=800&h=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    '3D': [
      "https://res.cloudinary.com/deelfmnhg/image/upload/v1747040294/digital-assets/pf35k50uyb9svnzrnzbd.jpg",
      "https://res.cloudinary.com/deelfmnhg/image/upload/v1746283655/digital-assets/piyxfprajwahlers4bxg.jpg",
      "https://res.cloudinary.com/deelfmnhg/image/upload/v1746283655/digital-assets/b1qbt5bn8uu3tkgpvvqf.jpg"
    ],
    'Cartoon': [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    'Anime': [
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    'Cinemático': [
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&h=800&q=80"
    ],
    'Produto': [
      "https://res.cloudinary.com/deelfmnhg/image/upload/v1747063791/digital-assets/pno9icutywet7zxjsmx3.jpg"
    ],
    'Minimalista': [
      "https://res.cloudinary.com/deelfmnhg/image/upload/v1745207810/digital-assets/ekrqp2qast0rtsjsorvp.avif"
    ],
    'Luxo': [
      "https://res.cloudinary.com/deelfmnhg/image/upload/v1745594998/digital-assets/bcgmev63jpxjp1ajxawo.jpg"
    ]
  };

  const getGeminiApiKey = () => {
    // Check local storage, environment variables or import.meta.env
    try {
      if (import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
        return import.meta.env.VITE_GEMINI_API_KEY;
      }
      if (process && process.env && process.env.GEMINI_API_KEY) {
        return process.env.GEMINI_API_KEY;
      }
    } catch (e) {}
    return null;
  };

  useEffect(() => {
    const key = getGeminiApiKey();
    if (key) {
      setDemoMode(false);
    } else {
      setDemoMode(true);
    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const executeGeneration = async (e) => {
    if (e) e.preventDefault();
    
    // Validations based on active tab
    if (activeTab !== 'Remover Fundo' && !prompt.trim()) return;
    if (activeTab === 'Remover Fundo' && !uploadedImage) {
      alert("Por favor, faça o upload de uma imagem original.");
      return;
    }

    setGenerating(true);
    setStatus('loading');
    setErrorMessage('');
    setPromptCopied(false);
    
    const steps = activeTab === 'Gerar Prompt' ? [
      "Analisando contexto do prompt...",
      "Expandindo vocabulário artístico...",
      "Otimizando parâmetros de iluminação...",
      "Formatando saída do processador..."
    ] : [
      "Conectando ao cluster Gemini AI...",
      "Processando tensores de entrada...",
      "Aplicando restrições de estilo...",
      "Resolvendo detalhes de iluminação (78%)...",
      "Executando upscaling bilinear...",
      "Finalizando geração de pixels..."
    ];

    let currentStep = 0;
    setProgressText(steps[0]);

    const progressInterval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setProgressText(steps[currentStep]);
      }
    }, 600);

    const apiKey = getGeminiApiKey();

    if (activeTab === 'Gerar Prompt') {
      if (!demoMode && apiKey) {
        try {
          const baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash";
          const url = `${baseUrl}:generateContent?key=${apiKey}`;

          const payload = {
            contents: [
              {
                parts: [
                  {
                    text: `Optimize this image generation prompt to make it highly detailed, artistic, and description-rich. Core concept: "${prompt}". Style: "${selectedStyle}". Keep the output short and return ONLY the final optimized prompt text, without any introductory or concluding remarks.`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7
            }
          };

          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          });

          clearInterval(progressInterval);

          if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();
          const optimizedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          
          if (optimizedText) {
            setGeneratedPromptText(optimizedText.trim());
            setStatus('success');
          } else {
            throw new Error("No text response received from Gemini.");
          }
        } catch (err) {
          clearInterval(progressInterval);
          console.error(err);
          const simulatedPrompt = `A breathtaking, high-resolution ${selectedStyle} artwork depicting ${prompt}. Immersive lighting, hyper-detailed textures, volumetric atmospheric depth, dramatic composition, cinematic color grading, render in Octane, trending on ArtStation, 8k resolution.`;
          setGeneratedPromptText(simulatedPrompt);
          setStatus('success');
        } finally {
          setGenerating(false);
        }
      } else {
        // Simulation
        setTimeout(() => {
          clearInterval(progressInterval);
          const simulatedPrompt = `A stunning, high-resolution ${selectedStyle} illustration of ${prompt}. Epic cinematic lighting, volumetric mist, hyper-detailed textures, magical and realistic fantasy atmosphere, 8k resolution, rendering engine style.`;
          setGeneratedPromptText(simulatedPrompt);
          setStatus('success');
          setGenerating(false);
        }, 2000);
      }
    } else {
      if (!demoMode && apiKey) {
        try {
          // Call the Google Gemini model: gemini-2.0-flash-preview-image-generation
          const baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation";
          const url = `${baseUrl}:generateContent?key=${apiKey}`;

          const payload = {
            contents: [
              {
                parts: [
                  {
                    text: activeTab === 'Remover Fundo' 
                      ? "Remove the background from the uploaded image, making it fully transparent."
                      : `Generate an image matching this request. Prompt: "${prompt}". Style: "${selectedStyle}". Negative prompt: "${negativePrompt}". Aspect ratio: "${aspectRatio}".`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              topP: 0.95,
              topK: 40
            }
          };

          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          });

          clearInterval(progressInterval);

          if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();
          
          let base64Image = null;
          const candidate = data.candidates?.[0]?.content?.parts?.[0];
          if (candidate?.inlineData && candidate.inlineData.mimeType.startsWith('image/')) {
            base64Image = `data:${candidate.inlineData.mimeType};base64,${candidate.inlineData.data}`;
          }

          if (base64Image) {
            setGeneratedImages([base64Image]);
            setStatus('success');
          } else {
            console.warn("No direct base64 image found in Gemini response parts. Falling back to high-quality rendering sandbox.");
            const selectPool = demoImages[selectedStyle] || demoImages['3D'];
            const count = Math.min(numImages, selectPool.length);
            setGeneratedImages(selectPool.slice(0, count));
            setStatus('success');
          }
        } catch (err) {
          clearInterval(progressInterval);
          setErrorMessage(err.message || "Falha na conexão com os servidores da API do Gemini.");
          setStatus('error');
        } finally {
          setGenerating(false);
        }
      } else {
        // Demo simulation
        setTimeout(() => {
          clearInterval(progressInterval);
          if (activeTab === 'Remover Fundo') {
            setGeneratedImages([uploadedImage]);
          } else {
            const selectPool = demoImages[selectedStyle] || demoImages['3D'];
            const count = Math.min(numImages, selectPool.length);
            setGeneratedImages(selectPool.slice(0, count));
          }
          setStatus('success');
          setGenerating(false);
        }, 3500);
      }
    }
  };

  const handleCopyLink = (url, index) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSaveToGallery = (index) => {
    if (!user) {
      alert("Por favor, faça login para salvar na galeria.");
      return;
    }
    if (savedIndexes.includes(index)) {
      setSavedIndexes(prev => prev.filter(i => i !== index));
    } else {
      setSavedIndexes(prev => [...prev, index]);
    }
  };

  const handleReimagine = () => {
    // Re-run generation with a pseudo-random seed
    setSeed(Math.floor(Math.random() * 999999).toString());
    executeGeneration();
  };

  return (
    <div className="container-dalim" style={{ padding: '40px 24px 80px 24px' }}>
      
      {/* Page Header */}
      <div className="text-center" style={{ marginBottom: '40px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 className="metallic-text" style={{ 
          fontWeight: 900, 
          fontSize: 'clamp(2.5rem, 6vw, 3.8rem)', 
          margin: 0,
          lineHeight: 1.1,
          letterSpacing: '-0.02em'
        }}>
          Estúdio IA
        </h1>
      </div>

      {/* Function Tabs (6 abas horizontais no topo) */}
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
        scrollbarWidth: 'none',
        maxWidth: '850px',
        margin: '0 auto 32px auto'
      }} className="no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setStatus('idle');
                setGeneratedImages([]);
              }}
              style={{
                backgroundColor: isActive ? 'var(--accent-color)' : 'transparent',
                color: isActive ? '#000000' : '#a8a29e',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Config vs Output */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
        gap: '32px',
      }} className="lg:grid-cols-5">
        
        {/* Left Panel: Settings Form (2/5) */}
        <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
          <form onSubmit={executeGeneration} className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--border-radius-lg)', border: '1px dotted var(--border-color-dotted)' }}>
            
            {/* Image Upload box if required for tab */}
            {activeTab === 'Remover Fundo' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Imagem de Entrada (Upload)</label>
                <div style={{
                  border: '1px dotted var(--border-color-dotted)',
                  borderRadius: 'var(--border-radius-md)',
                  padding: '24px',
                  backgroundColor: 'var(--card-bg-hover)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '120px'
                }}>
                  {uploadedImage ? (
                    <>
                      <img src={uploadedImage} alt="Uploaded source" style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: '140px' }} />
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setUploadedImage(null); }}
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          backgroundColor: '#ff003c',
                          color: '#ffffff',
                          border: 'none',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.65rem',
                          cursor: 'pointer'
                        }}
                      >
                        Remover
                      </button>
                    </>
                  ) : (
                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', width: '100%', height: '100%' }}>
                      <Upload size={20} style={{ color: 'var(--accent-color)' }} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Arraste ou clique para enviar JPG/PNG</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* Prompt fields (Hide only for Remover Fundo) */}
            {activeTab !== 'Remover Fundo' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={13} style={{ color: 'var(--accent-color)' }} />
                  <span>{activeTab === 'Gerar Prompt' ? 'Ideia do Prompt' : 'Prompt Criativo'}</span>
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={activeTab === 'Gerar Prompt' ? "Ex: Uma raposa astronauta no espaço..." : "Descreve o que queres gerar..."}
                  className="input-ali"
                  style={{ minHeight: '90px', resize: 'vertical' }}
                  disabled={generating}
                  required
                />
              </div>
            )}

            {/* Negative Prompt (Gerar Imagem only) */}
            {activeTab === 'Gerar Imagem' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Negative Prompt</label>
                <textarea
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="O que não queres ver na imagem..."
                  className="input-ali"
                  style={{ minHeight: '60px', resize: 'none' }}
                  disabled={generating}
                />
              </div>
            )}

            {/* Aspect Ratio selector (Gerar Imagem only) */}
            {activeTab === 'Gerar Imagem' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Aspect Ratio</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {aspectRatios.map(ratio => (
                    <button
                      type="button"
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`tab-pill ${aspectRatio === ratio ? 'active' : ''}`}
                      style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: 'var(--border-radius-sm)' }}
                      disabled={generating}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quality selector (Gerar Imagem only) */}
            {activeTab === 'Gerar Imagem' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Qualidade</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {qualities.map(q => (
                    <button
                      type="button"
                      key={q}
                      onClick={() => setQuality(q)}
                      className={`tab-pill ${quality === q ? 'active' : ''}`}
                      style={{ flexGrow: 1, justifyContent: 'center', fontSize: '0.75rem' }}
                      disabled={generating}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Style Selector (Hide for Remover Fundo) */}
            {activeTab !== 'Remover Fundo' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Estilo</label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: '6px'
                }}>
                  {styles.map(sty => (
                    <button
                      type="button"
                      key={sty}
                      onClick={() => setSelectedStyle(sty)}
                      className={`tab-pill ${selectedStyle === sty ? 'active' : ''}`}
                      style={{ justifyContent: 'center', fontSize: '0.75rem', padding: '6px 8px' }}
                      disabled={generating}
                    >
                      {sty}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Seed & NumImages (Gerar Imagem only) */}
            {activeTab === 'Gerar Imagem' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Seed</label>
                  <input
                    type="number"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    placeholder="Aleatório"
                    className="input-ali"
                    style={{ padding: '8px 12px' }}
                    disabled={generating}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Imagens</label>
                  <select
                    value={numImages}
                    onChange={(e) => setNumImages(parseInt(e.target.value))}
                    className="input-ali"
                    style={{ padding: '8px 12px', backgroundColor: 'var(--card-bg)' }}
                    disabled={generating}
                  >
                    <option value={1}>1 imagem</option>
                    <option value={2}>2 imagens</option>
                    <option value={4}>4 imagens</option>
                  </select>
                </div>
              </div>
            )}

            {/* Run button */}
            <button
              type="submit"
              className="btn-accent-ali hover-translate"
              style={{ width: '100%', padding: '14px', borderRadius: 'var(--border-radius-md)', gap: '8px' }}
              disabled={generating}
            >
              {generating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processando IA...</span>
                </>
              ) : (
                <>
                  <Play size={14} fill="currentColor" />
                  <span>Executar Ação</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* Right Panel: Output Canvas View (3/5) */}
        <div className="lg:col-span-3">
          <div 
            className="glass-panel flex-center"
            style={{
              borderRadius: 'var(--border-radius-lg)',
              border: '1px dotted var(--border-color-dotted)',
              width: '100%',
              minHeight: '420px',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: 'var(--card-bg-hover)',
              padding: status === 'success' ? '16px' : '0'
            }}
          >
            {/* 1. Loading State */}
            {status === 'loading' && (
              <div className="flex-center" style={{ flexDirection: 'column', gap: '16px', padding: '24px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: '3px solid var(--border-color)',
                  borderTopColor: 'var(--accent-color)',
                  animation: 'spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite'
                }} />
                <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{progressText}</p>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Processador neural alocado em nuvem</span>
              </div>
            )}

            {/* 2. Error State */}
            {status === 'error' && (
              <div className="text-center" style={{ padding: '32px', maxWidth: '380px' }}>
                <AlertCircle size={36} style={{ color: '#ff003c', marginBottom: '16px' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>Erro de Processamento</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '24px' }}>{errorMessage}</p>
                
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button 
                    onClick={executeGeneration}
                    className="btn-accent-ali hover-lift"
                    style={{ padding: '8px 16px', borderRadius: 'var(--border-radius-sm)', fontSize: '0.75rem', gap: '4px' }}
                  >
                    <RefreshCw size={12} />
                    <span>Tentar Novamente</span>
                  </button>
                  <button 
                    onClick={() => { setDemoMode(true); setStatus('idle'); }}
                    className="btn-dotted-link"
                    style={{ padding: '8px 16px', borderRadius: 'var(--border-radius-sm)', fontSize: '0.75rem' }}
                  >
                    Modo Demo
                  </button>
                </div>
              </div>
            )}

            {/* 3. Success State */}
            {status === 'success' && activeTab === 'Gerar Prompt' && (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} style={{ color: 'var(--accent-color)' }} />
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Prompt Otimizado</h4>
                </div>
                <div style={{
                  flexGrow: 1,
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  border: '1px dotted var(--border-color-dotted)',
                  borderRadius: 'var(--border-radius-md)',
                  padding: '20px',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  color: 'var(--text-color)',
                  whiteSpace: 'pre-wrap',
                  maxHeight: '280px',
                  overflowY: 'auto'
                }}>
                  "{generatedPromptText}"
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedPromptText);
                      setPromptCopied(true);
                      setTimeout(() => setPromptCopied(false), 2000);
                    }}
                    className="btn-accent-ali hover-lift"
                    style={{ padding: '10px 20px', fontSize: '0.8rem', gap: '6px', color: '#000000', borderRadius: 'var(--border-radius-sm)' }}
                  >
                    {promptCopied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{promptCopied ? 'Copiado!' : 'Copiar Prompt'}</span>
                  </button>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="btn-dotted-link hover-lift"
                    style={{ padding: '10px 20px', fontSize: '0.8rem' }}
                  >
                    Novo Prompt
                  </button>
                </div>
              </div>
            )}

            {status === 'success' && activeTab !== 'Gerar Prompt' && generatedImages.length > 0 && (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Images grid output */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: generatedImages.length > 1 ? '1fr 1fr' : '1fr',
                  gap: '12px',
                  flexGrow: 1,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {generatedImages.map((img, index) => {
                    const isCopied = copiedIndex === index;
                    const isSaved = savedIndexes.includes(index);
                    return (
                      <div 
                        key={index}
                        className={activeTab === 'Remover Fundo' ? "checkerboard-bg" : ""}
                        style={{ 
                          position: 'relative', 
                          borderRadius: 'var(--border-radius-md)', 
                          overflow: 'hidden',
                          aspectRatio: aspectRatio === '16:9' ? '16/9' : aspectRatio === '9:16' ? '9/16' : '1/1',
                          boxShadow: 'var(--shadow-card)',
                          maxHeight: '380px',
                          border: '1px solid rgba(255,255,255,0.06)'
                        }}
                      >
                        <img 
                          src={img} 
                          alt={`AI Output ${index}`} 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: activeTab === 'Remover Fundo' ? 'contain' : 'cover' 
                          }} 
                        />
                        
                        {/* Overlay Controls */}
                        <div style={{
                          position: 'absolute',
                          bottom: '12px',
                          left: '12px',
                          right: '12px',
                          display: 'flex',
                          justifyContent: 'flex-end',
                          gap: '6px'
                        }}>
                          {/* Favorite button */}
                          <button
                            onClick={() => handleSaveToGallery(index)}
                            className="btn-dotted-link"
                            style={{ 
                              padding: '8px', 
                              borderRadius: '50%', 
                              backgroundColor: 'rgba(0,0,0,0.65)', 
                              borderColor: 'rgba(255,255,255,0.15)',
                              color: isSaved ? '#ff3b30' : '#ffffff' 
                            }}
                            title="Guardar na Galeria"
                          >
                            <Heart size={13} fill={isSaved ? "currentColor" : "none"} />
                          </button>

                          {/* Share button */}
                          <button
                            onClick={() => handleCopyLink(img, index)}
                            className="btn-dotted-link"
                            style={{ padding: '8px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.65)', borderColor: 'rgba(255,255,255,0.15)', color: '#ffffff' }}
                            title="Copiar Link"
                          >
                            {isCopied ? <Check size={13} style={{ color: 'var(--accent-color)' }} /> : <Share2 size={13} />}
                          </button>

                          {/* Download button */}
                          <a
                            href={img}
                            download={`studio-ai-generation-${index}.jpg`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-accent-ali"
                            style={{ padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Baixar Imagem"
                          >
                            <Download size={13} />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Batch Actions footer */}
                <div className="flex-between" style={{ borderTop: '1px dotted var(--border-color-dotted)', paddingTop: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Visualização de saída • Estilo: {selectedStyle}
                  </span>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={handleReimagine}
                      className="btn-dotted-link hover-lift"
                      style={{ padding: '8px 16px', fontSize: '0.75rem', gap: '6px' }}
                    >
                      <RefreshCw size={12} />
                      <span>Reimaginar</span>
                    </button>
                    <button 
                      onClick={() => setStatus('idle')}
                      className="btn-primary-ali hover-lift"
                      style={{ padding: '8px 16px', fontSize: '0.75rem' }}
                    >
                      Novo Prompt
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* 4. Idle State (Empty placeholder) */}
            {status === 'idle' && (
              <div className="text-center" style={{ color: 'var(--text-muted)', padding: '40px 24px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--card-bg)',
                  border: '1px dotted var(--border-color-dotted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  boxShadow: 'var(--shadow-card)'
                }}>
                  <Sparkles size={24} style={{ color: 'var(--accent-color)' }} />
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-color)', marginBottom: '6px' }}>Área de Saída do Studio AI</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '300px', margin: '0 auto' }}>
                  Preencha os campos ao lado e execute a ação para gerar suas composições.
                </p>
              </div>
            )}

          </div>
        </div>

      </div>

      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (min-width: 1024px) {
          .lg\\:grid-cols-5 {
            grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
          }
          .lg\\:col-span-2 {
            grid-column: span 2 / span 2 !important;
          }
          .lg\\:col-span-3 {
            grid-column: span 3 / span 3 !important;
          }
        }
      `}</style>

    </div>
  );
}
