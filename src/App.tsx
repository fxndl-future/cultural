import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MapComponent } from './components/MapComponent';
import { Timeline } from './components/Timeline';
import { RouteRecommendation } from './components/RouteRecommendation';
import { useTheme } from './context/ThemeContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import { AnimationProvider, useAnimations } from './context/AnimationContext';
import { SeasonParticles } from './components/SeasonParticles';
import { SeasonalInfo } from './components/SeasonalInfoNew';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUp, Zap, Volume2, VolumeX, Sparkles, MapPin, Flower2, Sun, Leaf, Snowflake, ChevronDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

gsap.registerPlugin(ScrollTrigger);

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const AppContent: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL, theme, season } = useTheme();
  const { showNotification } = useNotification();
  const { animationsEnabled } = useAnimations();
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isHeroLocked, setIsHeroLocked] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  
  const SeasonIcon = season === 'spring' ? Flower2 : season === 'summer' ? Sun : season === 'autumn' ? Leaf : Snowflake;

  // Hero 区域滚轮锁定逻辑
  useEffect(() => {
    let accumulatedDelta = 0;
    const SCROLL_THRESHOLD = 100;

    const handleWheel = (e: WheelEvent) => {
      // 只在 Hero 区域锁定滚动
      if (!isHeroLocked) return;
      
      const hero = heroRef.current;
      if (!hero) return;
      
      const rect = hero.getBoundingClientRect();
      // 检查是否在 Hero 区域内
      if (rect.top > -10 && rect.bottom > window.innerHeight * 0.5) {
        if (e.deltaY > 0) {
          e.preventDefault();
          accumulatedDelta += e.deltaY;
          
          if (accumulatedDelta > SCROLL_THRESHOLD) {
            setIsHeroLocked(false);
            // 平滑滚动到下一个 section
            const gallery = document.getElementById('gallery');
            if (gallery) {
              gallery.scrollIntoView({ behavior: 'smooth' });
            }
            accumulatedDelta = 0;
          }
        }
      }
    };

    const handleScroll = () => {
      // 当滚动到顶部时重新锁定 Hero
      if (window.scrollY < 100) {
        setIsHeroLocked(true);
      }
      setShowScrollTop(window.scrollY > 1000);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHeroLocked]);

  useEffect(() => {
    if (!animationsEnabled) {
      gsap.globalTimeline.clear();
      ScrollTrigger.getAll().forEach(st => st.kill());
      return;
    }

    const ctx = gsap.context(() => {
      const sections = ['#gallery', '#seasonal-info', '#route-recommendation', '#routes', '#history'];
      sections.forEach((id) => {
        gsap.to(id, {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: id,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });
      });
    });

    return () => ctx.revert();
  }, [animationsEnabled, season]);

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    showNotification(soundEnabled ? t('actions.sound_off') : t('actions.sound_on'), 'info');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsHeroLocked(true);
  };

  const handleCollabClick = () => {
    showNotification(t('actions.collab_started'), 'success');
  };

  const handleExplore = () => {
    setIsHeroLocked(false);
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-gray-200 selection:text-gray-900 ${isRTL ? 'rtl' : 'ltr'} transition-all duration-1000`}>
      <SeasonParticles />
      <Navbar />
      
      <main ref={mainRef} className="relative bg-white/50">
        {/* Hero Section - 全屏锁定 */}
        <div 
          ref={heroRef}
          id="explore"
          className="h-screen sticky top-0 z-10"
        >
          <HeroSection />
          {/* 向下滚动提示 */}
          <button 
            onClick={handleExplore}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors animate-bounce z-20"
          >
            <span className="text-xs font-medium uppercase tracking-widest">向下滚动</span>
            <ChevronDown size={20} />
          </button>
        </div>

        {/* 其他内容区域 - 正常滚动 */}
        <div className="relative z-20 bg-white">
          {/* Gallery Section */}
          <section id="gallery" className="relative py-20 sm:py-32 overflow-hidden opacity-0 transform translate-y-20">
            <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/30 to-white" />
            <div className={cn("absolute top-0 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1200px] h-[400px] sm:h-[600px] rounded-full blur-[150px] sm:blur-[200px] opacity-10 pointer-events-none", `bg-season-${season}`)} />
            
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 sm:gap-8 mb-12 sm:mb-20">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", `bg-season-${season}`)}>
                      <Sparkles size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-gray-400">{t('gallery.label')}</span>
                  </div>
                  <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[0.9] mb-4 sm:mb-6">
                    <span className="text-gray-900">{t('gallery.title')}</span>
                    <span className={cn("text-transparent bg-clip-text bg-gradient-to-r ml-2 sm:ml-4", 
                      season === 'spring' ? 'from-pink-500 to-rose-400' :
                      season === 'summer' ? 'from-amber-500 to-yellow-400' :
                      season === 'autumn' ? 'from-orange-500 to-red-400' :
                      'from-blue-500 to-cyan-400'
                    )}>{t('gallery.subtitle')}</span>
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed">
                    {t('gallery.description')}
                  </p>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-right">
                    <p className="text-3xl sm:text-5xl font-black text-gray-900">{theme.images.length * 10}<span className="text-gray-300">+</span></p>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mt-1">{t('gallery.scenes')}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-3 sm:gap-5 auto-rows-[100px] sm:auto-rows-[180px] md:auto-rows-[220px]">
                <div className="col-span-12 md:col-span-8 row-span-2 md:row-span-3 relative overflow-hidden rounded-2xl sm:rounded-[2rem] group shadow-2xl cursor-pointer">
                  <img 
                    src={theme.images[0]} 
                    alt={`${season} main scene`}
                    className="w-full h-full object-cover transition-all duration-[1200ms] ease-out group-hover:scale-105"
                    onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                    onError={(e) => { e.currentTarget.src = theme.images[1]; }}
                    style={{ opacity: 0, transition: 'opacity 1s ease-out' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/50" />
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                    <div className="flex items-center gap-2 backdrop-blur-xl bg-white/15 border border-white/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2">
                      {season === 'spring' && <span className="text-sm sm:text-lg">🌸</span>}
                      {season === 'summer' && <span className="text-sm sm:text-lg">☀️</span>}
                      {season === 'autumn' && <span className="text-sm sm:text-lg">🍁</span>}
                      {season === 'winter' && <span className="text-sm sm:text-lg">❄️</span>}
                      <span className="text-white text-xs sm:text-sm font-medium">
                        {t(`seasons.${season}_tag`)}
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 md:p-10">
                    <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2 sm:mb-3">{t('gallery.immersive')}</p>
                    <h3 className="text-white text-xl sm:text-3xl md:text-4xl font-bold leading-tight mb-2 sm:mb-3">
                      {t(`seasons.${season}_title`)}
                    </h3>
                    <p className="text-white/70 text-xs sm:text-sm max-w-lg leading-relaxed hidden sm:block">
                      {t(`seasons.${season}_desc`)}
                    </p>
                  </div>
                </div>

                <div className="col-span-6 md:col-span-4 row-span-2 md:row-span-3 relative overflow-hidden rounded-2xl sm:rounded-[2rem] group shadow-xl cursor-pointer">
                  <img 
                    src={theme.images[1]} 
                    alt={`${season} scene 2`}
                    className="w-full h-full object-cover transition-all duration-[1000ms] ease-out group-hover:scale-110"
                    onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                    onError={(e) => { e.currentTarget.src = theme.images[0]; }}
                    style={{ opacity: 0, transition: 'opacity 1s ease-out' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <div className="p-3 sm:p-4 rounded-xl backdrop-blur-xl bg-white/90 shadow-lg">
                      <h4 className="text-gray-900 text-sm sm:text-base font-bold mb-1">{t('gallery.explore_more')}</h4>
                      <p className="text-gray-500 text-xs">{t('gallery.discover')}</p>
                    </div>
                  </div>
                </div>

                {theme.images.slice(2, 5).map((img, i) => (
                  <div 
                    key={i}
                    className="col-span-6 md:col-span-4 relative overflow-hidden rounded-xl sm:rounded-2xl group shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer"
                  >
                    <img 
                      src={img} 
                      alt={`${season} scene ${i + 3}`}
                      className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
                      onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                      onError={(e) => { e.currentTarget.src = theme.images[0]; }}
                      style={{ opacity: 0, transition: 'opacity 0.8s ease-out' }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-400 shadow-lg">
                        <ArrowUp size={16} className="sm:w-5 sm:h-5 text-gray-900 rotate-45" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400">
                      <p className="text-white text-xs sm:text-sm font-medium">
                        {i === 0 ? t('gallery.texture') : i === 1 ? t('gallery.architecture') : t('gallery.lighting')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                {[
                  { value: `${theme.images.length * 10}+`, labelKey: 'gallery.images' },
                  { value: '4K', labelKey: 'gallery.quality' },
                  { value: '360°', labelKey: 'gallery.panorama' },
                  { value: '∞', labelKey: 'gallery.infinite' }
                ].map((stat, i) => (
                  <div key={i} className="text-center p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t(stat.labelKey)}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="seasonal-info" className="max-w-[1600px] mx-auto px-4 sm:px-8 py-20 sm:py-32 opacity-0 transform translate-y-20">
            <div className="flex flex-col mb-8 sm:mb-16">
              <span className="text-xs font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] text-gray-400 mb-3 sm:mb-4">{t('seasonal_info.label')}</span>
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter">{t('seasonal_info.title')}</h2>
            </div>
            <SeasonalInfo />
          </section>

          <section id="route-recommendation" className="opacity-0 transform translate-y-20">
            <RouteRecommendation />
          </section>

          <section id="routes" className="max-w-[1600px] mx-auto px-4 sm:px-8 py-16 sm:py-20 opacity-0 transform translate-y-20">
            <MapComponent />
          </section>

          <section id="history" className="max-w-[1600px] mx-auto px-4 sm:px-8 py-20 sm:py-32 opacity-0 transform translate-y-20">
            <Timeline />
          </section>
        </div>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex flex-col gap-3">
          <button 
            onClick={toggleSound}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-white border border-gray-100 text-black rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300 group backdrop-blur-xl"
          >
            {soundEnabled ? <Volume2 size={20} className="sm:w-6 sm:h-6" /> : <VolumeX size={20} className="sm:w-6 sm:h-6 text-gray-300" />}
          </button>
          {showScrollTop && (
            <button 
              onClick={scrollToTop}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-white border border-gray-100 text-black rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl hover:bg-gray-50 hover:-translate-y-2 transition-all duration-300 group backdrop-blur-xl"
            >
              <ArrowUp size={20} className="sm:w-6 sm:h-6 group-hover:animate-bounce" />
            </button>
          )}
          
          <div className="group relative">
            <button 
              onClick={handleCollabClick}
              className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-white to-gray-100 text-gray-900 border border-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 relative overflow-hidden"
            >
              <Zap size={20} className="sm:w-6 sm:h-6 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-200 to-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
            <span className="absolute right-14 sm:right-20 top-1/2 -translate-y-1/2 bg-white text-gray-900 border border-gray-200 text-[10px] font-black uppercase tracking-widest px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 whitespace-nowrap pointer-events-none shadow-2xl">
              {t('actions.start_collab')}
            </span>
          </div>
        </div>
      </main>

      <footer className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className={cn("absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-[100px] sm:blur-[120px] opacity-20", `bg-season-${season}`)} />
          <div className={cn("absolute bottom-0 right-0 w-48 sm:w-80 h-48 sm:h-80 rounded-full blur-[80px] sm:blur-[100px] opacity-15", `bg-season-${season}`)} />
        </div>
        
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-16">
              <div className="lg:col-span-5 space-y-6 sm:space-y-8">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={cn("w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-xl", `bg-season-${season}`)}>
                    <MapPin className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black">{t('footer.brand')}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm font-medium">{t('footer.brand_en')}</p>
                  </div>
                </div>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-md">
                  {t('footer.tagline')}
                </p>
              </div>
              
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                <div className="space-y-4 sm:space-y-6">
                  <h4 className="text-white font-bold text-base sm:text-lg">{t('footer.explore_features')}</h4>
                  <ul className="space-y-2 sm:space-y-3">
                    {[
                      { nameKey: 'footer.seasonal_experience', href: '#seasonal-info' },
                      { nameKey: 'footer.route_recommend', href: '#route-recommendation' },
                      { nameKey: 'footer.culture_map', href: '#routes' },
                      { nameKey: 'footer.history_timeline', href: '#history' }
                    ].map((item) => (
                      <li key={item.nameKey}>
                        <a 
                          href={item.href}
                          className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group text-sm sm:text-base"
                        >
                          <span className={cn("w-1 h-1 rounded-full transition-all group-hover:w-2", `bg-season-${season}`)} />
                          {t(item.nameKey)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-4 sm:space-y-6">
                  <h4 className="text-white font-bold text-base sm:text-lg">{t('footer.about_us')}</h4>
                  <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-400">
                    <li className="hover:text-white transition-colors cursor-pointer">{t('footer.company')}</li>
                    <li className="hover:text-white transition-colors cursor-pointer">{t('footer.team')}</li>
                    <li className="hover:text-white transition-colors cursor-pointer">{t('footer.careers')}</li>
                    <li className="hover:text-white transition-colors cursor-pointer">{t('footer.press')}</li>
                  </ul>
                </div>
                
                <div className="space-y-4 sm:space-y-6">
                  <h4 className="text-white font-bold text-base sm:text-lg">{t('footer.support')}</h4>
                  <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-400">
                    <li className="hover:text-white transition-colors cursor-pointer">{t('footer.help_center')}</li>
                    <li className="hover:text-white transition-colors cursor-pointer">{t('footer.contact')}</li>
                    <li className="hover:text-white transition-colors cursor-pointer">{t('footer.feedback')}</li>
                    <li className="hover:text-white transition-colors cursor-pointer">{t('footer.api')}</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <p className="text-gray-500 text-xs sm:text-sm">
                  © 2024 {t('footer.brand')}. {t('footer.rights')}
                </p>
                <div className="flex items-center gap-4 sm:gap-6 text-xs">
                  <button className="text-gray-400 hover:text-white transition-colors">{t('common.privacy')}</button>
                  <button className="text-gray-400 hover:text-white transition-colors">{t('common.terms')}</button>
                  <button className="text-gray-400 hover:text-white transition-colors">{t('common.legal')}</button>
                </div>
              </div>
              
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-gray-400 text-xs sm:text-sm">{t('common.current_season')}</span>
                <div className="flex items-center gap-2">
                  <SeasonIcon size={14} className={cn(`text-season-${season}`, "sm:w-4 sm:h-4")} />
                  <span className="text-white text-xs sm:text-sm font-medium">
                    {t(`seasons.${season}`)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <AnimationProvider>
        <AppContent />
      </AnimationProvider>
    </NotificationProvider>
  );
};

export default App;
