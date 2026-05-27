import {Component, inject, AfterViewInit, ChangeDetectionStrategy, signal, effect} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TourService } from '../../services/tour';
import { TourLogService } from '../../services/tour-log';
import { TourLog } from '../../models/tour-log';
import { ConfirmModal } from '../../shared/confirm-modal/confirm-modal';
import { MapFacadeService } from '../../services/map-facade-service';
import {DecimalPipe} from '@angular/common';
import {Tour} from '../../models/tour';

@Component({
  selector: 'app-tour-detail',
  imports: [ConfirmModal, DecimalPipe],
  templateUrl: './tour-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourDetail implements AfterViewInit {
  private tourService = inject(TourService);
  private tourLogService = inject(TourLogService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private mapFacadeService = inject(MapFacadeService);

  private id = +this.route.snapshot.paramMap.get('id')!;

  tour = signal<Tour | undefined>(undefined);
  logs = signal<TourLog[]>([]);

  constructor() {
    this.tourService.getById(this.id).then(t => this.tour.set(t));
    this.tourLogService.getByTourId(this.id).subscribe(l => this.logs.set(l));

    effect(() => {
      const t = this.tour();
      if (t?.routeGeoJson) {
        this.mapFacadeService.setRoute(t.routeGeoJson);
      }
    });
  }

  deleteLogTarget = signal<number | null>(null);

  ngAfterViewInit() {
    this.mapFacadeService.initMap('map');     // #map div is outside @if, always present
  }
  ngOnDestroy() {
    this.mapFacadeService.destroyMap();
  }

  edit()      { this.router.navigate(['/tours', this.tour()!.id, 'edit']); }
  back()      { this.router.navigate(['/tours']); }
  newLog()    { this.router.navigate(['/tours', this.tour()!.id, 'logs', 'new']); }
  editLog(l: TourLog) { this.router.navigate(['/tours', this.tour()!.id, 'logs', l.id, 'edit']); }
  deleteLog(id: number) { this.deleteLogTarget.set(id); }

  confirmDeleteLog() {
    const id = this.deleteLogTarget()!;
    this.tourLogService.delete(id).subscribe(() => {
      this.deleteLogTarget.set(null);
    });
  }
}
