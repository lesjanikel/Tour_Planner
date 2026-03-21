import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TourService } from '../../services/tour';
import { TourLogService } from '../../services/tour-log';
import { Tour } from '../../models/tour';
import { TourLog } from '../../models/tour-log';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [],
  templateUrl: './tour-detail.html',
})
export class TourDetail implements OnInit {
  tour?: Tour;
  logs: TourLog[] = [];

  private tourService = inject(TourService);
  private tourLogService = inject(TourLogService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.tourService.getById(id).subscribe(t => this.tour = t);
    this.tourLogService.getByTourId(id).subscribe(l => this.logs = l);
  }

  edit() { this.router.navigate(['/tours', this.tour!.id, 'edit']); }
  back() { this.router.navigate(['/tours']); }
  newLog() { this.router.navigate(['/tours', this.tour!.id, 'logs','new']); }
  deleteLog(id: number) { this.tourLogService.delete(id).subscribe(() => this.ngOnInit()); }
}
