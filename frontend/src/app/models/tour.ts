export type TransportType =
  | 'DRIVING_CAR'
  | 'CYCLING_REGULAR'
  | 'FOOT_WALKING'
  | 'FOOT_HIKING';

export interface RouteGeometry {
  type: string;
  coordinates: number[][];   // [[lon,lat], ...]
}

export interface Tour {
  id: number;
  name: string;
  description: string;
  fromName: string;
  fromLat: number;
  fromLon: number;
  toName: string;
  toLat: number;
  toLon: number;
  transportType: TransportType;
  distanceKm: number;
  durationSec: number;
  routeGeoJson: RouteGeometry | null;
  imageUrl: string | null;
  ownerId: number;
  popularity: number;
  childFriendly: boolean | null;
}

export interface CreateTourRequest {
  name: string;
  description: string;
  fromName: string;
  fromLat: number;
  fromLon: number;
  toName: string;
  toLat: number;
  toLon: number;
  transportType: TransportType;
}
