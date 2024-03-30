import { DatePipe } from '@angular/common'
import { Component } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'

interface Recording {
  date: string
  title: string
  url: string
  cacheUrl: URL
}

@Component({
  selector: 'main-recordings',
  templateUrl: 'recordings.component.html',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, DatePipe],
})
export class RecordingsComponent {
  recordings: Recording[]

  async ngOnInit() {
    this.getRecordings()
  }

  private getRecordings = async() => {
    const cache = await caches.open('audios')
    const keys = await cache.keys()
    
    const records = await Promise.all(
      keys.map(async (k) => {
        const url = new URL(k.url)
        const name = url.pathname.split('/').pop()!
        const data = JSON.parse(localStorage.getItem(name)!)
        const r = await cache.match(k)
        const audio = await r?.blob()
        return {
          date: data.date,
          title: data.title,
          url: URL.createObjectURL(audio!),
          cacheUrl: url
        }
      })
    )
    this.recordings = records
  }

  deleteRecording = async(url: URL) =>{
    const cache = await caches.open('audios')
    await cache.delete(url)
    this.getRecordings()
  }
}
