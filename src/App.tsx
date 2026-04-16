import React, { useEffect, useRef, useState } from 'react';
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
import { ArrowUp, Zap, Volume2, VolumeX, Sparkles, MapPin, Flower2, Sun, Leaf, Snowflake } from 'lucide-react';
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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  const SeasonIcon = season === 'spring' ? Flower2 : season === 'summer' ? Sun : season === 'autumn' ? Leaf : Snowflake;

  useEffect(() => {
    if (!animationsEnabled) {
      gsap.globalTimeline.clear();
      ScrollTrigger.getAll().forEach(st => st.kill());
      return;
    }

    const ctx = gsap.context(() => {
      if (progressBarRef.current) {
        gsap.to(progressBarRef.current, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3,
          }
        });
      }

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

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 1000);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      ctx.revert();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [animationsEnabled, season]);

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    showNotification(soundEnabled ? t('actions.sound_off') : t('actions.sound_on'), 'info');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCollabClick = () => {
    showNotification(t('actions.collab_started'), 'success');
  };

  const handleExplore = () => {
    document.querySelector('#seasonal-info')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-gray-200 selection:text-gray-900 ${isRTL ? 'rtl' : 'ltr'} transition-all duration-1000`}>
      <SeasonParticles />
      <Navbar />
      
      <main className="relative bg-white/50">
        {/* Progress Indicator */}
        <div className="fixed top-0 left-0 right-0 h-1.5 z-[100] bg-gray-100/20 backdrop-blur-sm">
          <div 
            ref={progressBarRef} 
            className={cn("h-full bg-gradient-to-r origin-left scale-x-0 shadow-[0_0_20px_rgba(120,120,120,0.25)]",
              season === 'spring' ? 'from-pink-400 via-rose-300 to-pink-200' :
              season === 'summer' ? 'from-amber-400 via-yellow-300 to-amber-200' :
              season === 'autumn' ? 'from-orange-400 via-amber-300 to-orange-200' :
              'from-blue-400 via-cyan-300 to-blue-200'
            )} 
          />
        </div>

        <div id="explore">
          <HeroSection />
        </div>

        {/* 时空融合体验区 - Premium Gallery */}
        <section id="gallery" className="relative py-32 overflow-hidden opacity-0 transform translate-y-20">
          {/* 精致背景装饰 */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/30 to-white" />
          <div className={cn("absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] rounded-full blur-[200px] opacity-10 pointer-events-none", `bg-season-${season}`)} />
          <div className={cn("absolute bottom-1/4 right-0 w-[500px] h-[500px] rounded-full blur-[150px] opacity-8 pointer-events-none", `bg-season-${season}`)} />
          
          {/* 装饰线条 */}
          <div className="absolute top-20 left-8 w-px h-32 bg-gradient-to-b from-transparent via-gray-200 to-transparent" />
          <div className="absolute top-20 right-8 w-px h-32 bg-gradient-to-b from-transparent via-gray-200 to-transparent" />
          
          <div className="max-w-[1600px] mx-auto px-4 sm:px-8 relative z-10">
            {/* 标题区域 - 更优雅 */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", `bg-season-${season}`)}>
                    <Sparkles size={24} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.4em] text-gray-400">{t('gallery.label')}</span>
                </div>
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-6">
                  <span className="text-gray-900">{t('gallery.title')}</span>
                  <span className={cn("text-transparent bg-clip-text bg-gradient-to-r ml-4", 
                    season === 'spring' ? 'from-pink-500 to-rose-400' :
                    season === 'summer' ? 'from-amber-500 to-yellow-400' :
                    season === 'autumn' ? 'from-orange-500 to-red-400' :
                    'from-blue-500 to-cyan-400'
                  )}>{t('gallery.subtitle')}</span>
                </h2>
                <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
                  {t('gallery.description')}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-5xl font-black text-gray-900">{theme.images.length * 10}<span className="text-gray-300">+</span></p>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mt-1">{t('gallery.scenes')}</p>
                </div>
              </div>
            </div>

            {/* 主画廊 - 优化版Bento Grid */}
            <div className="grid grid-cols-12 gap-5 auto-rows-[180px] md:auto-rows-[220px]">
              {/* 大图 - 主视觉 */}
              <div className="col-span-12 md:col-span-8 row-span-3 relative overflow-hidden rounded-[2rem] group shadow-2xl cursor-pointer">
                <img 
                  src={theme.images[0]} 

                  alt={`${season} main scene`}
                  className="w-full h-full object-cover transition-all duration-[1200ms] ease-out group-hover:scale-105"
                  onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                  onError={(e) => { e.currentTarget.src = theme.images[1]; }}
                  style={{ opacity: 0, transition: 'opacity 1s ease-out' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/50" />
                
                {/* 季节标签 */}
                <div className="absolute top-6 left-6">
                  <div className="flex items-center gap-2 backdrop-blur-xl bg-white/15 border border-white/20 rounded-full px-4 py-2">
                    {season === 'spring' && <span className="text-lg">🌸</span>}
                    {season === 'summer' && <span className="text-lg">☀️</span>}
                    {season === 'autumn' && <span className="text-lg">🍁</span>}
                    {season === 'winter' && <span className="text-lg">❄️</span>}
                    <span className="text-white text-sm font-medium">
                      {t(`seasons.${season}_tag`)}
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                  <div className="flex items-end justify-between gap-6">
                    <div className="flex-1">
                      <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3">{t('gallery.immersive')}</p>
                      <h3 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-3">
                        {t(`seasons.${season}_title`)}
                      </h3>
                      <p className="text-white/70 text-sm max-w-lg leading-relaxed hidden md:block">
                        {t(`seasons.${season}_desc`)}
                      </p>
                    </div>
                    <button
                      onClick={handleExplore}
                      className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-xl hover:scale-110 hover:bg-white transition-all duration-300"
                    >
                      <ArrowUp size={24} className="text-gray-900 rotate-45" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 右侧竖图 */}
              <div className="col-span-6 md:col-span-4 row-span-3 relative overflow-hidden rounded-[2rem] group shadow-xl cursor-pointer">
                <img 
                  src={theme.images[1]} 

                  alt={`${season} scene 2`}
                  className="w-full h-full object-cover transition-all duration-[1000ms] ease-out group-hover:scale-110"
                  onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                  onError={(e) => { e.currentTarget.src = theme.images[0]; }}
                  style={{ opacity: 0, transition: 'opacity 1s ease-out' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <div className="p-4 rounded-xl backdrop-blur-xl bg-white/90 shadow-lg">
                    <h4 className="text-gray-900 text-base font-bold mb-1">{t('gallery.explore_more')}</h4>
                    <p className="text-gray-500 text-xs">{t('gallery.discover')}</p>
                  </div>
                </div>
              </div>

              {/* 底部横排图 */}
              {theme.images.slice(2, 5).map((img, i) => (
                <div 
                  key={i}
                  className="col-span-6 md:col-span-4 relative overflow-hidden rounded-2xl group shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer"
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
                  
                  {/* 悬浮图标 */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-400 shadow-lg">
                      <ArrowUp size={20} className="text-gray-900 rotate-45" />
                    </div>
                  </div>
                  
                  {/* 底部信息 */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400">
                    <p className="text-white text-sm font-medium">
                      {i === 0 ? t('gallery.texture') : i === 1 ? t('gallery.architecture') : t('gallery.lighting')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 底部统计 - 简化 */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: `${theme.images.length * 10}+`, labelKey: 'gallery.images' },
                { value: '4K', labelKey: 'gallery.quality' },
                { value: '360°', labelKey: 'gallery.panorama' },
                { value: '∞', labelKey: 'gallery.infinite' }
              ].map((stat, i) => (
                <div key={i} className="text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-3xl font-black text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t(stat.labelKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="seasonal-info" className="max-w-[1600px] mx-auto px-4 sm:px-8 py-32 opacity-0 transform translate-y-20">
          <div className="flex flex-col mb-16">
            <span className="text-xs font-black uppercase tracking-[0.5em] text-gray-400 mb-4">{t('seasonal_info.label')}</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter">{t('seasonal_info.title')}</h2>
          </div>
          <SeasonalInfo />
        </section>

        <section id="route-recommendation" className="opacity-0 transform translate-y-20">
          <RouteRecommendation />
        </section>

        <section id="routes" className="max-w-[1600px] mx-auto px-4 sm:px-8 py-20 opacity-0 transform translate-y-20">
          <MapComponent />
        </section>

        <section id="history" className="max-w-[1600px] mx-auto px-4 sm:px-8 py-32 opacity-0 transform translate-y-20">
          <Timeline />
        </section>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
          <button 
            onClick={toggleSound}
            className="w-14 h-14 bg-white border border-gray-100 text-black rounded-2xl flex items-center justify-center shadow-2xl hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300 group backdrop-blur-xl"
          >
            {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} className="text-gray-300" />}
          </button>
          {showScrollTop && (
            <button 
              onClick={scrollToTop}
              className="w-14 h-14 bg-white border border-gray-100 text-black rounded-2xl flex items-center justify-center shadow-2xl hover:bg-gray-50 hover:-translate-y-2 transition-all duration-300 group backdrop-blur-xl"
            >
              <ArrowUp size={24} className="group-hover:animate-bounce" />
            </button>
          )}
          
          <div className="group relative">
            <button 
              onClick={handleCollabClick}
              className="w-16 h-16 bg-gradient-to-br from-white to-gray-100 text-gray-900 border border-gray-200 rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 relative overflow-hidden"
            >
              <Zap size={24} className="relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-200 to-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
            <span className="absolute right-20 top-1/2 -translate-y-1/2 bg-white text-gray-900 border border-gray-200 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 whitespace-nowrap pointer-events-none shadow-2xl">
              {t('actions.start_collab')}
            </span>
          </div>
        </div>
      </main>

      <footer className="relative bg-gray-900 text-white overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0">
          <div className={cn("absolute top-0 left-0 w-96 h-96 rounded-full blur-[120px] opacity-20", `bg-season-${season}`)} />
          <div className={cn("absolute bottom-0 right-0 w-80 h-80 rounded-full blur-[100px] opacity-15", `bg-season-${season}`)} />
        </div>
        
        <div className="relative z-10">
          {/* 主要内容区域 */}
          <div className="max-w-7xl mx-auto px-8 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              
              {/* 品牌区域 */}
              <div className="lg:col-span-5 space-y-8">
                <div className="flex items-center gap-4">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl", `bg-season-${season}`)}>
                    <MapPin className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black">{t('footer.brand')}</h3>
                    <p className="text-gray-400 text-sm font-medium">{t('footer.brand_en')}</p>
                  </div>
                </div>
                
                <p className="text-lg text-gray-300 leading-relaxed max-w-md">
                  {t('footer.tagline')}
                </p>
                

              </div>
              
              {/* 导航链接 */}
              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* 探索功能 */}
                <div className="space-y-6">
                  <h4 className="text-white font-bold text-lg">{t('footer.explore_features')}</h4>
                  <ul className="space-y-3">
                    {[
                      { nameKey: 'footer.seasonal_experience', href: '#seasonal-info' },
                      { nameKey: 'footer.route_recommend', href: '#route-recommendation' },
                      { nameKey: 'footer.culture_map', href: '#routes' },
                      { nameKey: 'footer.history_timeline', href: '#history' }
                    ].map((item) => (
                      <li key={item.nameKey}>
                        <a 
                          href={item.href}
                          className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                        >
                          <span className={cn("w-1 h-1 rounded-full transition-all group-hover:w-2", `bg-season-${season}`)} />
                          {t(item.nameKey)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* 关于我们 */}
                <div className="space-y-6">
                  <h4 className="text-white font-bold text-lg">{t('footer.about_us')}</h4>
                  <ul className="space-y-3">
                    {[
                      'footer.company_intro',
                      'footer.development',
                      'footer.team',
                      'footer.partners',
                      'footer.news'
                    ].map((itemKey) => (
                      <li key={itemKey}>
                        <button className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                          <span className={cn("w-1 h-1 rounded-full transition-all group-hover:w-2", `bg-season-${season}`)} />
                          {t(itemKey)}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* 帮助支持 */}
                <div className="space-y-6">
                  <h4 className="text-white font-bold text-lg">{t('footer.help_support')}</h4>
                  <ul className="space-y-3">
                    {[
                      'footer.user_guide',
                      'footer.faq',
                      'footer.feedback',
                      'footer.tech_support',
                      'footer.contact_us'
                    ].map((itemKey) => (
                      <li key={itemKey}>
                        <button className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                          <span className={cn("w-1 h-1 rounded-full transition-all group-hover:w-2", `bg-season-${season}`)} />
                          {t(itemKey)}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                
              </div>
            </div>
          </div>
          
          {/* 分割线 */}
          <div className="border-t border-gray-800" />
          
          {/* 底部版权区域 */}
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <p className="text-gray-400 text-sm">
                  {t('common.copyright')}
                </p>
                <div className="flex items-center gap-6 text-xs">
                  <button className="text-gray-400 hover:text-white transition-colors">{t('common.privacy')}</button>
                  <button className="text-gray-400 hover:text-white transition-colors">{t('common.terms')}</button>
                  <button className="text-gray-400 hover:text-white transition-colors">{t('common.legal')}</button>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">{t('common.current_season')}</span>
                <div className="flex items-center gap-2">
                  <SeasonIcon size={16} className={cn(`text-season-${season}`)} />
                  <span className="text-white text-sm font-medium">
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
