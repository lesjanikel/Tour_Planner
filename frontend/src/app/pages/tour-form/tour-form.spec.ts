import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { TourForm } from './tour-form';
import { TourService } from '../../services/tour';

describe('TourForm', () => {
  let component: TourForm;
  let fixture: ComponentFixture<TourForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourForm],
      providers: [
        { provide: TourService, useValue: { getById: vi.fn(), create: vi.fn(), update: vi.fn() } },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TourForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('form is invalid when name and description are empty', () => {
    expect(component.tourForm().valid()).toBe(false);
  });

  it('form is valid when all required fields are filled', () => {
    component.model.set({
      name: 'Vienna to Graz',
      description: 'A nice route',
      fromName: 'Vienna',
      fromLat: 48.2,
      fromLon: 16.3,
      toName: 'Graz',
      toLat: 47.0,
      toLon: 15.4,
      transportType: 'FOOT_HIKING',
    });
    expect(component.tourForm().valid()).toBe(true);
  });
});
