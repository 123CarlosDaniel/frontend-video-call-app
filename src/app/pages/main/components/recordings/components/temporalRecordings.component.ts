import { DatePipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Recording } from "@models/recording.model";
import { RecordingService } from "@services/recording.service";
import { Subscription } from "rxjs";

@Component({
  standalone: true,
  selector: 'recording-temporal',
  templateUrl: './temporalRecordings.component.html',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, DatePipe],
})
export class TemporalRecordings{

  private recordingService = inject(RecordingService)
  public recordings: Recording[]
  private recordingSubscription : Subscription

  ngOnInit() {
    this.recordingSubscription = this.recordingService.getRecordObs().subscribe(_recordings => {
      this.recordings = _recordings
    })
    this.recordingService.getRecordings()
  }

  ngOnDestroy(){
    this.recordingSubscription.unsubscribe()
  }

  deleteRecording = async(url: URL) =>{
    this.recordingService.deleteRecording(url)
  }
}