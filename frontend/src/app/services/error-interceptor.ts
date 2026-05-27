import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth';
import { ToastService } from './toast';
import { environment } from '../../environments/environment';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // only handle our own backend errors
      if (req.url.startsWith(environment.apiUrl)) {
        if (err.status === 401) {
          auth.logout();
          router.navigate(['/login']);
          toast.error('Session expired. Please log in again.');
        } else if (err.status >= 500) {
          toast.error('Server error — please try again.');
        }
        // 400/404/etc. left for component-level handling (form errors, etc.)
      }
      return throwError(() => err);
    }),
  );
};
