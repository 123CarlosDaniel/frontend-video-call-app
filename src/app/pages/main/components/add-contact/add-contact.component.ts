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
  standalone: true,
  selector: 'main-add-contact-form',
  templateUrl: './add-contact.component.html',
  imports: [
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule
  ]
})
export class AddContactComponent{
  private dataService = inject(DataService)

  addContactForm = new FormGroup({
    username: new FormControl("", [Validators.required])
  })

  showError = false
  addContactFormSub: Subscription
  isValidForm: boolean
  ngOnInit() {
    this.addContactFormSub = this.addContactForm.statusChanges.subscribe(() => {
      this.isValidForm = this.addContactForm.valid
    })
  }

  ngOnDestroy() {
    this.addContactFormSub.unsubscribe()
  }

  onSubmit(){
    if(!this.isValidForm){
      this.showError = true
      setTimeout(()=>{
        this.showError = false
      }, 3000)
      return
    }
    const {username} = this.addContactForm.getRawValue()
    this.dataService.addContact(username!)   
    this.addContactForm.reset()
  }
}