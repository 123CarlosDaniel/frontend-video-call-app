import { Component, inject } from "@angular/core";
import { User } from "@models/data.model";
import { DataService } from "@services/data.service";
import { Subscription } from "rxjs";

@Component({
  templateUrl: './home.component.html',
  selector: 'main-home',
  standalone: true
})
export class HomeComponent{
  userSubscription: Subscription
  private dataService = inject(DataService)
  user: User

  ngOnInit(){
    this.userSubscription = this.dataService.getUser().subscribe(_user => {
      this.user = _user
    })
  }
  ngOnDelete(){
    this.userSubscription.unsubscribe()
  }
}