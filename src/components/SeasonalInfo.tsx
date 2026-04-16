import React, { useEffect, useRef, useState } from 'react';
import { useTheme, SEASONS } from '../context/ThemeContext';
import type { Season } from '../context/ThemeContext';
import { Cloud, Thermometer, Shirt, MapPin, ArrowRight, Sparkles, Calendar, Sun, Snowflake, Leaf, Flower2, Wind, Droplets, Eye } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNotification } from '../context/NotificationContext';
import { WeatherCanvas } from './WeatherCanvas';

gsap.registerPlugin(ScrollTrigger);

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SEASON_ICONS: Record<Season, React.ElementType> = {
  spring: Flower2,
  summer: Sun,
  autumn: Leaf,
  winter: Snowflake,
};

const SEASON_NAMES: Record<Season, string> = {
  spring: '春',
  summer: '夏',
  autumn: '秋',
  winter: '冬',
};

const SEASON_RADAR_DATA: Record<Season, { comfort: number; crowd: number; photo: number; activity: number }> = {
  spring: { comfort: 85, crowd: 65, photo: 90, activity: 88 },
  summer: { comfort: 60, crowd: 85, photo: 75, activity: 92 },
  autumn: { comfort: 92, crowd: 70, photo: 98, activity: 85 },
  winter: { comfort: 55, crowd: 45, photo: 88, activity: 70 },
};

