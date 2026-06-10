import React from 'react';
import { Mail, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-dotted-top" style={{ padding: '40px 24px 30px 24px', backgroundColor: 'var(--bg-color)' }}>
      <div className="container-dalim">
        
        {/* Socials & Top Button */}
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '20px' }}>
          
          {/* Social Icons Wrapped in Dotted Squares */}
          <div className="flex-center" style={{ gap: '10px' }}>
            {/* Email Icon */}
            <a href="mailto:contact@designali.in" className="btn-dotted-link hover-translate" style={{ padding: '10px', borderRadius: 'var(--border-radius-md)' }} title="Email">
              <Mail size={16} />
            </a>

            {/* Instagram Icon */}
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="btn-dotted-link hover-translate" style={{ padding: '10px', borderRadius: 'var(--border-radius-md)' }} title="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>

            {/* Facebook Icon */}
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="btn-dotted-link hover-translate" style={{ padding: '10px', borderRadius: 'var(--border-radius-md)' }} title="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>

            {/* WhatsApp Icon */}
            <a href="https://wa.me/5500000000000" target="_blank" rel="noreferrer" className="btn-dotted-link hover-translate" style={{ padding: '10px', borderRadius: 'var(--border-radius-md)' }} title="WhatsApp">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.982L2 22l5.166-1.353a9.95 9.95 0 0 0 4.846 1.254h.004c5.507 0 9.99-4.478 9.99-9.985 0-2.67-1.037-5.18-2.92-7.062C17.182 3.036 14.67 2 12.012 2zm6.074 13.962c-.25.706-1.25 1.29-1.724 1.38-.475.09-1.092.177-3.136-.653-2.613-1.06-4.29-3.72-4.42-3.896-.13-.177-1.053-1.4-1.053-2.67 0-1.272.666-1.897.902-2.148.235-.25.516-.312.688-.312.172 0 .344 0 .493.007.158.007.37.003.565.47.202.483.69 1.684.75 1.805.062.12.102.26.023.418-.08.158-.12.26-.24.398-.12.138-.25.31-.358.416-.12.12-.246.25-.105.493.14.242.625 1.03 1.34 1.666.92.82 1.693 1.074 1.939 1.196.246.123.39.103.532-.06.14-.164.606-.703.77-.962.164-.26.324-.217.546-.135.22.082 1.402.66 1.643.78.24.12.4.18.46.28.06.1.06.574-.19 1.28z"/>
              </svg>
            </a>
          </div>

          {/* Scroll to Top */}
          <div className="flex-center" style={{ 
            border: '1px dotted var(--border-color-dotted)', 
            borderRadius: '9999px',
            padding: '4px 12px',
            backgroundColor: 'var(--card-bg)'
          }}>
            <button 
              onClick={scrollToTop}
              className="flex-center"
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: 'var(--text-color)',
                fontSize: '0.75rem',
                fontWeight: 600,
                gap: '6px'
              }}
            >
              <span>Back to Top</span>
              <ArrowUp size={13} />
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
}
