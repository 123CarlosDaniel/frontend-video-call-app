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
import { AuthService } from '@services/auth.service'
import { Router, RouterModule } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Subscription } from 'rxjs'
import { FormStateMatcher } from '@shared/form-utils/errorMatcher'

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
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
export class LoginComponent {
  isValidForm = true
  hide = true
  showSpinner = false

  private authService = inject(AuthService)
  private router = inject(Router)
  private snackBar = inject(MatSnackBar)

  loginForm = new FormGroup({
    username: new FormControl('admin123', [Validators.required]),
    password: new FormControl('admin123', [Validators.required]),
  })

  matcher = new FormStateMatcher()

  loginFormSub: Subscription

  ngOnInit() {
    this.loginFormSub = this.loginForm.statusChanges.subscribe(() => {
      this.isValidForm = this.loginForm.valid
    })
  }

  ngOnDestroy() {
    this.loginFormSub.unsubscribe()
  }

  onSubmit() {
    if (this.isValidForm) {
      this.showSpinner = true
      const { username, password } = this.loginForm.getRawValue()
      this.authService.login(username!, password!).subscribe({
        next: (res) => {
          this.router.navigate(['/'])
        },
        error: (err) => {
          if (err.statusText == 'OK') {
            this.snackBar.open('Credenciales invalidas', 'Close', {
              duration: 3000,
            })
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
