export function renderCanvas() {
  const canvas = document.getElementById('canvas');
  if (!canvas) {
    console.warn('Canvas element with id "canvas" not found.');
    return;
  }

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let running = true;
  let frame = 1;

  // Configuration settings for spring simulation
  const E = {
    debug: true,
    friction: 0.5,
    trails: 80,
    size: 50,
    dampening: 0.025,
    tension: 0.99,
  };

  // State
  let pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let lines = [];

  // Oscillator helper to rotate colors (HSL phase)
  class Oscillator {
    constructor(config) {
      this.phase = config.phase || 0;
      this.offset = config.offset || 0;
      this.frequency = config.frequency || 0.001;
      this.amplitude = config.amplitude || 1;
      this.val = 0;
    }

    update() {
      this.phase += this.frequency;
      this.val = this.offset + Math.sin(this.phase) * this.amplitude;
      return this.val;
    }

    value() {
      return this.val;
    }
  }

  const f = new Oscillator({
    phase: Math.random() * 2 * Math.PI,
    amplitude: 85,
    frequency: 0.0015,
    offset: 285,
  });

  // Node class representing trail points
  class Node {
    constructor() {
      this.x = pos.x;
      this.y = pos.y;
      this.vx = 0;
      this.vy = 0;
    }
  }

  // Line class representing a trail ribbon
  class Line {
    constructor(config) {
      this.spring = config.spring + 0.1 * Math.random() - 0.05;
      this.friction = E.friction + 0.01 * Math.random() - 0.005;
      this.nodes = [];
      for (let i = 0; i < E.size; i++) {
        this.nodes.push(new Node());
      }
    }

    update() {
      let springForce = this.spring;
      const firstNode = this.nodes[0];
      firstNode.vx += (pos.x - firstNode.x) * springForce;
      firstNode.vy += (pos.y - firstNode.y) * springForce;

      for (let i = 0; i < this.nodes.length; i++) {
        const node = this.nodes[i];
        if (i > 0) {
          const prevNode = this.nodes[i - 1];
          node.vx += (prevNode.x - node.x) * springForce;
          node.vy += (prevNode.y - node.y) * springForce;
          node.vx += prevNode.vx * E.dampening;
          node.vy += prevNode.vy * E.dampening;
        }
        node.vx *= this.friction;
        node.vy *= this.friction;
        node.x += node.vx;
        node.y += node.vy;
        springForce *= E.tension;
      }
    }

    draw() {
      let n = this.nodes[0].x;
      let i = this.nodes[0].y;
      ctx.beginPath();
      ctx.moveTo(n, i);
      
      let a;
      for (a = 1; a < this.nodes.length - 2; a++) {
        const e = this.nodes[a];
        const t = this.nodes[a + 1];
        n = 0.5 * (e.x + t.x);
        i = 0.5 * (e.y + t.y);
        ctx.quadraticCurveTo(e.x, e.y, n, i);
      }
      
      const e = this.nodes[a];
      const t = this.nodes[a + 1];
      ctx.quadraticCurveTo(e.x, e.y, t.x, t.y);
      ctx.stroke();
      ctx.closePath();
    }
  }

  function initLines() {
    lines = [];
    for (let i = 0; i < E.trails; i++) {
      lines.push(new Line({ spring: 0.45 + (i / E.trails) * 0.025 }));
    }
  }

  // Update pointer coordinates on mouse/touch interaction
  function updatePosition(e) {
    if (e.touches) {
      pos.x = e.touches[0].clientX;
      pos.y = e.touches[0].clientY;
    } else {
      pos.x = e.clientX;
      pos.y = e.clientY;
    }
  }

  function updateTouchPosition(e) {
    if (e.touches.length === 1) {
      pos.x = e.touches[0].clientX;
      pos.y = e.touches[0].pageY;
    }
  }

  let bootstrapped = false;

  // Bootstraps simulation when interaction starts
  function bootstrap(e) {
    updatePosition(e);
    initLines();
    bootstrapped = true;

    // Remove bootstrap trigger
    document.removeEventListener('mousemove', bootstrap);
    document.removeEventListener('touchstart', bootstrap);

    // Register active trackers
    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('touchmove', updatePosition);
    document.addEventListener('touchstart', updateTouchPosition);

    render();
  }

  // Main animation frame
  function render() {
    if (running) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = `hsla(${Math.round(f.update())}, 100%, 50%, 0.025)`;
      ctx.lineWidth = 10;

      for (let i = 0; i < E.trails; i++) {
        if (lines[i]) {
          lines[i].update();
          lines[i].draw();
        }
      }
      
      frame++;
      animationFrameId = requestAnimationFrame(render);
    }
  }

  // Manage window scaling
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Setup bootstrap listeners
  document.addEventListener('mousemove', bootstrap);
  document.addEventListener('touchstart', bootstrap);
  
  window.addEventListener('resize', resizeCanvas);

  // CPU optimizations for focus and blur
  const handleFocus = () => {
    if (!running) {
      running = true;
      if (bootstrapped) {
        render();
      }
    }
  };

  const handleBlur = () => {
    running = false;
  };

  window.addEventListener('focus', handleFocus);
  window.addEventListener('blur', handleBlur);

  resizeCanvas();

  // Return standard unmounting callback
  return () => {
    running = false;
    cancelAnimationFrame(animationFrameId);

    document.removeEventListener('mousemove', bootstrap);
    document.removeEventListener('touchstart', bootstrap);
    document.removeEventListener('mousemove', updatePosition);
    document.removeEventListener('touchmove', updatePosition);
    document.removeEventListener('touchstart', updateTouchPosition);
    
    window.removeEventListener('resize', resizeCanvas);
    window.removeEventListener('focus', handleFocus);
    window.removeEventListener('blur', handleBlur);
  };
}
