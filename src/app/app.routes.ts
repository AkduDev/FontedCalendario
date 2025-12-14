import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Layout } from './layout/layout';
import { Events } from './pages/events/events';
import { EventDetail } from './pages/event-detail/event-detail';
import { Unauthorized } from './pages/unauthorized/unauthorized';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'unauthorized', component: Unauthorized },
  {
    path: 'app',
    component: Layout,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'events', pathMatch: 'full' },
      { path: 'dashboard', component: Events },
      { path: 'events', component: Events },
      { path: 'events/:id', component: EventDetail }
    ]
  },
  { path: '**', redirectTo: 'login' } 
];

