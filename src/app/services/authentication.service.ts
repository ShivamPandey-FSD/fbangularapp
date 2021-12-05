import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastService } from './toast.service';
import jwt_decode from 'jwt-decode';
import { AppConfig } from '../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isUserAuthenticated = new BehaviorSubject<boolean>(this.hasToken());
  isUserAdmin = new BehaviorSubject<boolean>(this.hasAdmin());
  apiUrl = AppConfig.settings.apiServer.baseURL;

  constructor(
    private _httpClient: HttpClient,
    private _router: Router,
    private _toastService: ToastService
  ) { }

  private hasToken(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  isUserLoggedIn(): Observable<boolean> {
    return this.isUserAuthenticated.asObservable();
  }

  private hasAdmin() {
    if(localStorage.getItem('currentUser')) {
      return JSON.parse(localStorage.getItem('currentUser') || '{}').isAdmin;
    }
    return;
  }

  isAdmin(): Observable<boolean> {
    return this.isUserAdmin.asObservable();
  }

  getToken() {
    if(localStorage.getItem('currentUser')) {
      return JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    }
    return;
  }

  getDecodedToken(token: string): any {
    try {
      return jwt_decode(token);
    }
    catch(Error) {
      return null;
    }
  }

  getTokenExpirationDate(token: string) {
    const decodedToken = this.getDecodedToken(token);
    if(decodedToken.exp === undefined) return null;
    const date = new Date(0);
    date.setUTCSeconds(decodedToken.exp);
    return date;
  }

  isTokenExpired(): boolean {
    var token = this.getToken();
    if(!token) return true;
    const date: any = this.getTokenExpirationDate(token);
    if(date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf())
  }

  login(email: string, password: string) {
    return this._httpClient.post<any>(this.apiUrl + 'users/authenticate', { email: email, password: password }).pipe(map(user => {
      if(user && user.token) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('currentUserPhotoId', user.photoId);
        this.isUserAuthenticated.next(true);
        this.isUserAdmin.next(user.isAdmin);
      }
      return user;
    }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.isUserAuthenticated.next(false);
    this.isUserAdmin.next(false);
    this._router.navigate(['/login']);
    this._toastService.openSnackBar('You have been logout successfully!', '', 'success-snackbar');
  }

}
