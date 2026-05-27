import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  form,
  FormField,
  required,
  minLength,
} from '@angular/forms/signals';

import { TourService } from '../../services/tour';
import {
  CreateTourRequest,
  TransportType,
  TRANSPORT_LABELS,
} from '../../models/tour';
import { AddressAutocomplete } from '../../shared/address-autocomplete/address-autocomplete';
import { GeocodeFeature } from '../../services/geocode';

interface TourFormData {
  name: string;
  description: string;
  fromName: string;
  fromLat: number | null;
  fromLon: number | null;
  toName: string;
  toLat: number | null;
  toLon: number | null;
  transportType: TransportType;
}

@Component({
  selector: 'app-tour-form',
  imports: [AddressAutocomplete, FormField],
  templateUrl: './tour-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourForm {
  private tourService = inject(TourService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEdit = false;
  editId = 0;
  submitted = signal(false);

  // single source of truth for the whole form
  model = signal<TourFormData>({
    name: '',
    description: '',
    fromName: '',
    fromLat: null,
    fromLon: null,
    toName: '',
    toLat: null,
    toLon: null,
    transportType: 'FOOT_HIKING',
  });

  // wrap the model with form() + validation schema
  tourForm = form(this.model, (path) => {
    required(path.name, { message: 'Name is required' });
    minLength(path.name, 3, { message: 'Min 3 characters' });

    required(path.description, { message: 'Description is required' });
    minLength(path.description, 3, { message: 'Min 3 characters' });

    required(path.fromLat, { message: 'Pick a suggestion from the dropdown' });
    required(path.fromLon);
    required(path.toLat, { message: 'Pick a suggestion from the dropdown' });
    required(path.toLon);
  });

  protected readonly transportLabels = TRANSPORT_LABELS;
  protected readonly transportKeys = Object.keys(TRANSPORT_LABELS) as TransportType[];

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.editId = +id;
      this.tourService.getById(+id).then(t => {
        this.model.set({
          name: t.name,
          description: t.description,
          fromName: t.fromName,
          fromLat: t.fromLat,
          fromLon: t.fromLon,
          toName: t.toName,
          toLat: t.toLat,
          toLon: t.toLon,
          transportType: t.transportType,
        });
      });
    }
  }

  // user typed in From — clear coords
  onFromTextChanged(text: string) {
    this.tourForm.fromName().value.set(text);
    this.tourForm.fromLat().value.set(null);
    this.tourForm.fromLon().value.set(null);
  }
  // user picked a From suggestion
  onFromSelected(f: GeocodeFeature) {
    this.tourForm.fromName().value.set(f.label);
    this.tourForm.fromLat().value.set(f.lat);
    this.tourForm.fromLon().value.set(f.lon);
  }

  onToTextChanged(text: string) {
    this.tourForm.toName().value.set(text);
    this.tourForm.toLat().value.set(null);
    this.tourForm.toLon().value.set(null);
  }
  onToSelected(f: GeocodeFeature) {
    this.tourForm.toName().value.set(f.label);
    this.tourForm.toLat().value.set(f.lat);
    this.tourForm.toLon().value.set(f.lon);
  }

  async save() {
    this.submitted.set(true);
    if (!this.tourForm().valid()) return;

    const req = this.model() as CreateTourRequest;
    const t = this.isEdit
      ? await this.tourService.update(this.editId, req)
      : await this.tourService.create(req);
    this.router.navigate(['/tours', t.id]);
  }

  cancel() { this.router.navigate(['/tours']); }
}
