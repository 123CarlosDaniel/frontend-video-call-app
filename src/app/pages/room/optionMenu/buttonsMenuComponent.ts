import { Component, EventEmitter, Output } from "@angular/core";
import {MatIconModule} from '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button'


@Component({
  standalone: true,
  selector: 'room-buttons',
  templateUrl: 'buttonsMenu.component.html',
  imports: [
    MatIconModule,
    MatButtonModule
  ]
})
export class ButtonsMenuComponent{
  cameraActive = true
  micActive = true

  @Output()
  onToggleCamera = new EventEmitter<void>()

  @Output()
  onToggleMic = new EventEmitter<void>()

  toggleCamera() {
    this.onToggleCamera.emit()
    this.cameraActive = !this.cameraActive
  }

  toggleMic() {
    this.onToggleMic.emit()
    this.micActive = !this.micActive
  }
}