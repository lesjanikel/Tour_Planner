import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html',
})
export class Register {
  username = '';
  password = '';
  passwordConfirm = '';
  accepted = false;

  private router = inject(Router);

  register() { this.router.navigate(['/login']); }
}
