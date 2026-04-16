import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export const WeatherCanvas: React.FC = () => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const time = Date.now() * 0.001;
      const width = canvas.width;
      const height = canvas.height;

      // Draw Temperature Curve
      ctx.beginPath();
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      
      for (let x = 0; x < width; x++) {
        const y = height / 2 + Math.sin(x * 0.02 + time) * 20;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw Sun/Weather Icon based on season
      ctx.setLineDash([]);
      ctx.fillStyle = theme.accent;
      const sunX = width - 50;
      const sunY = 50;
      
      ctx.beginPath();
      ctx.arc(sunX, sunY, 15 + Math.sin(time * 2) * 2, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, [theme]);

  return (
    <div className="absolute top-4 right-4 w-48 h-32 pointer-events-none opacity-40">
      <canvas 
        ref={canvasRef} 
        width={192} 
        height={128} 
        className="w-full h-full"
      />
      <div className="absolute bottom-0 left-0 text-[10px] font-black uppercase tracking-tighter text-gray-400">
        Live Weather Viz
      </div>
    </div>
  );
};
