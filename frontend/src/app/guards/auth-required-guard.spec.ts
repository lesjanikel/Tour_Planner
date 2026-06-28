import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { vi } from 'vitest';
import { authRequiredGuard } from './auth-required-guard';
import { AuthService } from '../services/auth';

describe('authRequiredGuard', () => {
  let authService: { isLoggedIn: ReturnType<typeof vi.fn> };
  let router: { parseUrl: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authService = { isLoggedIn: vi.fn() };
    router = { parseUrl: vi.fn().mockReturnValue({}) };
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('allows navigation when the user is logged in', () => {
    authService.isLoggedIn.mockReturnValue(true);
    const result = TestBed.runInInjectionContext(() =>
      authRequiredGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));
    expect(result).toBe(true);
  });

});
