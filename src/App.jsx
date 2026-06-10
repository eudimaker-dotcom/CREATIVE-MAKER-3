import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import { authService } from './supabase';


// Modals
import AuthModal from './components/AuthModal';
import PaymentModal from './components/PaymentModal';
import AssetDetailModal from './components/AssetDetailModal';

// Sub views
import PromptMarketplace from './components/PromptMarketplace';
import ImageGenerator from './components/ImageGenerator';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile';
import FontsGallery from './components/FontsGallery';
import AssetCard from './components/AssetCard';

// New Pages
import GraficosPage from './components/GraficosPage';
import TemplatesPage from './components/TemplatesPage';
import AssetsPage from './components/AssetsPage';
import ImagesPage from './components/ImagesPage';
import UploadPage from './components/UploadPage';
import CanvasBackground from './components/CanvasBackground';
import SearchPage from './components/SearchPage';
import HomePage from './components/HomePage';

import { Copy, Check, Download } from 'lucide-react';

// Mock Data
import { assetsData, designersData, mockFonts, promptsData } from './mockData';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Navigation helper
  const navigate = (path) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Popstate listener to support browser Back/Forward
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [columnCount, setColumnCount] = useState(5);
  
  // Dynamic state database mapping custom uploads
  const [dbAssets, setDbAssets] = useState(assetsData);
  const [favoritesList, setFavoritesList] = useState([]);
  
  // Modals state
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [checkoutAsset, setCheckoutAsset] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  // Theme, User, and Active profiles state
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedDesigner, setSelectedDesigner] = useState(null);

  // Featured Fonts state & actions
  const [copiedFontId, setCopiedFontId] = useState(null);
  const handleCopyFontCode = (fontName, id) => {
    navigator.clipboard.writeText(`font-family: "${fontName}", sans-serif;`);
    setCopiedFontId(id);
    setTimeout(() => setCopiedFontId(null), 2000);
  };

  // Featured Prompts state & actions
  const [copiedPromptId, setCopiedPromptId] = useState(null);
  const handleCopyPrompt = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };


  // Load active session on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Failed to load user session:', err);
      }
    };
    loadSession();

    // Listen to Supabase auth changes if real Supabase client is active
    if (authService.isRealSupabase && authService.supabase) {
      const { data: { subscription } } = authService.supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setUser({
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email.split('@')[0],
            downloads: session.user.user_metadata?.downloads || []
          });
        } else {
          setUser(null);
        }
      });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  // Sync dark mode class with DOM element
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Keep favoritesList in sync with user's persisted favorites
  useEffect(() => {
    if (user) {
      setFavoritesList(user.favorites || []);
    } else {
      setFavoritesList([]);
    }
  }, [user]);



  // Log in simulation handler
  const handleLoginSuccess = (userData) => {
    setUser({
      ...userData,
      downloads: userData.downloads || [],
      favorites: userData.favorites || [],
      collections: userData.collections || [],
      recentActivity: userData.recentActivity || []
    });
    setFavoritesList(userData.favorites || []);
  };

  const handleLogOut = async () => {
    try {
      await authService.signOut();
    } catch (err) {
      console.error('Error logging out:', err);
    }
    setUser(null);
    setFavoritesList([]);
    navigate('/graficos');
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      await authService.updateCurrentUser(updatedUser);
      setUser(updatedUser);
    } catch (err) {
      console.error('Error updating user metadata:', err);
      setUser(updatedUser);
    }
  };

  // Activity tracking helper
  const handleTrackActivity = async (itemId, type) => {
    if (!user) return;
    const timestamp = new Date().toISOString();
    const newActivity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      itemId,
      type,
      timestamp
    };
    
    // Avoid spamming duplicate actions for the same item/type in activity log
    const prevActivity = user.recentActivity || [];
    const filtered = prevActivity.filter(act => !(act.itemId === itemId && act.type === type));
    const recentActivity = [newActivity, ...filtered].slice(0, 20);

    const updatedUser = {
      ...user,
      recentActivity
    };
    setUser(updatedUser);
    await handleUpdateUser(updatedUser);
  };

  // Track asset views
  useEffect(() => {
    if (selectedAsset) {
      handleTrackActivity(selectedAsset.id, 'view');
    }
  }, [selectedAsset]);

  // Stripe checkout purchase simulator success handler
  const handlePaymentSuccess = async (asset) => {
    if (user) {
      const updatedUser = {
        ...user,
        downloads: [...(user.downloads || []), asset.id]
      };
      setUser(updatedUser);
      await handleUpdateUser(updatedUser);
      await handleTrackActivity(asset.id, 'download');
    }
    // Update downloads counts in the asset list
    setDbAssets(prev => prev.map(item => {
      if (item.id === asset.id) {
        return { ...item, downloads: item.downloads + 1 };
      }
      return item;
    }));
  };

  const handlePurchaseTrigger = (asset) => {
    if (!user) {
      setIsAuthOpen(true);
    } else {
      setCheckoutAsset(asset);
    }
  };

  // Route/Switch to specific designer profile tab
  const handleSelectAuthor = (authorUsername) => {
    const designerObj = designersData.find(d => d.username === authorUsername);
    if (designerObj) {
      setSelectedDesigner(designerObj);
      navigate('/profile');
    }
  };

  // Toggle saving to favorites
  const handleToggleFavorite = async (asset) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    const assetId = asset.id;
    const isFav = favoritesList.includes(assetId);
    
    let updatedFavorites;
    if (isFav) {
      updatedFavorites = favoritesList.filter(id => id !== assetId);
      // Decrease saves count
      setDbAssets(db => db.map(item => item.id === assetId ? { ...item, saves: Math.max(0, (item.saves || 0) - 1) } : item));
    } else {
      updatedFavorites = [...favoritesList, assetId];
      // Increase saves count
      setDbAssets(db => db.map(item => item.id === assetId ? { ...item, saves: (item.saves || 0) + 1 } : item));
      // Track save action
      setTimeout(() => handleTrackActivity(assetId, 'save'), 100);
    }
    
    setFavoritesList(updatedFavorites);
    
    const updatedUser = {
      ...user,
      favorites: updatedFavorites
    };
    setUser(updatedUser);
    await handleUpdateUser(updatedUser);
  };

  // Dynamic publishing logic handler
  const handlePublishAsset = (newAsset) => {
    setDbAssets(prev => [newAsset, ...prev]);
  };

  const handleDashboardSetActiveTab = (tab) => {
    if (tab === 'assets') {
      navigate('/graficos');
    } else {
      navigate('/' + tab);
    }
  };

  return (
    <div className="main-layout">
      {/* Interactive Background Canvas (only on Home/Gráficos page) */}
      {(currentPath === '/' || currentPath === '/graficos') && <CanvasBackground />}
      
      {/* Navigation Layer */}
      {currentPath !== '/dashboard' && (
        <Navbar 
          currentPath={currentPath}
          navigate={navigate}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenAuth={() => setIsAuthOpen(true)}
          user={user}
          onLogOut={handleLogOut}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
      )}

      <main className="content-wrapper">
        {(currentPath === '/graficos' || currentPath === '/') && (
          <>
            {/* Hero Banner Area */}
            <Hero 
              onOpenAuth={() => setIsAuthOpen(true)}
              user={user}
              navigate={navigate}
            />

            {/* Render HomePage on Root path, GraficosPage on /graficos path */}
            {currentPath === '/' ? (
              <HomePage
                dbAssets={dbAssets}
                onSelectAsset={setSelectedAsset}
                onPurchase={handlePurchaseTrigger}
                favoritesList={favoritesList}
                onToggleFavorite={handleToggleFavorite}
                user={user}
                navigate={navigate}
              />
            ) : (
              <GraficosPage
                onOpenAuth={() => setIsAuthOpen(true)}
                user={user}
                onSelectAsset={setSelectedAsset}
                onPurchase={handlePurchaseTrigger}
                favoritesList={favoritesList}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {/* Register Call to action */}
            <CTASection 
              onOpenAuth={() => setIsAuthOpen(true)}
              user={user}
              setActiveTab={(tab) => navigate('/' + (tab === 'generator' ? 'studio-ai' : tab))}
            />
          </>
        )}

        {/* Templates Page */}
        {currentPath === '/templates' && (
          <TemplatesPage 
            onOpenAuth={() => setIsAuthOpen(true)}
            user={user}
            favoritesList={favoritesList}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {/* Fonts specimen gallery */}
        {currentPath === '/fontes' && (
          <FontsGallery 
            onOpenAuth={() => setIsAuthOpen(true)}
            user={user}
            onPurchase={handlePurchaseTrigger}
            favoritesList={favoritesList}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {/* Assets Page */}
        {currentPath === '/assets' && (
          <AssetsPage 
            onOpenAuth={() => setIsAuthOpen(true)}
            user={user}
            favoritesList={favoritesList}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {/* Imagens Page */}
        {currentPath === '/imagens' && (
          <ImagesPage 
            onOpenAuth={() => setIsAuthOpen(true)}
            user={user}
            favoritesList={favoritesList}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {/* Generative Sandbox AI Studio */}
        {currentPath === '/studio-ai' && (
          <ImageGenerator user={user} />
        )}

        {/* Search Results Page */}
        {currentPath === '/pesquisa' && (
          <SearchPage 
            query={searchQuery}
            dbAssets={dbAssets}
            onSelectAsset={setSelectedAsset}
            onPurchase={handlePurchaseTrigger}
            favoritesList={favoritesList}
            onToggleFavorite={handleToggleFavorite}
            user={user}
          />
        )}

        {/* Upload Custom Resource Page */}
        {currentPath === '/upload' && (
          <UploadPage 
            onOpenAuth={() => setIsAuthOpen(true)}
            user={user}
            onPublishAsset={handlePublishAsset}
            navigate={navigate}
          />
        )}

        {/* User profile view */}
        {currentPath === '/profile' && selectedDesigner && (
          <UserProfile 
            designer={selectedDesigner}
            assets={dbAssets}
            onSelectAsset={setSelectedAsset}
            onPurchase={handlePurchaseTrigger}
            user={user}
          />
        )}

        {/* User dashboard settings */}
        {currentPath === '/dashboard' && user && (
          <Dashboard 
            user={user} 
            onSelectAsset={setSelectedAsset}
            favoritesList={favoritesList}
            onLogOut={handleLogOut}
            setActiveTab={handleDashboardSetActiveTab}
            onUpdateUser={handleUpdateUser}
          />
        )}
      </main>

      {/* Dotted border Footer */}
      <Footer />

      {/* MODALS RENDER OVERLAYS */}
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <PaymentModal 
        isOpen={!!checkoutAsset}
        onClose={() => setCheckoutAsset(null)}
        asset={checkoutAsset}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <AssetDetailModal 
        isOpen={!!selectedAsset}
        onClose={() => setSelectedAsset(null)}
        asset={selectedAsset}
        onPurchase={handlePurchaseTrigger}
        user={user}
        onSelectAsset={setSelectedAsset}
        favoritesList={favoritesList}
        onToggleFavorite={handleToggleFavorite}
      />

    </div>
  );
}
