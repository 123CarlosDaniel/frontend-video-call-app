import { Injectable, inject } from "@angular/core";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {environment} from "@environments/environment"
import { TokenService } from "./token.service";
import { DataService } from "./data.service";

@Injectable({
  providedIn: 'root'
})
export class PermanentRecordingService{
  private tokenService = inject(TokenService)
  private dataService = inject(DataService)
  private client: S3Client

  constructor(){
    this.client = new S3Client({
      credentials: {
        accessKeyId: environment.CLIENT_ACCESS_KEY,
        secretAccessKey: environment.CLIENT_SECRET_KEY
      },
      region: environment.BUCKET_REGION
    })
  }

  saveRecording = async (url: URL) => {
    const cache = await caches.open("audios")
    const r = await cache.match(url)
    const blob = await r?.blob()
    const prefix = this.tokenService.getUserId()
    const recordId = url.pathname.split('/').pop()!

    const key = `${prefix}/${recordId}`

    const putCommand = new PutObjectCommand({
      Bucket: environment.BUCKET_NAME,
      Key: key,
      CacheControl: "max-age="+60*60*24,
      Body: blob
    })
    const data = JSON.parse(localStorage.getItem(recordId)!)

    await Promise.all([
      this.client.send(putCommand),
      this.dataService.addRecording({
        id: recordId,
        name: data.name,
        creationDate: data.date,
        recordingKey: key
      })
    ])
  }
}