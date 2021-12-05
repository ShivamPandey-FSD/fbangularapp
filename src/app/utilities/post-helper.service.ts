import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'underscore';
import { UtilityService } from '../services/utility.service';
import { PostService } from '../services/post.service';
import { FileuploadService } from '../services/fileupload.service';
import { Post } from '../models/post.model';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class PostHelperService {

  constructor(
    private _utilityService: UtilityService,
    private _fileuploadService: FileuploadService,
    private _postService: PostService,
    private _domSanitizer: DomSanitizer
  ) { }

  calculatePostTimers(filteredPosts: any): Post[] {
    filteredPosts.forEach((element: any) => {
      element.postTimer = this._utilityService.dateDifference(element.createdDate);
    });

    return filteredPosts;
  }

  private createImageFromBlob(image: Blob): Observable<any> {
    return new Observable(observer => {
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        let unsafeImageToShow: any = reader.result;
        const imageToShow = this._domSanitizer.bypassSecurityTrustUrl(unsafeImageToShow);
        observer.next(imageToShow);
      }, false);

      if(image) {
        reader.readAsDataURL(image);
      }
    });
  }

  private loadUserIconForPosts(filteredPosts: any, userId: string): Observable<any> {
    return new Observable(observer => {
      filteredPosts.forEach((postElement: any) => {
        postElement.isMyPost = postElement.userId === userId ? true : false;
        this._fileuploadService.getPhotoById(postElement.userPhotoId).subscribe(res => {
          this.createImageFromBlob(res).subscribe(response => {
            postElement.userIcon = response;
            observer.next(filteredPosts);
          });
        }, err => {
          throw err;
        });
      });
    });
  }

  private loadPostImages(mappedPosts: any): Observable<any> {

    return new Observable(observer => {
      mappedPosts.forEach((postElement: any) => {
        if(postElement.postImage !== '00') {
          postElement.isPostImage = true;
          this._fileuploadService.getPhotoById(postElement.postImage).subscribe(res => {
            this.createImageFromBlob(res).subscribe(response => {
              postElement.postImage = response;
              observer.next(mappedPosts);
            });
          });
        }
        else {
          postElement.isPostImage = false;
          observer.next(mappedPosts);
        }
      });
    });
  }

  loadPosts(userId: any): Observable<any> {
    return new Observable(observer => {
      this._postService.getAllPosts().subscribe(posts => {
        if(posts.length === 0) {
          observer.next(posts);
        }
        let activePosts = _.filter(posts, function (post) {
          return post.isActive === true;
        });

        let aggregatePosts = this.calculatePostTimers(activePosts);

        this.loadUserIconForPosts(aggregatePosts, userId).subscribe(mappedPosts => {
          this.loadPostImages(mappedPosts).subscribe(finalPosts => {
            observer.next(finalPosts);
          });
        });
      });
    });
  }

  createNewPost(formObject: Post, uploadId: string): Observable<any> {
    return new Observable(observer => {
      const postObject = {
        id: formObject.id,
        post: '',
        userId: formObject.userId,
        userName: formObject.userName,
        userPhotoId: formObject.userPhotoId,
        // userImageId: uploadId,
        // imageId: uploadId,
        postImageId: formObject.postImageId,
        postImage: uploadId,
        postTimer: formObject.postTimer,
        isActive: true,
        isAdmin: formObject.isAdmin,
        profession: formObject.profession,
        isMyPost: true,
        isPostImage: true,
        userIcon: formObject.userIcon
      };

      this._postService.createPost(postObject).subscribe(() => {
        observer.next(postObject);
      });
    });
  }

  performPictureUploading(imageEvent: any): Observable<any> {
    return new Observable(observer => {
      if(imageEvent.target.files.length > 0) {
        const file = imageEvent.target.files[0];
        const formData = new FormData();
        formData.append('picture', file);
        this._fileuploadService.uploadImage(formData).subscribe(uploadResult => {
          observer.next(uploadResult);
        });
      }
    });
  }

  uploadPostImage(formObject: any, imageEvent: any): Observable<any> {
    return new Observable(observer => {
      this.performPictureUploading(imageEvent).subscribe(uploadResult => {
        this.createNewPost(formObject, uploadResult.uploadId).subscribe(result => {
          observer.next(result);
        });
      });
    });
  }

}
