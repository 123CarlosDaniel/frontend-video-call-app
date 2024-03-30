import { Routes } from '@angular/router';
import { RecordingsComponent } from './components/recordings/recordings.component';
import { HomeComponent } from './components/home/home.component';
import { MainComponent } from './main.component';
import { RoomsComponent } from './components/rooms/rooms.component';

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