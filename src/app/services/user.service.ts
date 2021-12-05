import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { HeaderService } from './header.service';
import { ToastService } from './toast.service';
import { Observable } from 'rxjs';
import { AppConfig } from '../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = AppConfig.settings.apiServer.baseURL;

  constructor(
    private _httpClient: HttpClient,
    private _headerService: HeaderService,
    private _toastService: ToastService
  ) { }

  register(newUser: User): any {
    return this._httpClient.post<User>(this.apiUrl + 'users/register', newUser, this._headerService.requestHeaders()).pipe(res => {
      return res;
    });
  }

  getUsers(): Observable<User[]> {
    return this._httpClient.get<User[]>(this.apiUrl + 'users/').pipe(res => {
      return res;
    });
  }

  getUserById(userId: string): any {
    return this._httpClient.get(this.apiUrl + 'users/' + userId).pipe(res => {
      return res;
    });
  }

  getUserByEmail(email: string): any {
    return this._httpClient.post(this.apiUrl + 'users/finduserbyemail', { email: email }, this._headerService.requestHeaders()).pipe(res => {
      return res;
    });
  }

  updateUserPhoto(updatedUser: any) {
    return this._httpClient.post(this.apiUrl + 'users/updateuserphotoId', updatedUser, this._headerService.requestHeaders()).pipe(res => {
      this._toastService.openSnackBar('Image Uploaded Successfully', '', 'success-snackbar');
      return res;
    });
  }

  updateUser(updatedUser: any) {
    return this._httpClient.put(this.apiUrl + 'users/' + updatedUser.id, updatedUser).pipe(res => {
      this._toastService.openSnackBar('Details updated successfully', '', 'success-snackbar');
      return res;
    })
  }

}
