import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointState, Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isUserLoggedIn: Observable<boolean>;
  isAdmin: Observable<boolean>;
  isHandset: Observable<BreakpointState> = this._breakpointObserver.observe(Breakpoints.Handset);

  constructor(public _authenticationService: AuthenticationService, private _breakpointObserver: BreakpointObserver) {
    this.isAdmin = _authenticationService.isAdmin();
    this.isUserLoggedIn = _authenticationService.isUserLoggedIn();
  }

  onLogoutClick() {
    this._authenticationService.logout();
  }

}