export const SeasonalInfo: React.FC = () => {
  const { season, theme, setSeason } = useTheme();
  const { showNotification } = useNotification();
  const { info } = theme;
  const containerRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeTerm, setActiveTerm] = useState<string | null>(null);
  const radarData = SEASON_RADAR_DATA[season];

  // 高级季节切换动画
  const handleSeasonSwitch = (newSeason: Season) => {
    if (newSeason === season || isTransitioning) return;
    
    setIsTransitioning(true);
    
    const tl = gsap.timeline({
      onComplete: () => {
        setSeason(newSeason);
        setIsTransitioning(false);
      }
    });

    // 3D翻转退出动画
    tl.to(heroImageRef.current, {
      rotationY: 90,
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      ease: 'power2.in',
    })
    .to('.seasonal-content', {
      y: 30,
      opacity: 0,
      stagger: 0.05,
      duration: 0.3,
      ease: 'power2.in',
    }, '-=0.3')
    .to('.radar-bar', {
      width: 0,
      duration: 0.3,
      ease: 'power2.in',
    }, '-=0.2')
    // 切换后入场动画
    .set(heroImageRef.current, { rotationY: -90 })
    .to(heroImageRef.current, {
      rotationY: 0,
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: 'power3.out',
    })
    .to('.seasonal-content', {
      y: 0,
      opacity: 1,
      stagger: 0.08,
      duration: 0.5,
      ease: 'power3.out',
    }, '-=0.4');

    showNotification(`已切换至${SEASON_NAMES[newSeason]}季主题`, 'success');
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const root = document.querySelector('.seasonal-layout');
      if (!root) return;

      // 增强的入场动画
      const blocks = root.querySelectorAll('[data-reveal]');
      gsap.fromTo(
        blocks,
        { y: 60, opacity: 0, rotationX: -15 },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: root,
            start: 'top 75%',
          },
        }
      );

      // 雷达图动画增强
      const bars = root.querySelectorAll<HTMLElement>('.radar-bar');
      bars.forEach((bar, index) => {
        const v = Number(bar.dataset.value || '0');
        gsap.fromTo(
          bar,
          { width: 0, opacity: 0 },
          {
            width: `${v}%`,
            opacity: 1,
            duration: 1.5,
            delay: index * 0.15,
            ease: 'elastic.out(1, 0.5)',
            scrollTrigger: {
              trigger: bar.parentElement as Element,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // 节气标签悬浮动画
      gsap.to('.solar-term-tag', {
        y: -3,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          each: 0.2,
          repeat: -1,
          yoyo: true,
        },
      });

      // 图片视差效果
      if (heroImageRef.current) {
        gsap.to(heroImageRef.current.querySelector('img'), {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: heroImageRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      // 季节切换器光晕动画
      gsap.to('.season-glow', {
        scale: 1.2,
        opacity: 0.6,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

    });
    return () => ctx.revert();
  }, [season]);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCalendar = () => {
    showNotification('活动日历已为你展开（示例）：后续可接入真实节庆与活动 API', 'info');
  };

  const handleGenerateRoute = () => {
    showNotification('已根据当季偏好生成路线（示例）：正在跳转到路线规划', 'success');
    scrollTo('#route-recommendation');
  };

  const handleEncyclopedia = () => {
    showNotification('季节百科已开启（示例）：后续可补全 24 节气图文与 3D 模型', 'info');
  };

  const handleTermClick = (term: string) => {
    setActiveTerm(activeTerm === term ? null : term);
    
    // 节气点击动画
    gsap.to(`.term-${term.replace(/\s/g, '')}`, {
      scale: 1.1,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out',
    });
    
    showNotification(`节气：${term} - 查看详细信息`, 'info');
  };

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const fallback = theme.images[0];
    if (img.dataset.fallbackApplied === 'true') {
      img.style.opacity = '1';
      return;
    }
    img.dataset.fallbackApplied = 'true';
    img.src = fallback;
  };

  const SeasonIcon = SEASON_ICONS[season];

  return (
    <div ref={containerRef} className="seasonal-layout">
      {/* 季节快速切换器 */}
      <div 
        className="flex items-center justify-center gap-4 mb-16"
        data-reveal
      >
        <div className="flex p-2 bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-2xl">
          {SEASONS.map((s) => {
            const Icon = SEASON_ICONS[s];
            const isActive = s === season;
            return (
              <button
                key={s}
                onClick={() => handleSeasonSwitch(s)}
                disabled={isTransitioning}
                className={cn(
                  "relative px-8 py-4 rounded-[1.5rem] transition-all duration-500 font-black uppercase tracking-widest text-xs flex items-center gap-3 group",
                  isActive 
                    ? `bg-season-${s} text-white shadow-2xl scale-105` 
                    : "text-gray-400 hover:text-gray-800 hover:bg-gray-50",
                  isTransitioning && "pointer-events-none"
                )}
              >
                {isActive && (
                  <div className={cn("season-glow absolute inset-0 rounded-[1.5rem] opacity-30", `bg-season-${s}`)} />
                )}
                <Icon size={18} className={cn("relative z-10 transition-transform", isActive ? "" : "group-hover:rotate-12")} />
                <span className="relative z-10">{SEASON_NAMES[s]}季</span>
                {isActive && (
                  <Sparkles size={14} className="relative z-10 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5">
          <div data-reveal className="seasonal-content flex items-center gap-3 mb-8">
            <div className={cn("w-3 h-3 rounded-full animate-pulse", `bg-season-${season}`)} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">
              Seasonal Brief
            </span>
            <SeasonIcon size={16} className={cn("ml-auto", `text-season-${season}`)} />
          </div>

          <div data-reveal className="seasonal-content space-y-10">
            <div className="space-y-4">
              <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] italic">
                {info.activity}
              </h3>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
                {info.weather} · 建议穿搭：{info.clothing}
              </p>
            </div>

            <div className="border-t border-black/10 pt-8 space-y-6">
              <div data-reveal className="seasonal-content flex items-start gap-4 group cursor-pointer hover:bg-gray-50/50 p-4 -m-4 rounded-2xl transition-all">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg group-hover:scale-110 transition-transform", `bg-season-${season}`)}>
                  <Cloud size={22} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2 flex items-center gap-2">
                    Weather
                    <Wind size={12} className="animate-pulse" />
                  </p>
                  <p className="text-base font-bold text-gray-900">{info.weather}</p>
                </div>
              </div>

              <div data-reveal className="seasonal-content flex items-start gap-4 group cursor-pointer hover:bg-gray-50/50 p-4 -m-4 rounded-2xl transition-all">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg group-hover:scale-110 transition-transform", `bg-season-${season}`)}>
                  <Shirt size={22} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2 flex items-center gap-2">
                    Clothing
                    <Droplets size={12} />
                  </p>
                  <p className="text-base font-bold text-gray-900">{info.clothing}</p>
                </div>
              </div>

              <div data-reveal className="seasonal-content flex items-start gap-4 group cursor-pointer hover:bg-gray-50/50 p-4 -m-4 rounded-2xl transition-all">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg group-hover:scale-110 transition-transform", `bg-season-${season}`)}>
                  <MapPin size={22} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2 flex items-center gap-2">
                    Spotlight
                    <Eye size={12} />
                  </p>
                  <p className="text-base font-bold text-gray-900">{info.recommendedSpots[0]}</p>
                </div>
              </div>
            </div>

            <div data-reveal className="seasonal-content flex flex-wrap items-center gap-4">
              <button
                onClick={handleCalendar}
                aria-label="打开活动日历"
                className={cn(
                  "inline-flex items-center gap-3 px-8 py-4 rounded-full text-xs font-black uppercase tracking-[0.3em] text-white shadow-xl active:scale-95 transition-all hover:shadow-2xl hover:-translate-y-1 group",
                  `bg-season-${season}`
                )}
              >
                <Calendar size={16} className="group-hover:rotate-12 transition-transform" />
                查看活动日历
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={handleGenerateRoute}
                aria-label="生成当季路线并跳转到路线规划"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-xs font-black uppercase tracking-[0.3em] bg-white hover:bg-gray-50 transition-all border border-gray-200 shadow-lg hover:shadow-xl active:scale-95 group"
              >
                <Sparkles size={16} className="text-yellow-500 group-hover:rotate-12 transition-transform" />
                生成当季路线
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div 
            ref={heroImageRef}
            data-reveal 
            className="seasonal-content relative rounded-[3rem] overflow-hidden border border-white/30 shadow-2xl bg-black"
            style={{ transformStyle: 'preserve-3d', perspective: '1200px' }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/20 to-transparent z-10" />
            <img
              src={theme.images[2] ?? theme.images[0]}
              alt={`${season} hero`}
              loading="lazy"
              className="w-full h-[520px] object-cover will-change-transform scale-110"
              onLoad={(e) => (e.currentTarget.style.opacity = '1')}
              onError={handleImgError}
              style={{ opacity: 0, transition: 'opacity 0.8s' }}
            />

            <div className="absolute inset-0 z-20 flex items-end p-10">
              <div className="max-w-xl">
                <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.5em] mb-4 flex items-center gap-2">
                  <Calendar size={12} />
                  Solar Terms · 二十四节气
                </p>
                <div className="flex flex-wrap gap-3">
                  {info.solarTerms.map((term, index) => (
                    <button
                      key={term}
                      onClick={() => handleTermClick(term)}
                      aria-label={`打开节气百科：${term}`}
                      className={cn(
                        `solar-term-tag term-${term.replace(/\s/g, '')} px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] backdrop-blur-md transition-all duration-300 border`,
                        activeTerm === term
                          ? "bg-white text-black border-white scale-110 shadow-xl"
                          : "bg-white/10 border-white/20 text-white/90 hover:bg-white/20 hover:scale-105"
                      )}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute top-6 right-6 z-30">
              <WeatherCanvas />
            </div>
            
            {/* 季节指示器 */}
            <div className="absolute top-6 left-6 z-30">
              <div className={cn(
                "px-5 py-3 rounded-2xl backdrop-blur-xl border border-white/20 flex items-center gap-3",
                "bg-white/10"
              )}>
                <SeasonIcon size={20} className="text-white" />
                <span className="text-white text-xs font-black uppercase tracking-widest">
                  {SEASON_NAMES[season]}季模式
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <div data-reveal className="seasonal-content relative rounded-[2.5rem] overflow-hidden border border-white/30 shadow-xl group cursor-pointer">
              <img
                src={theme.images[3] ?? theme.images[0]}
                alt={`${season} detail 1`}
                loading="lazy"
                className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                onError={handleImgError}
                style={{ opacity: 0, transition: 'opacity 0.8s' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white/60 text-[9px] font-black uppercase tracking-widest mb-2">Hot Spot</p>
                  <p className="text-white text-lg font-black">{info.recommendedSpots[0]}</p>
                </div>
              </div>
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100">
                <ArrowRight size={16} className="text-white" />
              </div>
            </div>

            <div data-reveal className="seasonal-content relative rounded-[2.5rem] overflow-hidden border border-white/30 shadow-xl group cursor-pointer">
              <img
                src={theme.images[4] ?? theme.images[1] ?? theme.images[0]}
                alt={`${season} detail 2`}
                loading="lazy"
                className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                onError={handleImgError}
                style={{ opacity: 0, transition: 'opacity 0.8s' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white/60 text-[9px] font-black uppercase tracking-widest mb-2">Deep Dive</p>
                  <p className="text-white text-lg font-black">{info.recommendedSpots[1] ?? info.recommendedSpots[0]}</p>
                </div>
              </div>
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100">
                <ArrowRight size={16} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 pt-16 border-t border-black/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div data-reveal className="seasonal-content flex items-center justify-between mb-8">
              <h4 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
                <SeasonIcon size={24} className={`text-season-${season}`} />
                当季推荐清单
              </h4>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">
                Curated
              </span>
            </div>
            <div className="space-y-6">
              {info.recommendedSpots.map((spot, idx) => (
                <div 
                  data-reveal 
                  key={spot} 
                  className="seasonal-content flex items-baseline gap-6 group cursor-pointer"
                  onClick={() => showNotification(`正在加载 ${spot} 的详细信息...`, 'info')}
                >
                  <span className={cn(
                    "text-5xl font-black leading-none select-none transition-colors duration-300",
                    `text-season-${season}/20 group-hover:text-season-${season}/40`
                  )}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 border-b border-black/10 pb-6 group-hover:border-black/20 transition-colors">
                    <p className="text-xl font-black text-gray-900 group-hover:text-black transition-colors flex items-center gap-3">
                      {spot}
                      <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </p>
                    <p className="text-sm text-gray-600 font-medium mt-2">
                      适合本季的光影、气温与人流节奏，建议预留 2–3 小时沉浸游览。
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div data-reveal className="seasonal-content rounded-[3rem] bg-white/70 border border-white/40 backdrop-blur-xl shadow-2xl p-10">
              <div className="flex items-center justify-between mb-10">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 flex items-center gap-2">
                  <Sparkles size={14} className="text-yellow-500" />
                  Season Radar · 季节指数
                </p>
                <div className={cn("w-3 h-3 rounded-full animate-pulse", `bg-season-${season}`)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Comfort 舒适度</p>
                    <span className="text-sm font-black">{radarData.comfort}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-black/5 overflow-hidden">
                    <div className={cn("radar-bar h-full rounded-full transition-all", `bg-season-${season}`)} data-value={radarData.comfort} style={{ width: 0 }} />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">
                    {radarData.comfort >= 80 ? '非常适宜出行' : radarData.comfort >= 60 ? '适宜出行' : '建议做好准备'}
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Crowd 人流量</p>
                    <span className="text-sm font-black">{radarData.crowd}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-black/5 overflow-hidden">
                    <div className={cn("radar-bar h-full rounded-full transition-all", `bg-season-${season}`)} data-value={radarData.crowd} style={{ width: 0 }} />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">
                    {radarData.crowd >= 70 ? '人流较多' : radarData.crowd >= 50 ? '人流适中' : '人流较少'}
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Photo 摄影指数</p>
                    <span className="text-sm font-black">{radarData.photo}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-black/5 overflow-hidden">
                    <div className={cn("radar-bar h-full rounded-full transition-all", `bg-season-${season}`)} data-value={radarData.photo} style={{ width: 0 }} />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">
                    {radarData.photo >= 85 ? '光影绝佳' : radarData.photo >= 70 ? '光影优秀' : '光影一般'}
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Activity 活动丰富</p>
                    <span className="text-sm font-black">{radarData.activity}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-black/5 overflow-hidden">
                    <div className={cn("radar-bar h-full rounded-full transition-all", `bg-season-${season}`)} data-value={radarData.activity} style={{ width: 0 }} />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">
                    {radarData.activity >= 85 ? '活动丰富多彩' : radarData.activity >= 70 ? '活动较多' : '活动较少'}
                  </p>
                </div>
              </div>

              <div className="mt-12 pt-10 border-t border-black/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <Thermometer size={18} className="text-gray-400" />
                  <p className="text-sm font-bold text-gray-600">提示：建议提前 24 小时查看降雨/风速变化，调整路线节奏。</p>
                </div>
                <button
                  onClick={handleEncyclopedia}
                  aria-label="打开季节百科"
                  className="inline-flex items-center gap-3 px-7 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.5em] bg-black text-white hover:bg-gray-800 transition-all active:scale-95 group"
                >
                  打开季节百科
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
