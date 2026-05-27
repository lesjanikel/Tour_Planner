import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { RouteGeometry } from '../models/tour';

@Injectable({ providedIn: 'root' })
export class MapFacadeService {
  private map: L.Map | null = null;
  private routeLayer: L.Polyline | null = null;
  private markers: L.Layer[] = [];

  initMap(containerId: string): void {
    if (this.map) this.destroyMap();         // tear down any stale instance
    this.map = L.map(containerId, { zoomControl: true, attributionControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
    this.map.setView([48.2082, 16.3738], 6);   // default while we wait for route
  }

  destroyMap(): void {
    this.map?.remove();
    this.map = null;
    this.routeLayer = null;
    this.markers = [];
  }

  setRoute(geom: RouteGeometry): void {
    if (!this.map) return;

    // clear any previous route/markers
    this.routeLayer?.remove();
    this.markers.forEach(m => m.remove());
    this.markers = [];



    // GeoJSON is [lon, lat] but Leaflet wants [lat, lon] — swap each pair
    const latLngs = geom.coordinates.map(([lon, lat]) => [lat, lon] as [number, number]);

    this.routeLayer = L.polyline(latLngs, {
      color: '#2563eb',
      weight: 4,
      opacity: 0.8,
    }).addTo(this.map);

    // start + end pins
    const start = latLngs[0];
    const end   = latLngs[latLngs.length - 1];
    this.markers.push(
      L.circleMarker(start, {
        radius: 7,
        color: '#15803d',          // green-700 outline
        fillColor: '#22c55e',      // green-500 fill
        fillOpacity: 1,
        weight: 2,
      }).addTo(this.map),
    );
    this.markers.push(
      L.circleMarker(end, {
        radius: 7,
        color: '#b91c1c',          // red-700 outline
        fillColor: '#ef4444',      // red-500 fill
        fillOpacity: 1,
        weight: 2,
      }).addTo(this.map),
    );


    // zoom to the route
    this.map.fitBounds(this.routeLayer.getBounds(), { padding: [30, 30] });
  }
}
