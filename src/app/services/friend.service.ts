import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HeaderService } from './header.service';
import { Friend } from '../models/friend.model';
import { ToastService } from './toast.service';
import { AppConfig } from '../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  apiUrl = AppConfig.settings.apiServer.baseURL;

  constructor(
    private _httpClient: HttpClient,
    private _headerService: HeaderService,
    private _toastService: ToastService
  ) { }

  createRequest(newRequest: Friend) {
    return this._httpClient.post<Friend>(this.apiUrl + 'friends/createrequest', newRequest, this._headerService.requestHeaders()).pipe(map(res => {
      this._toastService.openSnackBar('Friend request sent successfully', '', 'success-snackbar');
      return res;
    }));
  }

  getAllFriendRequests() {
    return this._httpClient.get<any[]>(this.apiUrl + 'friends/');
  }

  getFriendById(id: string) {
    return this._httpClient.get<Friend>(this.apiUrl + 'friends/' + id).pipe(map(res => {
      return res;
    }));
  }

  updateFriendRequest(updatedRequest: any) {
    return this._httpClient.put(this.apiUrl + 'friends/' + updatedRequest.id, updatedRequest).pipe(res => {
      return res;
    });
  }

}
