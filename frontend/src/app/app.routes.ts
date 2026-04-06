import { Routes } from '@angular/router';
import { Home} from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { TourList } from './pages/tour-list/tour-list';
import { TourDetail } from './pages/tour-detail/tour-detail';
import { TourForm } from './pages/tour-form/tour-form';
import { TourLogForm} from './pages/tour-log-form/tour-log-form';
import { Impressum } from './pages/impressum/impressum';
import { Contact } from './pages/contact/contact';
import { About }   from './pages/about/about';
import { Privacy } from './pages/privacy/privacy';
import { authRequiredGuard } from './guards/auth-required-guard';
import { guestGuard } from './guards/guest-guard';

export const routes: Routes = [
  { path: '', component: Home, canActivate: [guestGuard] },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },
  { path: 'impressum', component: Impressum },
  { path: 'contact', component: Contact },
  { path: 'about',   component: About },
  { path: 'privacy', component: Privacy },
  { path: 'tours', component: TourList, canActivate: [authRequiredGuard] },
  { path: 'tours/new', component: TourForm, canActivate: [authRequiredGuard] },
  { path: 'tours/:id', component: TourDetail, canActivate: [authRequiredGuard] },
  { path: 'tours/:id/edit', component: TourForm, canActivate: [authRequiredGuard] },
  { path: 'tours/:id/logs/new', component: TourLogForm, canActivate: [authRequiredGuard] },
  { path: 'tours/:id/logs/:logId/edit', component: TourLogForm, canActivate: [authRequiredGuard] },
  { path: '**', redirectTo: 'tours' }
];
