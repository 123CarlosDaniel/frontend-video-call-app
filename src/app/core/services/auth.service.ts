import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { TokenService } from "./token.service";
import { tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { AuthResponse } from "@models/auth.model";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class AuthService{
  private http = inject(HttpClient)
  private tokenService = inject(TokenService)
  private snackBar = inject(MatSnackBar)

  login(username: string, password: string) {
    const url = environment.authUrl
    return this.http.post<AuthResponse>(url, {username, password})
      .pipe(
        tap(res => this.tokenService.saveTokens(res.token, res.id))
      )
  }
 
  register(username: string, password: string) {
    const url = environment.registerUrl
    return this.http.post<AuthResponse>(url, {username, password})
      .pipe(
        tap(res => this.tokenService.saveTokens(res.token, res.id))
      )
  }

  logout() {
    const url = environment.logoutUrl
    const id = this.tokenService.getUserId()
    this.http.get(`${url}/${id}`).subscribe({
      next: () => {
        this.snackBar.open("Cerraste sesión", "Close", {duration: 3000})
      }
    })
    this.tokenService.clearTokens()
  }
}