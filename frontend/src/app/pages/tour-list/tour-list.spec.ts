import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { TourList } from './tour-list';
import { TourService } from '../../services/tour';
import { Tour } from '../../models/tour';

function makeTour(overrides: Partial<Tour> = {}): Tour {
  return {
    id: 1, name: 'T', description: '', fromName: '', fromLat: 0, fromLon: 0,
    toName: '', toLat: 0, toLon: 0, transportType: 'FOOT_WALKING',
    distanceKm: 10, durationSec: 3600, routeGeoJson: null, imageUrl: null,
    ownerId: 1, popularity: 0, childFriendly: null, ...overrides,
  };
}

describe('TourList', () => {
  let component: TourList;
  let toursSignal: ReturnType<typeof signal<Tour[]>>;

  beforeEach(async () => {
    toursSignal = signal<Tour[]>([]);

    const mockTourService = {
      tours: toursSignal.asReadonly(),
      loadAll: vi.fn(),
      search: vi.fn().mockReturnValue(Promise.resolve()),
      delete: vi.fn().mockReturnValue(Promise.resolve()),
      import: vi.fn(),
      exportAll: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TourList],
      providers: [
        { provide: TourService, useValue: mockTourService },
        { provide: Router, useValue: { navigate: vi.fn() } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TourList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('filteredTours excludes non-child-friendly tours when filter is active', () => {
    toursSignal.set([
      makeTour({id: 1, childFriendly: true}),
      makeTour({id: 2, childFriendly: false}),
    ]);
    component.filterChildFriendly.set(true);
    expect(component.filteredTours().length).toBe(1);
    expect(component.filteredTours()[0].id).toBe(1);
  });

  it('totalDistance sums distanceKm across all tours', () => {
    toursSignal.set([makeTour({distanceKm: 15}), makeTour({distanceKm: 25})]);
    expect(component.totalDistance()).toBe(40);
  });
});
