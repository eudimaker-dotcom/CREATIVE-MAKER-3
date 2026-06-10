import React from 'react';
import { testimonialsData } from '../mockData';
import { Star } from 'lucide-react';

export default function Testimonials() {
  return (
    <section style={{ padding: '80px 24px' }}>
      <div className="container-dalim" style={{ maxWidth: '960px' }}>
        
        {/* Title */}
        <div className="text-center" style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, marginBottom: '8px' }}>
            Loved by Designers
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            What creative minds say about our asset marketplace templates.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
          gap: '24px'
        }} className="md:grid-cols-3">
          
          {testimonialsData.map((test) => (
            <div 
              key={test.id}
              className="glass-panel"
              style={{ 
                padding: '24px', 
                borderRadius: 'var(--border-radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                border: '1px dotted var(--border-color-dotted)'
              }}
            >
              {/* Stars */}
              <div className="flex" style={{ gap: '2px', color: 'var(--accent-color)' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" stroke="none" />
                ))}
              </div>

              {/* Text */}
              <p style={{ fontSize: '0.8rem', lineHeight: 1.5, color: 'var(--text-color)', fontStyle: 'italic' }}>
                "{test.text}"
              </p>

              {/* Author */}
              <div className="flex-center" style={{ gap: '10px', marginTop: 'auto', alignSelf: 'flex-start' }}>
                <img 
                  src={test.avatar} 
                  alt={test.author} 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 600 }}>{test.author}</h4>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{test.role}</p>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
      
      {/* Dynamic responsive grid correction */}
      <style>{`
        @media (min-width: 768px) {
          .md\\:grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
        }
      `}</style>
    </section>
  );
}
