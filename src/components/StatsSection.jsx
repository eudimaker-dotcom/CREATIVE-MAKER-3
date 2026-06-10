import React from 'react';
import { statsData } from '../mockData';

export default function StatsSection() {
  return (
    <section className="border-dotted-ali" style={{ borderLeft: 'none', borderRight: 'none', padding: '60px 24px', backgroundColor: 'var(--card-bg-glass)' }}>
      <div className="container-dalim">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '24px',
        }} className="md:grid-cols-4">
          
          {statsData.map((stat, idx) => (
            <div 
              key={idx} 
              className="fade-up-item is-visible text-center"
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <span style={{ 
                fontSize: 'clamp(2rem, 4vw, 3rem)', 
                fontWeight: 800, 
                fontFamily: 'var(--font-heading)',
                lineHeight: 1,
                color: 'var(--text-color)'
              }}>
                {stat.value}
              </span>
              <span style={{ 
                fontSize: '0.75rem', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em', 
                color: 'var(--text-muted)',
                fontWeight: 500
              }}>
                {stat.label}
              </span>
            </div>
          ))}

        </div>
      </div>
      
      {/* Dynamic responsive grid correction */}
      <style>{`
        @media (min-width: 768px) {
          .md\\:grid-cols-4 {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          }
        }
      `}</style>
    </section>
  );
}
