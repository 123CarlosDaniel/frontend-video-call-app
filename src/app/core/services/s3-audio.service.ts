import { Injectable } from "@angular/core";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { environment } from "@environments/environment";

@Injectable({
  providedIn: "root"
})
export class S3AudioService{
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

  saveRecording = async (blob: Blob, key: string) => {
    const putCommand = new PutObjectCommand({
      Bucket: environment.BUCKET_NAME,
      Key: key,
      CacheControl: "max-age="+60*60*24,
      Body: blob
    })
    await this.client.send(putCommand)
  }

  getRecordingUrl = async (key: string) => {
    const getCommand = new GetObjectCommand({
      Key: key, 
      Bucket: environment.BUCKET_NAME
    })

    const response = await this.client.send(getCommand)
    const buffer = await response.Body!.transformToByteArray()
    const blob = new Blob([buffer], { type: 'audio/wav' })
    const audioUrl = URL.createObjectURL(blob)
    return audioUrl
  }

  deleteRecording = async (key: string) => {
    const deleteCommand = new DeleteObjectCommand({
      Key: key,
      Bucket: environment.BUCKET_NAME
    })
    await this.client.send(deleteCommand)
  }
}