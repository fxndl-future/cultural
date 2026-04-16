import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme, type Season } from '../context/ThemeContext';
import gsap from 'gsap';
import { useAnimations } from '../context/AnimationContext';

export const SeasonalDecor: React.FC<{ className?: string }> = ({ className }) => {
  const { season } = useTheme();
  const { animationsEnabled } = useAnimations();
  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const prevSeasonRef = useRef<Season>(season);
  const [leavingSeason, setLeavingSeason] = useState<Season | null>(null);

  useEffect(() => {
    if (prevSeasonRef.current === season) return;
    setLeavingSeason(prevSeasonRef.current);
    prevSeasonRef.current = season;
  }, [season]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const root = ref.current;
      const svg = svgRef.current;
      if (!root || !svg) return;

      const enter = root.querySelector<SVGGElement>(`[data-season="${season}"][data-phase="enter"]`);
      const leave = leavingSeason
        ? root.querySelector<SVGGElement>(`[data-season="${leavingSeason}"][data-phase="leave"]`)
        : null;

      if (!animationsEnabled) {
        if (enter) gsap.set(enter, { opacity: 1, clearProps: 'transform' });
        if (leave) gsap.set(leave, { opacity: 0, clearProps: 'transform' });
        setLeavingSeason(null);
        return;
      }

      if (leave) {
        gsap.to(leave, {
          opacity: 0,
          y: -12,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete: () => setLeavingSeason(null),
        });
      }

      if (enter) {
        const items = enter.querySelectorAll<HTMLElement>('[data-anim]');
        gsap.fromTo(
          enter,
          { opacity: 0, y: 10, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' }
        );
        gsap.fromTo(
          items,
          { opacity: 0, y: 10, rotate: -2, transformOrigin: '50% 50%' },
          { opacity: 1, y: 0, rotate: 0, duration: 0.9, ease: 'power3.out', stagger: 0.06 }
        );

        const floats = enter.querySelectorAll<HTMLElement>('[data-float]');
        floats.forEach((el) => {
          gsap.to(el, {
            y: -8,
            duration: 2.2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 0.6,
          });
        });

        const spins = enter.querySelectorAll<HTMLElement>('[data-spin]');
        spins.forEach((el) => {
          gsap.to(el, {
            rotate: 360,
            duration: 10 + Math.random() * 4,
            repeat: -1,
            ease: 'none',
          });
        });

        const dashes = enter.querySelectorAll<SVGPathElement>('[data-dash]');
        dashes.forEach((p) => {
          const len = p.getTotalLength?.() ?? 0;
          if (!len) return;
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(p, {
            strokeDashoffset: 0,
            duration: 1.2,
            ease: 'power2.out',
          });
        });
      }

      gsap.fromTo(svg, 
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' }
      );

      gsap.to(svg, {
        x: 'random(-10, 10)',
        y: 'random(-10, 10)',
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, ref);

    return () => ctx.revert();
  }, [season, leavingSeason, animationsEnabled]);

  const enterKey = useMemo(() => `enter-${season}`, [season]);
  const leaveKey = useMemo(() => (leavingSeason ? `leave-${leavingSeason}` : null), [leavingSeason]);

  return (
    <div ref={ref} className={className ?? 'absolute inset-0 pointer-events-none'}>
      <svg 
        ref={svgRef} 
        viewBox="0 0 1200 700" 
        className="w-full h-full" 
        preserveAspectRatio="xMidYMid slice"
        style={{ filter: 'blur(0.5px)' }}
      >
        {leavingSeason && (
          <g key={leaveKey ?? undefined} data-season={leavingSeason} data-phase="leave" opacity={1}>
            <SeasonSVG season={leavingSeason} />
          </g>
        )}
        <g key={enterKey} data-season={season} data-phase="enter" opacity={1}>
          <SeasonSVG season={season} />
        </g>
      </svg>
    </div>
  );
};

const SeasonSVG: React.FC<{ season: Season }> = ({ season }) => {
  if (season === 'spring') {
    return (
      <g>
        <g data-anim>
          <path
            d="M210 585 C250 500, 310 430, 360 360 C420 280, 500 230, 560 210 C610 195, 665 205, 720 240 C790 285, 840 360, 880 455 C915 538, 940 585, 940 585 Z"
            fill="rgba(0,0,0,0.20)"
          />
          <path d="M520 585 C535 505, 540 430, 535 360 C532 320, 520 270, 498 230" stroke="rgba(255,255,255,0.55)" strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M505 275 C460 255, 420 230, 392 200" stroke="rgba(255,255,255,0.45)" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M545 305 C595 280, 640 245, 672 210" stroke="rgba(255,255,255,0.45)" strokeWidth="8" strokeLinecap="round" fill="none" />
        </g>
        <g data-anim>
          {Array.from({ length: 16 }).map((_, i) => (
            <g key={i} data-float data-spin transform={`translate(${420 + i * 32} ${170 + (i % 5) * 18})`}>
              <path d="M0 0 C10 -12, 24 -12, 34 0 C24 12, 10 12, 0 0 Z" fill="rgba(255,183,197,0.85)" />
              <circle cx="18" cy="0" r="3" fill="rgba(255,255,255,0.65)" />
            </g>
          ))}
        </g>
      </g>
    );
  }

  if (season === 'summer') {
    return (
      <g>
        <g data-anim>
          <circle cx="960" cy="140" r="42" fill="rgba(255,241,118,0.85)" />
          {Array.from({ length: 10 }).map((_, i) => (
            <g key={i} data-spin transform={`translate(960 140) rotate(${i * 36})`}>
              <rect x="0" y="-4" width="90" height="8" rx="4" fill="rgba(255,241,118,0.35)" />
            </g>
          ))}
        </g>
        <g data-anim transform="translate(330 210)">
          <path d="M0 0 L240 40 L120 360 Z" fill="rgba(255,255,255,0.75)" />
          <path d="M0 0 L120 360 L-40 320 Z" fill="rgba(79,195,247,0.55)" />
          <path d="M240 40 L120 360 L290 330 Z" fill="rgba(79,195,247,0.40)" />
          <rect x="112" y="210" width="18" height="220" rx="9" fill="rgba(255,255,255,0.55)" />
        </g>
        <g data-anim>
          <path data-dash d="M130 560 C220 520, 300 540, 380 560 C460 580, 540 600, 640 580 C740 560, 820 520, 910 560" stroke="rgba(255,255,255,0.45)" strokeWidth="10" strokeLinecap="round" fill="none" />
          <path data-dash d="M150 610 C240 570, 320 590, 400 610 C480 630, 560 650, 660 630 C760 610, 840 570, 930 610" stroke="rgba(255,255,255,0.30)" strokeWidth="10" strokeLinecap="round" fill="none" />
        </g>
      </g>
    );
  }

  if (season === 'autumn') {
    return (
      <g>
        <g data-anim transform="translate(770 170)">
          <path
            d="M0 140 C-55 80, -50 10, 20 -10 C60 -22, 90 6, 112 36 C135 5, 170 -8, 205 10 C270 44, 275 120, 220 170 C190 198, 150 218, 112 240 C74 218, 34 198, 0 170 Z"
            fill="rgba(255,138,101,0.85)"
          />
          <path d="M112 24 L112 236" stroke="rgba(255,255,255,0.55)" strokeWidth="10" strokeLinecap="round" />
          {Array.from({ length: 7 }).map((_, i) => (
            <path key={i} d={`M112 ${60 + i * 22} L${70 + i * 6} ${86 + i * 22}`} stroke="rgba(255,255,255,0.35)" strokeWidth="6" strokeLinecap="round" />
          ))}
        </g>
        <g data-anim transform="translate(260 470)">
          <ellipse cx="210" cy="120" rx="180" ry="120" fill="rgba(0,0,0,0.18)" />
          <path d="M60 90 C60 30, 120 0, 210 0 C300 0, 360 30, 360 90 C360 150, 300 210, 210 210 C120 210, 60 150, 60 90 Z" fill="rgba(255,138,101,0.92)" />
          <path d="M170 0 C180 -35, 220 -40, 246 -10" stroke="rgba(255,255,255,0.55)" strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M115 60 C155 45, 185 35, 210 35 C235 35, 265 45, 305 60" stroke="rgba(255,255,255,0.35)" strokeWidth="10" strokeLinecap="round" fill="none" />
        </g>
      </g>
    );
  }

  return (
    <g>
      <g data-anim transform="translate(280 250)">
        <circle cx="140" cy="120" r="110" fill="rgba(255,255,255,0.80)" />
        <circle cx="140" cy="300" r="150" fill="rgba(255,255,255,0.88)" />
        <circle cx="110" cy="105" r="10" fill="rgba(0,0,0,0.55)" />
        <circle cx="170" cy="105" r="10" fill="rgba(0,0,0,0.55)" />
        <path d="M140 125 C130 145, 150 145, 140 125 Z" fill="rgba(255,138,101,0.9)" />
        <path d="M105 165 C125 185, 155 185, 175 165" stroke="rgba(0,0,0,0.25)" strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M-40 260 C10 235, 50 235, 100 260" stroke="rgba(255,255,255,0.55)" strokeWidth="18" strokeLinecap="round" fill="none" />
        <path d="M180 260 C230 235, 270 235, 320 260" stroke="rgba(255,255,255,0.55)" strokeWidth="18" strokeLinecap="round" fill="none" />
      </g>
      <g data-anim>
        {Array.from({ length: 14 }).map((_, i) => (
          <g key={i} data-float data-spin transform={`translate(${760 + (i % 7) * 60} ${120 + Math.floor(i / 7) * 70})`}>
            <path
              d="M16 0 L20 10 L32 12 L22 20 L24 32 L16 26 L8 32 L10 20 L0 12 L12 10 Z"
              fill="rgba(255,255,255,0.55)"
            />
          </g>
        ))}
      </g>
    </g>
  );
};
