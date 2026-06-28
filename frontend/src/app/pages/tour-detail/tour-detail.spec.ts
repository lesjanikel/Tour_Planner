import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { TourDetail } from './tour-detail';
import { TourService } from '../../services/tour';
import { TourLogService } from '../../services/tour-log';
import { MapFacadeService } from '../../services/map-facade-service';
import { ToastService } from '../../services/toast';
import { Tour } from '../../models/tour';

const mockTour: Tour = {
  id: 1, name: 'Test Tour', description: 'desc', fromName: 'A', fromLat: 0, fromLon: 0,
  toName: 'B', toLat: 1, toLon: 1, transportType: 'FOOT_WALKING',
  distanceKm: 10, durationSec: 3600, routeGeoJson: null, imageUrl: null,
  ownerId: 1, popularity: 0, childFriendly: null,
};

describe('TourDetail', () => {
  let component: TourDetail;
  let fixture: ComponentFixture<TourDetail>;
  let tourService: { getById: ReturnType<typeof vi.fn>; export: ReturnType<typeof vi.fn>; setImage: ReturnType<typeof vi.fn>; clearImage: ReturnType<typeof vi.fn> };
  let tourLogService: { loadAll: ReturnType<typeof vi.fn>; delete: ReturnType<typeof vi.fn>; logs: ReturnType<typeof signal> };
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    tourService = {
      getById: vi.fn().mockResolvedValue(mockTour),
      export: vi.fn(),
      setImage: vi.fn(),
      clearImage: vi.fn(),
    };
    tourLogService = {
      loadAll: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
      logs: signal([]),
    };
    router = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [TourDetail],
      providers: [
        { provide: TourService, useValue: tourService },
        { provide: TourLogService, useValue: tourLogService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: MapFacadeService, useValue: { initMap: vi.fn(), destroyMap: vi.fn(), setRoute: vi.fn() } },
        { provide: ToastService, useValue: { error: vi.fn(), success: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TourDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('loads the tour on init and sets the tour signal', async () => {
    expect(tourService.getById).toHaveBeenCalledWith(1);
    expect(component.tour()?.name).toBe('Test Tour');
  });

});
