import { Injectable, inject } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { TemporalRecording } from '@models/recording.model'
import { BehaviorSubject } from 'rxjs'
import { v4 as uuid } from "uuid";

@Injectable({
  providedIn: 'root',
})
export class TemporalRecordingService {
  private recordsSubject = new BehaviorSubject<TemporalRecording[]>([])
  private snackBar = inject(MatSnackBar)

  public getRecordings = async () => {
    const cache = await caches.open('audios')
    const keys = await cache.keys()
    const records = await Promise.all(
      keys.map(async (k) => {
        const url = new URL(k.url)
        const id = url.pathname.split('/').pop()!
        const data = JSON.parse(localStorage.getItem(id)!)
        const r = await cache.match(k)
        const audio = await r!.blob()
        return {
          creationDate: data.creationDate,
          id: data.id,
          name: data.name,
          url: URL.createObjectURL(audio),
          cacheUrl: url,
        }
      })
    )
    this.recordsSubject.next(records)
  }

  public saveRecording = async(audioBlob: Blob) => {
    const cache = await caches.open('audios')
    const response = new Response(audioBlob)
    const randomId = uuid()
    await cache.put(randomId, response)
    const data = {
      creationDate : new Date().getTime(),
      id: randomId,
      name: ""
    }
    localStorage.setItem(randomId, JSON.stringify(data))
  }

  public deleteFromCache = async (url: URL) => {
    const cache = await caches.open('audios')
    const id = url.pathname.split('/').pop()!
    localStorage.removeItem(id)
    await cache.delete(url)
    this.getRecordings()
  }

  public deleteRecording = async (url: URL) => {
    const res = window.confirm('Do you want to delete this recording?')
    if (!res) return
    await this.deleteFromCache(url)
    this.snackBar.open('Deleted successfully', 'Close', {
      duration: 3000,
    })
  }

  public getRecordSubject = () => {
    return this.recordsSubject
  }

  public editRecordingName = (url: URL, name: string) => {
    if (name == '') {
      this.snackBar.open('Ingresa un nombre valido', 'Close', {
        duration: 3000,
      })
      return
    }
    const id = url.pathname.split('/').pop()!
    const recording = JSON.parse(localStorage.getItem(id)!)
    const str = JSON.stringify({ ...recording, name })
    localStorage.setItem(id, str)
    this.snackBar.open('Editado correctamente', 'Close', { duration: 3000 })
  }
}
