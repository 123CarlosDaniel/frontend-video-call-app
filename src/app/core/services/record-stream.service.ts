import { Injectable, inject } from "@angular/core";
import { TemporalRecordingService } from "./temporal-recording.service";

@Injectable({
  providedIn: 'root'
})
export class RecordStream{
  private temporalRecordingService = inject(TemporalRecordingService)
  private mediaRecorder: MediaRecorder

  public record(stream1: MediaStream, stream2: MediaStream | undefined){
    const audioContext = new AudioContext();
    const audioDestination = audioContext.createMediaStreamDestination()
    const source1 = audioContext.createMediaStreamSource(stream1)
    source1.connect(audioDestination)
    if(stream2){
      const source2 = audioContext.createMediaStreamSource(stream2)
      source2.connect(audioDestination)
    }
    this.mediaRecorder = new MediaRecorder(audioDestination.stream, {
      audioBitsPerSecond: 16000
    })

    const audioChunks: BlobPart[] = []
    this.mediaRecorder.ondataavailable = e => {
      audioChunks.push(e.data)
    }
    this.mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, {type: 'audio/wav'})
      await this.temporalRecordingService.saveRecording(audioBlob)
    }
    this.mediaRecorder.start()
  }

  public stopRecording(){
    this.mediaRecorder.stop()
  }
}