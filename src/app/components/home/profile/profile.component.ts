import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'underscore';
import { PostService } from 'src/app/services/post.service';
import { FileuploadService } from 'src/app/services/fileupload.service';
import { FriendService } from 'src/app/services/friend.service';
import { ProfileHelperService } from 'src/app/utilities/profile-helper.service';
import { BaseComponent } from '../../base/base.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent extends BaseComponent implements OnInit {
  activeUserObject: any;
  existingPhotoId: any;
  noOfPosts: Number = 0;
  noOfConnections: Number = 0;
  imageToShow: any;
  isImageLoaded: boolean = false;
  isImageAvailable: boolean = false;
  myUrl: any;
  myTrustedUrl: any;

  constructor(
    private _postService: PostService,
    private _friendService: FriendService,
    private _fileuploadService: FileuploadService,
    private _profileHelperService: ProfileHelperService,
    private _domSanitizer: DomSanitizer
  ) {
    super();
    this.activeUserObject = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  ngOnInit(): void {
    this.existingPhotoId = localStorage.getItem('currentUserPhotoId');
    this.loadActiveUserPhoto(this.existingPhotoId);
    this.loadActiveUserPostCounts(this.activeUserObject._id);
    this.loadActiveUserConnections(this.activeUserObject._id)
  }

  loadActiveUserPhoto(photoId: string) {
    this._fileuploadService.getPhotoById(photoId).pipe(takeUntil(this.unsubscribe)).subscribe(result => {
      this.createImageFromBlob(result);

      this.isImageLoaded = true;
    }, err => {
      this.isImageLoaded = true;
      this.isImageAvailable = false;
    });
  }

  private createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.myUrl = reader.result;
      this.myTrustedUrl = this._domSanitizer.bypassSecurityTrustUrl(this.myUrl);
      this.imageToShow = this.myTrustedUrl;
    }, false);

    if(image) {
      this.isImageAvailable = true;
      reader.readAsDataURL(image);
    }
  }

  loadActiveUserPostCounts(userId: string) {
    this._postService.getPostByUserId(userId).pipe(takeUntil(this.unsubscribe)).subscribe((result: any) => this.noOfPosts = result.length);
  }

  loadActiveUserConnections(userId: string) {
    this._friendService.getAllFriendRequests().pipe(takeUntil(this.unsubscribe)).subscribe(result => {
      let matchingElement = _.filter(result, function(item) {
        return (item.userId === userId || item.friendId === userId) && item.status === 'You are friend';
      });

      this.noOfConnections = matchingElement.length;
    });
  }

  onProfilePhotoUpload(event: any) {
    this._profileHelperService.changeActivateUserProfilePhoto(this.activeUserObject._id, event).pipe(takeUntil(this.unsubscribe)).subscribe(newPhotoId => {
      localStorage.setItem('currentUserPhotoId', newPhotoId);
      this.ngOnInit();
    });
  }

}
