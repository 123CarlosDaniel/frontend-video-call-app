import { Injectable, inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Recording } from "@models/recording.model";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RecordingService{
  private recordsObs = new BehaviorSubject<Recording[]>([])
  private snackBar = inject(MatSnackBar)
  
  public getRecordings = async() => {
    const cache = await caches.open('audios')
    const keys = await cache.keys()
    const records = await Promise.all(
      keys.map(async (k) => {
        const url = new URL(k.url)
        const name = url.pathname.split('/').pop()!
        const data = JSON.parse(localStorage.getItem(name)!)
        const r = await cache.match(k)
        const audio = await r!.blob()
        return {
          date: data.date,
          title: data.title,
          url: URL.createObjectURL(audio),
          cacheUrl: url
        }
      })
    )
    this.recordsObs.next(records)
  }

  public deleteRecording = async(url: URL)=>{
    const res = window.confirm("Do you want to delete this recording?")
    if(!res) return
    const cache = await caches.open('audios')
    await cache.delete(url)
    this.snackBar.open('Deleted successfully', 'Close', {
      duration: 3000,
    })
    this.getRecordings()
  }

  public getRecordObs(){
    return this.recordsObs
  }
}