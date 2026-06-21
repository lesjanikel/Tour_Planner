import {inject, Injectable, signal} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {CreateTourRequest, ImportResult, Tour} from '../models/tour';
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

  async search(query: string): Promise<void> {
    const list = await firstValueFrom(
      this.http.get<Tour[]>(`${this.base}/search`, {
        params: { q: query }
      })
    );

    this._tours.set(list);
  }

  async export(id: number): Promise<Blob> {
    return await firstValueFrom(
      this.http.get(`${this.base}/${id}/export`, {
        responseType: 'blob'
      })
    );
  }

  async exportAll(): Promise<Blob> {
    return await firstValueFrom(
      this.http.get(`${this.base}/export`, {
        responseType: 'blob'
      })
    );
  }

  async import(file: File): Promise<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);

    const result = await firstValueFrom(
      this.http.post<ImportResult>(`${this.base}/import`, formData)
    );

    this._tours.update(list => [...list, ...result.imported]);
    return result;
  }

  async getById(id: number): Promise<Tour> {
    return firstValueFrom(this.http.get<Tour>(`${this.base}/${id}`));
  }

  async create(req: CreateTourRequest): Promise<Tour> {
    const created = await firstValueFrom(this.http.post<Tour>(this.base, req));
    this._tours.update(list => [...list, created]);
    return created;
  }
  async setImage(tourId: number, file: File): Promise<Tour> {
    const formData = new FormData();
    formData.append('file', file);
    const updated = await firstValueFrom(
      this.http.post<Tour>(`${this.base}/${tourId}/image`, formData)
    );
    this._tours.update(list => list.map(t => t.id === tourId ? updated : t));
    return updated;
  }

  async clearImage(tourId: number): Promise<Tour> {
    const updated = await firstValueFrom(
      this.http.delete<Tour>(`${this.base}/${tourId}/image`)
    );
    this._tours.update(list => list.map(t => t.id === tourId ? updated : t));
    return updated;
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
