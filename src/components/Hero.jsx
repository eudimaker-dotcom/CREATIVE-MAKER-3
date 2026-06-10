import React from 'react';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import DotPattern from './DotPattern';


export default function Hero({ onOpenAuth, user, navigate }) {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <section 
      style={{ 
        minHeight: 'auto', 
        padding: '50px 24px 30px 24px', 
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      
      {/* Grid background layer with fading sides */}
      <div className="grid-fade-bg" />

      {/* Dot Pattern Background with fading sides */}
      <DotPattern
        width={32}
        height={32}
        cx={1.5}
        cy={1.5}
        cr={1}
        style={{
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 30%, transparent 100%)',
          opacity: 0.15,
          color: 'var(--text-color, #ffffff)',
          zIndex: 1
        }}
      />

      {/* Background glow layers */}
      <div className="radial-glow-layer" style={{ top: '50px', height: '400px' }}>
        <div className="radial-glow-purple" />
      </div>

      <div 
        className="container-dalim" 
        style={{ 
          maxWidth: '1100px', 
          position: 'relative', 
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%'
        }}
      >
        {/* Small red subtitle badge */}
        <motion.div 
          custom={0}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          style={{ 
            fontSize: '0.9rem',
            fontWeight: 600,
            marginBottom: '12px',
            color: '#ff003c',
            letterSpacing: '0.05em',
            textAlign: 'center'
          }}
        >
          Explore recursos exclusivos e personalizados
        </motion.div>

        {/* Headliner Title */}
        <motion.h1
          custom={1}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 900,
            fontSize: 'clamp(2.2rem, 6vw, 4.2rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            textAlign: 'center',
            maxWidth: '950px',
            color: 'var(--text-color)',
            marginBottom: '16px'
          }}
        >
          <span className="metallic-text">Design</span> feito para criadores.
        </motion.h1>

        {/* Shorter Portuguese Description text */}
        <motion.p
          custom={2}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          style={{
            fontSize: '0.9rem',
            color: 'var(--text-muted, #a8a29e)',
            lineHeight: 1.5,
            maxWidth: '680px',
            margin: '0 auto 24px auto',
            fontWeight: 400,
            textAlign: 'center'
          }}
        >
          Descubra recursos criativos lindamente elaborados para todos os seus projetos — desde mockups modernos até templates com inspiração vintage.
        </motion.p>

        {/* CTA Actions */}
        <motion.div 
          custom={3}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="flex-center"
          style={{ 
            display: 'flex',
            gap: '16px', 
            flexWrap: 'wrap', 
            justifyContent: 'center',
            width: '100%'
          }}
        >
          {/* Button 1: Faça o upload do seu design/faça login (with glowing border box) */}
          <div style={{
            padding: '2px',
            borderRadius: '9999px',
            background: 'linear-gradient(90deg, #ff007f, #7f00ff, #ff003c)',
            boxShadow: '0 0 20px rgba(255, 0, 127, 0.45)',
            display: 'inline-flex'
          }}>
            <button 
              onClick={user ? () => navigate('/upload') : onOpenAuth}
              className="hover-lift"
              style={{ 
                padding: '14px 30px', 
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: '#ffffff',
                color: '#000000',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'var(--transition-smooth)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {user ? 'Faça o upload do seu design' : 'Faça o upload do seu design/faça login'}
            </button>
          </div>

          {/* Button 2: Compartilhe seu projeto */}
          <button 
            onClick={user ? () => navigate('/upload') : onOpenAuth}
            className="hover-lift"
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px', 
              padding: '14px 30px', 
              borderRadius: '9999px',
              border: '1px solid var(--border-color-glass, rgba(255,255,255,0.15))',
              backgroundColor: 'var(--card-bg-glass, rgba(12, 10, 9, 0.75))',
              color: 'var(--text-color, #ffffff)',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
          >
            <Mail size={14} style={{ color: 'var(--text-color, #ffffff)' }} />
            <span>Compartilhe seu projeto</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
