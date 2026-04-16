import React, { useEffect, useRef, useState } from 'react';
import { useTheme, SEASONS } from '../context/ThemeContext';
import type { Season } from '../context/ThemeContext';
import { Sparkles, Calendar, Sun, Snowflake, Leaf, Flower2, Thermometer, ArrowRight, ChevronRight, Camera, Wind, Droplets, Eye, Star, Heart } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNotification } from '../context/NotificationContext';

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

const SEASON_FULL_NAMES: Record<Season, string> = {
  spring: '春季 · Spring',
  summer: '夏季 · Summer',
  autumn: '秋季 · Autumn',
  winter: '冬季 · Winter',
};

const SEASON_DESCRIPTIONS: Record<Season, string> = {
  spring: '万物复苏，花开满园。最宜赏樱踏青，感受生机盎然的古都春色。',
  summer: '蝉鸣荷香，清凉避暑。在古建筑的阴凉处品茗，感受夏日悠然。',
  autumn: '红叶映殿，金秋如画。最佳观赏季节，摄影爱好者的天堂。',
  winter: '银装素裹，冬日暖阳。雪后的宫殿别有韵味，体验冬日静谧。',
};



const SEASON_ACCENT_COLORS: Record<Season, string> = {
  spring: 'from-pink-500 to-rose-400',
  summer: 'from-amber-500 to-yellow-400',
  autumn: 'from-orange-500 to-red-400',
  winter: 'from-blue-500 to-cyan-400',
};

const SEASON_RADAR_DATA: Record<Season, { comfort: number; crowd: number; photo: number; activity: number }> = {
  spring: { comfort: 85, crowd: 65, photo: 90, activity: 88 },
  summer: { comfort: 60, crowd: 85, photo: 75, activity: 92 },
  autumn: { comfort: 92, crowd: 70, photo: 98, activity: 85 },
  winter: { comfort: 55, crowd: 45, photo: 88, activity: 70 },
};

