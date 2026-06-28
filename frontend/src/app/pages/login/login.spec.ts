import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { Login } from './login';
import { AuthService } from '../../services/auth';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authService: { login: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authService = { login: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('form is invalid when username and password are empty', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('sets specific error on 401 and generic error on other failures', async () => {
    component.form.setValue({ username: 'alice', password: 'wrong' });
    authService.login.mockRejectedValue({ status: 401 });
    await component.login();
    expect(component.error()).toBe('Invalid credentials');

    authService.login.mockRejectedValue({ status: 500 });
    await component.login();
    expect(component.error()).toBe('Something went wrong');
  });

});
