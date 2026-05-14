import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<string | null>(localStorage.getItem('user'));
  isLoggedIn(): boolean {
    return this.user() !== null;
  }

  login(username: string, password: string): boolean {
    this.user.set(username);
    localStorage.setItem('user', username);
    return true;
  }

  logout() {
    this.user.set(null);
    localStorage.removeItem('user');
  }
}
