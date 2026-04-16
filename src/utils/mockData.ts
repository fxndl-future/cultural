import type { AttractionLocation } from '../types';

export const MOCK_LOCATIONS: AttractionLocation[] = [
  {
    id: '1',
    name: '故宫博物院',
    lat: 39.9163,
    lng: 116.3972,
    description: '紫禁城，明清两代的皇家宫殿。',
    era: '明清',
    history: '建成于1420年，是世界上现存规模最大、保存最为完整的木质结构古建筑之一。',
    images: ['https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&q=80&w=1200'],
    tags: ['古建筑', '博物馆', '皇宫']
  },
  {
    id: '2',
    name: '天坛公园',
    lat: 39.8836,
    lng: 116.4128,
    description: '明、清两代帝王祭祀皇天、祈祷五谷丰登的场所。',
    era: '明代',
    history: '始建于明永乐十八年（1420年），清乾隆、光绪时曾重修改建。',
    images: ['https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&q=80&w=1200'],
    tags: ['祭祀', '古建筑', '公园']
  },
  {
    id: '3',
    name: '颐和园',
    lat: 39.9997,
    lng: 116.2755,
    description: '中国清朝时期的皇家园林。',
    era: '清代',
    history: '前身为清漪园，坐落在北京西郊，距城区15公里，全园占地3.009平方公里。',
    images: ['https://images.unsplash.com/photo-1590510326499-f3c3335ef44d?auto=format&fit=crop&q=80&w=1200'],
    tags: ['园林', '皇家', '湖泊']
  }
];
