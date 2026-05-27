import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { form, FormField, required, min, max, minLength } from '@angular/forms/signals';
import { TourLogService } from '../../services/tour-log';
import { CreateTourLogRequest } from '../../models/tour-log';

interface LogFormData {
  dateTime: string;
  comment: string;
  difficulty: number;
  totalDistance: number;
  totalTime: number;
  rating: number;
}

@Component({
  selector: 'app-tour-log-form',
  imports: [FormField],
  templateUrl: './tour-log-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourLogForm {
  private tourLogService = inject(TourLogService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  tourId = +this.route.snapshot.paramMap.get('id')!;
  logIdParam = this.route.snapshot.paramMap.get('logId');
  isEdit = !!this.logIdParam;
  submitted = signal(false);

  model = signal<LogFormData>({
    dateTime: '',
    comment: '',
    difficulty: 1,
    totalDistance: 0,
    totalTime: 0,
    rating: 1,
  });

  logForm = form(this.model, (path) => {
    required(path.dateTime, { message: 'Date is required' });
    minLength(path.comment, 3, { message: 'Comment must be at least 3 characters' });
    min(path.difficulty, 1, { message: '1–5' });
    max(path.difficulty, 5, { message: '1–5' });
    min(path.rating, 1, { message: '1–5' });
    max(path.rating, 5, { message: '1–5' });
    min(path.totalDistance, 0, { message: 'Must be ≥ 0' });
    min(path.totalTime, 0, { message: 'Must be ≥ 0' });
  });

  constructor() {
    if (this.isEdit) {
      this.tourLogService.getById(this.tourId, +this.logIdParam!).then(l => {
        this.model.set({
          dateTime: l.dateTime.slice(0, 16),   // ISO → datetime-local "YYYY-MM-DDThh:mm"
          comment: l.comment,
          difficulty: l.difficulty,
          totalDistance: l.totalDistance,
          totalTime: l.totalTime,
          rating: l.rating,
        });
      });
    }
  }

  async save() {
    this.submitted.set(true);
    if (!this.logForm().valid()) return;

    const m = this.model();
    // datetime-local sends "YYYY-MM-DDThh:mm" — backend's LocalDateTime needs seconds
    const dateTime = m.dateTime.length === 16 ? m.dateTime + ':00' : m.dateTime;
    const req: CreateTourLogRequest = { ...m, dateTime };

    if (this.isEdit) {
      await this.tourLogService.update(this.tourId, +this.logIdParam!, req);
    } else {
      await this.tourLogService.create(this.tourId, req);
    }
    this.router.navigate(['/tours', this.tourId]);
  }

  cancel() { this.router.navigate(['/tours', this.tourId]); }
}
