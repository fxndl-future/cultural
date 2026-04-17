import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Route, Clock, Star, ChevronRight, Sparkles, 
  Camera, Footprints,
  Share2, Download, Navigation, MapPin
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

gsap.registerPlugin(ScrollTrigger);

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RecommendedRoute {
  id: string;
  name: string;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  spots: string[];
  highlights: string[];
  bestTime: string;
  rating: number;
  reviews: number;
  image: string;
  tags: string[];
  seasonMatch: number;
}

const SEASON_ROUTES: Record<string, RecommendedRoute[]> = {
  spring: [
    {
      id: 'spring-1',
      name: '春日赏樱精华游',
      duration: '4小时',
      difficulty: 'easy',
      spots: ['玉渊潭公园', '中山公园', '北海公园'],
      highlights: ['樱花大道', '古建筑映衬', '湖畔野餐'],
      bestTime: '09:00 - 13:00',
      rating: 4.9,
      reviews: 2847,
      image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&q=80&w=800',
      tags: ['赏花', '摄影', '亲子'],
      seasonMatch: 98,
    },
    {
      id: 'spring-2',
      name: '故宫春韵深度游',
      duration: '6小时',
      difficulty: 'medium',
      spots: ['故宫博物院', '景山公园', '北海公园'],
      highlights: ['御花园牡丹', '万春亭远眺', '白塔倒影'],
      bestTime: '08:30 - 14:30',
      rating: 4.8,
      reviews: 3562,
      image: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&q=80&w=800',
      tags: ['历史', '文化', '深度'],
      seasonMatch: 95,
    },
    {
      id: 'spring-3',
      name: '踏青骑行环线',
      duration: '5小时',
      difficulty: 'hard',
      spots: ['奥林匹克森林公园', '鸟巢', '水立方'],
      highlights: ['环湖骑行', '现代建筑', '生态湿地'],
      bestTime: '07:00 - 12:00',
      rating: 4.7,
      reviews: 1893,
      image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=800',
      tags: ['运动', '骑行', '户外'],
      seasonMatch: 92,
    },
  ],
  summer: [
    {
      id: 'summer-1',
      name: '避暑皇家园林游',
      duration: '7小时',
      difficulty: 'medium',
      spots: ['颐和园', '圆明园', '北京大学'],
      highlights: ['昆明湖泛舟', '荷花观赏', '西洋楼遗址'],
      bestTime: '06:00 - 13:00',
      rating: 4.9,
      reviews: 4521,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
      tags: ['避暑', '园林', '历史'],
      seasonMatch: 96,
    },
    {
      id: 'summer-2',
      name: '什刹海夜游路线',
      duration: '4小时',
      difficulty: 'easy',
      spots: ['什刹海', '烟袋斜街', '南锣鼓巷'],
      highlights: ['夜景灯光', '胡同文化', '特色小吃'],
      bestTime: '18:00 - 22:00',
      rating: 4.8,
      reviews: 3891,
      image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=800',
      tags: ['夜游', '美食', '休闲'],
      seasonMatch: 94,
    },
    {
      id: 'summer-3',
      name: '慕田峪长城日出游',
      duration: '8小时',
      difficulty: 'hard',
      spots: ['慕田峪长城', '红螺寺', '雁栖湖'],
      highlights: ['长城日出', '古寺祈福', '湖光山色'],
      bestTime: '04:00 - 12:00',
      rating: 4.9,
      reviews: 2156,
      image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=800',
      tags: ['日出', '长城', '挑战'],
      seasonMatch: 88,
    },
  ],
  autumn: [
    {
      id: 'autumn-1',
      name: '香山红叶经典游',
      duration: '5小时',
      difficulty: 'medium',
      spots: ['香山公园', '碧云寺', '八大处'],
      highlights: ['红叶谷', '古寺禅意', '登高远眺'],
      bestTime: '08:00 - 13:00',
      rating: 4.9,
      reviews: 5234,
      image: 'https://images.unsplash.com/photo-1506355683710-bd071c0a5828?auto=format&fit=crop&q=80&w=800',
      tags: ['红叶', '登山', '摄影'],
      seasonMatch: 99,
    },
    {
      id: 'autumn-2',
      name: '长城金秋徒步',
      duration: '6小时',
      difficulty: 'hard',
      spots: ['箭扣长城', '慕田峪长城'],
      highlights: ['野长城穿越', '秋色全景', '户外摄影'],
      bestTime: '07:00 - 13:00',
      rating: 4.8,
      reviews: 1876,
      image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=800',
      tags: ['徒步', '挑战', '风光'],
      seasonMatch: 95,
    },
    {
      id: 'autumn-3',
      name: '皇城根文化漫步',
      duration: '4小时',
      difficulty: 'easy',
      spots: ['天坛公园', '前门大街', '大栅栏'],
      highlights: ['银杏大道', '祈年殿', '老北京风情'],
      bestTime: '14:00 - 18:00',
      rating: 4.7,
      reviews: 2943,
      image: 'https://images.unsplash.com/photo-1477601263368-146caf1c9c45?auto=format&fit=crop&q=80&w=800',
      tags: ['文化', '漫步', '美食'],
      seasonMatch: 91,
    },
  ],
  winter: [
    {
      id: 'winter-1',
      name: '故宫雪景摄影游',
      duration: '5小时',
      difficulty: 'medium',
      spots: ['故宫博物院', '角楼', '筒子河'],
      highlights: ['红墙白雪', '角楼倒影', '宫廷建筑'],
      bestTime: '08:00 - 13:00',
      rating: 4.9,
      reviews: 4123,
      image: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&q=80&w=800',
      tags: ['雪景', '摄影', '文化'],
      seasonMatch: 97,
    },
    {
      id: 'winter-2',
      name: '什刹海冰雪体验',
      duration: '4小时',
      difficulty: 'easy',
      spots: ['什刹海冰场', '恭王府', '鼓楼'],
      highlights: ['冰上运动', '王府文化', '钟鼓楼夜景'],
      bestTime: '13:00 - 17:00',
      rating: 4.8,
      reviews: 3567,
      image: 'https://images.unsplash.com/photo-1457269449834-928af64c654d?auto=format&fit=crop&q=80&w=800',
      tags: ['冰雪', '体验', '亲子'],
      seasonMatch: 95,
    },
    {
      id: 'winter-3',
      name: '温泉养生之旅',
      duration: '8小时',
      difficulty: 'easy',
      spots: ['小汤山温泉', '昌平十三陵', '居庸关'],
      highlights: ['温泉疗养', '皇陵探秘', '长城远眺'],
      bestTime: '09:00 - 17:00',
      rating: 4.7,
      reviews: 2134,
      image: 'https://images.unsplash.com/photo-1486365227551-f3f90034a57c?auto=format&fit=crop&q=80&w=800',
      tags: ['温泉', '养生', '休闲'],
      seasonMatch: 89,
    },
  ],
};

