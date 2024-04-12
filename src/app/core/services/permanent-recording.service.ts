import { Injectable, inject } from "@angular/core";
import { TokenService } from "./token.service";
import { DataService } from "./data.service";
import { S3AudioService } from "./s3-audio.service";

@Injectable({
  providedIn: 'root'
})
export class PermanentRecordingService{
  private tokenService = inject(TokenService)
  private dataService = inject(DataService)
  private s3AudioService = inject(S3AudioService)

  saveRecording = async (url: URL) => {
    const cache = await caches.open("audios")
    const r = await cache.match(url)
    const blob = await r?.blob()!
    const prefix = this.tokenService.getUserId()
    const recordId = url.pathname.split('/').pop()!
    const key = `${prefix}/${recordId}`
    const data = JSON.parse(localStorage.getItem(recordId)!)

    await this.s3AudioService.saveImage(blob, key)

    this.dataService.addRecording({
      id: recordId,
      name: data.name,
      creationDate: data.creationDate,
      recordingKey: key
    })
  }
}