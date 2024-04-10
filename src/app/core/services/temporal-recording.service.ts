import { Injectable, inject } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Recording } from '@models/recording.model'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class TemporalRecordingService {
  private recordsSubject = new BehaviorSubject<Recording[]>([])
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
          date: data.date,
          id: data.id,
          name: data.name,
          url: URL.createObjectURL(audio),
          cacheUrl: url,
        }
      })
    )
    this.recordsSubject.next(records)
  }

  public deleteFromCache = async (url: URL) => {
    const cache = await caches.open('audios')
    const id = url.pathname.split('/').pop()!
    localStorage.removeItem(id)
    await cache.delete(url)
  }

  public deleteRecording = async (url: URL) => {
    const res = window.confirm('Do you want to delete this recording?')
    if (!res) return
    await this.deleteFromCache(url)
    this.snackBar.open('Deleted successfully', 'Close', {
      duration: 3000,
    })
    this.getRecordings()
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
