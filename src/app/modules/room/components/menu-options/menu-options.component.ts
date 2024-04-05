import { Component, EventEmitter, Output } from "@angular/core";
import {MatIconModule} from '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button'


@Component({
  standalone: true,
  selector: 'menu-options',
  templateUrl: 'menu-options.component.html',
  imports: [
    MatIconModule,
    MatButtonModule
  ]
})
export class ButtonsMenuComponent{
  cameraActive = true
  micActive = true
  recordActive = false
  @Output()
  onToggleCamera = new EventEmitter<void>()

  @Output()
  onToggleMic = new EventEmitter<void>()

  @Output()
  onToggleRecord = new EventEmitter<boolean>()

  toggleCamera() {
    this.onToggleCamera.emit()
    this.cameraActive = !this.cameraActive
  }

  toggleMic() {
    this.onToggleMic.emit()
    this.micActive = !this.micActive
  }

  toggleRecord(){
    this.recordActive = !this.recordActive
    this.onToggleRecord.emit(this.recordActive)
  }
}