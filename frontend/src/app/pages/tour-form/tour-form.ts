import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TourService } from '../../services/tour';
import { Tour } from '../../models/tour';

@Component({
  selector: 'app-tour-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tour-form.html',
})
export class TourForm implements OnInit {
  tour: Tour = { id: 0, name: '', description: '', from: '', to: '', transportType: 'Hike', distance: 0, estimatedTime: 0 };
  isEdit = false;

  private tourService = inject(TourService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.tourService.getById(+id).subscribe(t => { if (t) this.tour = t; });
    }
  }

  save() {
    if (this.isEdit) {
      this.tourService.update(this.tour).subscribe(() => this.router.navigate(['/tours', this.tour.id]));
    } else {
      this.tourService.create(this.tour).subscribe(t => this.router.navigate(['/tours', t.id]));
    }
  }

  cancel() { this.router.navigate(['/tours']); }
}
