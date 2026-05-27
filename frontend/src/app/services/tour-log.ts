import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TourLog, CreateTourLogRequest } from '../models/tour-log';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TourLogService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/tours`;

  // logs for the CURRENT tour (replaced when context switches)
  private _logs = signal<TourLog[]>([]);
  readonly logs = this._logs.asReadonly();

  async loadAll(tourId: number): Promise<void> {
    const list = await firstValueFrom(this.http.get<TourLog[]>(`${this.base}/${tourId}/logs`));
    this._logs.set(list);
  }

  async getById(tourId: number, id: number): Promise<TourLog> {
    return firstValueFrom(this.http.get<TourLog>(`${this.base}/${tourId}/logs/${id}`));
  }

  async create(tourId: number, req: CreateTourLogRequest): Promise<TourLog> {
    const created = await firstValueFrom(
      this.http.post<TourLog>(`${this.base}/${tourId}/logs`, req)
    );
    this._logs.update(list => [...list, created]);
    return created;
  }

  async update(tourId: number, id: number, req: CreateTourLogRequest): Promise<TourLog> {
    const updated = await firstValueFrom(
      this.http.put<TourLog>(`${this.base}/${tourId}/logs/${id}`, req)
    );
    this._logs.update(list => list.map(l => l.id === id ? updated : l));
    return updated;
  }

  async delete(tourId: number, id: number): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.base}/${tourId}/logs/${id}`));
    this._logs.update(list => list.filter(l => l.id !== id));
  }
}
