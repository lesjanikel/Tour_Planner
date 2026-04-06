import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
})
export class Navbar {

  private router = inject(Router);
  private authService = inject(AuthService);

  isLoggedIn = this.authService.isLoggedIn;
  username = this.authService.user;

  goHome()  { this.router.navigate(['/']); }
  goTours() { this.router.navigate(['/tours']); }
  goLogin() { this.router.navigate(['/login']); }
  goRegister() { this.router.navigate(['/register']); }
  newTour() { this.router.navigate(['/tours/new']); }
  logout() { this.authService.logout(); this.router.navigate(['/']); }



}
