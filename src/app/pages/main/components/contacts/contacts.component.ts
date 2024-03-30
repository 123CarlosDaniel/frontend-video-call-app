import { DatePipe } from '@angular/common'
import { Component, inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltip } from '@angular/material/tooltip'
import { User } from '@models/data.model'
import { DataService } from '@services/data.service'
import { Subscription } from 'rxjs'

@Component({
  templateUrl: './contacts.component.html',
  standalone: true,
  selector: 'main-contacts',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltip,
    DatePipe
  ],
})
export class ContactsComponent {
  contacts: Omit<User, 'contacts'>[] = []
  private dataService = inject(DataService)

  userSubscription: Subscription

  ngOnInit() {
    this.userSubscription = this.dataService.getUser().subscribe((user) => {
      this.contacts = user.contacts
    })
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe()
  }

}
