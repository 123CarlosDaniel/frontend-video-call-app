import {Injectable} from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  saveTokens(token: string, userId: string) {
    localStorage.setItem('token', token)
    localStorage.setItem('userId', userId)
  }

  getToken() {
    return localStorage.getItem('token')
  }

  getUserId() {
    return localStorage.getItem('userId')
  }

  clearTokens() {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
  }
}