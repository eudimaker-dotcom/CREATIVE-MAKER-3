import React from 'react';

export default function CTASection() {
  return (
    <section style={{ padding: '0 24px 80px 24px' }}>
      <style>{`
        @media (max-width: 768px) {
          .cta-flex-container {
            flex-direction: column !important;
            text-align: center !important;
            gap: 24px !important;
          }
          .cta-flex-container > div {
            text-align: center !important;
          }
          .cta-qr-wrapper {
            margin-top: 10px;
          }
        }
      `}</style>
      
      <div className="container-dalim" style={{ maxWidth: '100%' }}>
        <div 
          className="glass-panel"
          style={{
            padding: '30px 40px',
            borderRadius: 'var(--border-radius-lg)',
            border: '1px dotted var(--border-color-dotted)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Glows */}
          <div style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 199, 116, 0.08)',
            top: '-50px',
            left: '-50px',
            filter: 'blur(40px)',
            pointerEvents: 'none'
          }} />

          <div className="cta-flex-container" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '40px',
            position: 'relative',
            zIndex: 1,
            textAlign: 'left'
          }}>
            {/* Left Block */}
            <div style={{ flex: 1 }}>
              {/* Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '9999px',
                border: '1px solid rgba(0, 199, 116, 0.3)',
                backgroundColor: 'rgba(0, 199, 116, 0.08)',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#00c774',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>Comunidade VIP</span>
              </div>

              <h2 style={{ 
                fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', 
                fontWeight: 800, 
                lineHeight: 1.15, 
                marginBottom: '12px',
                color: '#ffffff',
                letterSpacing: '-0.02em'
              }}>
                VENHA FAZER PARTE DA NOSSA COMUNIDADE NO <span className="metallic-text">WHATSAPP</span>
              </h2>

              <p style={{ 
                fontSize: '0.85rem', 
                color: 'var(--text-muted)', 
                marginBottom: '20px', 
                lineHeight: 1.5,
                maxWidth: '540px'
              }}>
                Receba novidades em primeira mão, suporte exclusivo e troque experiências com outros criativos angolanos.
              </p>

              <a 
                href="https://chat.whatsapp.com/invite" 
                target="_blank" 
                rel="noreferrer" 
                className="hover-lift"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  backgroundColor: '#00c774',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(0, 199, 116, 0.3)',
                  transition: 'var(--transition-smooth)'
                }}
              >
                ENTRAR NO GRUPO WHATSAPP
              </a>
            </div>

            {/* Right Block: QR Code */}
            <div className="cta-qr-wrapper" style={{ flexShrink: 0, position: 'relative' }}>
              {/* QR Code Container */}
              <div style={{
                backgroundColor: '#ffffff',
                padding: '12px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                width: '120px',
                height: '120px'
              }}>
                <svg width="96" height="96" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
                  <rect width="29" height="29" fill="white" rx="3" />
                  <path d="M1 1h7v7H1zM2 2v5h5V2zm1 1h3v3H3z" fill="black" />
                  <path d="M21 1h7v7h-7zM22 2v5h5V2zm1 1h3v3H3z" fill="black" />
                  <path d="M1 21h7v7H1zM2 22v5h5V22zm1 1h3v3H3z" fill="black" />
                  <path d="M10 1h2v2h-2zm4 0h1v1h-1zm2 0h3v1h-3zm5 0h1v2h-1zm-10 3h1v2h-1zm3 0h2v1h-2zm4 0h1v1h-1zm1 0h2v2h-2zm-9 3h2v1h-2zm3 0h1v1h-1zm4 0h1v2h-1zm3 0h1v1h-1zm-11 3h3v1h-3zm4 0h2v1h-2zm4 0h1v2h-1zm3 0h2v1h-2zm-12 2h1v1h-1zm3 0h1v1h-1zm2 0h2v2h-2zm4 0h2v1h-2zm-10 3h1v1h-1zm3 0h2v1h-2zm4 0h1v1h-1zm3 0h3v1h-3zm-11 3h2v2h-2zm4 0h1v1h-1zm2 0h2v1h-2zm4 0h1v1h-1zm-9 3h3v1h-3zm4 0h1v1h-1zm2 0h1v1h-1zm3 0h2v1h-2z" fill="black" />
                </svg>
              </div>
              {/* Green overlap chat badge */}
              <div style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                backgroundColor: '#00c774',
                color: '#ffffff',
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                border: '2px solid var(--card-bg, #0c0a09)'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
