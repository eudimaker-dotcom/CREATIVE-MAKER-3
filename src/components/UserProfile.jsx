import React, { useState } from 'react';
import { Users, Download, Eye } from 'lucide-react';
import AssetCard from './AssetCard';

export default function UserProfile({ designer, assets, onSelectAsset, onPurchase, user }) {
  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(designer.followers);

  const handleFollowToggle = () => {
    if (following) {
      setFollowerCount(prev => prev - 1);
    } else {
      setFollowerCount(prev => prev + 1);
    }
    setFollowing(!following);
  };

  // Find assets published by this specific designer
  const publishedAssets = assets.filter(asset => asset.authorUsername === designer.username);

  return (
    <div className="container-dalim" style={{ padding: '40px 24px 80px 24px' }}>
      
      {/* Cover Banner Cover */}
      <div className="profile-cover-box">
        <img 
          src={designer.banner} 
          alt={`${designer.name} cover`} 
          className="profile-cover-img"
        />
      </div>

      {/* Avatar Container */}
      <div className="profile-avatar-container">
        <img 
          src={designer.avatar} 
          alt={designer.name} 
          className="profile-avatar-img"
        />
      </div>

      {/* Profile Detail Info */}
      <div className="profile-info-section">
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '20px'
        }}>
          <div>
            <div className="flex-center" style={{ gap: '10px', justifyContent: 'flex-start' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{designer.name}</h2>
              <span className="badge-secondary" style={{ backgroundColor: 'var(--accent-color)', color: '#000000', borderColor: 'var(--accent-color)', fontWeight: 600 }}>
                Verified Creator
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              @{designer.username}
            </p>
          </div>

          {/* Follow and Socials */}
          <div className="flex-center" style={{ gap: '12px', flexWrap: 'wrap' }}>
            {/* Social Icons SVGs */}
            <div className="flex-center" style={{ gap: '8px' }}>
              {designer.socials.instagram && (
                <a href={designer.socials.instagram} target="_blank" rel="noreferrer" className="btn-dotted-link" style={{ padding: '8px', borderRadius: '50%' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              )}
              {designer.socials.twitter && (
                <a href={designer.socials.twitter} target="_blank" rel="noreferrer" className="btn-dotted-link" style={{ padding: '8px', borderRadius: '50%' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}
              {designer.socials.github && (
                <a href={designer.socials.github} target="_blank" rel="noreferrer" className="btn-dotted-link" style={{ padding: '8px', borderRadius: '50%' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </a>
              )}
            </div>

            <button
              onClick={handleFollowToggle}
              className={following ? "btn-dotted-link" : "btn-primary-ali hover-translate"}
              style={{ padding: '10px 24px', borderRadius: 'var(--border-radius-md)' }}
            >
              {following ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>

        {/* Bio */}
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '640px', lineHeight: 1.6, marginBottom: '24px' }}>
          {designer.bio}
        </p>

        {/* Statistics Widgets */}
        <div style={{
          display: 'flex',
          gap: '24px',
          padding: '16px 24px',
          borderRadius: 'var(--border-radius-md)',
          backgroundColor: 'var(--card-bg-hover)',
          border: '1px dotted var(--border-color-dotted)',
          maxWidth: '520px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} style={{ color: 'var(--accent-color)' }} />
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Followers</span>
              <strong style={{ fontSize: '0.9rem', fontWeight: 800 }}>{followerCount.toLocaleString()}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '1px dotted var(--border-color-dotted)', paddingLeft: '24px' }}>
            <Download size={16} style={{ color: 'var(--accent-color)' }} />
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Downloads</span>
              <strong style={{ fontSize: '0.9rem', fontWeight: 800 }}>{designer.downloads.toLocaleString()}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '1px dotted var(--border-color-dotted)', paddingLeft: '24px' }}>
            <Eye size={16} style={{ color: 'var(--accent-color)' }} />
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Views</span>
              <strong style={{ fontSize: '0.9rem', fontWeight: 800 }}>{designer.views.toLocaleString()}</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Divider */}
      <div style={{ height: '1px', borderTop: '1px dotted var(--border-color-dotted)', margin: '20px 0 40px 0' }} />

      {/* Title Showcase */}
      <div style={{ textAlign: 'left', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
          Published Resources ({publishedAssets.length})
        </h3>
      </div>

      {/* Assets Grid */}
      {publishedAssets.length === 0 ? (
        <div style={{ color: 'var(--text-muted)', padding: '40px 0' }}>
          <p>No resources published yet by this designer.</p>
        </div>
      ) : (
        <div className="grid-container">
          {publishedAssets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onSelect={onSelectAsset}
              onPurchase={onPurchase}
              user={user}
            />
          ))}
        </div>
      )}

    </div>
  );
}
