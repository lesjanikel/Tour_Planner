import {Component, inject, AfterViewInit, ChangeDetectionStrategy, signal, effect} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TourService } from '../../services/tour';
import { TourLogService } from '../../services/tour-log';
import { TourLog } from '../../models/tour-log';
import { ConfirmModal } from '../../shared/confirm-modal/confirm-modal';
import { MapFacadeService } from '../../services/map-facade-service';
import {DatePipe, DecimalPipe} from '@angular/common';
import {Tour} from '../../models/tour';
import { TRANSPORT_LABELS} from '../../models/tour';
import {environment} from '../../../environments/environment';
import {extractError, ToastService} from '../../services/toast';

@Component({
  selector: 'app-tour-detail',
  imports: [ConfirmModal, DecimalPipe, DatePipe],
  templateUrl: './tour-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourDetail implements AfterViewInit {
  private tourService = inject(TourService);
  private tourLogService = inject(TourLogService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private mapFacadeService = inject(MapFacadeService);
  private toast = inject(ToastService)


  private id = +this.route.snapshot.paramMap.get('id')!;
  protected readonly transportLabels = TRANSPORT_LABELS;
  protected readonly apiUrl = environment.apiUrl;

  tour = signal<Tour | undefined>(undefined);
  logs = this.tourLogService.logs;
  deleteLogTarget = signal<number | null>(null);

  constructor() {
    this.tourService.getById(this.id)
      .then(t => this.tour.set(t))
      .catch(err => {
        this.toast.error(extractError(err, 'Could not load tour'));
        this.router.navigate(['/tours']);
      });
    this.tourLogService.loadAll(this.id)
      .catch(err => this.toast.error(extractError(err, 'Could not load logs')));

    effect(() => {
      const t = this.tour();
      if (t?.routeGeoJson) {
        this.mapFacadeService.setRoute(t.routeGeoJson);
      }
    });
  }


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

  async confirmDeleteLog() {
    try {
      await this.tourLogService.delete(this.id, this.deleteLogTarget()!);
      this.tour.set(await this.tourService.getById(this.id));
      this.toast.success('Log deleted');
    } catch (err) {
      this.toast.error(extractError(err, 'Could not delete log'));
    } finally {
      this.deleteLogTarget.set(null);
    }
  }

  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      const updated = await this.tourService.setImage(this.id, file);
      this.tour.set(updated);
      this.toast.success('Image uploaded');
    } catch (err) {
      this.toast.error(extractError(err, 'Upload failed'));
    } finally {
      (event.target as HTMLInputElement).value = '';
    }
    (event.target as HTMLInputElement).value = '';   // reset so same file can be re-picked
  }

  async removeImage() {
    const updated = await this.tourService.clearImage(this.id);
    this.tour.set(updated);
  }
}
