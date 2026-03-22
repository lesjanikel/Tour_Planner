import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TourLog } from '../models/tour-log';

@Injectable({ providedIn: 'root' })
export class TourLogService {
  private logs: TourLog[] = [
    { id: 1, tourId: 1, date: '2026-03-01', comment: 'Tolle Tour!', difficulty: 2, totalDistance: 15, totalTime: 180, rating: 5 }
  ];

  getById(id:number): Observable<TourLog | undefined> { return of(this.logs.find(l => l.id === id)); }
  getByTourId(tourId: number): Observable<TourLog[]> { return of(this.logs.filter(l => l.tourId === tourId)); }
  create(log: TourLog): Observable<TourLog> { log.id = Date.now(); this.logs.push(log); return of(log); }
  update(updated: TourLog): Observable<TourLog> { this.logs = this.logs.map(l => l.id === updated.id ? updated : l); return of(updated); }
  delete(id: number): Observable<void> { this.logs = this.logs.filter(l => l.id !== id); return of(void 0); }
}
