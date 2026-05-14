import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './register.html',
})
export class Register {
  form = new FormGroup({
    username: new FormControl('', [Validators.required]),

    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)
    ]),

    passwordConfirm: new FormControl('', [Validators.required]),

    accepted: new FormControl(false, [Validators.requiredTrue] )
  });

  private router = inject(Router);

  register() {
    if (
      this.form.value.password !==
      this.form.value.passwordConfirm
    ) {
      this.form.controls.passwordConfirm.setErrors({
        mismatch: true
      });

      this.form.controls.passwordConfirm.markAsTouched();

      return;
    }

    this.router.navigate(['/login']);
  }
}
