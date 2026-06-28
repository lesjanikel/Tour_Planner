import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
  });

  it('isLoggedIn returns false when no session is stored', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  it('logout clears the user signal and removes session from localStorage', () => {
    service.user.set('alice');
    localStorage.setItem('token', 'some-token');
    localStorage.setItem('user', 'alice');
    service.logout();
    expect(service.isLoggedIn()).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
