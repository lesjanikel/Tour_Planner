import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Tour } from '../models/tour';

@Injectable({ providedIn: 'root' })
export class TourService {
  private tours: Tour[] = [
    { id: 1, name: 'Wienerwald Hike', description: 'Schöne Wanderung', from: 'Wien', to: 'Klosterneuburg', transportType: 'Hike', distance: 15, estimatedTime: 180 },
    { id: 2, name: 'Donauradweg', description: 'Fahrradtour', from: 'Wien', to: 'Tulln', transportType: 'Bike', distance: 40, estimatedTime: 120 }
  ];

  getAll(): Observable<Tour[]> { return of(this.tours); }
  getById(id: number): Observable<Tour | undefined> { return of(this.tours.find(t => t.id === id)); }
  create(tour: Tour): Observable<Tour> { tour.id = Date.now(); this.tours.push(tour); return of(tour); }
  update(updated: Tour): Observable<Tour> { this.tours = this.tours.map(t => t.id === updated.id ? updated : t); return of(updated); }
  delete(id: number): Observable<void> { this.tours = this.tours.filter(t => t.id !== id); return of(void 0); }
}
