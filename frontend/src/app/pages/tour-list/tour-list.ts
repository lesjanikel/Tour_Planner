import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TourService } from '../../services/tour';
import { Tour } from '../../models/tour';
import { ConfirmModal } from '../../shared/confirm-modal/confirm-modal';
import { AchievementsService } from '../../services/achievements';
import { AchievementsComponent } from './achievements/achievements';
import {DecimalPipe} from '@angular/common';
import {extractError, ToastService} from '../../services/toast';

@Component({
  selector: 'app-tour-list',
  imports: [FormsModule, ConfirmModal, AchievementsComponent, DecimalPipe],
  templateUrl: './tour-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourList {
  private tourService = inject(TourService);
  private router = inject(Router);
  private achievementsService = inject(AchievementsService);
  private toast = inject(ToastService)

  tours= this.tourService.tours;
  search= signal('');
  deleteTarget= signal<number | null>(null);

  filteredTours = computed(() => {
    const q = this.search().toLowerCase();
    return this.tours().filter(t => t.name.toLowerCase().includes(q));
  });
  totalDistance = computed(() => this.tours().reduce((s, t) => s + t.distanceKm, 0));
  totalTime     = computed(() =>
    Math.round(this.tours().reduce((s, t) => s + t.durationSec / 60, 0) / 60)
  );
  achievements  = computed(() => this.achievementsService.getAchievements(this.tours()));

  constructor() {
    this.tourService.loadAll();      // fires once, service fills its own signal
  }

  edit(id: number)   { this.router.navigate(['/tours', id, 'edit']); }
  detail(id: number) { this.router.navigate(['/tours', id]); }
  delete(id: number) { this.deleteTarget.set(id); }

  async confirmDelete() {
    try {
      await this.tourService.delete(this.deleteTarget()!);
      this.toast.success('Tour deleted');
    } catch (err) {
      this.toast.error(extractError(err, 'Could not delete tour'));
    } finally {
      this.deleteTarget.set(null);   // close modal either way
    }
  }
}
