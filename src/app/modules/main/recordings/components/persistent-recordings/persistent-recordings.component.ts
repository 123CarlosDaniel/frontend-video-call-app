import { DatePipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RecordingDataExtra } from "@models/data.model";
import { DataService } from "@services/data.service";
import { S3AudioService } from "@services/s3-audio.service";
import { Subscription } from "rxjs";

@Component({
  templateUrl: "./persistent-recordings.component.html",
  standalone: true,
  selector: "persistent-recordings",
  imports: [DatePipe]
})
export class PersistentRecordingsComponent{
  private dataService = inject(DataService)
  private s3AudioService = inject(S3AudioService)
  recordingsData: RecordingDataExtra[]
  userSubscription: Subscription

  ngOnInit(){
    this.userSubscription = this.dataService.getUser().subscribe(async _user => {
      const promises = _user.recordings.map<Promise<RecordingDataExtra>>(async r => {
        const url = await this.s3AudioService.getImageUrl(r.recordingKey)
        return {...r, objectUrl: url}
      })
      if(promises.length == 0) return
      this.recordingsData = await Promise.all(promises)
    })
  }

  ngOnDestroy(){
    this.userSubscription.unsubscribe()
  }

}