import { Routes } from '@angular/router';
import { Home} from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { TourList } from './pages/tour-list/tour-list';
import { TourDetail } from './pages/tour-detail/tour-detail';
import { TourForm } from './pages/tour-form/tour-form';
import { TourLogForm} from './pages/tour-log-form/tour-log-form';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'tours', component: TourList, canActivate: [authGuard] },
  { path: 'tours/new', component: TourForm, canActivate: [authGuard] },
  { path: 'tours/:id', component: TourDetail, canActivate: [authGuard] },
  { path: 'tours/:id/edit', component: TourForm, canActivate: [authGuard] },
  { path: 'tours/:id/logs/new', component: TourLogForm, canActivate: [authGuard] },
  { path: 'tours/:id/logs/:logId/edit', component: TourLogForm, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
