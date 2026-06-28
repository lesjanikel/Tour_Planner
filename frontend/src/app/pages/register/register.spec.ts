import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { Register } from './register';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: AuthService, useValue: { register: vi.fn().mockResolvedValue(undefined) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('password is invalid when shorter than 8 characters', () => {
    component.form.controls.password.setValue('Short1');
    expect(component.form.controls.password.invalid).toBe(true);
  });

  it('password is invalid when it has no uppercase letter or digit', () => {
    component.form.controls.password.setValue('alllowercase');
    expect(component.form.controls.password.invalid).toBe(true);
  });

  it('register sets mismatch error when passwords do not match', async () => {
    component.form.controls.username.setValue('alice');
    component.form.controls.password.setValue('Password1');
    component.form.controls.passwordConfirm.setValue('Different1');
    component.form.controls.accepted.setValue(true);
    await component.register();
    expect(component.form.controls.passwordConfirm.errors?.['mismatch']).toBe(true);
  });
});
