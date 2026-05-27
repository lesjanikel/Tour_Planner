import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

export interface GeocodeFeature {
  label: string;
  layer: string;
  country: string;
  lat: number;
  lon: number;
}

@Injectable({ providedIn: 'root' })
export class GeocodeService {
  private http = inject(HttpClient);
  autocomplete(q: string, limit = 5): Observable<GeocodeFeature[]> {
    return this.http.get<GeocodeFeature[]>(
      `${environment.apiUrl}/api/geocode`,
      { params: { q, limit } }
    );
  }
}
