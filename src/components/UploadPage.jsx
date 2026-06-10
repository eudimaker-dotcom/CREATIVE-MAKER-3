import React, { useState } from 'react';
import { Upload, FileText, DollarSign, Check, AlertCircle, ShieldAlert } from 'lucide-react';

export default function UploadPage({ onOpenAuth, user, onPublishAsset, navigate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Mockups'); // Mockups, Templates, Fontes, Assets, Imagens
  const [priceType, setPriceType] = useState('free'); // free, paid
  const [price, setPrice] = useState('0.00');
  const [imageUrl, setImageUrl] = useState('');
  const [downloadLink, setDownloadLink] = useState('https://gumroad.com');
  const [tags, setTags] = useState('');
  
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Mockups', 'Templates', 'Fontes', 'Assets', 'Imagens'];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!user) {
      setError("Você precisa estar autenticado para realizar o upload.");
      return;
    }

    if (!title.trim() || !description.trim()) {
      setError("Título e Descrição são obrigatórios.");
      return;
    }

    // Default image if empty
    const finalImage = imageUrl.trim() || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&h=450&q=80";

    const parsedPrice = priceType === 'free' ? 0 : parseFloat(price);

    const newAsset = {
      id: "user-asset-" + Math.floor(Math.random() * 1000000),
      title: title,
      description: description,
      images: [finalImage],
      downloadLink: downloadLink,
      category: category,
      author: user.name || "Designali Creator",
      authorUsername: user.email?.split('@')[0] || "user",
      downloads: 0,
      views: 1,
      saves: 0,
      price: parsedPrice,
      uploadedAt: new Date().toISOString(),
      tags: tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
    };

    if (onPublishAsset) {
      onPublishAsset(newAsset);
      setSuccess(true);
      
      // Clear form
      setTitle('');
      setDescription('');
      setImageUrl('');
      setTags('');
      
      // Redirect back after a delay
      setTimeout(() => {
        if (navigate) navigate('/graficos');
      }, 2000);
    } else {
      setError("Falha ao se comunicar com o banco de dados temporário.");
    }
  };

  if (!user) {
    return (
      <div className="container-dalim" style={{ padding: '80px 24px', display: 'flex', justifyContent: 'center' }}>
        <div 
          className="glass-panel text-center"
          style={{
            padding: '48px 32px',
            borderRadius: 'var(--border-radius-lg)',
            border: '1px dotted var(--border-color-dotted)',
            maxWidth: '520px',
            width: '100%'
          }}
        >
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 0, 85, 0.08)',
            border: '1px solid rgba(255, 0, 85, 0.15)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ff0055',
            marginBottom: '24px'
          }}>
            <ShieldAlert size={28} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>Autenticação Requerida</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '32px' }}>
            Faça parte da nossa comunidade exclusiva de criadores. Faça login para compartilhar seus mockups, templates ou fontes personalizadas.
          </p>
          <button 
            onClick={onOpenAuth}
            className="btn-accent-ali hover-translate"
            style={{ padding: '14px 40px', borderRadius: 'var(--border-radius-md)', fontWeight: 700 }}
          >
            Fazer Sign In / Cadastro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-dalim" style={{ padding: '40px 24px 80px 24px', display: 'flex', justifyContent: 'center' }}>
      
      <div style={{ maxWidth: '640px', width: '100%', textAlign: 'left' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>Upload de Recurso</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Compartilhe seus designs com milhares de criadores da comunidade.
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(255,0,85,0.08)',
            border: '1px solid rgba(255,0,85,0.2)',
            borderRadius: 'var(--border-radius-md)',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#ff0055',
            fontSize: '0.8rem',
            marginBottom: '20px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: 'rgba(158, 255, 0, 0.08)',
            border: '1px solid rgba(158, 255, 0, 0.2)',
            borderRadius: 'var(--border-radius-md)',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--accent-color)',
            fontSize: '0.8rem',
            marginBottom: '20px'
          }}>
            <Check size={16} />
            <span><strong>Upload Concluído!</strong> Seu recurso foi publicado. Redirecionando...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--border-radius-lg)', border: '1px dotted var(--border-color-dotted)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Título do Recurso *</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Minimalist iPhone 16 Mockup Canvas"
              className="input-ali"
              required
            />
          </div>

          {/* Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Descrição Completa *</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva as especificações do arquivo (tamanho, formato, camadas, etc.)..."
              className="input-ali"
              style={{ minHeight: '100px', resize: 'vertical' }}
              required
            />
          </div>

          {/* Category */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Categoria</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {categories.map(cat => {
                const isActive = category === cat;
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`tab-pill ${isActive ? 'active' : ''}`}
                    style={{ fontSize: '0.75rem', padding: '6px 14px' }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image Thumbnail Link */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>URL da Miniatura / Thumbnail</label>
            <input 
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Insira o link da imagem (ou deixe vazio para padrão)"
              className="input-ali"
            />
          </div>

          {/* Download File / External link */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Link de Download do Arquivo *</label>
            <input 
              type="url"
              value={downloadLink}
              onChange={(e) => setDownloadLink(e.target.value)}
              placeholder="Ex: Link do Gumroad, Google Drive ou Behance"
              className="input-ali"
              required
            />
          </div>

          {/* Price setting */}
          <div style={{ borderTop: '1px dotted var(--border-color-dotted)', paddingTop: '16px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Modelo de Faturamento</label>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="priceType" 
                  checked={priceType === 'free'} 
                  onChange={() => setPriceType('free')} 
                  style={{ accentColor: 'var(--accent-color)' }}
                />
                <span>Gratuito (Free)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="priceType" 
                  checked={priceType === 'paid'} 
                  onChange={() => setPriceType('paid')}
                  style={{ accentColor: 'var(--accent-color)' }}
                />
                <span>Pago / Premium</span>
              </label>
            </div>

            {priceType === 'paid' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '160px' }}>
                <DollarSign size={16} style={{ color: 'var(--text-muted)' }} />
                <input 
                  type="number"
                  step="0.01"
                  min="0.99"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="input-ali"
                  style={{ padding: '6px 12px' }}
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Tags (separadas por vírgula)</label>
            <input 
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Ex: psd, packaging, minimal, apple"
              className="input-ali"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-accent-ali hover-translate"
            style={{ width: '100%', padding: '14px', borderRadius: 'var(--border-radius-md)', fontWeight: 700, gap: '6px', justifyContent: 'center' }}
          >
            <Upload size={16} />
            <span>Publicar Recurso</span>
          </button>

        </form>

      </div>

    </div>
  );
}
