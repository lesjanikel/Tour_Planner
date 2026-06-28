import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { vi } from 'vitest';
import { TourLogForm } from './tour-log-form';
import { TourLogService } from '../../services/tour-log';

describe('TourLogForm', () => {
  let component: TourLogForm;
  let fixture: ComponentFixture<TourLogForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourLogForm],
      providers: [
        { provide: TourLogService, useValue: { getById: vi.fn(), create: vi.fn(), update: vi.fn() } },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: (k: string) => k === 'id' ? '1' : null } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TourLogForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('form is invalid when date is missing', () => {
    expect(component.logForm().valid()).toBe(false);
  });

  it('form is valid when all required fields are correctly filled', () => {
    component.model.set({
      dateTime: '2024-01-01T10:00',
      comment: 'Great tour',
      difficulty: 3,
      totalDistance: 15,
      totalTime: 120,
      rating: 4,
    });
    expect(component.logForm().valid()).toBe(true);
  });
});
