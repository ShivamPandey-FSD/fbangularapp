import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private _authenticationService: AuthenticationService,
    private _router: Router
  ) {  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    if(this._authenticationService.getToken() && !this._authenticationService.isTokenExpired()) {
      return true;
    }
    else if(this._authenticationService.getToken() && this._authenticationService.isTokenExpired()) {
      this._authenticationService.logout();
    }

    this._router.navigate(['login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  
}
