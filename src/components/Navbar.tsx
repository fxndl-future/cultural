import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { Languages, Map, X, Menu, Sparkles } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import gsap from 'gsap';
import { ANIMATION_CONFIG } from '../utils/animationConfig';
import { useAnimations } from '../context/AnimationContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { season, setSeason, isRTL, toggleRTL } = useTheme();
  const { animationsEnabled, setAnimationsEnabled } = useAnimations();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      gsap.to(mobileMenuRef.current, {
        x: 0,
        opacity: 1,
        duration: ANIMATION_CONFIG.duration.normal,
        ease: ANIMATION_CONFIG.ease.smooth,
      });
      if (menuItemsRef.current) {
        gsap.fromTo(menuItemsRef.current.children, 
          { x: 50, opacity: 0 },
          { 
            x: 0, 
            opacity: 1, 
            stagger: 0.1, 
            duration: 0.5, 
            delay: 0.2,
            ease: ANIMATION_CONFIG.ease.main 
          }
        );
      }
    } else {
      gsap.to(mobileMenuRef.current, {
        x: '100%',
        opacity: 0,
        duration: ANIMATION_CONFIG.duration.normal,
        ease: ANIMATION_CONFIG.ease.inOut,
      });
    }
  }, [isMobileMenuOpen]);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(nextLang);
  };

  const seasons: Array<'spring' | 'summer' | 'autumn' | 'winter'> = ['spring', 'summer', 'autumn', 'winter'];
  
  const seasonConfig = {
    spring: {
      icon: '🌸',
      color: 'from-pink-400 to-pink-500',
      bgColor: 'bg-pink-500',
      label: t('common.spring'),
    },
    summer: {
      icon: '☀️',
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-500',
      label: t('common.summer'),
    },
    autumn: {
      icon: '🍁',
      color: 'from-orange-400 to-red-500',
      bgColor: 'bg-orange-500',
      label: t('common.autumn'),
    },
    winter: {
      icon: '❄️',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-cyan-500',
      label: t('common.winter'),
    },
  };

  const handleSeasonChange = (s: typeof seasons[number]) => {
    if (s === season) return;
    
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[100] pointer-events-none bg-white opacity-0';
    document.body.appendChild(overlay);
    
    const tl = gsap.timeline({
      onComplete: () => {
        setSeason(s);
        document.body.removeChild(overlay);
      }
    });
    
    tl.to(overlay, { opacity: 0.3, duration: 0.4, ease: 'power2.in' })
      .to(overlay, { opacity: 0, duration: 0.6, ease: 'power2.out' });
  };

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 py-4 transition-all duration-500",
        isScrolled 
          ? "bg-white/95 backdrop-blur-2xl border-b border-gray-100 py-3 shadow-2xl shadow-gray-200/30" 
          : "bg-transparent py-6"
      )}>
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className={cn(
            "w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg", 
            `bg-season-${season}`
          )}>
            <Map className="text-white" size={22} />
          </div>
          <h1 className={cn(
            "text-xl font-black tracking-tight transition-all duration-500 whitespace-nowrap",
            isScrolled ? "text-gray-900" : "text-white drop-shadow-lg"
          )}>
            {t('common.title')}
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className={cn(
            "hidden lg:flex items-center gap-8 text-sm font-bold transition-all duration-500",
            isScrolled ? "text-gray-600" : "text-white/90"
          )}>
            <a href="#explore" className={cn("relative group transition-all whitespace-nowrap", isScrolled ? "hover:text-black" : "hover:text-white")}>
              {t('common.explore')}
              <span className={cn("absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full", isScrolled ? "bg-black" : "bg-white")} />
            </a>
            <a href="#seasonal-info" className={cn("relative group transition-all whitespace-nowrap", isScrolled ? "hover:text-black" : "hover:text-white")}>
              {t('common.seasonal_theme')}
              <span className={cn("absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full", isScrolled ? "bg-black" : "bg-white")} />
            </a>
            <a href="#route-recommendation" className={cn("relative group transition-all whitespace-nowrap", isScrolled ? "hover:text-black" : "hover:text-white")}>
              {t('common.routes')}
              <span className={cn("absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full", isScrolled ? "bg-black" : "bg-white")} />
            </a>
            <a href="#routes" className={cn("relative group transition-all whitespace-nowrap", isScrolled ? "hover:text-black" : "hover:text-white")}>
              {t('map.plan_route')}
              <span className={cn("absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full", isScrolled ? "bg-black" : "bg-white")} />
            </a>
            <a href="#history" className={cn("relative group transition-all whitespace-nowrap", isScrolled ? "hover:text-black" : "hover:text-white")}>
              {t('common.history')}
              <span className={cn("absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full", isScrolled ? "bg-black" : "bg-white")} />
            </a>
          </div>

          <div className={cn(
            "flex items-center gap-2 md:pl-6 md:border-l transition-all duration-500",
            isScrolled ? "border-gray-200" : "border-white/20"
          )}>
            {/* Season Selector */}
            <div className={cn(
              "hidden md:flex items-center gap-1.5 p-1 rounded-full transition-all duration-500",
              isScrolled ? "bg-gray-100" : "bg-white/10 backdrop-blur-xl border border-white/10"
            )}>
              {seasons.map((s) => {
                const config = seasonConfig[s];
                const isActive = season === s;
                return (
                  <button
                    key={s}
                    onClick={() => handleSeasonChange(s)}
                    className={cn(
                      "w-8 h-8 rounded-full transition-all duration-300 flex items-center justify-center text-sm shadow-sm hover:scale-110",
                      isActive 
                        ? `bg-gradient-to-br ${config.color} text-white shadow-md ring-2 ring-white/60 scale-105` 
                        : isScrolled 
                          ? "bg-white hover:bg-gray-200 text-gray-600"
                          : "bg-white/10 hover:bg-white/20 text-white/70"
                    )}
                    title={config.label}
                    aria-label={config.label}
                  >
                    {config.icon}
                  </button>
                );
              })}
            </div>
            
            {/* Language Toggle */}
            <button 
              onClick={toggleLanguage} 
              className={cn(
                "p-2.5 rounded-xl transition-all hover:scale-110 active:scale-95",
                isScrolled 
                  ? "hover:bg-gray-100 text-gray-700" 
                  : "hover:bg-white/20 text-white"
              )} 
              title={t('common.language')}
            >
              <Languages size={18} />
            </button>

            {/* Animation Toggle */}
            <button 
              onClick={() => setAnimationsEnabled(!animationsEnabled)} 
              className={cn(
                "p-2.5 rounded-xl transition-all hover:scale-110 active:scale-95",
                isScrolled ? "hover:bg-gray-100" : "hover:bg-white/20",
                animationsEnabled 
                  ? "text-yellow-500 drop-shadow-lg" 
                  : (isScrolled ? "text-gray-400" : "text-white/50")
              )} 
              title="Toggle Animations"
            >
              <Sparkles size={18} fill={animationsEnabled ? "currentColor" : "none"} />
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className={cn(
                "lg:hidden p-2.5 rounded-xl transition-all hover:scale-110",
                isScrolled ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/20 text-white"
              )}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        ref={mobileMenuRef}
        className="fixed inset-0 z-[60] bg-white transform translate-x-full opacity-0 md:hidden flex flex-col p-8"
      >
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-4">
            <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg", `bg-season-${season}`)}>
              <Map className="text-white" size={22} />
            </div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">{t('common.title')}</h1>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all active:scale-90"
          >
            <X size={24} />
          </button>
        </div>

        <div ref={menuItemsRef} className="flex flex-col gap-6">
          <a 
            href="#explore" 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="text-4xl font-black text-gray-900 hover:translate-x-4 transition-all duration-300"
          >
            {t('common.explore')}
          </a>
          <a 
            href="#routes" 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="text-4xl font-black text-gray-900 hover:translate-x-4 transition-all duration-300"
          >
            {t('common.routes')}
          </a>
          <a 
            href="#seasonal-info" 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="text-4xl font-black text-gray-900 hover:translate-x-4 transition-all duration-300"
          >
            {t('common.seasonal_theme')}
          </a>
          <a 
            href="#route-recommendation" 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="text-4xl font-black text-gray-900 hover:translate-x-4 transition-all duration-300"
          >
            {t('map.plan_route')}
          </a>
          <a 
            href="#history" 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="text-4xl font-black text-gray-900 hover:translate-x-4 transition-all duration-300"
          >
            {t('common.history')}
          </a>
          
          <div className="h-px bg-gray-100 my-4" />
          
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t('common.settings')}</h3>
            
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-700">{t('common.seasonal_theme')}</span>
              <div className="flex gap-2">
                {seasons.map((s) => {
                  const config = seasonConfig[s];
                  const isActive = season === s;
                  return (
                    <button
                      key={s}
                      onClick={() => handleSeasonChange(s)}
                      className={cn(
                        "w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center text-lg shadow-md",
                        isActive 
                          ? `bg-gradient-to-br ${config.color} text-white scale-110 shadow-lg ring-2 ring-gray-200` 
                          : "bg-gray-100 hover:bg-gray-200"
                      )}
                      aria-label={config.label}
                    >
                      {config.icon}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <button 
              onClick={toggleLanguage} 
              className="flex items-center justify-between font-bold text-gray-700 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
            >
              <span>{t('common.language')}</span>
              <span className="bg-white px-4 py-2 rounded-xl text-sm font-bold uppercase shadow-sm">{i18n.language}</span>
            </button>
            
            <button 
              onClick={toggleRTL} 
              className="flex items-center justify-between font-bold text-gray-700 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
            >
              <span>RTL</span>
              <span className={cn(
                "w-14 h-7 rounded-full transition-colors relative",
                isRTL ? "bg-black" : "bg-gray-200"
              )}>
                <div className={cn(
                  "absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all shadow-md",
                  isRTL ? "translate-x-7" : ""
                )} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
