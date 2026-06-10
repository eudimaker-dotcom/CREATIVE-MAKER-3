import React, { useState, useEffect } from 'react';
import AssetCard from './AssetCard';
import { Loader2 } from 'lucide-react';

export default function AssetGrid({ assets, onSelect, onPurchase, user, onSelectAuthor, favoritesList, onToggleFavorite, columnCount }) {
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);
  const [loadingMore, setLoadingMore] = useState(false);

  // Trigger skeleton animation on assets changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [assets]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 4);
      setLoadingMore(false);
    }, 600);
  };

  const isFavorited = (id) => favoritesList && favoritesList.includes(id);

  if (isLoading) {
    return (
      <section className="container-dalim" style={{ paddingBottom: '80px' }}>
        <div className={`grid-container grid-cols-${columnCount || 5}`}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton-card skeleton-pulse">
              <div className="skeleton-image" />
              <div className="skeleton-content">
                <div className="skeleton-line" style={{ width: '40%' }} />
                <div className="skeleton-line" style={{ width: '90%', height: '18px' }} />
                <div className="skeleton-line" style={{ width: '60%', marginTop: 'auto' }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="container-dalim text-center" style={{ padding: '60px 24px', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: '0.9rem' }}>No assets found matching your search or filters.</p>
      </div>
    );
  }

  const visibleAssets = assets.slice(0, visibleCount);
  const hasMore = assets.length > visibleCount;

  return (
    <section className="container-dalim" style={{ paddingBottom: '80px' }}>
      
      {/* Grid container cards */}
      <div className={`grid-container grid-cols-${columnCount || 5}`}>
        {visibleAssets.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            onSelect={onSelect}
            onPurchase={onPurchase}
            user={user}
            onSelectAuthor={onSelectAuthor}
            onToggleFavorite={onToggleFavorite}
            isFavorited={isFavorited(asset.id)}
          />
        ))}
      </div>

      {/* Infinite Scroll/Load More Loader */}
      {hasMore && (
        <div className="flex-center" style={{ marginTop: '20px' }}>
          <button 
            onClick={handleLoadMore}
            className="btn-dotted-link"
            style={{ padding: '12px 32px', gap: '8px', minWidth: '160px', justifyContent: 'center' }}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Loading Assets...</span>
              </>
            ) : (
              <span>Load More resources</span>
            )}
          </button>
        </div>
      )}

      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
