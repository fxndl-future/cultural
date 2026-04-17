import React, { useState, useEffect, useRef } from 'react';
import { History, Clock, MapPin, Share2, Heart, MessageSquare, ArrowRight } from 'lucide-react';
import { MOCK_LOCATIONS } from '../utils/mockData';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

gsap.registerPlugin(ScrollTrigger);

const HISTORY_TIMELINE = [
  {
    year: '1420',
    event: '紫禁城建成',
    detail: '明永乐十八年，皇家宫殿正式落成，标志着北京作为都城的地位确立。',
    image: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&q=80&w=1200',
  },
  {
    year: '1530',
    event: '天坛初建',
    detail: '嘉靖年间，大祀殿（现祈年殿前身）落成，用于天地合祀。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Temple%20of%20Heaven%20in%20Beijing%2C%20traditional%20Chinese%20architecture%2C%20祈年殿%2C%20blue%20tiles%2C%20clear%20sky%2C%20high%20quality%20photo&image_size=landscape_16_9',
  },
  {
    year: '1750',
    event: '清漪园落成',
    detail: '乾隆皇帝为祝贺皇太后六十寿辰，下令修建清漪园（现颐和园）。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Summer%20Palace%20in%20Beijing%2C%20traditional%20Chinese%20garden%2C%20lake%20view%2C%20classical%20architecture%2C%20high%20quality%20photo&image_size=landscape_16_9',
  },
  {
    year: '1925',
    event: '故宫博物院成立',
    detail: '清室善后委员会接管故宫，正式成立故宫博物院并向公众开放。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Forbidden%20City%20in%20Beijing%2C%20palace%20museum%2C%20traditional%20Chinese%20architecture%2C%20red%20walls%2C%20high%20quality%20photo&image_size=landscape_16_9',
  },
  {
    year: '2026',
    event: '数字孪生游览',
    detail: '集成AR/VR技术的数字化文旅体验系统上线，实现虚实结合的沉浸式游览。',
    image: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=1200',
  },
] as const;

