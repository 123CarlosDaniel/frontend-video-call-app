import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltip } from "@angular/material/tooltip";
import { RouterModule } from "@angular/router";
import { Contact, Room } from "@models/data.model";
import { DataService } from "@services/data.service";
import { Subscription } from "rxjs";

@Component({
  templateUrl: './rooms.component.html',
  selector: 'main-rooms',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltip,
    RouterModule
  ],
})
export class RoomsComponent{
  contacts: Contact[] = []

  private dataService = inject(DataService)
  userSubscription: Subscription
  ngOnInit(){
    this.userSubscription = this.dataService.getUser().subscribe(_user => {
      this.contacts = []
      if(_user.username !== "") {
        this.contacts.push(_user)
        _user.contacts.forEach(contact => {
          this.contacts.push(contact)
        })
      }
    })
  }

  ngOnDestroy(){
    this.userSubscription.unsubscribe()
  }

  deleteRoom(id: string){
    console.log({id})
    this.dataService.deleteRoom(id)
  }
}