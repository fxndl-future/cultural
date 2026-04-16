import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useTheme } from '../context/ThemeContext';

const Particle: React.FC<{ type: 'petals' | 'rain' | 'leaves' | 'snow' }> = ({ type }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const x = Math.random() * window.innerWidth;
    const y = -50;
    const duration = 5 + Math.random() * 10;
    const delay = Math.random() * 10;

    const tl = gsap.timeline({ repeat: -1, delay });

    if (type === 'snow') {
      tl.fromTo(ref.current, 
        { x, y, opacity: 0, scale: Math.random() },
        { 
          y: window.innerHeight + 50, 
          x: x + (Math.random() - 0.5) * 200,
          opacity: 0.8,
          duration,
          ease: 'none',
        }
      );
    } else if (type === 'leaves') {
      tl.fromTo(ref.current,
        { x, y, opacity: 0, rotation: 0 },
        {
          y: window.innerHeight + 50,
          x: x + (Math.random() - 0.5) * 400,
          rotation: 720,
          opacity: 0.6,
          duration,
          ease: 'power1.inOut',
        }
      );
    } else if (type === 'petals') {
      tl.fromTo(ref.current,
        { x, y, opacity: 0, rotation: 0 },
        {
          y: window.innerHeight + 50,
          x: x + Math.sin(Math.random()) * 300,
          rotation: 360,
          opacity: 0.7,
          duration,
          ease: 'sine.inOut',
        }
      );
    } else if (type === 'rain') {
      tl.fromTo(ref.current,
        { x, y, opacity: 0, scaleY: 1 },
        {
          y: window.innerHeight + 50,
          opacity: 0.4,
          duration: 0.8 + Math.random() * 0.5,
          ease: 'none',
        }
      );
    }

    return () => {
      tl.kill();
    };
  }, [type]);

  const getStyle = () => {
    switch (type) {
      case 'snow': return 'bg-white rounded-full w-2 h-2 blur-[1px]';
      case 'leaves': return 'bg-orange-500 rounded-tl-full rounded-br-full w-4 h-6 opacity-40';
      case 'petals': return 'bg-pink-200 rounded-full w-3 h-4 opacity-50';
      case 'rain': return 'bg-blue-400 w-0.5 h-8 opacity-30';
      default: return '';
    }
  };

  return <div ref={ref} className={`absolute pointer-events-none ${getStyle()}`} />;
};

export const SeasonParticles: React.FC = () => {
  const { theme } = useTheme();
  const particleCount = 30;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {Array.from({ length: particleCount }).map((_, i) => (
        <Particle key={`${theme.particles}-${i}`} type={theme.particles} />
      ))}
    </div>
  );
};
