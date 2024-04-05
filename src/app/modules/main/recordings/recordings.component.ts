import { Component } from '@angular/core'
import { TemporalRecordings } from './components/temporal-recordings.component'

@Component({
  selector: 'main-recordings',
  templateUrl: 'recordings.component.html',
  standalone: true,
  imports: [TemporalRecordings]
})
export class RecordingsComponent {

}
