import { Component } from '@angular/core'
import { TemporalRecordingsComponent } from './components/temporal-recordings/temporal-recordings.component'
import { PersistentRecordingsComponent } from './components/persistent-recordings/persistent-recordings.component'

@Component({
  selector: 'main-recordings',
  templateUrl: 'recordings.component.html',
  standalone: true,
  imports: [TemporalRecordingsComponent, PersistentRecordingsComponent]
})
export class RecordingsComponent {

}
