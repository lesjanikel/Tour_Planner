import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
})
export class Register {
  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/),
    ]),
    passwordConfirm: new FormControl('', [Validators.required]),
    accepted: new FormControl(false, [Validators.requiredTrue]),
  });

  error = signal<string | null>(null);
  loading = signal(false);

  private router = inject(Router);
  private authService = inject(AuthService);

  async register() {
    if (this.form.value.password !== this.form.value.passwordConfirm) {
      this.form.controls.passwordConfirm.setErrors({ mismatch: true });
      this.form.controls.passwordConfirm.markAsTouched();
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.authService.register(this.form.value.username!, this.form.value.password!);
      this.router.navigate(['/tours']);
    } catch (err: any) {
      this.error.set(err.error?.detail ?? 'Could not register');
    } finally {
      this.loading.set(false);
    }
  }
}
