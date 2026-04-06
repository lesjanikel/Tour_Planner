import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.html',
})
export class Footer{
  private router = inject(Router);

  goImpressum() { this.router.navigate(['/impressum']); }
  goContact() { this.router.navigate(['/contact']); }
  goAbout()   { this.router.navigate(['/about']); }
  goPrivacy() { this.router.navigate(['/privacy']); }
}
