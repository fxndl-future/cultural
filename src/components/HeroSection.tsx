import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, Compass, Flower2, Sun, Leaf, Snowflake } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

gsap.registerPlugin(ScrollTrigger);

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SEASON_ICONS = {
  spring: Flower2,
  summer: Sun,
  autumn: Leaf,
  winter: Snowflake,
};

export const HeroSection: React.FC = () => {
  const { season, theme } = useTheme();
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const bgImages = theme.images.slice(0, 4);
  const SeasonIcon = SEASON_ICONS[season];

  // 自动轮播背景图 - 更流畅
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % bgImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [bgImages.length]);

  // 高级3D视差效果
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 30;
      const yPos = (clientY / window.innerHeight - 0.5) * 30;

      // 背景轻微跟随
      gsap.to(bgRef.current, {
        x: xPos * 0.3,
        y: yPos * 0.3,
        rotationY: xPos * 0.02,
        rotationX: -yPos * 0.02,
        duration: 1.5,
        ease: 'power2.out',
      });

      // 标题跟随
      if (titleRef.current) {
        gsap.to(titleRef.current, {
          x: xPos * 0.08,
          y: yPos * 0.08,
          duration: 1.2,
          ease: 'power2.out',
        });
      }
      
      // 卡片视差
      if (cardsRef.current) {
        gsap.to(cardsRef.current, {
          x: xPos * 0.05,
          y: yPos * 0.05,
          duration: 1,
          ease: 'power2.out',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 主时间线动画 - 更流畅的入场
      const tl = gsap.timeline({ delay: 0.3 });
      
      // 背景优雅入场
      tl.from(bgRef.current, {
        scale: 1.3,
        opacity: 0,
        duration: 2,
        ease: 'power3.out',
      })
      // 标题分层入场
      .from(titleRef.current, {
        y: 80,
        opacity: 0,
        duration: 1.4,
        ease: 'power4.out',
      }, '-=1.2')
      // 描述文字入场
      .from(descRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      }, '-=0.8')
      // CTA按钮入场
      .from(ctaRef.current?.children || [], {
        y: 30,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.5')
      // 特色卡片入场
      .from(cardsRef.current?.children || [], {
        y: 50,
        opacity: 0,
        scale: 0.95,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.4')
      // 滚动指示器
      .from(scrollIndicatorRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
      }, '-=0.3');

      // 滚动指示器持续动画
      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleExplore = () => {
    document.querySelector('#gallery')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWatchVideo = () => {
    console.log('Watch video clicked');
  };

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      
      {/* 全屏背景图 */}
      <div ref={bgRef} className="absolute inset-0 scale-110">
        {bgImages.map((img, index) => (
          <div 
            key={index}
            className={cn(
              "absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-out",
              index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            )}
            style={{ 
              backgroundImage: `url('${img}')`,
            }}
          />
        ))}
        {/* 季节主题色叠加 */}
        <div className={cn(
          "absolute inset-0 mix-blend-multiply opacity-30",
          season === 'spring' ? 'bg-gradient-to-br from-pink-300 to-rose-200' :
          season === 'summer' ? 'bg-gradient-to-br from-amber-300 to-yellow-200' :
          season === 'autumn' ? 'bg-gradient-to-br from-orange-300 to-red-200' :
          'bg-gradient-to-br from-blue-300 to-cyan-200'
        )} />
      </div>

      {/* 优雅渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
      
      {/* 动态光效 */}
      <div className={cn(
        "absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 animate-pulse",
        `bg-season-${season}`
      )} />
      
      {/* 飘动粒子效果 */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute rounded-full animate-float",
              season === 'spring' ? 'w-2 h-2 bg-pink-300/40' :
              season === 'summer' ? 'w-3 h-3 bg-yellow-200/40' :
              season === 'autumn' ? 'w-2 h-2 bg-orange-300/40' :
              'w-1.5 h-1.5 bg-white/50'
            )}
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
      
      {/* 主内容区 */}
      <div className="relative z-10 text-center px-6 sm:px-8 max-w-5xl mx-auto w-full">
        
        {/* 顶部标签 */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-3 backdrop-blur-xl bg-white/10 border border-white/20 px-8 py-3 rounded-full shadow-2xl">
            <SeasonIcon size={16} className="text-white/80" />
            <span className="text-xs font-medium text-white/80 tracking-[0.2em]">
              {t('hero.tagline')}
            </span>
          </div>
        </div>
        
        {/* 主标题 - 优化排版 */}
        <div ref={titleRef} className="mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight text-white drop-shadow-2xl">
            <span className="block">{t('common.title')}</span>
          </h1>
          <div className="mt-4 flex justify-center">
            <div className="w-20 h-1 rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
        </div>
        
        {/* 描述文字 - 优化间距和层次 */}
        <div ref={descRef} className="mb-12">
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed font-medium mb-4">
            {t('common.subtitle')}
          </p>
          <p className="text-sm sm:text-base md:text-lg text-white/60 max-w-xl mx-auto leading-relaxed">
            {t('common.description')}
          </p>
        </div>

        {/* CTA按钮 - 优化样式 */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button 
            onClick={handleExplore}
            className={cn(
              "group relative px-10 py-4 rounded-full font-bold text-white overflow-hidden transition-all duration-500 shadow-xl hover:shadow-2xl active:scale-95 flex items-center gap-3",
              `bg-gradient-to-r hover:scale-105`,
              season === 'spring' ? 'from-pink-500 to-rose-500' :
              season === 'summer' ? 'from-amber-500 to-yellow-500' :
              season === 'autumn' ? 'from-orange-500 to-red-500' :
              'from-blue-500 to-cyan-500'
            )}
          >
            <span className="relative z-10 flex items-center gap-3 text-base">
              <Compass size={20} className="group-hover:rotate-45 transition-transform duration-500" />
              {t('hero.explore')}
            </span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          
          <button 
            onClick={handleWatchVideo}
            className="group px-8 py-4 rounded-full font-medium text-white/90 border border-white/30 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 flex items-center gap-3"
          >
            <Play size={18} className="group-hover:scale-110 transition-transform" />
            {t('hero.watch')}
          </button>
        </div>
        
        {/* 滚动指示器 */}
        <div 
          ref={scrollIndicatorRef} 
          className="flex flex-col items-center gap-3 cursor-pointer opacity-60 hover:opacity-100 transition-opacity" 
          onClick={handleExplore}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-bounce" />
          </div>
          <span className="text-xs font-medium tracking-widest text-white/50">
            {t('hero.cta')}
          </span>
        </div>
      </div>
      
      {/* 底部渐变 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
};
