import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TourService } from '../../services/tour';
import { Tour } from '../../models/tour';
import { ConfirmModal } from '../../shared/confirm-modal/confirm-modal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AchievementsService } from '../../services/achievements';
import { Achievement } from '../../models/achievement';
import { AchievementsComponent } from './achievements/achievements';

@Component({
  selector: 'app-tour-list',
  standalone: true,
  imports: [FormsModule, ConfirmModal, AchievementsComponent],
  templateUrl: './tour-list.html',
})
export class TourList implements OnInit {
  tours: Tour[] = [];
  search = '';
  totalDistance = 0;
  totalTime = 0;
  achievements: Achievement[] = [];
  deleteTarget: number|null = null;

  private tourService = inject(TourService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private achievementsService = inject(AchievementsService);

  loadTours() {
    this.tourService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      this.tours = data;
      this.totalDistance = data.reduce((s, t) => s + t.distance, 0);
      this.totalTime = Math.round(data.reduce((s, t) => s + t.estimatedTime, 0) / 60);
      this.achievements = this.achievementsService.getAchievements(data);
    });
  }

  ngOnInit() {
    this.loadTours();
  }

  filteredTours() {
    return this.tours.filter(t =>
      t.name.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  edit(id: number) {
    this.router.navigate(['/tours', id, 'edit']);
  }

  delete(id: number) {
    this.deleteTarget = id;
  }

  confirmDelete(){
    this.tourService.delete(this.deleteTarget!).subscribe(() => {
      this.deleteTarget = null;
      this.loadTours();
    })
  }

  protected detail(id: number) {
    this.router.navigate(['/tours', id]);
  }
}
