import { Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { HomeComponent } from './home/home.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RecordingsComponent } from './recordings/recordings.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: HomeComponent 
      },
      {
        path: 'rooms',
        component: RoomsComponent 
      },
      {
        path: 'recordings',
        component: RecordingsComponent
      }
    ]
  }
]