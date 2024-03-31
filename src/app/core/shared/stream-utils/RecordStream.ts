import { Injectable } from "@angular/core";
import { v4 as uuid } from "uuid";

@Injectable({
  providedIn: 'root'
})
export class RecordStream{

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
    this.mediaRecorder = new MediaRecorder(audioDestination.stream);
    const audioChunks: BlobPart[] = []
    this.mediaRecorder.ondataavailable = e => {
      audioChunks.push(e.data)
    }
    this.mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, {type: 'audio/wav'})
      const cache = await caches.open('audios')
      const response = new Response(audioBlob)
      const idName = uuid()
      await cache.put(idName, response)
      const data = {
        date : new Date().getTime(),
        title: idName
      }
      localStorage.setItem(idName, JSON.stringify(data))
    }
    this.mediaRecorder.start()
  }

  public stopRecording(){
    this.mediaRecorder.stop()
  }
}