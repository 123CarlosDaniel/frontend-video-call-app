import { Injectable } from "@angular/core";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
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

  saveImage = async (blob: Blob, key: string) => {
    const putCommand = new PutObjectCommand({
      Bucket: environment.BUCKET_NAME,
      Key: key,
      CacheControl: "max-age="+60*60*24,
      Body: blob
    })
    await this.client.send(putCommand)
  }
}