import { Component, inject } from "@angular/core";
import { RecordingData } from "@models/data.model";
import { DataService } from "@services/data.service";
import { Subscription } from "rxjs";

@Component({
  templateUrl: "./persistent-recordings.component.html",
  standalone: true,
  selector: "persistent-recordings"
})
export class PersistentRecordingsComponent{
  private dataService = inject(DataService)
  recordingsData: RecordingData[]

  userSubscription: Subscription

  ngOnInit(){
    this.userSubscription = this.dataService.getUser().subscribe(async _user => {
      this.recordingsData = _user.recordings
      console.log(this.recordingsData)
    })
  }

  ngOnDestroy(){
    this.userSubscription.unsubscribe()
  }

}