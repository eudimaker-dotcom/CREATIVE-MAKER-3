import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Download, 
  CreditCard, 
  User, 
  Settings, 
  ArrowLeft, 
  LogOut, 
  Check, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  Heart, 
  HardDrive,
  Eye,
  ExternalLink,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { assetsData } from '../mockData';

// Input Sanitization helper to protect against XSS
const sanitizeInput = (val) => {
  if (typeof val !== 'string') return val;
  return val
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Image Error Fallback Handler
const handleImageError = (e) => {
  e.target.onerror = null;
  e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80';
};

// Simulated Promise-Based API Client
const DB_API = {
  updateProfile: async (profileData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: profileData });
      }, 600);
    });
  },
  upgradeSubscription: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, plan: 'Pro' });
      }, 600);
    });
  }
};

export default function Dashboard({ user, onSelectAsset, favoritesList, onLogOut, setActiveTab, onUpdateUser }) {
  const [currentSubTab, setCurrentSubTab] = useState('overview'); // 'overview', 'products', 'subscription', 'profile'
  const [plan, setPlan] = useState(user?.plan || 'Free');
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Profile Form States
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profilePassword, setProfilePassword] = useState('••••••••');
  const [notifNewResources, setNotifNewResources] = useState(true);
  const [notifWeeklyNewsletter, setNotifWeeklyNewsletter] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync state if user changes in parent component (avoids infinite loops by depending on user)
  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfileEmail(user.email || '');
      setPlan(user.plan || 'Free');
    }
  }, [user]);

  // Billing History Simulation
  const [invoices, setInvoices] = useState([
    { id: "INV-2026-002", date: "30/04/2026", desc: "Assinatura Mensal Pro", val: "$19.00", status: "Pago" },
    { id: "INV-2026-001", date: "30/03/2026", desc: "Assinatura Mensal Pro", val: "$19.00", status: "Pago" }
  ]);

  if (!user) return null;

  // Filter downloaded/purchased assets
  const purchasedAssets = assetsData.filter(asset => 
    user.downloads && user.downloads.includes(asset.id)
  );

  // Fallback to showcase default premium mockups if download history is empty (used in dashboard home suggestions)
  const displayAssets = purchasedAssets.length > 0 ? purchasedAssets : assetsData.slice(0, 3);

  // Filter saved/favorited assets
  const savedAssets = assetsData.filter(asset => 
    favoritesList && favoritesList.includes(asset.id)
  );

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setValidationError('');
    setSaveSuccess(false);

    // XSS Sanitization
    const sanitizedName = sanitizeInput(profileName);
    const sanitizedEmail = sanitizeInput(profileEmail);

    // Front-end Validations
    if (!sanitizedName.trim()) {
      setValidationError('O nome completo é obrigatório.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      setValidationError('Por favor, insira um e-mail válido.');
      return;
    }
    if (profilePassword !== '••••••••' && profilePassword.length < 6) {
      setValidationError('A nova senha deve conter pelo menos 6 caracteres.');
      return;
    }

    setIsUpdating(true);
    try {
      const response = await DB_API.updateProfile({
        name: sanitizedName,
        email: sanitizedEmail,
        password: profilePassword === '••••••••' ? undefined : profilePassword
      });

      if (response.success) {
        setSaveSuccess(true);
        if (onUpdateUser) {
          onUpdateUser({
            ...user,
            name: sanitizedName,
            email: sanitizedEmail
          });
        }
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      setValidationError('Erro ao conectar com o servidor para atualizar os dados.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSimulateUpgrade = async () => {
    setIsUpdating(true);
    try {
      const response = await DB_API.upgradeSubscription();
      if (response.success) {
        setPlan('Pro');
        
        // Sync upgrade in the parent user object
        if (onUpdateUser) {
          onUpdateUser({
            ...user,
            plan: 'Pro'
          });
        }

        // Add a new invoice line to billing history
        const newInvoice = {
          id: `INV-2026-00${invoices.length + 1}`,
          date: new Date().toLocaleDateString('pt-BR'),
          desc: "Upgrade para Plano Pro (Mensal)",
          val: "$19.00",
          status: "Pago"
        };
        setInvoices([newInvoice, ...invoices]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogoutClick = () => {
    if (onLogOut) onLogOut();
    if (setActiveTab) setActiveTab('assets');
  };

  const menuItems = [
    { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'products', label: 'Meus Produtos', icon: Download },
    { id: 'subscription', label: 'Minha Assinatura', icon: CreditCard },
    { id: 'profile', label: 'Meus Dados', icon: User }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--bg-color)', 
      color: 'var(--text-color)', 
      fontFamily: 'var(--font-body)', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      
      {/* 1. Header do Painel */}
      <header style={{
        height: '70px',
        backgroundColor: 'var(--card-bg)',
        borderBottom: '1px dotted var(--border-color-dotted)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Mobile menu toggle */}
          <button 
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '4px'
            }}
            className="mobile-toggle-btn"
          >
            <Menu size={20} />
          </button>

          {/* Logo Designali */}
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            onClick={() => setActiveTab('assets')}
          >
            <div style={{
              width: '12px', 
              height: '20px', 
              backgroundColor: '#ff003c',
              borderTopRightRadius: '10px',
              borderBottomRightRadius: '10px'
            }} />
            <span style={{ 
              fontFamily: 'var(--font-heading)', 
              fontWeight: 700, 
              fontSize: '1rem', 
              color: 'var(--text-color)',
              letterSpacing: '-0.02em'
            }}>
              Designali
            </span>
            <span style={{
              fontSize: '0.65rem',
              backgroundColor: 'rgba(255,255,255,0.06)',
              color: '#a8a29e',
              padding: '2px 8px',
              borderRadius: '9999px',
              border: '1px solid rgba(255,255,255,0.04)',
              fontWeight: 600
            }}>
              Painel do Cliente
            </span>
          </div>
        </div>

        {/* User profile actions */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowAvatarDropdown(!showAvatarDropdown)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '4px 8px',
              borderRadius: '9999px',
              transition: 'background-color 0.2s ease'
            }}
            className="hover-bg-stone-900"
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#9EFF00',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              fontWeight: 700,
              fontSize: '0.9rem'
            }}>
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="Avatar" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80';
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                profileName ? profileName.charAt(0).toUpperCase() : 'U'
              )}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-color)', fontWeight: 500 }} className="desktop-only">
              {profileName || 'Visitante'}
            </span>
            <ChevronDown size={14} style={{ color: '#a8a29e', transform: showAvatarDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} className="desktop-only" />
          </button>
 
          {/* User actions dropdown */}
          {showAvatarDropdown && (
            <>
              <div 
                onClick={() => setShowAvatarDropdown(false)}
                style={{ position: 'fixed', inset: 0, zIndex: 110 }}
              />
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                backgroundColor: '#090909',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                width: '200px',
                padding: '6px',
                zIndex: 120,
                boxShadow: '0 10px 25px rgba(0,0,0,0.6)'
              }}>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ fontSize: '0.75rem', color: '#a8a29e', wordBreak: 'break-all' }}>{profileEmail}</p>
                </div>
                <button 
                  onClick={() => {
                    setActiveTab('assets');
                    setShowAvatarDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 12px',
                    background: 'none',
                    border: 'none',
                    color: '#fafaf9',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    transition: 'var(--transition-smooth)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  className="hover-bg-stone-900"
                >
                  <ArrowLeft size={13} />
                  <span>Voltar ao Catálogo</span>
                </button>
                <button 
                  onClick={handleLogoutClick}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 12px',
                    background: 'none',
                    border: 'none',
                    color: '#ff0055',
                    fontSize: '0.75rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  className="hover-bg-stone-900"
                >
                  <LogOut size={13} />
                  <span>Sair (Logout)</span>
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* 2. Corpo do Painel */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        
        {/* Sidebar Esquerda (Navegação Desktop) */}
        <aside 
          style={{
            width: '260px',
            backgroundColor: 'var(--card-bg)',
            borderRight: '1px dotted var(--border-color-dotted)',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'sticky',
            top: '70px',
            height: 'calc(100vh - 70px)'
          }}
          className="desktop-sidebar"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = currentSubTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentSubTab(item.id)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: isActive ? 'rgba(158, 255, 0, 0.06)' : 'transparent',
                    color: isActive ? '#9EFF00' : '#a8a29e',
                    border: 'none',
                    borderLeft: isActive ? '3px solid #9EFF00' : '3px solid transparent',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: isActive ? 600 : 500,
                    textAlign: 'left',
                    transition: 'var(--transition-smooth)'
                  }}
                  className={isActive ? "" : "hover-sidebar-link"}
                >
                  <Icon size={16} style={{ color: isActive ? '#9EFF00' : 'inherit' }} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Rodapé da Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              onClick={() => setActiveTab('assets')}
              style={{
                width: '100%',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: 'transparent',
                color: '#fafaf9',
                border: '1px dotted rgba(255,255,255,0.15)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 500,
                textAlign: 'left',
                transition: 'var(--transition-smooth)'
              }}
              className="hover-bg-stone-900"
            >
              <ArrowLeft size={16} />
              <span>Voltar ao Catálogo</span>
            </button>

            <button 
              onClick={handleLogoutClick}
              style={{
                width: '100%',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: 'transparent',
                color: '#a8a29e',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 500,
                textAlign: 'left',
                transition: 'var(--transition-smooth)'
              }}
              className="hover-bg-stone-900"
            >
              <LogOut size={16} />
              <span>Sair da Conta</span>
            </button>
          </div>
        </aside>

        {/* Sidebar Mobile Overlay Menu */}
        {mobileSidebarOpen && (
          <>
            <div 
              onClick={() => setMobileSidebarOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(4px)',
                zIndex: 140
              }}
            />
            <aside style={{
              position: 'fixed',
              left: 0,
              top: 0,
              bottom: 0,
              width: '260px',
              backgroundColor: 'var(--card-bg)',
              borderRight: '1px dotted var(--border-color-dotted)',
              zIndex: 150,
              padding: '24px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '10px 0 30px rgba(0,0,0,0.5)'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#a8a29e' }}>MENU</span>
                  <button 
                    onClick={() => setMobileSidebarOpen(false)}
                    style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
                  >
                    <X size={20} />
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {menuItems.map(item => {
                    const Icon = item.icon;
                    const isActive = currentSubTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentSubTab(item.id);
                          setMobileSidebarOpen(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          backgroundColor: isActive ? 'rgba(158, 255, 0, 0.06)' : 'transparent',
                          color: isActive ? '#9EFF00' : '#a8a29e',
                          border: 'none',
                          borderLeft: isActive ? '3px solid #9EFF00' : '3px solid transparent',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: isActive ? 600 : 500,
                          textAlign: 'left',
                          transition: 'var(--transition-smooth)'
                        }}
                      >
                        <Icon size={16} style={{ color: isActive ? '#9EFF00' : 'inherit' }} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button 
                  onClick={() => {
                    setActiveTab('assets');
                    setMobileSidebarOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: 'transparent',
                    color: '#fafaf9',
                    border: '1px dotted rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    textAlign: 'left'
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>Voltar ao Catálogo</span>
                </button>
                <button 
                  onClick={handleLogoutClick}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: 'transparent',
                    color: '#a8a29e',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    textAlign: 'left'
                  }}
                >
                  <LogOut size={16} />
                  <span>Sair da Conta</span>
                </button>
              </div>
            </aside>
          </>
        )}

        {/* 3. Conteúdo Principal */}
        <main style={{
          flex: 1,
          padding: '40px 24px',
          backgroundColor: 'var(--bg-color)',
          overflowY: 'auto'
        }} className="content-area">
          <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
            
            {/* SUB TAB: VISÃO GERAL */}
            {currentSubTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Welcome Card */}
                <div 
                  className="glass-panel"
                  style={{
                    padding: '36px',
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    backgroundImage: 'linear-gradient(135deg, #090909 0%, #161513 100%)',
                    textAlign: 'left',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div className="radial-glow-gold" style={{ opacity: 0.1, top: '-50px', right: '-50px' }} />
                  <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, color: '#ffffff', marginBottom: '12px', lineHeight: 1.1 }}>
                    Olá, {profileName}! Pronto para criar hoje?
                  </h1>
                  <p style={{ fontSize: '0.9rem', color: '#a8a29e', maxWidth: '600px', lineHeight: 1.6 }}>
                    Aproveite os recursos de mockups, prompts e tipografia da Designali para elevar seus projetos visuais ao próximo nível.
                  </p>
                  <button 
                    onClick={() => setActiveTab('assets')}
                    style={{
                      backgroundColor: '#9EFF00',
                      color: '#000000',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '9999px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      marginTop: '20px',
                      transition: 'var(--transition-smooth)'
                    }}
                    className="hover-translate"
                  >
                    Navegar pelo Catálogo
                  </button>
                </div>

                {/* Métricas Rápidas Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '20px'
                }}>
                  {/* Metric 1 */}
                  <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', border: '1px dotted var(--border-color-dotted)', display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left' }}>
                    <div style={{
                      backgroundColor: 'rgba(158, 255, 0, 0.1)',
                      color: 'var(--accent-color, #adfa1d)',
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Download size={22} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-color)', display: 'block' }}>
                        {purchasedAssets.length}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.02em' }}>
                        Downloads Efetuados
                      </span>
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', border: '1px dotted var(--border-color-dotted)', display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left' }}>
                    <div style={{
                      backgroundColor: plan === 'Pro' ? 'rgba(158, 255, 0, 0.1)' : 'rgba(255, 0, 85, 0.1)',
                      color: plan === 'Pro' ? 'var(--accent-color, #adfa1d)' : '#ff0055',
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Sparkles size={22} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-color)', display: 'block' }}>
                        Plano {plan}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.02em' }}>
                        Status de Assinatura
                      </span>
                    </div>
                  </div>

                  {/* Metric 3 */}
                  <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', border: '1px dotted var(--border-color-dotted)', display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left' }}>
                    <div style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: 'var(--text-muted)',
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <HardDrive size={22} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-color)', display: 'block' }}>
                        1.2 GB / 5 GB
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.02em' }}>
                        Cloud Mockups Usados
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ultimas Atividades / Atalhos */}
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', color: '#ffffff' }}>
                    {purchasedAssets.length > 0 ? 'Últimos Recursos Baixados' : 'Sugestões de Recursos'}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {displayAssets.map(asset => (
                      <div 
                        key={asset.id}
                        className="glass-panel"
                        style={{
                          padding: '12px 18px',
                          borderRadius: '12px',
                          border: '1px solid rgba(255,255,255,0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-start' }}>
                          <img 
                            src={(asset.images && asset.images[0]) ? asset.images[0] : ''} 
                            alt={asset.title} 
                            onError={handleImageError}
                            style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: '6px' }}
                          />
                          <div>
                            <strong style={{ fontSize: '0.85rem', color: '#ffffff', display: 'block' }}>{asset.title}</strong>
                            <span style={{ fontSize: '0.7rem', color: '#a8a29e' }}>{asset.category} • por {asset.author}</span>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => onSelectAsset(asset)}
                            style={{
                              background: 'none',
                              border: '1px solid rgba(255,255,255,0.1)',
                              color: '#ffffff',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '0.7rem',
                              fontWeight: 500,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              transition: 'var(--transition-smooth)'
                            }}
                            className="hover-bg-stone-900"
                          >
                            <Eye size={12} />
                            <span>Visualizar</span>
                          </button>
                          <a 
                            href={asset.downloadLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              backgroundColor: '#9EFF00',
                              color: '#000000',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              textDecoration: 'none',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Download size={12} />
                            <span>Download</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* SUB TAB: MEUS PRODUTOS */}
            {currentSubTab === 'products' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>Meus Produtos</h2>
                  <p style={{ fontSize: '0.85rem', color: '#a8a29e', marginTop: '4px' }}>
                    Acesse o histórico de arquivos e recursos adquiridos em sua conta.
                  </p>
                </div>

                {purchasedAssets.length === 0 ? (
                  /* Elegant Empty State */
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px 24px',
                    borderRadius: '16px',
                    backgroundColor: '#090909',
                    border: '1px dotted rgba(255, 255, 255, 0.1)',
                    textAlign: 'center',
                    marginTop: '16px'
                  }}>
                    <div style={{
                      backgroundColor: 'rgba(158, 255, 0, 0.05)',
                      border: '1px solid rgba(158, 255, 0, 0.15)',
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#9EFF00',
                      marginBottom: '20px'
                    }}>
                      <Download size={28} />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                      Nenhum recurso baixado ainda
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#a8a29e', maxWidth: '340px', lineHeight: 1.5, marginBottom: '24px' }}>
                      Explore nosso catálogo e faça o download de mockups, ícones, fontes e muito mais para começar a criar.
                    </p>
                    <button 
                      onClick={() => setActiveTab('assets')}
                      style={{
                        backgroundColor: '#9EFF00',
                        color: '#000000',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '9999px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'var(--transition-smooth)'
                      }}
                      className="hover-translate"
                    >
                      Explorar Recursos Gratuitos
                    </button>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
                    gap: '24px',
                    padding: '12px 0'
                  }}>
                    {purchasedAssets.map(asset => (
                      <div 
                        key={asset.id}
                        style={{
                          borderRadius: '16px',
                          border: '1px solid rgba(255,255,255,0.06)',
                          backgroundColor: '#090909',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          height: '100%'
                        }}
                        className="glass-panel hover-border-lime"
                      >
                        <div>
                          {/* Imagem Box */}
                          <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', position: 'relative' }}>
                            <img 
                              src={(asset.images && asset.images[0]) ? asset.images[0] : ''} 
                              alt={asset.title} 
                              onError={handleImageError}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <span style={{
                              position: 'absolute',
                              top: '12px',
                              left: '12px',
                              backgroundColor: 'rgba(0,0,0,0.7)',
                              color: '#ffffff',
                              fontSize: '0.65rem',
                              fontWeight: 600,
                              padding: '4px 10px',
                              borderRadius: '9999px',
                              backdropFilter: 'blur(4px)',
                              border: '1px solid rgba(255,255,255,0.05)'
                            }}>
                              {asset.category}
                            </span>
                          </div>

                          {/* Corpo do card */}
                          <div style={{ padding: '16px' }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.3, marginBottom: '6px' }}>
                              {asset.title}
                            </h4>
                            <p style={{ fontSize: '0.75rem', color: '#a8a29e' }}>
                              Desenvolvido por {asset.author}
                            </p>
                          </div>
                        </div>

                        {/* Ações */}
                        <div style={{ padding: '0 16px 16px 16px', display: 'flex', gap: '8px' }}>
                          <a 
                            href={asset.downloadLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              flex: 1,
                              backgroundColor: '#9EFF00',
                              color: '#000000',
                              border: 'none',
                              padding: '10px',
                              borderRadius: '8px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              textDecoration: 'none',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              transition: 'var(--transition-smooth)'
                            }}
                            className="hover-translate"
                          >
                            <Download size={14} />
                            <span>Baixar Novamente</span>
                          </a>

                          <button 
                            onClick={() => onSelectAsset(asset)}
                            style={{
                              background: 'none',
                              border: '1px solid rgba(255,255,255,0.08)',
                              color: '#fafaf9',
                              padding: '10px',
                              borderRadius: '8px',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              cursor: 'pointer',
                              transition: 'var(--transition-smooth)'
                            }}
                            className="hover-bg-stone-900"
                            title="Detalhes"
                          >
                            <FileText size={14} />
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SUB TAB: MINHA ASSINATURA */}
            {currentSubTab === 'subscription' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', textAlign: 'left' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>Minha Assinatura</h2>
                  <p style={{ fontSize: '0.85rem', color: '#a8a29e', marginTop: '4px' }}>
                    Gerencie seu plano de acesso, faturamento e método de pagamento.
                  </p>
                </div>

                {/* Banner de Status do Plano */}
                {plan === 'Free' ? (
                  /* Banner Upgrade Estético Rosa/Neon */
                  <div style={{
                    padding: '36px',
                    borderRadius: '20px',
                    backgroundImage: 'linear-gradient(90deg, #ff0055 0%, #7000ff 100%)',
                    boxShadow: '0 8px 32px rgba(255, 0, 85, 0.15)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                      background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)',
                      pointerEvents: 'none'
                    }} />
                    
                    <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <span style={{
                        backgroundColor: 'rgba(255,255,255,0.12)',
                        color: '#ffffff',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        width: 'fit-content',
                        letterSpacing: '0.04rem',
                        textTransform: 'uppercase',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        Plano Atual: Free
                      </span>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>Liberte sua criatividade com o Plano Pro!</h3>
                      <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', maxWidth: '560px', lineHeight: 1.5 }}>
                        Faça o upgrade para obter downloads ilimitados de todos os mockups, ícones e fontes curadas, sem limites diários.
                      </p>
                      
                      <button 
                        onClick={handleSimulateUpgrade}
                        disabled={isUpdating}
                        style={{
                          backgroundColor: '#ffffff',
                          color: '#000000',
                          border: 'none',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          marginTop: '12px',
                          width: 'fit-content',
                          transition: 'var(--transition-smooth)',
                          boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
                        }}
                        className="hover-translate btn-upgrade-pro"
                      >
                        {isUpdating ? 'Processando...' : 'Simular Upgrade Pro (US$ 19/mês)'}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Banner Premium Plano Ativo Verde-Limão */
                  <div style={{
                    padding: '36px',
                    borderRadius: '20px',
                    backgroundColor: '#090909',
                    border: '1px solid #9EFF00',
                    boxShadow: '0 8px 32px rgba(158, 255, 0, 0.05)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          backgroundColor: 'rgba(158, 255, 0, 0.1)',
                          color: '#9EFF00',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          border: '1px solid rgba(158, 255, 0, 0.15)',
                          textTransform: 'uppercase'
                        }}>
                          Assinatura Ativa
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#a8a29e' }}>Plano Designali Pro</span>
                      </div>
                      
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>Seu Plano Pro está ativo!</h3>
                      <p style={{ fontSize: '0.85rem', color: '#a8a29e', maxWidth: '560px', lineHeight: 1.5 }}>
                        Obrigado por apoiar a nossa comunidade! Você tem acesso ilimitado a todas as ferramentas e mockups.
                      </p>

                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                        gap: '16px', 
                        marginTop: '16px',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                        paddingTop: '16px'
                      }}>
                        <div>
                          <span style={{ fontSize: '0.65rem', color: '#a8a29e', display: 'block', textTransform: 'uppercase' }}>Próxima Renovação</span>
                          <strong style={{ fontSize: '0.9rem', color: '#ffffff' }}>30 de Junho de 2026</strong>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.65rem', color: '#a8a29e', display: 'block', textTransform: 'uppercase' }}>Método de Pagamento</span>
                          <strong style={{ fontSize: '0.9rem', color: '#ffffff' }}>Cartão de Crédito (•••• 4242)</strong>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.65rem', color: '#a8a29e', display: 'block', textTransform: 'uppercase' }}>Valor Cobrado</span>
                          <strong style={{ fontSize: '0.9rem', color: '#ffffff' }}>$19.00 / mês</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Histórico de Faturamento */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', color: '#ffffff' }}>Histórico de Faturamento</h3>
                  
                  <div style={{ overflowX: 'auto' }} className="glass-panel rounded-lg">
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                          <th style={{ padding: '14px 18px', color: '#a8a29e', fontWeight: 600 }}>Invoice ID</th>
                          <th style={{ padding: '14px 18px', color: '#a8a29e', fontWeight: 600 }}>Data</th>
                          <th style={{ padding: '14px 18px', color: '#a8a29e', fontWeight: 600 }}>Descrição</th>
                          <th style={{ padding: '14px 18px', color: '#a8a29e', fontWeight: 600 }}>Valor</th>
                          <th style={{ padding: '14px 18px', color: '#a8a29e', fontWeight: 600 }}>Status</th>
                          <th style={{ padding: '14px 18px', color: '#a8a29e', fontWeight: 600, textAlign: 'right' }}>Recibo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map((inv) => (
                          <tr key={inv.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }} className="hover-bg-stone-900">
                            <td style={{ padding: '14px 18px', color: '#ffffff', fontWeight: 600 }}>{inv.id}</td>
                            <td style={{ padding: '14px 18px', color: '#a8a29e' }}>{inv.date}</td>
                            <td style={{ padding: '14px 18px', color: '#ffffff' }}>{inv.desc}</td>
                            <td style={{ padding: '14px 18px', color: '#ffffff', fontWeight: 600 }}>{inv.val}</td>
                            <td style={{ padding: '14px 18px' }}>
                              <span style={{
                                backgroundColor: 'rgba(158, 255, 0, 0.1)',
                                color: '#9EFF00',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '0.65rem',
                                fontWeight: 700
                              }}>
                                {inv.status}
                              </span>
                            </td>
                            <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                              <button 
                                onClick={() => alert(`Baixando recibo ${inv.id}...`)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#a8a29e',
                                  cursor: 'pointer',
                                  padding: '4px',
                                  borderRadius: '4px',
                                  transition: 'color 0.2s'
                                }}
                                className="hover-color-white"
                              >
                                <FileText size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* SUB TAB: MEUS DADOS */}
            {currentSubTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', textAlign: 'left' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>Meus Dados</h2>
                  <p style={{ fontSize: '0.85rem', color: '#a8a29e', marginTop: '4px' }}>
                    Mantenha suas informações pessoais e preferências de conta atualizadas.
                  </p>
                </div>

                {validationError && (
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#ff0055',
                    backgroundColor: 'rgba(255, 0, 85, 0.1)',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 0, 85, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px'
                  }}>
                    <AlertCircle size={16} />
                    <span>{validationError}</span>
                  </div>
                )}

                {saveSuccess && (
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#9EFF00',
                    backgroundColor: 'rgba(158, 255, 0, 0.1)',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(158, 255, 0, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px'
                  }}>
                    <Check size={16} />
                    <span>Seus dados foram atualizados com sucesso!</span>
                  </div>
                )}

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
                  gap: '32px'
                }} className="md:grid-cols-3">
                  
                  {/* Formulário (Col 1 e 2) */}
                  <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="md:col-span-2">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="mobile-stack">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.75rem', color: '#a8a29e', fontWeight: 600 }}>Nome Completo</label>
                        <input 
                          type="text"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="input-ali"
                          required
                          disabled={isUpdating}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.75rem', color: '#a8a29e', fontWeight: 600 }}>E-mail</label>
                        <input 
                          type="email"
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          className="input-ali"
                          required
                          disabled={isUpdating}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.75rem', color: '#a8a29e', fontWeight: 600 }}>Nova Senha</label>
                      <input 
                        type="password"
                        value={profilePassword}
                        onChange={(e) => setProfilePassword(e.target.value)}
                        className="input-ali"
                        disabled={isUpdating}
                        placeholder="Deixe em branco para não alterar"
                      />
                    </div>

                    {/* Preferências */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>Preferências de Notificação</h4>
                      
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.8rem', color: '#a8a29e' }}>
                        <input 
                          type="checkbox"
                          checked={notifNewResources}
                          onChange={(e) => setNotifNewResources(e.target.checked)}
                          disabled={isUpdating}
                          style={{
                            accentColor: '#9EFF00',
                            width: '16px',
                            height: '16px',
                            cursor: 'pointer'
                          }}
                        />
                        <span>Notificar-me por e-mail quando novos recursos de design (mockups/fontes) forem lançados.</span>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.8rem', color: '#a8a29e' }}>
                        <input 
                          type="checkbox"
                          checked={notifWeeklyNewsletter}
                          onChange={(e) => setNotifWeeklyNewsletter(e.target.checked)}
                          disabled={isUpdating}
                          style={{
                            accentColor: '#9EFF00',
                            width: '16px',
                            height: '16px',
                            cursor: 'pointer'
                          }}
                        />
                        <span>Receber newsletter semanal com curadoria de designs do time da Designali.</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isUpdating}
                      style={{
                        backgroundColor: '#9EFF00',
                        color: '#000000',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        width: 'fit-content',
                        marginTop: '10px',
                        transition: 'var(--transition-smooth)'
                      }}
                      className="hover-translate"
                    >
                      {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                  </form>

                  {/* Foto de Perfil (Col 3) */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <h4 style={{ fontSize: '0.75rem', color: '#a8a29e', fontWeight: 600, width: '100%' }}>Foto de Perfil</h4>
                    
                    <div style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      border: '2px solid rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      fontSize: '3rem',
                      fontWeight: 800,
                      color: '#9EFF00',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
                    }}>
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt="Avatar do Usuário" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80';
                          }}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        profileName ? profileName.charAt(0).toUpperCase() : 'U'
                      )}
                    </div>

                    <button 
                      onClick={() => alert('Mock: upload de imagem de perfil iniciado...')}
                      style={{
                        background: 'none',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: '#fafaf9',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'var(--transition-smooth)'
                      }}
                      className="hover-bg-stone-900"
                    >
                      Alterar Foto
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Estilos Inline CSS do Painel */}
      <style>{`
        /* Desktop sidebar layout adjustments */
        @media (max-width: 768px) {
          .desktop-sidebar {
            display: none !important;
          }
          .mobile-toggle-btn {
            display: block !important;
          }
          .desktop-only {
            display: none !important;
          }
          .mobile-stack {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 769px) {
          .md\\:grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
          .md\\:col-span-2 {
            grid-column: span 2 / span 2 !important;
          }
        }
        
        /* Accessibility Focus States */
        .input-ali:focus {
          outline: 2px solid #9EFF00 !important;
          outline-offset: 2px !important;
          border-color: #9EFF00 !important;
          box-shadow: none !important;
        }
        button:focus-visible, a:focus-visible, input:focus-visible {
          outline: 2px solid #9EFF00 !important;
          outline-offset: 2px !important;
        }
        
        /* Loading & Disabled cursor styles */
        button:disabled, input:disabled {
          opacity: 0.6 !important;
          cursor: not-allowed !important;
        }
        
        /* Upgrade Button Hover State */
        .btn-upgrade-pro:hover {
          background-color: #9EFF00 !important;
          color: #000000 !important;
          box-shadow: 0 0 15px rgba(158, 255, 0, 0.4) !important;
        }
        
        /* Smooth hovers */
        .hover-sidebar-link:hover {
          color: #ffffff !important;
          background-color: rgba(255,255,255,0.02) !important;
        }
        .hover-bg-stone-900:hover {
          background-color: #1c1917 !important;
        }
        .hover-color-white:hover {
          color: #ffffff !important;
        }
        
        /* Borda verde-limão neon em hover nos cards de mockups */
        .hover-border-lime {
          transition: border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .hover-border-lime:hover {
          border-color: #9EFF00 !important;
          transform: translateY(-4px) !important;
          box-shadow: 0 10px 30px rgba(158, 255, 0, 0.04) !important;
        }
      `}</style>

    </div>
  );
}
