export const DUMMY = 'dummy';

export type AttractionLocation = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  era: string; // Historical era
  history: string;
  images: string[];
  tags: string[];
};

export type RoutePoint = AttractionLocation & {
  order: number;
  timeSlot?: 'morning' | 'afternoon' | 'evening';
};

export type TravelRoute = {
  id: string;
  name: string;
  points: RoutePoint[];
  createdBy: string;
};
