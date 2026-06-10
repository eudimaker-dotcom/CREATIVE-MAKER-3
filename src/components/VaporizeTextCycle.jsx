import React, { useRef, useEffect, useState, createElement, useMemo, useCallback, memo } from "react";

const Tag = {
  H1: "h1",
  H2: "h2",
  H3: "h3",
  P: "p"
};

// Custom hook to check if element is in viewport
function useIsInView(ref) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '50px' }
    );
    
    observer.observe(ref.current);
    
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isInView;
}

export default function VaporizeTextCycle({
  texts = ["O melhor site local para criadores nacionais.", "Sua plataforma nacional de recursos criativos."],
  font = {
    fontFamily: "var(--font-heading)",
    fontWeight: 800,
  },
  spread = 4,
  density = 6,
  animation = {
    vaporizeDuration: 2.5,
    fadeInDuration: 1.2,
    waitDuration: 3.5,
  },
  direction = "left-to-right",
  alignment = "center",
  tag = Tag.H1,
}) {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const isInView = useIsInView(wrapperRef);
  const lastFontRef = useRef(null);
  const particlesRef = useRef([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [animationState, setAnimationState] = useState("static");
  const vaporizeProgressRef = useRef(0);
  const fadeOpacityRef = useRef(0);
  
  // Responsive Font Size State for long text
  const [fontSize, setFontSize] = useState(52);
  
  // Track dark mode for gradient changes
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });
    
    setIsDark(document.documentElement.classList.contains("dark"));
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setFontSize(52); // mobile size — bold & impactful
      } else if (width < 1024) {
        setFontSize(80); // tablet size — large & commanding
      } else {
        setFontSize(120); // desktop size — dominant headline
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const transformedDensity = transformValue(density, [0, 10], [0.3, 1], true);

  // Calculate device pixel ratio
  const globalDpr = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.devicePixelRatio * 1.5 || 1;
    }
    return 1;
  }, []);

  // Responsive height and full width for headlines
  const wrapperStyle = useMemo(() => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: `${fontSize * 4.0}px`, // accommodates wrapped multi-line text
    width: "100%",
    position: "relative",
    pointerEvents: "none",
  }), [fontSize]);

  const canvasStyle = useMemo(() => ({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  }), []);

  // Memoize animation durations
  const animationDurations = useMemo(() => ({
    VAPORIZE_DURATION: (animation.vaporizeDuration ?? 2.5) * 1000,
    FADE_IN_DURATION: (animation.fadeInDuration ?? 1.2) * 1000,
    WAIT_DURATION: (animation.waitDuration ?? 3.5) * 1000,
  }), [animation.vaporizeDuration, animation.fadeInDuration, animation.waitDuration]);

  // Memoize font config
  const fontConfig = useMemo(() => {
    const VAPORIZE_SPREAD = calculateVaporizeSpread(fontSize);
    const MULTIPLIED_VAPORIZE_SPREAD = VAPORIZE_SPREAD * spread;
    return {
      fontSize,
      VAPORIZE_SPREAD,
      MULTIPLIED_VAPORIZE_SPREAD,
      font: `${font.fontWeight ?? 800} ${fontSize * globalDpr}px ${font.fontFamily ?? "var(--font-heading)"}`,
    };
  }, [fontSize, font.fontWeight, font.fontFamily, spread, globalDpr]);

  // Memoize particle update function
  const memoizedUpdateParticles = useCallback((particles, vaporizeX, deltaTime) => {
    return updateParticles(
      particles,
      vaporizeX,
      deltaTime,
      fontConfig.MULTIPLIED_VAPORIZE_SPREAD,
      animationDurations.VAPORIZE_DURATION,
      direction,
      transformedDensity
    );
  }, [fontConfig.MULTIPLIED_VAPORIZE_SPREAD, animationDurations.VAPORIZE_DURATION, direction, transformedDensity]);

  // Memoize render function
  const memoizedRenderParticles = useCallback((ctx, particles) => {
    renderParticles(ctx, particles, globalDpr);
  }, [globalDpr]);

  // Start animation cycle when in view
  useEffect(() => {
    if (isInView) {
      setAnimationState("static");
      const startAnimationTimeout = setTimeout(() => {
        setAnimationState("vaporizing");
      }, animationDurations.WAIT_DURATION);
      return () => clearTimeout(startAnimationTimeout);
    } else {
      setAnimationState("static");
    }
  }, [isInView, currentTextIndex]);

  // Animation loop
  useEffect(() => {
    if (!isInView) return;

    let lastTime = performance.now();
    let frameId;

    const animate = (currentTime) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      if (!canvas || !ctx || !particlesRef.current.length) {
        frameId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      switch (animationState) {
        case "static": {
          memoizedRenderParticles(ctx, particlesRef.current);
          break;
        }
        case "vaporizing": {
          vaporizeProgressRef.current += deltaTime * 100 / (animationDurations.VAPORIZE_DURATION / 1000);

          const textBoundaries = canvas.textBoundaries;
          if (!textBoundaries) break;

          const progress = Math.min(100, vaporizeProgressRef.current);
          const vaporizeX = direction === "left-to-right"
            ? textBoundaries.left + textBoundaries.width * progress / 100
            : textBoundaries.right - textBoundaries.width * progress / 100;

          const allVaporized = memoizedUpdateParticles(particlesRef.current, vaporizeX, deltaTime);
          memoizedRenderParticles(ctx, particlesRef.current);

          if (vaporizeProgressRef.current >= 100 && allVaporized) {
            setCurrentTextIndex(prevIndex => (prevIndex + 1) % texts.length);
            setAnimationState("fadingIn");
            fadeOpacityRef.current = 0;
          }
          break;
        }
        case "fadingIn": {
          fadeOpacityRef.current += deltaTime * 1000 / animationDurations.FADE_IN_DURATION;

          ctx.save();
          ctx.scale(globalDpr, globalDpr);
          particlesRef.current.forEach(particle => {
            particle.x = particle.originalX;
            particle.y = particle.originalY;
            const opacity = Math.min(fadeOpacityRef.current, 1) * particle.originalAlpha;
            const color = particle.color.replace(/[\d.]+\)$/, `${opacity})`);
            ctx.fillStyle = color;
            const pSize = (particle.sampleRate || 1) / globalDpr;
            ctx.fillRect(particle.x / globalDpr, particle.y / globalDpr, pSize, pSize);
          });
          ctx.restore();

          if (fadeOpacityRef.current >= 1) {
            setAnimationState("waiting");
            setTimeout(() => {
              setAnimationState("vaporizing");
              vaporizeProgressRef.current = 0;
              resetParticles(particlesRef.current);
            }, animationDurations.WAIT_DURATION);
          }
          break;
        }
        case "waiting": {
          memoizedRenderParticles(ctx, particlesRef.current);
          break;
        }
      }

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [
    animationState, 
    isInView, 
    texts.length, 
    direction, 
    globalDpr, 
    memoizedUpdateParticles, 
    memoizedRenderParticles, 
    animationDurations.FADE_IN_DURATION, 
    animationDurations.WAIT_DURATION, 
    animationDurations.VAPORIZE_DURATION
  ]);

  // Render text helper
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !fontSize) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.parentElement.clientWidth;
    const height = canvas.parentElement.clientHeight;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = Math.floor(width * globalDpr);
    canvas.height = Math.floor(height * globalDpr);

    const fontString = fontConfig.font;
    const currentText = texts[currentTextIndex] || "projeto.";

    // Apply metallic gradient based on theme
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    if (isDark) {
      // Premium bright chrome gradient
      gradient.addColorStop(0, '#ffffff');      // Silver white
      gradient.addColorStop(0.25, '#94a3b8');   // Medium metallic gray
      gradient.addColorStop(0.5, '#f8fafc');    // Bright highlight
      gradient.addColorStop(0.75, '#475569');   // Reflection
      gradient.addColorStop(1, '#e2e8f0');      // Chrome shine
    } else {
      // Premium dark steel gradient
      gradient.addColorStop(0, '#0f172a');      // Slate 900
      gradient.addColorStop(0.25, '#475569');   // Slate 600
      gradient.addColorStop(0.5, '#1e293b');    // Slate 800
      gradient.addColorStop(0.75, '#64748b');   // Slate 500
      gradient.addColorStop(1, '#334155');      // Slate 700
    }

    let textX;
    const textY = canvas.height / 2;

    if (alignment === "center") {
      textX = canvas.width / 2;
    } else if (alignment === "left") {
      textX = 0;
    } else {
      textX = canvas.width;
    }

    const { particles, textBoundaries } = createParticles(ctx, canvas, currentText, textX, textY, fontString, gradient, alignment, fontSize, globalDpr);
    particlesRef.current = particles;
    canvas.textBoundaries = textBoundaries;
  }, [texts, currentTextIndex, fontConfig.font, fontSize, isDark, alignment, globalDpr]);

  useEffect(() => {
    drawCanvas();

    const currentFont = font.fontFamily || "var(--font-heading)";
    if (currentFont !== lastFontRef.current) {
      lastFontRef.current = currentFont;
      
      const timeoutId = setTimeout(() => {
        cleanup({ canvasRef, particlesRef });
        drawCanvas();
      }, 500);
      
      return () => {
        clearTimeout(timeoutId);
        cleanup({ canvasRef, particlesRef });
      };
    }
  }, [drawCanvas, font.fontFamily]);

  // Initial and resize observation
  useEffect(() => {
    const container = wrapperRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      drawCanvas();
    });

    resizeObserver.observe(container);
    return () => {
      resizeObserver.disconnect();
    };
  }, [drawCanvas]);

  return (
    <div ref={wrapperRef} style={wrapperStyle}>
      <canvas ref={canvasRef} style={canvasStyle} />
      <SeoElement tag={tag} texts={texts} />
    </div>
  );
}

