import { DatePipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RecordingDataExtra } from "@models/data.model";
import { DataService } from "@services/data.service";
import { PermanentRecordingService } from "@services/permanent-recording.service";
import { Subscription } from "rxjs";

@Component({
  templateUrl: "./persistent-recordings.component.html",
  standalone: true,
  selector: "persistent-recordings",
  imports: [DatePipe, MatIconModule, MatTooltipModule, MatButtonModule]
})
export class PersistentRecordingsComponent{
  private dataService = inject(DataService)
  private permanentRecordingService = inject(PermanentRecordingService)
  recordingsData: RecordingDataExtra[] = []
  userSubscription: Subscription

  ngOnInit(){
    this.userSubscription = this.dataService.getUser().subscribe(async _user => {
      const promises = _user.recordings.map<Promise<RecordingDataExtra>>(async r => {
        const url = await this.permanentRecordingService.getRecordingUrl(r.recordingKey)
        return {...r, objectUrl: url}
      })
      if(promises.length == 0) return
      this.recordingsData = await Promise.all(promises)
    })
  }

  ngOnDestroy(){
    this.userSubscription.unsubscribe()
  }

  deleteRecording = async (audioId: string, key: string) => {
    await this.permanentRecordingService.deleteRecording(audioId, key)
  }
}