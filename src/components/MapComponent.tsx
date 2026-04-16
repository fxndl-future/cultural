import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { useTranslation } from 'react-i18next';
import { GripVertical, MapPin, Clock, Navigation, Share2, Search, ArrowUpDown, Zap } from 'lucide-react';
import { MOCK_LOCATIONS } from '../utils/mockData';
import type { RoutePoint } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import gsap from 'gsap';
import { ANIMATION_CONFIG } from '../utils/animationConfig';
import { useNotification } from '../context/NotificationContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fix Leaflet marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const ChangeView: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
};

export const MapComponent: React.FC = () => {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [route, setRoute] = useState<RoutePoint[]>(
    MOCK_LOCATIONS.map((loc, index) => ({ ...loc, order: index }))
  );
  const [selectedPoint, setSelectedPoint] = useState<RoutePoint | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeEra, setActiveEra] = useState<string>('all');
  const listRef = useRef<HTMLDivElement | null>(null);

  // Filtered and sorted route
  const filteredRoute = useMemo(() => {
    return route.filter(point => {
      const matchesSearch = point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          point.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesEra = activeEra === 'all' || point.era === activeEra;
      return matchesSearch && matchesEra;
    });
  }, [route, searchQuery, activeEra]);

  const eras = useMemo(() => {
    const allEras = route.map(p => p.era);
    return ['all', ...Array.from(new Set(allEras))];
  }, [route]);

  useEffect(() => {
    if (listRef.current) {
      gsap.fromTo(listRef.current.children, 
        { y: 20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.05, 
          duration: 0.4, 
          ease: ANIMATION_CONFIG.ease.main 
        }
      );
    }
  }, [filteredRoute.length]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(route);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setRoute(items.map((item, index) => ({ ...item, order: index })));
    showNotification(`已调整游览顺序：${reorderedItem.name}`, 'info');
  };

  const polylinePositions = route.map(p => [p.lat, p.lng] as [number, number]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showNotification('路线分享链接已复制到剪贴板', 'success');
  };

  const [isGenerating, setIsGenerating] = useState(false);

  const generateItinerary = () => {
    setIsGenerating(true);
    showNotification('正在根据您的偏好生成个性化行程...', 'info');
    setTimeout(() => {
      setIsGenerating(false);
      showNotification('智能行程生成成功！已为您优化游览顺序', 'success');
    }, 2000);
  };

  return (
    <section id="routes" className="py-20 px-4 sm:px-8 bg-transparent flex flex-col gap-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-black/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-black text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">Interactive Planner</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tighter">智能路线中枢</h2>
          <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
            {t('map.drag_to_reorder')} - 实时规划您的文旅路线，支持拖拽调整顺序，并在地图上即时预览路径。
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={generateItinerary}
            disabled={isGenerating}
            className={cn(
              "flex items-center gap-2 bg-white px-6 py-4 rounded-2xl border border-gray-100 hover:border-gray-300 transition-all shadow-sm font-bold hover:shadow-md active:scale-95 disabled:opacity-50",
              isGenerating && "animate-pulse"
            )}
          >
            <Zap size={20} className="text-yellow-500" />
            智能行程
          </button>
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 bg-white px-6 py-4 rounded-2xl border border-gray-100 hover:border-gray-300 transition-all shadow-sm font-bold hover:shadow-md active:scale-95 group/share"
          >
            <Share2 size={20} className="group-hover/share:rotate-12 transition-transform" />
            分享路线
          </button>
          <button 
            onClick={() => showNotification('已为您规划最佳行车路线，准备开始导航', 'success')}
            className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-black/10 font-bold active:scale-95 group/nav"
          >
            <Navigation size={20} className="group-hover/nav:translate-x-1 group-hover/nav:-translate-y-1 transition-transform" />
            开始导航
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[800px]">
        {/* Route List Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6 overflow-hidden bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black flex items-center gap-3">
                <MapPin size={24} className="text-red-500" />
                游览站点
                <span className="text-sm bg-gray-100 text-gray-400 px-3 py-1 rounded-full font-bold ml-2">
                  {filteredRoute.length}
                </span>
              </h3>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="搜索景点名称或描述..."
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-black/5 transition-all outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {eras.map(era => (
                  <button
                    key={era}
                    onClick={() => setActiveEra(era)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all uppercase tracking-wider",
                      activeEra === era 
                        ? "bg-black text-white shadow-lg" 
                        : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    )}
                  >
                    {era === 'all' ? '全部时期' : era}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="route">
                {(provided) => (
                  <div 
                    {...provided.droppableProps} 
                    ref={(el) => {
                      provided.innerRef(el);
                      listRef.current = el;
                    }} 
                    className="space-y-4"
                  >
                    {filteredRoute.length > 0 ? (
                      filteredRoute.map((point, index) => (
                        <Draggable key={point.id} draggableId={point.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={cn(
                                "group p-5 rounded-3xl border transition-all duration-300 cursor-pointer",
                                snapshot.isDragging 
                                  ? "bg-white border-black/10 shadow-2xl scale-105 z-50 ring-4 ring-black/5" 
                                  : "bg-gray-50 border-transparent hover:bg-white hover:border-gray-200 hover:shadow-xl",
                                selectedPoint?.id === point.id && "ring-2 ring-black border-transparent bg-white shadow-xl"
                              )}
                              onClick={() => setSelectedPoint(point)}
                              onMouseEnter={(e) => {
                                gsap.to(e.currentTarget, {
                                  rotationY: 5,
                                  transformPerspective: 1000,
                                  duration: 0.3
                                });
                              }}
                              onMouseLeave={(e) => {
                                gsap.to(e.currentTarget, {
                                  rotationY: 0,
                                  duration: 0.3
                                });
                              }}
                            >
                              <div className="flex items-center gap-5">
                                <div {...provided.dragHandleProps} className="text-gray-300 group-hover:text-gray-500 transition-colors">
                                  <GripVertical size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-black text-gray-900 truncate">{point.name}</h4>
                                    <span className="text-[10px] bg-white border border-gray-100 px-2 py-0.5 rounded-full font-black text-gray-400 uppercase tracking-tighter">
                                      {point.era}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-400 flex items-center gap-1 font-bold">
                                      <Clock size={12} />
                                      预计 45 min
                                    </span>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <div className="w-8 h-8 bg-white rounded-full border border-gray-100 flex items-center justify-center text-xs font-black text-gray-900">
                                    {index + 1}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <div className="py-12 text-center space-y-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                          <Search size={32} />
                        </div>
                        <p className="text-gray-400 font-bold">未找到匹配的景点</p>
                        <button 
                          onClick={() => { setSearchQuery(''); setActiveEra('all'); }}
                          className="text-xs font-black text-black underline underline-offset-4"
                        >
                          重置所有筛选
                        </button>
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>

        {/* Map Container */}
        <div className="lg:col-span-8 rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl shadow-gray-200/50 relative group">
          <MapContainer
            center={[39.9163, 116.3972]}
            zoom={13}
            className="w-full h-full z-0"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredRoute.map((point) => (
              <Marker 
                key={point.id} 
                position={[point.lat, point.lng]}
                eventHandlers={{
                  click: () => setSelectedPoint(point),
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-3 min-w-[240px]">
                    <div className="relative h-32 mb-4 overflow-hidden rounded-xl">
                <img
                  src={point.images[0]}
                  className="w-full h-full object-cover"
                  alt={point.name}

                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=1200';
                  }}
                />
                      <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                        {point.era}
                      </div>
                    </div>
                    <h4 className="font-black text-lg mb-1">{point.name}</h4>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{point.description}</p>
                    <button className="w-full bg-black text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95">
                      查看景点详情
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
            <Polyline 
              positions={polylinePositions} 
              pathOptions={{ 
                color: '#ef4444', 
                weight: 6, 
                dashArray: '1, 12',
                lineCap: 'round',
                opacity: 0.8
              }} 
            />
            {selectedPoint && <ChangeView center={[selectedPoint.lat, selectedPoint.lng]} zoom={15} />}
          </MapContainer>
          
          {/* Map Overlays */}
          <div className="absolute top-8 right-8 z-[1000] flex flex-col gap-3">
            <button 
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((pos) => {
                    showNotification(`定位成功：${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`, 'success');
                  });
                }
              }}
              className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hover:bg-gray-50 transition-all group active:scale-90"
            >
              <Navigation size={22} className="group-hover:text-blue-500 transition-colors" />
            </button>
            <button 
              onClick={() => {
                setRoute([...route].reverse());
                showNotification('已翻转游览路线顺序', 'info');
              }}
              className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hover:bg-gray-50 transition-all group active:scale-90"
            >
              <ArrowUpDown size={22} className="group-hover:text-green-500 transition-colors" />
            </button>
          </div>

          <div className="absolute bottom-8 left-8 right-8 z-[1000] pointer-events-none">
            <div className="bg-white/90 backdrop-blur-xl p-4 rounded-2xl border border-gray-100 shadow-2xl flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Navigation className="text-black" size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">当前行程概览</p>
                  <p className="font-black text-gray-900">{route.length} 个站点 • 预计游览 4.5 小时</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  showNotification('正在生成 PDF 路书...', 'info');
                  setTimeout(() => showNotification('路书生成成功，开始下载', 'success'), 2000);
                }}
                className="bg-black text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95"
              >
                导出路书
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
