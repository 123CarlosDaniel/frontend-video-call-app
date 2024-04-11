import { Subscription } from 'rxjs'
import { Component, inject } from '@angular/core'
import { MatDividerModule } from '@angular/material/divider'
import { MatTabsModule } from '@angular/material/tabs'
import { Router, RouterModule } from '@angular/router'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { AuthService } from '@services/auth.service'
import { User } from '@models/data.model'
import { DataService } from '@services/data.service'
import { MatTooltip } from '@angular/material/tooltip'
import { AddContactComponent } from './components/add-contact/add-contact.component'
import { CreateRoomComponent } from './components/create-room/create-room.component'
import { ContactsComponent } from './components/contacts/contacts.component'

@Component({
  standalone: true,
  templateUrl: './main.component.html',
  selector: 'app-main',
  imports: [
    ContactsComponent,
    CreateRoomComponent,
    AddContactComponent,
    MatDividerModule,
    MatTabsModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTooltip
  ],
})
export class MainComponent {

  links = [
    {
      route: "/", 
      title : "home"
    },
    {
      route: "/rooms",
      title: "rooms"
    },
    {
      route: "/recordings",
      title: "recordings"
    }
  ]


  private authService = inject(AuthService)
  private router = inject(Router)
  private dataService = inject(DataService)

  activeLink: string
  
  user: User = {
    id: '',
    username: '',
    lastConnection: '',
    contacts: [],
    rooms: [],
    recordings: []
  }
  private dataSubscription: Subscription

  ngOnInit(){
    this.activeLink = this.router.url.split("/").pop() || "home"

    this.dataSubscription = this.dataService.getUser().subscribe((_user) => {
      this.user = _user
    })
    this.dataService.fetchData()
  }

  ngOnDestroy(){
    this.dataSubscription.unsubscribe()
  }

  logout() {
    this.authService.logout()
    this.router.navigate(['/auth/login'])
  }
}
