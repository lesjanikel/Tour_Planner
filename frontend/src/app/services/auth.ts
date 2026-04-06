import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<string | null>(localStorage.getItem('user'));
  isLoggedIn = computed(() => this.user() !== null);

  login(username: string, password: string): boolean {
    localStorage.setItem('user', username);
    this.user.set(username);
    return true;
  }

  logout() {
    localStorage.removeItem('user');
    this.user.set(null);
  }

}
