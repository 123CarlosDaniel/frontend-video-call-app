import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { RoomComponent } from './pages/room/room.component';
import { authGuardFn, loginGuardFn } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuardFn],
    canActivateChild: [authGuardFn],
    loadChildren: () => import('./pages/main/main.routes').then(m => m.routes)
  },
  {
    path: 'auth',
    canActivate: [loginGuardFn],
    loadChildren: () => import('./pages/auth/auth.routes').then(m => m.routes)
  },
  {
    path: 'room/:id',
    canActivate: [authGuardFn],
    component: RoomComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
