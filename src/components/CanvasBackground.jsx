import React, { useEffect } from 'react';
import { renderCanvas } from '../canvas-effect';

export default function CanvasBackground() {
  useEffect(() => {
    // Start the canvas effect and get its cleanup function
    const cleanup = renderCanvas();
    
    // Call cleanup function when the component unmounts
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  return <canvas id="canvas" />;
}
