import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DataService } from "@services/data.service";
import { Subscription } from "rxjs";

@Component({
  templateUrl: './createRoom.component.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule
  ],
  selector: 'main-createRoom'
})
export class CreateRoomComponent{
  private dataService = inject(DataService)

  createRoomForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    description: new FormControl("")
  })

  showError = false
  isValidForm = false

  formSubscription: Subscription
  ngOnInit(){
    this.formSubscription = this.createRoomForm.valueChanges.subscribe(()=>{
      this.isValidForm = this.createRoomForm.valid     
    })
  }

  ngOnDestroy(){
    this.formSubscription.unsubscribe()
  }

  onSubmit(){
    if(!this.isValidForm){
      this.showError = true
      setTimeout(()=>{
        this.showError = false
      }, 3000)
      return
    }
    // implementar con la api 
    const {name, description} = this.createRoomForm.getRawValue()
    this.dataService.createRoom(name!, description || "")
    this.createRoomForm.reset()
  }
}