// ------------------------------------------------------------ //
// SEO ELEMENT
// ------------------------------------------------------------ //
const SeoElement = memo(({ tag = Tag.P, texts }) => {
  const style = useMemo(() => ({
    position: "absolute",
    width: "0",
    height: "0",
    overflow: "hidden",
    userSelect: "none",
    pointerEvents: "none",
  }), []);

  const safeTag = Object.values(Tag).includes(tag) ? tag : "p";
  
  return createElement(safeTag, { style }, texts?.join(" ") ?? "");
});

// ------------------------------------------------------------ //
// CLEANUP
// ------------------------------------------------------------ //
const cleanup = ({ canvasRef, particlesRef }) => {
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext("2d");
  
  if (canvas && ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  
  if (particlesRef.current) {
    particlesRef.current = [];
  }
};

// ------------------------------------------------------------ //
// PARTICLE SYSTEM CREATION (WITH WORD WRAPPING)
// ------------------------------------------------------------ //
const createParticles = (
  ctx,
  canvas,
  text,
  textX,
  textY,
  font,
  fillStyle,
  alignment,
  fontSize,
  globalDpr
) => {
  const particles = [];

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = fillStyle;
  ctx.font = font;
  ctx.textAlign = alignment;
  ctx.textBaseline = "middle";
  ctx.imageSmoothingQuality = "high";
  ctx.imageSmoothingEnabled = true;
  
  if ('fontKerning' in ctx) {
    ctx.fontKerning = "normal";
  }
  
  if ('textRendering' in ctx) {
    ctx.textRendering = "geometricPrecision";
  }

  // Word Wrapping implementation
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";
  const maxWidth = canvas.width - Math.floor(40 * globalDpr); // margins
  const lineHeight = fontSize * globalDpr * 1.25;

  for (let n = 0; n < words.length; n++) {
    const testLine = currentLine + words[n] + " ";
    const testWidth = ctx.measureText(testLine).width;
    if (testWidth > maxWidth && n > 0) {
      lines.push(currentLine.trim());
      currentLine = words[n] + " ";
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine.trim());

  // Calculate text boundaries based on maximum line width
  let maxTextWidth = 0;
  lines.forEach(lineText => {
    const w = ctx.measureText(lineText).width;
    if (w > maxTextWidth) maxTextWidth = w;
  });

  let textLeft;
  if (alignment === "center") {
    textLeft = textX - maxTextWidth / 2;
  } else if (alignment === "left") {
    textLeft = textX;
  } else {
    textLeft = textX - maxTextWidth;
  }
  
  const textBoundaries = {
    left: textLeft,
    right: textLeft + maxTextWidth,
    width: maxTextWidth,
  };

  // Draw wrapped text centered vertically
  const totalHeight = lines.length * lineHeight;
  const startY = textY - totalHeight / 2 + lineHeight / 2;

  lines.forEach((lineText, index) => {
    ctx.fillText(lineText, textX, startY + index * lineHeight);
  });

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const baseDPR = 3;
  const currentDPR = canvas.width / parseInt(canvas.style.width);
  const baseSampleRate = Math.max(1, Math.round(currentDPR / baseDPR));
  const sampleRate = Math.max(1, Math.round(baseSampleRate));

  for (let y = 0; y < canvas.height; y += sampleRate) {
    for (let x = 0; x < canvas.width; x += sampleRate) {
      const index = (y * canvas.width + x) * 4;
      const alpha = data[index + 3];
      
      if (alpha > 0) {
        const originalAlpha = alpha / 255;
        particles.push({
          x,
          y,
          originalX: x,
          originalY: y,
          color: `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, ${originalAlpha})`,
          opacity: originalAlpha,
          originalAlpha,
          velocityX: 0,
          velocityY: 0,
          angle: 0,
          speed: 0,
          sampleRate
        });
      }
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  return { particles, textBoundaries };
};

const updateParticles = (
  particles,
  vaporizeX,
  deltaTime,
  MULTIPLIED_VAPORIZE_SPREAD,
  VAPORIZE_DURATION,
  direction,
  density
) => {
  let allParticlesVaporized = true;
  
  particles.forEach(particle => {
    const shouldVaporize = direction === "left-to-right" 
      ? particle.originalX <= vaporizeX 
      : particle.originalX >= vaporizeX;
    
    if (shouldVaporize) {
      if (particle.speed === 0) {
        particle.angle = Math.random() * Math.PI * 2;
        particle.speed = (Math.random() * 1 + 0.5) * MULTIPLIED_VAPORIZE_SPREAD;
        particle.velocityX = Math.cos(particle.angle) * particle.speed;
        particle.velocityY = Math.sin(particle.angle) * particle.speed;
        particle.shouldFadeQuickly = Math.random() > density;
      }
      
      if (particle.shouldFadeQuickly) {
        particle.opacity = Math.max(0, particle.opacity - deltaTime);
      } else {
        const dx = particle.originalX - particle.x;
        const dy = particle.originalY - particle.y;
        const distanceFromOrigin = Math.sqrt(dx * dx + dy * dy);
        
        const dampingFactor = Math.max(0.95, 1 - distanceFromOrigin / (100 * MULTIPLIED_VAPORIZE_SPREAD));
        
        const randomSpread = MULTIPLIED_VAPORIZE_SPREAD * 3;
        const spreadX = (Math.random() - 0.5) * randomSpread;
        const spreadY = (Math.random() - 0.5) * randomSpread;
        
        particle.velocityX = (particle.velocityX + spreadX + dx * 0.002) * dampingFactor;
        particle.velocityY = (particle.velocityY + spreadY + dy * 0.002) * dampingFactor;
        
        const maxVelocity = MULTIPLIED_VAPORIZE_SPREAD * 2;
        const currentVelocity = Math.sqrt(particle.velocityX * particle.velocityX + particle.velocityY * particle.velocityY);
        
        if (currentVelocity > maxVelocity) {
          const scale = maxVelocity / currentVelocity;
          particle.velocityX *= scale;
          particle.velocityY *= scale;
        }
        
        particle.x += particle.velocityX * deltaTime * 20;
        particle.y += particle.velocityY * deltaTime * 10;
        
        const baseFadeRate = 0.25;
        const durationBasedFadeRate = baseFadeRate * (2000 / VAPORIZE_DURATION);
        
        particle.opacity = Math.max(0, particle.opacity - deltaTime * durationBasedFadeRate);
      }
      
      if (particle.opacity > 0.01) {
        allParticlesVaporized = false;
      }
    } else {
      allParticlesVaporized = false;
    }
  });
  
  return allParticlesVaporized;
};

const renderParticles = (ctx, particles, globalDpr) => {
  ctx.save();
  ctx.scale(globalDpr, globalDpr);
  
  particles.forEach(particle => {
    if (particle.opacity > 0) {
      const color = particle.color.replace(/[\d.]+\)$/, `${particle.opacity})`);
      ctx.fillStyle = color;
      const pSize = (particle.sampleRate || 1) / globalDpr;
      ctx.fillRect(particle.x / globalDpr, particle.y / globalDpr, pSize, pSize);
    }
  });
  
  ctx.restore();
};

const resetParticles = (particles) => {
  particles.forEach(particle => {
    particle.x = particle.originalX;
    particle.y = particle.originalY;
    particle.opacity = particle.originalAlpha;
    particle.speed = 0;
    particle.velocityX = 0;
    particle.velocityY = 0;
  });
};

const calculateVaporizeSpread = (fontSize) => {
  const size = typeof fontSize === "string" ? parseInt(fontSize) : fontSize;
  
  const points = [
    { size: 20, spread: 0.2 },
    { size: 50, spread: 0.5 },
    { size: 100, spread: 1.5 }
  ];
  
  if (size <= points[0].size) return points[0].spread;
  if (size >= points[points.length - 1].size) return points[points.length - 1].spread;
  
  let i = 0;
  while (i < points.length - 1 && points[i + 1].size < size) i++;
  
  const p1 = points[i];
  const p2 = points[i + 1];
  
  return p1.spread + (size - p1.size) * (p2.spread - p1.spread) / (p2.size - p1.size);
};

function transformValue(input, inputRange, outputRange, clamp = false) {
  const [inputMin, inputMax] = inputRange;
  const [outputMin, outputMax] = outputRange;
  
  const progress = (input - inputMin) / (inputMax - inputMin);
  let result = outputMin + progress * (outputMax - outputMin);
  
  if (clamp) {
    if (outputMax > outputMin) {
      result = Math.min(Math.max(result, outputMin), outputMax);
    } else {
      result = Math.min(Math.max(result, outputMax), outputMin);
    }
  }
  
  return result;
}
