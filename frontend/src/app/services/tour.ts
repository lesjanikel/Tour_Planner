import {inject, Injectable, signal} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {CreateTourRequest, Tour} from '../models/tour';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TourService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/tours`;

  private _tours = signal<Tour[]>([]);
  readonly tours = this._tours.asReadonly();

  async loadAll(): Promise<void> {
    const list = await firstValueFrom(this.http.get<Tour[]>(this.base));
    this._tours.set(list);
  }

  async getById(id: number): Promise<Tour> {
    return firstValueFrom(this.http.get<Tour>(`${this.base}/${id}`));
  }

  async create(req: CreateTourRequest): Promise<Tour> {
    const created = await firstValueFrom(this.http.post<Tour>(this.base, req));
    this._tours.update(list => [...list, created]);
    return created;
  }

  async update(id: number, req: CreateTourRequest): Promise<Tour> {
    const updated = await firstValueFrom(this.http.put<Tour>(`${this.base}/${id}`, req));
    this._tours.update(list => list.map(t => t.id === id ? updated : t));
    return updated;
  }

  async delete(id: number): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.base}/${id}`));
    this._tours.update(list => list.filter(t => t.id !== id));
  }
}
