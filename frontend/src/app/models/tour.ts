export interface Tour {
  id: number;
  name: string;
  description: string;
  from: string;
  to: string;
  transportType: 'Hike' | 'Bike' | 'Running' | 'Train';
  distance: number;
  estimatedTime: number;
}

