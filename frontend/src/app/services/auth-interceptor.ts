import { HttpInterceptorFn } from '@angular/common/http';
import {environment} from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // adds jwt bearer token automatically to every outbound request
  const token = localStorage.getItem('token');
  const expired = token ? isExpired(token) : true;
  if (token && req.url.startsWith(environment.apiUrl)) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next(req);
};

function isExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch { return true; }
}
