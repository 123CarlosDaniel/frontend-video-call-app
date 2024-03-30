import { Component, inject } from '@angular/core'
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms'

import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatIconModule } from '@angular/material/icon'
import { Router, RouterModule } from '@angular/router'
import { AuthService } from '@services/auth.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Subscription } from 'rxjs'
import { FormStateMatcher } from '@shared/form-utils/errorMatcher'



@Component({
  templateUrl: './register.component.html',
  standalone: true,
  selector: 'app-register',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class RegisterComponent {
  isValidForm = true
  hide = true
  showSpinner = false
  private authService = inject(AuthService)
  private router = inject(Router)
  private snackBar = inject(MatSnackBar)

  registerForm = new FormGroup({
    username: new FormControl('admin123', [Validators.required]),
    password: new FormControl('admin123', [Validators.required]),
  })

  matcher = new FormStateMatcher()

  registerFormSub: Subscription
  ngOnInit() {
    this.registerFormSub = this.registerForm.statusChanges.subscribe(() => {
      this.isValidForm = this.registerForm.valid
    })
  }

  ngOnDestroy() {
    this.registerFormSub.unsubscribe()
  }

  onSubmit() {
    if (this.isValidForm) {
      this.showSpinner = true
      const { username, password } = this.registerForm.getRawValue()
      this.authService.register(username!, password!).subscribe({
        next: (res) => {
          this.router.navigate(['/'])
        },
        error: (err) => {
          console.log({err})
          if (err.statusText == 'OK') {
            if(err.status == 400) {
              this.snackBar.open('Usuario ya registrado', 'Close', {
                duration: 3000,
              })
            }
            else {
              this.snackBar.open('Credenciales invalidas', 'Close', {
                duration: 3000,
              })
            }
          } else {
            this.snackBar.open('Error del servidor', 'Close', {
              duration: 3000,
            })
          }
          this.showSpinner = false
        },
      })
    }
  }
}
