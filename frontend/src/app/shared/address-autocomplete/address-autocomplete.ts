import {Component, EventEmitter, inject, Input, Output, signal, DestroyRef} from '@angular/core';
import {catchError, debounceTime, distinctUntilChanged, of, switchMap} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {GeocodeFeature, GeocodeService} from '../../services/geocode';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-address-autocomplete',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './address-autocomplete.html',
})
export class AddressAutocomplete {
  @Input() placeholder = 'Search…';
  @Input() initialValue = '';
  @Output() selected = new EventEmitter<GeocodeFeature>();
  @Output() textChanged = new EventEmitter<string>();

  query = new FormControl('', { nonNullable: true });
  suggestions = signal<GeocodeFeature[]>([]);
  open = signal(false);

  private geocode = inject(GeocodeService);
  private destroyRef = inject(DestroyRef)

  ngOnInit() {
    if (this.initialValue) this.query.setValue(this.initialValue);

    this.query.valueChanges.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(q => q.trim().length < 2 ? of([]) : this.geocode.autocomplete(q)),
      catchError(() => of([])),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(list => {
      this.suggestions.set(list);
      this.open.set(list.length > 0);
    });
    this.query.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(v => this.textChanged.emit(v));
  }

  pick(f: GeocodeFeature) {
    this.query.setValue(f.label, { emitEvent: false });   // don't re-trigger search
    this.open.set(false);
    this.selected.emit(f);
  }


  protected closeLater() {
    setTimeout(() => this.open.set(false), 150)
  }
}
