import { Routes } from '@angular/router';
import { RoomComponent } from './modules/room/room.component';
import { authGuardFn, loginGuardFn } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuardFn],
    canActivateChild: [authGuardFn],
    loadChildren: () => import('./modules/main/main.routes').then(m => m.routes)
  },
  {
    path: 'auth',
    canActivate: [loginGuardFn],
    loadChildren: () => import('./modules/auth/auth.routes').then(m => m.routes)
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