const DIFFICULTY_COLORS = {
  easy: 'bg-green-500',
  medium: 'bg-yellow-500',
  hard: 'bg-red-500',
};

const DIFFICULTY_TEXT = {
  easy: '轻松',
  medium: '适中',
  hard: '挑战',
};

export const RouteRecommendation: React.FC = () => {
  const { season, theme } = useTheme();
  const { showNotification } = useNotification();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const routes = SEASON_ROUTES[season] || SEASON_ROUTES.spring;
  
  const filteredRoutes = activeFilter === 'all' 
    ? routes 
    : routes.filter(r => r.difficulty === activeFilter);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      if (headerRef.current) {
        gsap.fromTo(headerRef.current.children,
          { y: 80, opacity: 0, rotationX: -20 },
          {
            y: 0,
            opacity: 1,
            rotationX: 0,
            duration: 1.6,
            stagger: 0.2,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
            }
          }
        );
      }

      // Cards staggered entrance with enhanced 3D effect
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        
        gsap.fromTo(card,
          { 
            y: 120, 
            opacity: 0, 
            rotationY: index % 2 === 0 ? -45 : 45,
            rotationX: -15,
            scale: 0.8,
            transformPerspective: 1500,
            transformOrigin: 'center center'
          },
          {
            y: 0,
            opacity: 1,
            rotationY: 0,
            rotationX: 0,
            scale: 1,
            duration: 1.4,
            delay: index * 0.12,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      });

      // Enhanced floating animation for sparkles and icons
      gsap.to('.route-sparkle', {
        y: -12,
        rotation: 20,
        scale: 1.1,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          each: 0.4,
          repeat: -1,
          yoyo: true
        },
      });

      // Background element animations
      gsap.to('.route-bg-element', {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none',
      });

    }, containerRef);

    return () => ctx.revert();
  }, [season, filteredRoutes]);

  const handleCardHover = (card: HTMLDivElement, isEntering: boolean, routeId: string) => {
    if (isEntering) {
      setHoveredCard(routeId);
      // 更流畅的悬浮动画
      gsap.to(card, {
        scale: 1.05,
        y: -16,
        rotationX: 2,
        rotationY: 1,
        boxShadow: '0 40px 80px -20px rgba(0,0,0,0.25)',
        duration: 0.6,
        ease: 'power3.out',
      });
      gsap.to(card.querySelector('.card-image'), {
        scale: 1.12,
        rotation: 0.5,
        duration: 0.8,
        ease: 'power3.out',
      });
      gsap.to(card.querySelector('.card-overlay'), {
        opacity: 0.3,
        duration: 0.4,
      });
      // 添加内容微妙移动
      gsap.to(card.querySelector('.card-content'), {
        y: -2,
        duration: 0.4,
        ease: 'power2.out',
      });
    } else {
      setHoveredCard(null);
      gsap.to(card, {
        scale: 1,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)',
        duration: 0.6,
        ease: 'power3.out',
      });
      gsap.to(card.querySelector('.card-image'), {
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
      gsap.to(card.querySelector('.card-overlay'), {
        opacity: 0,
        duration: 0.4,
      });
      gsap.to(card.querySelector('.card-content'), {
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  };

  const handleSelectRoute = (route: RecommendedRoute) => {
    showNotification(`已选择路线：${route.name}，正在生成详细行程...`, 'success');
    
    // Scroll to map section
    setTimeout(() => {
      document.querySelector('#routes')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 500);
  };

  const handleShareRoute = (route: RecommendedRoute) => {
    navigator.clipboard.writeText(`${window.location.origin}/route/${route.id}`);
    showNotification('路线分享链接已复制到剪贴板', 'success');
  };

  const handleDownloadRoute = (route: RecommendedRoute) => {
    showNotification(`正在生成 ${route.name} 的PDF行程单...`, 'info');
    setTimeout(() => {
      showNotification('行程单生成完成，开始下载', 'success');
    }, 1500);
  };

  return (
    <section 
      ref={containerRef} 
      id="route-recommendation" 
      className="py-32 px-4 sm:px-8 bg-gradient-to-b from-white via-gray-50/30 to-white overflow-hidden relative"
    >
      {/* 增强背景装饰 */}
      <div className={cn("absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[120px] opacity-8 pointer-events-none animate-breathe", `bg-season-${season}`)} />
      <div className={cn("absolute bottom-1/3 right-1/5 w-[500px] h-[500px] rounded-full blur-[150px] opacity-6 pointer-events-none animate-float", `bg-season-${season}`)} />
      
      {/* 季节装饰图案 */}
      <div className="absolute inset-0 opacity-2 pointer-events-none">
        {season === 'spring' && (
          <div className="route-bg-element absolute top-1/4 right-1/4 w-32 h-32 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 10c8 0 15 6 15 15s-7 15-15 15-15-6-15-15 7-15 15-15z' fill='%23ffb7c5'/%3E%3C/svg%3E")`,
            backgroundSize: 'contain'
          }} />
        )}
        {season === 'summer' && (
          <div className="route-bg-element absolute top-1/3 left-1/4 w-28 h-28 opacity-12" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 10l3 12h12l-10 7 4 12-9-7-9 7 4-12-10-7h12z' fill='%234fc3f7'/%3E%3C/svg%3E")`,
            backgroundSize: 'contain'
          }} />
        )}
        {season === 'autumn' && (
          <div className="route-bg-element absolute bottom-1/4 left-1/3 w-36 h-36 opacity-8" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M30 40c0-10 8-20 20-20s20 10 20 20c0 8-5 15-12 18l-8-8-8 8c-7-3-12-10-12-18z' fill='%23ff8a65'/%3E%3C/svg%3E")`,
            backgroundSize: 'contain'
          }} />
        )}
        {season === 'winter' && (
          <div className="route-bg-element absolute top-2/3 right-1/3 w-24 h-24 opacity-15" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 20v20m0 20v20m-20-30h20m20 0h20' stroke='%2390a4ae' stroke-width='3' fill='none'/%3E%3C/svg%3E")`,
            backgroundSize: 'contain'
          }} />
        )}
      </div>
      
      <div className="max-w-[1600px] mx-auto relative z-10">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 lg:gap-8 mb-12 lg:mb-16">
          <div className="flex-1">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-white shadow-lg",
                `bg-season-${season}`
              )}>
                <Route size={20} className="sm:w-6 sm:h-6" />
              </div>
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] text-gray-400">
                AI-Powered Routes
              </span>
              <Sparkles size={14} className="route-sparkle text-yellow-500 sm:w-4 sm:h-4" />
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter italic mb-4 sm:mb-6">
              智能路线推荐
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed">
              基于当前{season === 'spring' ? '春季' : season === 'summer' ? '夏季' : season === 'autumn' ? '秋季' : '冬季'}
              时节特点，为您精选最佳游览路线，结合天气、人流与景观最佳观赏时机。
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap p-1.5 sm:p-2 bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-lg">
            {(['all', 'easy', 'medium', 'hard'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest transition-all duration-300",
                  activeFilter === filter
                    ? "bg-black text-white shadow-lg"
                    : "text-gray-400 hover:text-gray-800 hover:bg-gray-50"
                )}
              >
                {filter === 'all' ? '全部' : DIFFICULTY_TEXT[filter]}
              </button>
            ))}
          </div>
        </div>

        {/* Season Match Banner */}
        <div className={cn(
          "mb-8 sm:mb-12 p-4 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-white/40 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 overflow-hidden relative",
          `bg-season-${season}/10`
        )}>
          <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-gradient-radial from-white/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center gap-4 sm:gap-6 relative z-10">
            <div className={cn(
              "w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center text-white shadow-2xl flex-shrink-0",
              `bg-season-${season}`
            )}>
              <Sparkles size={24} className="route-sparkle sm:w-9 sm:h-9" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-black text-gray-400 uppercase tracking-wider sm:tracking-widest mb-1 sm:mb-2">
                当季最佳匹配
              </p>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black truncate">
                {routes[0]?.name}
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mt-1">
                季节匹配度 <span className={cn("font-black", `text-season-${season}`)}>{routes[0]?.seasonMatch}%</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => handleSelectRoute(routes[0])}
            className={cn(
              "px-5 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-white font-black uppercase tracking-wider sm:tracking-widest shadow-xl hover:shadow-2xl transition-all active:scale-95 relative z-10 flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center",
              `bg-season-${season}`
            )}
          >
            立即体验
            <ChevronRight size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Route Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRoutes.map((route, index) => (
            <div
              key={route.id}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl hover:border-gray-200 transition-all duration-500 cursor-pointer"
              onMouseEnter={(e) => handleCardHover(e.currentTarget, true, route.id)}
              onMouseLeave={(e) => handleCardHover(e.currentTarget, false, route.id)}
              onClick={() => handleSelectRoute(route)}
            >
              {/* Image Section */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={route.image}
                  alt={route.name}
                  className="card-image w-full h-full object-cover transition-transform duration-700"
                  onError={(e) => {
                    e.currentTarget.src = theme.images[0];
                  }}
                />
                <div className="card-overlay absolute inset-0 bg-black opacity-0 transition-opacity" />
                
                {/* Top Badges */}
                <div className="absolute top-5 left-5 flex gap-2">
                  <span className={cn(
                    "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white",
                    DIFFICULTY_COLORS[route.difficulty]
                  )}>
                    {DIFFICULTY_TEXT[route.difficulty]}
                  </span>
                  <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 backdrop-blur-md">
                    {route.seasonMatch}% 匹配
                  </span>
                </div>

                {/* Action Buttons */}
                <div className={cn(
                  "absolute top-5 right-5 flex gap-2 transition-all duration-300",
                  hoveredCard === route.id ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                )}>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleShareRoute(route); }}
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center hover:bg-white transition-all shadow-lg"
                  >
                    <Share2 size={16} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDownloadRoute(route); }}
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center hover:bg-white transition-all shadow-lg"
                  >
                    <Download size={16} />
                  </button>
                </div>

                {/* Rating Badge */}
                <div className="absolute bottom-5 right-5 flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
                  <Star size={14} fill="#facc15" className="text-yellow-400" />
                  <span className="font-black text-sm">{route.rating}</span>
                  <span className="text-gray-400 text-xs">({route.reviews})</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="card-content p-8">
                <div className="flex items-center gap-3 text-gray-400 mb-4">
                  <Clock size={16} />
                  <span className="text-xs font-bold">{route.duration}</span>
                  <span className="text-gray-200">•</span>
                  <span className="text-xs font-bold">{route.bestTime}</span>
                </div>

                <h3 className="text-2xl font-black mb-4 group-hover:text-gray-700 transition-colors">
                  {route.name}
                </h3>

                {/* Spots Preview */}
                <div className="flex items-center gap-2 mb-6">
                  <MapPin size={14} className="text-gray-300" />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm text-gray-500 truncate">
                      {route.spots.join(' → ')}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {route.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-gray-50 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-wider hover:bg-gray-100 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Highlights */}
                <div className="space-y-3 mb-6">
                  {route.highlights.slice(0, 2).map((highlight, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full animate-pulse", `bg-season-${season}`)} />
                      <span className="text-sm text-gray-600">{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleSelectRoute(route); }}
                  className={cn(
                    "w-full py-4 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 group/btn",
                    `bg-season-${season}`
                  )}
                >
                  <Navigation size={16} className="group-hover/btn:rotate-12 transition-transform" />
                  开始规划
                  <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions Bar */}
        <div className="mt-12 sm:mt-16 p-5 sm:p-8 bg-black rounded-2xl sm:rounded-[2.5rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-8">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <Footprints size={22} className="text-white sm:w-7 sm:h-7" />
            </div>
            <div>
              <p className="text-white/60 text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest mb-1">
                自定义路线
              </p>
              <h4 className="text-white text-base sm:text-xl font-black">
                想要更个性化的体验？
              </h4>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto">
            <button 
              onClick={() => showNotification('AI路线生成器已启动，请描述您的偏好...', 'info')}
              className="px-5 sm:px-8 py-3 sm:py-4 bg-white text-black rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest hover:bg-gray-100 transition-all active:scale-95 flex items-center justify-center gap-2 sm:gap-3"
            >
              <Sparkles size={14} className="sm:w-4 sm:h-4" />
              AI 生成路线
            </button>
            <button 
              onClick={() => {
                document.querySelector('#routes')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 sm:px-8 py-3 sm:py-4 bg-white/10 text-white rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest hover:bg-white/20 transition-all active:scale-95 flex items-center justify-center gap-2 sm:gap-3 border border-white/10"
            >
              <Camera size={14} className="sm:w-4 sm:h-4" />
              手动规划
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
