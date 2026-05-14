import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { TourService } from '../../services/tour';
import { Tour } from '../../models/tour';

@Component({
  selector: 'app-tour-form',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './tour-form.html',
})
export class TourForm implements OnInit {
  tour: Tour = { id: 0, name: '', description: '', from: '', to: '', transportType: 'Hike', distance: 0, estimatedTime: 0, imagePath: '' };
  isEdit = false;
  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),

    description: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),

    from: new FormControl('', [ Validators.required ]),

    to: new FormControl('', [ Validators.required ]),

    transportType: new FormControl('Hike', [ Validators.required ]),

    distance: new FormControl(0, [ Validators.min(0) ]),

    estimatedTime: new FormControl(0, [ Validators.min(0) ]),

    imagePath: new FormControl('')
  });

  private tourService = inject(TourService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.tourService.getById(+id).subscribe(t => {
        if (t) {
          this.tour = {...t};
          this.form.patchValue(t);
        }
      });
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.tour = {
      ...this.tour,
      ...this.form.value
    } as Tour;

    if (this.isEdit) {
      this.tourService.update(this.tour).subscribe(() => this.router.navigate(['/tours', this.tour.id]));
    } else {
      this.tourService.create(this.tour).subscribe(t => this.router.navigate(['/tours', t.id]));
    }
  }

  cancel() { this.router.navigate(['/tours']); }
}
