import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import {ErrorList} from '../../shared/error-list/error-list';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ErrorList],
  templateUrl: './login.html',
})
export class Login {
  username = '';
  password = '';

  errors: string[] = [];

  private router = inject(Router);
  private authService = inject(AuthService);

  login() {
    this.errors = [];

    if (!this.username.trim()) {
      this.errors.push('Username is required.');
    }
    if (!this.password) {
      this.errors.push('Password is required.');
    }

    if (this.errors.length > 0) return;

    this.authService.login(this.username, this.password);
    this.router.navigate(['/tours']);
  }

  goRegister() { this.router.navigate(['/register']); }
}
