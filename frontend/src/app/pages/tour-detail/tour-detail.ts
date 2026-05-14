import { Component, inject, OnInit, AfterViewInit, DestroyRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TourService } from '../../services/tour';
import { TourLogService } from '../../services/tour-log';
import { Tour } from '../../models/tour';
import { TourLog } from '../../models/tour-log';
import { ConfirmModal } from '../../shared/confirm-modal/confirm-modal';
import { MapFacadeService } from '../../services/map-facade-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [
    ConfirmModal
  ],
  templateUrl: './tour-detail.html',
})
export class TourDetail implements OnInit, AfterViewInit {
  tour?: Tour;
  logs: TourLog[] = [];

  private tourService = inject(TourService);
  private tourLogService = inject(TourLogService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private mapFacadeService = inject(MapFacadeService);
  deleteLogTarget: number | null = null;

  loadData() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.tourService.getById(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(t => (this.tour = t));
    this.tourLogService.getByTourId(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(l => this.logs = l);
  }

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.mapFacadeService.initMap("map");
  }

  edit() { this.router.navigate(['/tours', this.tour!.id, 'edit']); }
  back() { this.router.navigate(['/tours']); }
  newLog() { this.router.navigate(['/tours', this.tour!.id, 'logs','new']); }
  deleteLog(id: number) {
    this.deleteLogTarget = id;
  }

  confirmDeleteLog(){
    this.tourLogService.delete(this.deleteLogTarget!).subscribe(() => {
      this.deleteLogTarget = null;
      this.loadData();
      }
    )
  }

  protected editLog(log: TourLog) {
    this.router.navigate(['/tours', this.tour!.id, 'logs', log.id, 'edit']);
  }
}
