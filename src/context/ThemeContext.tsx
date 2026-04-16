import React, { createContext, useContext, useState } from 'react';

// Season type for seasonal theming - use const array + typeof for better compatibility
export const SEASONS = ['spring', 'summer', 'autumn', 'winter'] as const;
export type Season = typeof SEASONS[number];

interface SeasonalInfo {
  solarTerms: string[];
  recommendedSpots: string[];
  activity: string;
  weather: string;
  clothing: string;
}

interface SeasonalTheme {
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
  particles: 'petals' | 'rain' | 'leaves' | 'snow';
  soundUrl: string;
  info: SeasonalInfo;
  images: string[];
}

const SEASONAL_THEMES: Record<Season, SeasonalTheme> = {
  spring: {
    primary: '#ffb7c5',
    secondary: '#fce4ec',
    accent: '#81c784',
    gradient: 'linear-gradient(135deg, #fff5f7 0%, #ffb7c5 100%)',
    particles: 'petals',
    soundUrl: '/sounds/spring.mp3',
    images: [
      'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1521339225847-bbad99c75e9f?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1462271035242-c2a0a544b82d?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1543739446-40209c533859?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1519682577862-22b62b24e493?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1520975958225-3d3e0f8c8b12?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1500417148159-68083bd7333a?auto=format&fit=crop&q=80&w=1920'
    ],
    info: {
      solarTerms: ['立春', '雨水', '惊蛰', '春分', '清明', '谷雨'],
      recommendedSpots: ['故宫赏花', '颐和园踏青'],
      activity: '春季风筝节',
      weather: '10°C - 20°C，微风',
      clothing: '轻便外套、卫衣'
    }
  },
  summer: {
    primary: '#4fc3f7',
    secondary: '#e1f5fe',
    accent: '#fff176',
    gradient: 'linear-gradient(135deg, #e0f7fa 0%, #4fc3f7 100%)',
    particles: 'rain',
    soundUrl: '/sounds/summer.mp3',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1440778303588-435521a205bc?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1920'
    ],
    info: {
      solarTerms: ['立夏', '小满', '芒种', '夏至', '小暑', '大暑'],
      recommendedSpots: ['北海划船', '什刹海避暑'],
      activity: '荷花艺术节',
      weather: '25°C - 35°C，多雨',
      clothing: '短袖、遮阳帽'
    }
  },
  autumn: {
    primary: '#ff8a65',
    secondary: '#fbe9e7',
    accent: '#d4e157',
    gradient: 'linear-gradient(135deg, #fff3e0 0%, #ff8a65 100%)',
    particles: 'leaves',
    soundUrl: '/sounds/autumn.mp3',
    images: [
      'https://images.unsplash.com/photo-1506355683710-bd071c0a5828?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1503435980610-a51f3ddfee50?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1476820865390-c59aeeb9e104?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&q=80&w=1920'
    ],
    info: {
      solarTerms: ['立秋', '处暑', '白露', '秋分', '寒露', '霜降'],
      recommendedSpots: ['香山红叶', '长城秋色'],
      activity: '中秋赏月会',
      weather: '15°C - 25°C，天高气爽',
      clothing: '薄毛衣、风衣'
    }
  },
  winter: {
    primary: '#90a4ae',
    secondary: '#eceff1',
    accent: '#ffffff',
    gradient: 'linear-gradient(135deg, #f5f7f8 0%, #90a4ae 100%)',
    particles: 'snow',
    soundUrl: '/sounds/winter.mp3',
    images: [
      'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1457269449834-928af64c654d?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1477601263368-146caf1c9c45?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1482489603187-f4e70337fdf3?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1486365227551-f3f90034a57c?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1458668383970-8ddd3927deed?auto=format&fit=crop&q=80&w=1920'
    ],
    info: {
      solarTerms: ['立冬', '小雪', '大雪', '冬至', '小寒', '大寒'],
      recommendedSpots: ['故宫雪景', '什刹海滑冰'],
      activity: '冰雪嘉年华',
      weather: '-10°C - 5°C，寒冷干燥',
      clothing: '羽绒服、围巾'
    }
  },
};

interface ThemeContextType {
  season: Season;
  setSeason: (season: Season) => void;
  theme: SeasonalTheme;
  isRTL: boolean;
  toggleRTL: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [season, setSeasonState] = useState<Season>(() => {
    const saved = localStorage.getItem('user-season');
    if (saved) return saved as Season;
    
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  });
  
  const [isRTL, setIsRTL] = useState(() => {
    return localStorage.getItem('user-rtl') === 'true';
  });

  const setSeason = (s: Season) => {
    setSeasonState(s);
    localStorage.setItem('user-season', s);
    // Play subtle sound on season change if needed
  };

  const toggleRTL = () => {
    const next = !isRTL;
    setIsRTL(next);
    localStorage.setItem('user-rtl', String(next));
  };

  return (
    <ThemeContext.Provider value={{ season, setSeason, theme: SEASONAL_THEMES[season], isRTL, toggleRTL }}>
      <div className={`theme-${season} ${isRTL ? 'rtl' : 'ltr'} transition-colors duration-1000`} dir={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
