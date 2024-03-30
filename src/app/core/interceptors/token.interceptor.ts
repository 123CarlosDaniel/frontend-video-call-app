import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TokenService } from "@services/token.service";
import { Observable } from "rxjs";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = this.addToken(req)
    return next.handle(req)
  }

  private addToken(req: HttpRequest<any>){
    const token = this.tokenService.getToken()
    if(token){
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      })
      return authReq
    }
    return req
  }
}