import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  error = signal<string | null>(null);
  loading = signal(false);

  private router = inject(Router);
  private authService = inject(AuthService);

  async login() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.authService.login(this.form.value.username!, this.form.value.password!);
      this.router.navigate(['/tours']);
    } catch (err: any) {
      this.error.set(err.status === 401 ? 'Invalid credentials' : 'Something went wrong');
    } finally {
      this.loading.set(false);
    }
  }
}
