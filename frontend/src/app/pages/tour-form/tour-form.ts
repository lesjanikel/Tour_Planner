import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TourService } from '../../services/tour';
import { Tour } from '../../models/tour';
import {ErrorList} from '../../shared/error-list/error-list';

@Component({
  selector: 'app-tour-form',
  standalone: true,
  imports: [FormsModule, ErrorList],
  templateUrl: './tour-form.html',
})
export class TourForm implements OnInit {
  tour: Tour = { id: 0, name: '', description: '', from: '', to: '', transportType: 'Hike', distance: 0, estimatedTime: 0 };
  isEdit = false;
  errors: string[] = [];

  private tourService = inject(TourService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.tourService.getById(+id).subscribe(t => { if (t) this.tour = {...t}; });
    }
  }

  save() {
    this.errors = [];


    if (!this.tour.name?.trim() || this.tour.name.trim().length < 3) {
      this.errors.push('Name muss mindestens 3 Zeichen lang sein.');
    }
    if (!this.tour.from?.trim()) {
      this.errors.push('Startort ist erforderlich.');
    }
    if (!this.tour.to?.trim()) {
      this.errors.push('Zielort ist erforderlich.');
    }
    if (this.tour.distance < 0) {
      this.errors.push('Distanz darf nicht negativ sein.');
    }
    if (this.tour.estimatedTime < 0) {
      this.errors.push('Zeit darf nicht negativ sein.');
    }

    if (this.errors.length > 0) return;


    if (this.isEdit) {
      this.tourService.update(this.tour).subscribe(() => this.router.navigate(['/tours', this.tour.id]));
    } else {
      this.tourService.create(this.tour).subscribe(t => this.router.navigate(['/tours', t.id]));
    }
  }

  cancel() { this.router.navigate(['/tours']); }
}
