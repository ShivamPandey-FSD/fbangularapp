import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { FileuploadService } from '../services/fileupload.service';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileHelperService {
  private messageSource = new BehaviorSubject(false);
  currentMessage = this.messageSource.asObservable();

  constructor(
    private _fileuploadService: FileuploadService,
    private _userService: UserService,
    private _postService: PostService
  ) { }

  updatePostPhotoId(userId: any, photoId: any): Observable<any> {
    return this._postService.updateBulkPosts({ userId: userId, photoId: photoId });
  }

  updateUserPhotoId(userId: any, photoId: any): Observable<any> {
    return this._userService.updateUserPhoto({ id: userId, photoId: photoId });
  }

  performPhotoUpdate(event: any): Observable<any> {
    return new Observable(observer => {
      if(event.target.files.length > 0) {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('picture', file);
        this._fileuploadService.uploadImage(formData).subscribe(uploadResult => {
          observer.next(uploadResult);
        });
      }
    });
  }

  changeActivateUserProfilePhoto(userId: any, event: any): Observable<any> {
    return new Observable(observer => {
      this.performPhotoUpdate(event).subscribe(uploadResult => {
        this.updateUserPhotoId(userId, uploadResult.uploadId).subscribe(() => {
          this.updatePostPhotoId(userId, uploadResult.uploadId).subscribe(() => {
            observer.next(uploadResult.uploadId);
            this.messageSource.next(true);
          });
        });
      });
    });
  }

}
