import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { vi } from 'vitest';
import { AddressAutocomplete } from './address-autocomplete';
import { GeocodeService, GeocodeFeature } from '../../services/geocode';

const mockFeature: GeocodeFeature = { label: 'Vienna', layer: 'city', country: 'AT', lat: 48.2, lon: 16.3 };

describe('AddressAutocomplete', () => {
  let component: AddressAutocomplete;
  let fixture: ComponentFixture<AddressAutocomplete>;
  let geocodeService: { autocomplete: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    geocodeService = { autocomplete: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [AddressAutocomplete],
      providers: [
        { provide: GeocodeService, useValue: geocodeService },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressAutocomplete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('pick emits the selected feature and closes the dropdown', () => {
    let emitted: GeocodeFeature | undefined;
    component.selected.subscribe((f: GeocodeFeature) => emitted = f);
    component.open.set(true);
    (component as any).pick(mockFeature);
    expect(emitted).toEqual(mockFeature);
    expect(component.open()).toBe(false);
  });

  it('does not call geocode for queries shorter than 2 characters', async () => {
    // set a short query and wait for any debounce to fire
    (component as any).rawQuery.set('a');
    await new Promise(r => setTimeout(r, 400));
    expect(geocodeService.autocomplete).not.toHaveBeenCalled();
  });
});
