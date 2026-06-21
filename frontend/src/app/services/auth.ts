import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

interface AuthResponse {
  token: string;
  username: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  user = signal<string | null>(this.loadValidUser());

  private loadValidUser(): string | null {
    const token = localStorage.getItem('token');
    const user  = localStorage.getItem('user');
    if (!token || !user) return null;
    if (this.isTokenExpired(token)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      //redirect to login
      return null;
    }
    return user;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }

  isLoggedIn(): boolean {
    return this.user() !== null;
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const res = await firstValueFrom(
      this.http.post<AuthResponse>(`${environment.apiUrl}/api/sessions`, { username, password })
    );
    this.storeSession(res);
    return res;
  }

  async register(username: string, password: string): Promise<AuthResponse> {
    const res = await firstValueFrom(
      this.http.post<AuthResponse>(`${environment.apiUrl}/api/users`, { username, password })
    );
    this.storeSession(res);
    return res;
  }

  logout(): void {
    this.user.set(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  private storeSession(res: AuthResponse): void {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', res.username);
    this.user.set(res.username);
  }
}
