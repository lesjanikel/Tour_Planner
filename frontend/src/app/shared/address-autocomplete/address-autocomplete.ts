import { Component, ChangeDetectionStrategy, inject, signal, input, output, DestroyRef } from '@angular/core';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GeocodeFeature, GeocodeService } from '../../services/geocode';

@Component({
  selector: 'app-address-autocomplete',
  templateUrl: './address-autocomplete.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressAutocomplete {
  value = input('');                             // displayed text (controlled by parent)
  placeholder = input('Search…');
  valueChange = output<string>();                // user typed
  selected = output<GeocodeFeature>();           // user picked

  suggestions = signal<GeocodeFeature[]>([]);
  open = signal(false);

  private geocode = inject(GeocodeService);
  private destroyRef = inject(DestroyRef);
  private rawQuery = signal('');                 // drives the search stream

  constructor() {

    toObservable(this.rawQuery).pipe(
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(q => q.trim().length < 2 ? of([]) : this.geocode.autocomplete(q)),
      catchError(() => of([])),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(list => {
      this.suggestions.set(list);
      this.open.set(list.length > 0);
    });
  }

  protected onInput(event: Event) {
    const text = (event.target as HTMLInputElement).value;
    this.valueChange.emit(text);
    this.rawQuery.set(text);
  }

  protected pick(f: GeocodeFeature) {
    this.selected.emit(f);   // parent decides what to do
    this.open.set(false);
  }

  protected closeLater() {
    setTimeout(() => this.open.set(false), 150);
  }
}
