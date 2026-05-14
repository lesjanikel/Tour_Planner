import { TestBed } from '@angular/core/testing';

import { Achievements } from './achievements';

describe('Achievements', () => {
  let service: Achievements;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Achievements);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
