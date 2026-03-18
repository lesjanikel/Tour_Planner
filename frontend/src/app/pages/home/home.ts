import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
})
export class Home {
  private router = inject(Router);

  goLogin() { this.router.navigate(['/login']); }
  goRegister() { this.router.navigate(['/register']); }
}
