import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { RecordingData, User } from '@models/data.model'
import { BehaviorSubject, map } from 'rxjs'
import { environment } from '../../../environments/environment'
import { TokenService } from './token.service'
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable({
  providedIn: 'root',
})
export class DataService {
  user = new BehaviorSubject<User>({
    id: '',
    username: '',
    lastConnection: '',
    contacts: [],
    rooms: [],
  })

  private http = inject(HttpClient)
  private tokenService = inject(TokenService)
  private snackBar = inject(MatSnackBar)

  fetchData() {
    const userId = this.tokenService.getUserId()
    this.http.get<User>(`${environment.usersUrl}/${userId}`).subscribe({
      next: (res) => {
        this.user.next(res)
      },
      error: (err) => {
        this.snackBar.open('Ocurrió un error', 'Close', { duration: 3000 })
      },
    })
  }

  deleteRoom(id: string){
    return this.http.delete(`${environment.deleteRoomUrl}/${id}`).subscribe({
      next: () => {
        this.snackBar.open('Eliminado correctamente', 'Ok', { duration: 3000 })
        this.fetchData()
      },
      error: (err) => {
        this.snackBar.open('Ocurrió un error', 'Close', { duration: 3000 })
      }
    })
  }

  addContact(username: string){
    const id = this.tokenService.getUserId()
    this.http.post(`${environment.usersUrl}/${id}/add-contact`,{
      username
    }).subscribe({
      next: (res) => {
        this.snackBar.open('Contacto agregado', 'Close', {duration: 3000})
        this.fetchData()
      },
      error: (err)=> {
        if(err.statusText == "OK") {
          this.snackBar.open('Usuario no encontrado', 'Close', {duration: 3000})
          return
        }
        this.snackBar.open('Ocurrió un error', 'Close', {duration: 3000})
      }
    })

  }

  createRoom(name: string, description: string){
    const id = this.tokenService.getUserId()
    this.http.post(`${environment.usersUrl}/${id}/add-room`,{
      name, description
    }).subscribe({
      next: (res) => {
        this.snackBar.open('Sala creada', 'Close', {duration: 3000})
        this.fetchData()
      },
      error: (err)=> {
        this.snackBar.open('Ocurrió un error', 'Close', {duration: 3000})
      }
    })
  }

  addRecording(recording: RecordingData){
    const id = this.tokenService.getUserId()
    return this.http.post(`${environment.usersUrl}/${id}/add-recording`, recording)
  }

  getUser(){
    return this.user
  }  

}
