import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TourService } from '../../services/tour';
import { Tour } from '../../models/tour';
import {ConfirmModal} from '../../shared/confirm-modal/confirm-modal';

@Component({
  selector: 'app-tour-list',
  standalone: true,
  imports: [FormsModule, ConfirmModal],
  templateUrl: './tour-list.html',
})
export class TourList implements OnInit {
  tours: Tour[] = [];
  search = '';
  totalDistance = 0;
  totalTime = 0;
  badge = 'Explorer';
  deleteTarget: number|null = null;

  private tourService = inject(TourService);
  private router = inject(Router);

  ngOnInit() {
    this.tourService.getAll().subscribe(data => {
      this.tours = data;
      this.totalDistance = data.reduce((s, t) => s + t.distance, 0);
      this.totalTime = Math.round(data.reduce((s, t) => s + t.estimatedTime, 0) / 60);
    });
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
      this.ngOnInit();
    })
  }

  protected detail(id: number) {
    this.router.navigate(['/tours', id]);
  }
}
