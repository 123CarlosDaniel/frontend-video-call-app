import { Injectable, inject } from "@angular/core";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {environment} from "@environments/environment"
import { TokenService } from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class PermanentRecordingService{
  private tokenService = inject(TokenService)
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
    const putCommand = new PutObjectCommand({
      Bucket: environment.BUCKET_NAME,
      Key: "",
      CacheControl: "max-age="+60*60*24,
      Body: "Buffer"
    })
    await this.client.send(putCommand)
  }
}