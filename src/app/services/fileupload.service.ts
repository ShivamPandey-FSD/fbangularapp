import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class FileuploadService {
  apiUrl = AppConfig.settings.apiServer.baseURL;

  constructor(private _httpClient: HttpClient) { }

  uploadImage(formData: FormData) {
    return this._httpClient.post<any>(this.apiUrl + 'files/uploadfile', formData).pipe(res => {
      return res;
    });
  }

  getPhotoById(photoId: string) {
    return this._httpClient.get(this.apiUrl + 'files/' + photoId, {
      responseType: "blob"
    }).pipe(res => {
      return res;
    })
  }

}
