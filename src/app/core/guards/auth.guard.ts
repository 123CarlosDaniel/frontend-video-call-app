import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { TokenService } from "@services/token.service";

export const authGuardFn: CanActivateFn = () => {
  const tokenService = inject(TokenService)
  const routerService = inject(Router)
  const token = tokenService.getToken()

  if (!token) {
    return routerService.createUrlTree(['/auth/login'])
  }
  return true
} 

export const loginGuardFn: CanActivateFn = () => {
  const tokenService = inject(TokenService)
  const routerService = inject(Router)
  const token = tokenService.getToken()
  if (token) {
    return routerService.navigate(['/'])
  }
  return true
}