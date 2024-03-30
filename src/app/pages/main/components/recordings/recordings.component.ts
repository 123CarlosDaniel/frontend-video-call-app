import { DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: 'main-recordings',
  templateUrl: 'recordings.component.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DatePipe
  ]
})
export class RecordingsComponent{
  recordings = [
    {
      date: "1710731798999",
      title: "Titulo de la grabacion",
      url: "url de la grabacion"
    },
    {
      date: "1710731798999",
      title: "Titulo de la grabacion",
      url: "url de la grabacion"
    },
    {
      date: "1710731798999",
      title: "Titulo de la grabacion",
      url: "url de la grabacion"
    }
  ]


}