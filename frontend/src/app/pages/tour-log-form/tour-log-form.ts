import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TourLogService } from '../../services/tour-log';
import { TourLog } from '../../models/tour-log';
import {ErrorList} from '../../shared/error-list/error-list';

@Component({
  selector: 'app-tour-log-form',
  standalone: true,
  imports: [FormsModule, ErrorList],
  templateUrl: './tour-log-form.html',
})
export class TourLogForm implements OnInit {
  log: TourLog = { id: 0, tourId: 0, date: '', comment: '', difficulty: 1, totalDistance: 0, totalTime: 0, rating: 1 };
  errors: string[] = [];
  isEdit = false;
  private tourLogService = inject(TourLogService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);


  ngOnInit() {
    this.log.tourId = +this.route.snapshot.paramMap.get('id')!;
    const logId = this.route.snapshot.paramMap.get('logId');
    if(logId){
      this.isEdit = true;
      this.tourLogService.getById(+logId).subscribe(log => {if(log) this.log = {...log}; })
    }
  }

  save() {
    this.errors = [];
    if (!this.log.date) {
      this.errors.push('Date is required.');
    }
    if (this.log.totalDistance < 0) {
      this.errors.push('Distance cannot be negative.');
    }
    if (this.log.totalTime < 0) {
      this.errors.push('Time cannot be negative.');
    }
    if (this.log.difficulty < 1 || this.log.difficulty > 5) {
      this.errors.push('Difficulty must be between 1 and 5.');
    }
    if (this.log.rating < 1 || this.log.rating > 5) {
      this.errors.push('Rating must be between 1 and 5.');
    }

    if (this.errors.length > 0) return;

    if(this.isEdit){
      this.tourLogService.update(this.log).subscribe(() => this.router.navigate(['/tours', this.log.tourId]));
    }
    else{
      this.tourLogService.create(this.log).subscribe(() => this.router.navigate(['/tours', this.log.tourId]));
    }

  }

  cancel() { this.router.navigate(['/tours', this.log.tourId]); }
}
