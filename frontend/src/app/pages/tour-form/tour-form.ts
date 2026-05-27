import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { TourService } from '../../services/tour';
import { CreateTourRequest, TransportType } from '../../models/tour';
import { AddressAutocomplete } from '../../shared/address-autocomplete/address-autocomplete';
import { GeocodeFeature } from '../../services/geocode';

@Component({
  selector: 'app-tour-form',
  standalone: true,
  imports: [ReactiveFormsModule, AddressAutocomplete],
  templateUrl: './tour-form.html',
})
export class TourForm implements OnInit {
  isEdit = false;
  editId = 0;
  initialFromName = '';
  initialToName   = '';

  form = new FormGroup({
    name:        new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(3)]),
    fromName:    new FormControl('', [Validators.required]),
    fromLat:     new FormControl<number | null>(null, [Validators.required]),
    fromLon:     new FormControl<number | null>(null, [Validators.required]),
    toName:      new FormControl('', [Validators.required]),
    toLat:       new FormControl<number | null>(null, [Validators.required]),
    toLon:       new FormControl<number | null>(null, [Validators.required]),
    transportType: new FormControl<TransportType>('FOOT_HIKING', [Validators.required]),
  });

  private tourService = inject(TourService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.isEdit = true;
    this.editId = +id;
    const t = await this.tourService.getById(+id);
    this.form.patchValue({
      name: t.name, description: t.description,
      fromName: t.fromName, fromLat: t.fromLat, fromLon: t.fromLon,
      toName:   t.toName,   toLat:   t.toLat,   toLon:   t.toLon,
      transportType: t.transportType,
    });
    this.initialFromName = t.fromName;
    this.initialToName   = t.toName;
  }

  onFromSelected(f: GeocodeFeature) {
    this.form.patchValue({ fromName: f.label, fromLat: f.lat, fromLon: f.lon });
  }
  onFromTextChanged(text: string) {
    this.form.patchValue({ fromName: text, fromLat: null, fromLon: null });
  }

  onToSelected(f: GeocodeFeature) {
    this.form.patchValue({ toName: f.label, toLat: f.lat, toLon: f.lon });
  }
  onToTextChanged(text: string) {
    this.form.patchValue({ toName: text, toLat: null, toLon: null });
  }

  async save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const req = this.form.getRawValue() as CreateTourRequest;
    const t = this.isEdit
      ? await this.tourService.update(this.editId, req)
      : await this.tourService.create(req);
    this.router.navigate(['/tours', t.id]);
  }

  cancel() { this.router.navigate(['/tours']); }
}