export const Timeline: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'real' | 'history'>('history');
  const { season } = useTheme();
  const { showNotification } = useNotification();
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);


  const [, setLikeTick] = useState(0);

  const toggleLike = (id: string) => {
    const isLiked = localStorage.getItem(`like-${id}`);
    if (isLiked) {
      localStorage.removeItem(`like-${id}`);
    } else {
      localStorage.setItem(`like-${id}`, 'true');
    }
    setLikeTick((x) => x + 1);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showNotification('链接已复制到剪贴板', 'success');
  };

  const openBooking = (name: string) => {
    showNotification(`正在为您打开 ${name} 的预约入口…`, 'info');
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Update selectedYear based on scroll
      HISTORY_TIMELINE.forEach((_, index) => {
        const card = cardsRef.current[index];
        if (!card) return;
        ScrollTrigger.create({
          trigger: card,
          start: 'top center',
          end: 'bottom center',
        });
      });
      
      // Background gradient shift based on season
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          background: activeTab === 'history' ? 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)' : '#ffffff',
          duration: 1,
          ease: 'power2.inOut'
        });
      }

      // Line drawing animation
      if (lineRef.current) {
        gsap.fromTo(lineRef.current, 
          { scaleY: 0 },
          { 
            scaleY: 1, 
            transformOrigin: 'top',
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 30%',
              end: 'bottom 80%',
              scrub: true,
            }
          }
        );
      }

      // Card flip entrance animation - 从中间向两边翻开
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        // 获取左右两部分内容
        const leftContent = card.querySelector('.timeline-left-content');
        const rightContent = card.querySelector('.timeline-right-content');
        const circle = card.querySelector('.timeline-circle');

        // 判断是否是反向布局（奇数项）
        const isReversed = index % 2 !== 0;

        // 初始状态 - 隐藏内容
        if (leftContent && rightContent) {
          gsap.set([leftContent, rightContent], {
            opacity: 0,
          });
        }

        // 圆圈先出现并放大 - 线到达时触发
        if (circle) {
          gsap.fromTo(circle,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: card,
                start: 'top 60%', // 线到达圆圈位置时触发
                toggleActions: 'play none none reverse',
              }
            }
          );
        }

        // 左侧内容动画（根据布局方向决定翻转方向）
        if (leftContent) {
          // 正常布局：左侧在左，向左翻开
          // 反向布局：左侧在右，向右翻开
          gsap.fromTo(leftContent,
            {
              opacity: 0,
              x: isReversed ? -60 : 60,
              rotationY: isReversed ? 60 : -60,
              transformOrigin: isReversed ? 'left center' : 'right center',
              transformPerspective: 1000
            },
            {
              opacity: 1,
              x: 0,
              rotationY: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 55%', // 线过了圆圈后触发
                toggleActions: 'play none none reverse',
              }
            }
          );
        }

        // 右侧内容动画（根据布局方向决定翻转方向）
        if (rightContent) {
          // 正常布局：右侧在右，向右翻开
          // 反向布局：右侧在左，向左翻开
          gsap.fromTo(rightContent,
            {
              opacity: 0,
              x: isReversed ? 60 : -60,
              rotationY: isReversed ? -60 : 60,
              transformOrigin: isReversed ? 'right center' : 'left center',
              transformPerspective: 1000
            },
            {
              opacity: 1,
              x: 0,
              rotationY: 0,
              duration: 0.8,
              ease: 'power3.out',
              delay: 0.15, // 稍微延迟，形成错落感
              scrollTrigger: {
                trigger: card,
                start: 'top 55%', // 线过了圆圈后触发
                toggleActions: 'play none none reverse',
              }
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [activeTab]);



  return (
    <section id="history" ref={containerRef} className="py-28 px-4 sm:px-8 bg-transparent overflow-hidden relative">
      <div className={cn("absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 pointer-events-none", `bg-season-${season}`)} />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-24">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <span className="h-px w-8 sm:w-12 bg-black" />
              <span className="text-xs sm:text-sm font-black tracking-[0.2em] sm:tracking-[0.3em] text-gray-400 uppercase">Spatio-temporal Experience</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 sm:mb-8 tracking-tighter">
              时空融合体验
            </h2>
            <p className="text-gray-500 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed">
              切换现实与历史时间轴，探索同一个地理坐标在不同时空维度下的文化印记与历史变迁。
            </p>
          </div>
          
          <div className="flex p-1.5 sm:p-2 bg-gray-50 rounded-2xl sm:rounded-[2rem] border border-gray-100 shadow-inner self-start lg:self-auto group">
            <button 
              onClick={() => setActiveTab('history')}
              className={cn(
                "flex items-center gap-2 sm:gap-3 px-5 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-[1.5rem] transition-all duration-500 font-black uppercase tracking-wider sm:tracking-widest text-[10px] sm:text-xs",
                activeTab === 'history' ? "bg-black text-white shadow-2xl scale-105" : "text-gray-400 hover:text-gray-800"
              )}
            >
              <History size={16} className="sm:w-[18px] sm:h-[18px]" />
              历史长廊
            </button>
            <button 
              onClick={() => setActiveTab('real')}
              className={cn(
                "flex items-center gap-2 sm:gap-3 px-5 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-[1.5rem] transition-all duration-500 font-black uppercase tracking-wider sm:tracking-widest text-[10px] sm:text-xs",
                activeTab === 'real' ? "bg-black text-white shadow-2xl scale-105" : "text-gray-400 hover:text-gray-800"
              )}
            >
              <Clock size={16} className="sm:w-[18px] sm:h-[18px]" />
              游览日程
            </button>
          </div>
        </div>

        {activeTab === 'history' ? (
          <div className="relative mt-32">

            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-100 transform -translate-x-1/2 hidden md:block" />
            <div 
              ref={lineRef}
              className="absolute left-1/2 top-0 bottom-0 w-1 bg-black transform -translate-x-1/2 hidden md:block z-10" 
            />
            
            <div className="space-y-24 sm:space-y-32 lg:space-y-48 relative">
              {HISTORY_TIMELINE.map((item, index) => (
                <div
                key={index}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className={cn(
                  "flex flex-col md:flex-row items-center gap-8 sm:gap-16 lg:gap-32",
                  index % 2 !== 0 ? "md:flex-row-reverse" : ""
                )}
              >
                <div className="timeline-left-content flex-1 text-center md:text-left" style={{ transformStyle: 'preserve-3d' }}>
                  <div className={cn("flex flex-col relative", index % 2 !== 0 ? "md:items-end md:text-right" : "md:items-start")}>
                      <span className="text-6xl sm:text-8xl lg:text-[10rem] font-black text-gray-50 mb-4 leading-none select-none">
                        {item.year}
                      </span>
                      <div className="relative z-10 -mt-8 sm:-mt-12 md:-mt-20">
                        <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4 sm:mb-6 tracking-tight">
                          {item.event}
                        </h3>
                        <div className={cn(
                          "absolute -top-2 sm:-top-4 w-8 sm:w-12 h-1 sm:h-1.5 bg-black",
                          index % 2 !== 0 ? "-right-2 sm:-right-4" : "-left-2 sm:-left-4"
                        )} />
                      </div>
                      <p className="text-gray-500 text-sm sm:text-base lg:text-lg leading-relaxed max-w-md relative z-10 px-4 md:px-0">
                        {item.detail}
                      </p>
                      <button className="mt-6 sm:mt-8 flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest group bg-gray-50 hover:bg-black hover:text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all relative z-10 mx-auto md:mx-0">
                        了解更多
                        <ArrowRight size={14} className="sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="timeline-circle relative z-20 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white border-4 sm:border-8 border-black flex items-center justify-center shadow-2xl group cursor-help flex-shrink-0">
                    <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-black group-hover:scale-150 transition-transform duration-500" />
                    <div className="absolute inset-0 rounded-full bg-black/5 animate-ping" />
                  </div>

                  <div className="timeline-right-content flex-1 hidden md:block" style={{ transformStyle: 'preserve-3d' }}>
                    <div className="aspect-[4/3] bg-gray-100 rounded-2xl sm:rounded-[3rem] overflow-hidden border border-gray-100 group cursor-pointer shadow-2xl relative">
                      <img 
                        src={item.image} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" 
                        alt={item.event} 
                        onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=1200';
                          e.currentTarget.style.opacity = '1';
                        }}
                        style={{ opacity: 0, transition: 'opacity 0.5s' }}
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white text-black px-4 sm:px-6 py-2 sm:py-3 rounded-full font-black text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform">
                          View Archives
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {MOCK_LOCATIONS.map((loc, index) => (
              <div 
                key={loc.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="group bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-2xl hover:shadow-black/10 transition-all duration-700 hover:-translate-y-4 flex flex-col h-full"
              >
                <div className="relative h-80 overflow-hidden shrink-0 bg-gray-100">
                  <img 
                    src={loc.images[0]} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    alt={loc.name}
                    onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=1200';
                      e.currentTarget.style.opacity = '1';
                    }}
                    style={{ opacity: 0, transition: 'opacity 0.5s' }}
                  />
                  <div className="absolute top-8 left-8 flex gap-2">
                    <span className="bg-white/90 backdrop-blur-xl px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                      {index === 0 ? '09:00 - 11:30' : index === 1 ? '13:00 - 15:30' : '16:00 - 18:00'}
                    </span>
                  </div>
                  <button 
                    onClick={() => toggleLike(loc.id)}
                    className="absolute top-8 right-8 w-12 h-12 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center text-red-500 shadow-xl hover:scale-110 active:scale-90 transition-all"
                  >
                    <Heart size={22} fill={localStorage.getItem(`like-${loc.id}`) ? "currentColor" : "none"} />
                  </button>
                </div>
                
                <div className="p-10 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-gray-400 mb-4">
                    <MapPin size={18} />
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase">Location • {loc.lat}, {loc.lng}</span>
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight group-hover:text-red-500 transition-colors">{loc.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium flex-1">
                    {loc.description}
                  </p>
                  
                  <div className="flex gap-4 mb-8">
                    <button 
                      onClick={() => openBooking(loc.name)}
                      className={cn("flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-lg transition-all active:scale-95", `bg-season-${season}`)}
                    >
                      立即预约
                    </button>
                    <button className="flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest bg-gray-50 text-gray-400 hover:bg-gray-100 transition-all">
                      语音导览
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between pt-8 border-t border-gray-50 mt-auto">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-sm">
                          <img src={`https://i.pravatar.cc/100?u=${i + index}`} alt="user" />
                        </div>
                      ))}
                      <div className="w-10 h-10 rounded-full border-4 border-white bg-black flex items-center justify-center text-[10px] font-black text-white shadow-sm">
                        +12
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-gray-300">
                      <button className="flex items-center gap-2 hover:text-black transition-colors group/btn">
                        <MessageSquare size={18} className="group-hover/btn:scale-110 transition-transform" />
                        <span className="text-xs font-black">42</span>
                      </button>
                      <button onClick={handleShare} className="flex items-center gap-2 hover:text-black transition-colors group/btn">
                        <Share2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
