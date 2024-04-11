import { DatePipe } from "@angular/common";
import { Component, ElementRef, ViewChild, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Recording } from "@models/recording.model";
import { PermanentRecordingService } from "@services/permanent-recording.service";
import { TemporalRecordingService } from "@services/temporal-recording.service";
import { Subscription } from "rxjs";

@Component({
  standalone: true,
  selector: 'temporal-recording',
  templateUrl: './temporal-recordings.component.html',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, DatePipe],
})
export class TemporalRecordings{

  private recordingService = inject(TemporalRecordingService)
  private permanentRecordingService = inject(PermanentRecordingService)
  public recordings: Recording[]
  private recordingSubscription : Subscription

  @ViewChild("inputName")
  private inputRef: ElementRef<HTMLInputElement>

  ngOnInit() {
    this.recordingSubscription = this.recordingService.getRecordSubject().subscribe(_recordings => {
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

  saveRecording = async (url: URL) =>{
    await this.permanentRecordingService.saveRecording(url)
    await this.recordingService.deleteFromCache(url)
  }

  editName = async(url: URL) => {
    const name = this.inputRef.nativeElement.value
    this.recordingService.editRecordingName(url, name)
  }
}