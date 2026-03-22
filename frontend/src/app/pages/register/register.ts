import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {ErrorList} from '../../shared/error-list/error-list';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ErrorList],
  templateUrl: './register.html',
})
export class Register {
  username = '';
  password = '';
  passwordConfirm = '';
  accepted = false;

  errors: string[] = [];

  private router = inject(Router);

  register() {
    this.errors = [];

    if (!this.username.trim()) {
      this.errors.push('Username is required.');
    }
    if (!this.password || this.password.length < 6) {
      this.errors.push('Password must be at least 6 characters.');
    }
    if (this.password !== this.passwordConfirm) {
      this.errors.push('Passwords do not match.');
    }
    if (!this.accepted) {
      this.errors.push('You must accept the user agreement.');
    }

    if (this.errors.length > 0) return;

    this.router.navigate(['/login']);
  }
}
