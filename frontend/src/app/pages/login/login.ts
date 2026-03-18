import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
})
export class Login {
  username = '';
  password = '';

  private router = inject(Router);
  private authService = inject(AuthService);

  login() {
    this.authService.login(this.username, this.password);
    this.router.navigate(['/tours']);
  }

  goRegister() { this.router.navigate(['/register']); }
}