const SEASON_HIGHLIGHTS: Record<Season, { icon: React.ElementType; title: string; desc: string }[]> = {
  spring: [
    { icon: Flower2, title: '赏樱胜地', desc: '玉渊潭、中山公园樱花盛开' },
    { icon: Camera, title: '最佳光线', desc: '柔和的春日阳光，摄影绝佳' },
    { icon: Wind, title: '舒适天气', desc: '10-20°C，微风和煦' },
  ],
  summer: [
    { icon: Droplets, title: '荷花观赏', desc: '北海、圆明园荷花满塘' },
    { icon: Eye, title: '避暑胜地', desc: '古建筑廊下纳凉好去处' },
    { icon: Star, title: '夜景璀璨', desc: '夜游故宫，灯火辉煌' },
  ],
  autumn: [
    { icon: Leaf, title: '红叶如火', desc: '香山、长城红叶正当时' },
    { icon: Camera, title: '摄影天堂', desc: '金秋光影，层林尽染' },
    { icon: Eye, title: '能见度高', desc: '秋高气爽，远眺绝佳' },
  ],
  winter: [
    { icon: Snowflake, title: '雪景奇观', desc: '故宫雪景，美轮美奂' },
    { icon: Heart, title: '温泉养生', desc: '小汤山温泉，冬日暖身' },
    { icon: Calendar, title: '节庆氛围', desc: '春节庙会，年味十足' },
  ],
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

  const handleSeasonSwitch = (newSeason: Season) => {
    if (newSeason === season || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // 更流畅的季节切换动画
    const tl = gsap.timeline({
      onComplete: () => {
        setSeason(newSeason);
        setIsTransitioning(false);
      }
    });

    // 优化过渡动画，减少生硬感
    tl.to(heroImageRef.current, {
      rotationY: 90,
      opacity: 0,
      scale: 0.95,
      duration: 0.6,
      ease: 'power3.inOut', // 更自然的缓动
    })
    .to('.seasonal-content', {
      y: 20,
      opacity: 0,
      stagger: 0.03,
      duration: 0.4,
      ease: 'power2.inOut',
    }, '-=0.4')
    .set(heroImageRef.current, { rotationY: -90 })
    .to(heroImageRef.current, {
      rotationY: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'power4.out',
    })
    .to('.seasonal-content', {
      y: 0,
      opacity: 1,
      stagger: 0.05,
      duration: 0.6,
      ease: 'power3.out',
    }, '-=0.6');

    showNotification(`已切换至${SEASON_NAMES[newSeason]}季主题`, 'success');
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const root = containerRef.current;
      if (!root) return;

      const blocks = root.querySelectorAll('[data-reveal]');
      gsap.fromTo(
        blocks,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.6,
          stagger: 0.12,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: root,
            start: 'top 80%',
          },
        }
      );

      // 更流畅的雷达图动画
      const bars = root.querySelectorAll<HTMLElement>('.radar-bar');
      bars.forEach((bar, index) => {
        const v = Number(bar.dataset.value || '0');
        gsap.fromTo(
          bar,
          { width: 0, opacity: 0 },
          {
            width: `${v}%`,
            opacity: 1,
            duration: 2,
            delay: index * 0.15,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: bar.parentElement as Element,
              start: 'top 90%',
            },
          }
        );
      });

      // 优化光晕动画
      gsap.to('.season-glow', {
        scale: 1.15,
        opacity: 0.8,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

    }, containerRef);
    return () => ctx.revert();
  }, [season]);

  const handleCalendar = () => {
    showNotification('活动日历已开启', 'info');
  };

  const handleGenerateRoute = () => {
    showNotification('正在生成当季推荐路线...', 'success');
    document.querySelector('#route-recommendation')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEncyclopedia = () => {
    showNotification('季节百科已开启', 'info');
  };

  const handleTermClick = (term: string) => {
    setActiveTerm(activeTerm === term ? null : term);
    showNotification(`节气：${term}`, 'info');
  };

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.dataset.fallbackApplied === 'true') return;
    img.dataset.fallbackApplied = 'true';
    img.src = theme.images[0];
  };

  const SeasonIcon = SEASON_ICONS[season];
  const highlights = SEASON_HIGHLIGHTS[season];

  return (
    <div ref={containerRef} className="seasonal-layout relative overflow-hidden">
      {/* 动态季节背景 */}
      <div className={cn(
        "absolute inset-0 transition-all duration-1000",
        season === 'spring' ? 'bg-gradient-to-br from-pink-50/80 via-white to-rose-50/60' :
        season === 'summer' ? 'bg-gradient-to-br from-amber-50/80 via-white to-yellow-50/60' :
        season === 'autumn' ? 'bg-gradient-to-br from-orange-50/80 via-white to-amber-50/60' :
        'bg-gradient-to-br from-blue-50/80 via-white to-cyan-50/60'
      )} />
      
      {/* 季节光晕 */}
      <div className={cn("absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[200px] opacity-20 pointer-events-none transition-colors duration-1000", `bg-season-${season}`)} />
      <div className={cn("absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[180px] opacity-15 pointer-events-none transition-colors duration-1000", `bg-season-${season}`)} />
      
      {/* 季节飘落效果 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute animate-fall",
              season === 'spring' ? 'text-pink-300 text-2xl' :
              season === 'summer' ? 'text-yellow-300 text-lg' :
              season === 'autumn' ? 'text-orange-400 text-2xl' :
              'text-blue-200 text-sm'
            )}
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 6}s`,
              opacity: 0.4 + Math.random() * 0.3,
            }}
          >
            {season === 'spring' ? '🌸' :
             season === 'summer' ? '☀️' :
             season === 'autumn' ? '🍂' : '❄️'}
          </div>
        ))}
      </div>

      {/* 季节切换器 */}
      <div data-reveal className="relative mb-20 z-10">
        <div className="flex flex-col items-center gap-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-gray-100 shadow-sm mb-6">
              <div className={cn("w-2 h-2 rounded-full animate-pulse", `bg-season-${season}`)} />
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">Season Experience</p>
            </div>
            <h3 className="text-5xl md:text-7xl font-black tracking-tight">
              <span className={cn(
                "text-transparent bg-clip-text bg-gradient-to-r",
                SEASON_ACCENT_COLORS[season]
              )}>{SEASON_FULL_NAMES[season]}</span>
            </h3>
            <p className="text-lg text-gray-500 mt-4 max-w-xl mx-auto leading-relaxed">
              {SEASON_DESCRIPTIONS[season]}
            </p>
          </div>

          {/* 季节选择器 - 更优雅 */}
          <div className="flex p-2 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-xl">
            {SEASONS.map((s) => {
              const Icon = SEASON_ICONS[s];
              const isActive = s === season;
              return (
                <button
                  key={s}
                  onClick={() => handleSeasonSwitch(s)}
                  disabled={isTransitioning}
                  className={cn(
                    "relative px-6 md:px-10 py-4 rounded-xl transition-all duration-500 font-bold text-sm flex items-center gap-2 md:gap-3",
                    isActive 
                      ? `bg-gradient-to-r ${SEASON_ACCENT_COLORS[s]} text-white shadow-lg scale-105` 
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
                    isTransitioning && "pointer-events-none opacity-50"
                  )}
                >
                  <Icon size={20} className={cn("transition-transform", !isActive && "group-hover:rotate-12")} />
                  <span>{SEASON_NAMES[s]}季</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start relative z-10">
        {/* 左侧 - 视觉展示 */}
        <div data-reveal className="relative">
          <div 
            ref={heroImageRef}
            className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl group"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <img 
              src={theme.images[0]} 
              alt={`${season} scene`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={handleImgError}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* 季节图标 */}
            <div className="absolute top-6 right-6">
              <div className={cn(
                "w-16 h-16 rounded-2xl backdrop-blur-xl bg-white/20 border border-white/30 flex items-center justify-center shadow-xl",
                "group-hover:scale-110 transition-transform"
              )}>
                <SeasonIcon size={32} className="text-white" />
              </div>
            </div>

            {/* 底部信息 */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2">Best Activity</p>
                  <h4 className="text-white text-2xl md:text-3xl font-bold leading-tight">{info.activity}</h4>
                </div>
                <button
                  onClick={handleGenerateRoute}
                  className="shrink-0 w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-xl hover:scale-110 transition-all"
                >
                  <ArrowRight size={22} className="text-gray-900" />
                </button>
              </div>
            </div>
          </div>

          {/* 缩略图 */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {theme.images.slice(1, 4).map((img, i) => (
              <div 
                key={i}
                className="aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <img 
                  src={img} 
                  alt={`${season} detail ${i}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={handleImgError}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 右侧 - 信息展示 */}
        <div className="flex flex-col gap-6">
          {/* 季节亮点 */}
          <div data-reveal className={cn(
            "seasonal-content p-6 md:p-8 rounded-3xl border shadow-lg transition-colors duration-500",
            season === 'spring' ? 'bg-gradient-to-br from-pink-50 to-rose-50/50 border-pink-100' :
            season === 'summer' ? 'bg-gradient-to-br from-amber-50 to-yellow-50/50 border-amber-100' :
            season === 'autumn' ? 'bg-gradient-to-br from-orange-50 to-amber-50/50 border-orange-100' :
            'bg-gradient-to-br from-blue-50 to-cyan-50/50 border-blue-100'
          )}>
            <div className="flex items-center gap-2 mb-6">
              <SeasonIcon size={18} className={cn(`text-season-${season}`)} />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">季节亮点</span>
            </div>
            
            <div className="space-y-4">
              {highlights.map((item, index) => {
                const HighlightIcon = item.icon;
                return (
                  <div 
                    key={index}
                    className="seasonal-content flex items-center gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-sm hover:bg-white transition-all cursor-pointer group shadow-sm hover:shadow-md"
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform bg-gradient-to-br",
                      SEASON_ACCENT_COLORS[season]
                    )}>
                      <HighlightIcon size={22} />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-base font-bold text-gray-900 mb-0.5">{item.title}</h5>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* 节气标签 */}
          <div data-reveal className="seasonal-content p-6 md:p-8 rounded-3xl bg-white border border-gray-100 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Calendar size={16} className={cn(`text-season-${season}`)} />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">节气</span>
              </div>
              <button onClick={handleCalendar} className="text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors">
                查看全部 →
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {info.solarTerms.map((term) => (
                <button
                  key={term}
                  onClick={() => handleTermClick(term)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105",
                    activeTerm === term 
                      ? `bg-gradient-to-r ${SEASON_ACCENT_COLORS[season]} text-white shadow-md` 
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* 数据指标 */}
          <div data-reveal className="seasonal-content p-6 md:p-8 rounded-3xl bg-white border border-gray-100 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles size={16} className="text-yellow-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">季节指数</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: '舒适度', value: radarData.comfort },
                { label: '人流量', value: radarData.crowd },
                { label: '摄影指数', value: radarData.photo },
                { label: '活动丰富', value: radarData.activity }
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-gray-400">{item.label}</p>
                    <span className="text-base font-bold text-gray-900">{item.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div 
                      className={cn("radar-bar h-full rounded-full bg-gradient-to-r transition-all duration-1000", SEASON_ACCENT_COLORS[season])} 
                      data-value={item.value} 
                      style={{ width: 0 }} 
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Thermometer size={14} className="text-gray-400" />
                <p className="text-xs text-gray-500">{info.weather}</p>
              </div>
              <button
                onClick={handleEncyclopedia}
                className={cn(
                  "px-5 py-2 rounded-full text-xs font-bold text-white transition-all hover:scale-105 active:scale-95 bg-gradient-to-r shadow-md",
                  SEASON_ACCENT_COLORS[season]
                )}
              >
                了解更多
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
