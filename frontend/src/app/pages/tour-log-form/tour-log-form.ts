import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TourLogService } from '../../services/tour-log';
import { TourLog } from '../../models/tour-log';

@Component({
  selector: 'app-tour-log-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tour-log-form.html',
})
export class TourLogForm implements OnInit {
  log: TourLog = { id: 0, tourId: 0, date: '', comment: '', difficulty: 1, totalDistance: 0, totalTime: 0, rating: 1 };

  private tourLogService = inject(TourLogService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.log.tourId = +this.route.snapshot.paramMap.get('id')!;
  }

  save() {
    this.tourLogService.create(this.log).subscribe(() => this.router.navigate(['/tours', this.log.tourId]));
  }

  cancel() { this.router.navigate(['/tours', this.log.tourId]); }
}
