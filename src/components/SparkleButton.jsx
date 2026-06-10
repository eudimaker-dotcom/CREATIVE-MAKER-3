import React, { useMemo, useState, useCallback } from "react";
import { Sparkle } from "lucide-react";
import { loadFull } from "tsparticles";
import { ParticlesProvider, Particles } from "@tsparticles/react";

const particleOptions = {
  key: "star",
  name: "Star",
  particles: {
    number: {
      value: 20,
      density: { enable: false },
    },
    color: {
      value: ["#7c3aed", "#bae6fd", "#a78bfa", "#93c5fd", "#0284c7", "#fafafa", "#38bdf8"],
    },
    shape: {
      type: "star",
      options: { star: { sides: 4 } },
    },
    opacity: { value: 0.8 },
    size: { value: { min: 1, max: 4 } },
    rotate: {
      value: { min: 0, max: 360 },
      enable: true,
      direction: "clockwise",
      animation: { enable: true, speed: 10, sync: false },
    },
    links: { enable: false },
    reduceDuplicates: true,
    move: {
      enable: true,
      center: { x: 120, y: 45 },
    },
  },
  interactivity: { events: {} },
  smooth: true,
  fpsLimit: 120,
  background: { color: "transparent", size: "cover" },
  fullScreen: { enable: false },
  detectRetina: true,
  absorbers: [
    {
      enable: true,
      opacity: 0,
      size: {
        value: 1,
        density: 1,
        limit: { radius: 5, mass: 5 },
      },
      position: { x: 110, y: 45 },
    },
  ],
  emitters: [
    {
      autoPlay: true,
      fill: true,
      life: { wait: true },
      rate: { quantity: 5, delay: 0.5 },
      position: { x: 110, y: 45 },
    },
  ],
};

function SparkleButtonInner({ children, onClick, style = {} }) {
  const [particleState, setParticlesReady] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  const modifiedOptions = useMemo(() => {
    return { ...particleOptions, autoPlay: isHovering };
  }, [isHovering]);

  const handleParticlesLoaded = useCallback(async () => {
    setParticlesReady("ready");
  }, []);

  return (
    <button
      className="sparkle-btn-outer"
      style={style}
      onClick={onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="sparkle-btn-inner">
        {/* Sparkle icons */}
        <Sparkle className="sparkle-icon sparkle-icon-main" size={14} />
        <Sparkle
          className="sparkle-icon sparkle-icon-1"
          size={5}
          style={{ animationDelay: "1s" }}
        />
        <Sparkle
          className="sparkle-icon sparkle-icon-2"
          size={3}
          style={{ animationDelay: "1.5s", animationDuration: "2.5s" }}
        />
        <Sparkle
          className="sparkle-icon sparkle-icon-3"
          size={4}
          style={{ animationDelay: "0.5s", animationDuration: "2.5s" }}
        />

        <span className="sparkle-btn-label">{children}</span>
      </div>

      {/* Particles layer */}
      <Particles
        id="sparkle-particles"
        className={`sparkle-particles ${particleState === "ready" && isHovering ? "sparkle-particles-visible" : ""}`}
        particlesLoaded={handleParticlesLoaded}
        options={modifiedOptions}
      />
    </button>
  );
}

// Stable init function (must not change between renders)
const particlesInit = async (engine) => {
  await loadFull(engine);
};

export default function SparkleButton(props) {
  return (
    <ParticlesProvider init={particlesInit}>
      <SparkleButtonInner {...props} />
    </ParticlesProvider>
  );
}
