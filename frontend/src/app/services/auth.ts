import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<string | null>(null);
  isLoggedIn = computed(() => this.user() !== null);

  login(username: string, password: string): boolean {
    this.user.set(username);
    return true;
  }

  logout() {
    this.user.set(null);
  }

}
