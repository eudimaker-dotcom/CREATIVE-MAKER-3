export function renderCanvas() {
  const canvas = document.getElementById('canvas');
  if (!canvas) {
    console.warn('Canvas element with id "canvas" not found.');
    return;
  }

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let particles = [];
  const mouse = { x: null, y: null, active: false, radius: 150 };

  // Theme configuration
  let accentColor = '#adfa1d';
  let isDark = true;

  // Retrieve current theme colors from CSS variables
  function updateThemeColors() {
    const rootStyles = getComputedStyle(document.documentElement);
    accentColor = rootStyles.getPropertyValue('--accent-color').trim() || '#adfa1d';
    isDark = document.documentElement.classList.contains('dark');
  }

  updateThemeColors();

  // Watch for theme changes (class modifications on documentElement)
  const observer = new MutationObserver(() => {
    updateThemeColors();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  // Handle Resize
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.radius = Math.random() * 2 + 1; // 1px to 3px
      this.baseSpeedX = (Math.random() - 0.5) * 0.4;
      this.baseSpeedY = (Math.random() - 0.5) * 0.4;
      this.speedX = this.baseSpeedX;
      this.speedY = this.baseSpeedY;
      this.density = (Math.random() * 20) + 10;
      this.alpha = Math.random() * 0.5 + 0.15; // Starting opacity
    }

    update() {
      // Mouse gravity/repulsion effect
      if (mouse.active && mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          // Gentle pull towards mouse
          this.x += (dx / distance) * force * 0.6;
          this.y += (dy / distance) * force * 0.6;
        }
      }

      // Move particle
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around edges
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      
      // Select base color according to theme
      let r, g, b;
      if (accentColor.startsWith('#')) {
        const hex = accentColor.replace('#', '');
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      } else {
        r = 173; g = 250; b = 29; // Fallback to lime green
      }

      const opacity = isDark ? this.alpha * 0.25 : this.alpha * 0.15;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      ctx.fill();
    }
  }

  // Initialize Particles
  function initParticles() {
    particles = [];
    // Number of particles depends on screen area
    const area = canvas.width * canvas.height;
    const numberOfParticles = Math.min(80, Math.floor(area / 18000));
    
    for (let i = 0; i < numberOfParticles; i++) {
      particles.push(new Particle());
    }
  }

  // Draw connecting lines
  function drawLines() {
    let r, g, b;
    if (accentColor.startsWith('#')) {
      const hex = accentColor.replace('#', '');
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    } else {
      r = 173; g = 250; b = 29;
    }

    const maxDistance = 140;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.hypot(dx, dy);

        if (distance < maxDistance) {
          // Opacity fades as distance increases
          const alpha = (1 - (distance / maxDistance)) * (isDark ? 0.08 : 0.05);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Draw lines to mouse if active
      if (mouse.active && mouse.x !== null && mouse.y !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const distance = Math.hypot(dx, dy);

        if (distance < mouse.radius) {
          const alpha = (1 - (distance / mouse.radius)) * (isDark ? 0.12 : 0.08);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }
      }
    }
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    drawLines();

    animationFrameId = requestAnimationFrame(animate);
  }

  // Event Listeners for Interaction
  const handleMouseMove = (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  };

  const handleMouseLeave = () => {
    mouse.active = false;
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      mouse.active = true;
    }
  };

  const handleTouchEnd = () => {
    mouse.active = false;
  };

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseleave', handleMouseLeave);
  window.addEventListener('touchmove', handleTouchMove);
  window.addEventListener('touchend', handleTouchEnd);

  // Initial setup and kickstart animation
  resizeCanvas();
  animate();

  // Return a cleanup function for React or general hot reloading
  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', resizeCanvas);
    window.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseleave', handleMouseLeave);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
    observer.disconnect();
  };
}
