import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy',
  imports: [],
  templateUrl: './privacy.html',
})
export class Privacy {
  private router = inject(Router);

  goContact() { this.router.navigate(['/contact']); }
}
