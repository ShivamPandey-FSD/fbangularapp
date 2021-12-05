import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { BaseComponent } from '../../base/base.component';
import { PostService } from 'src/app/services/post.service';
import { PostHelperService } from 'src/app/utilities/post-helper.service';
import { Post } from 'src/app/models/post.model';
import { ProfileHelperService } from 'src/app/utilities/profile-helper.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent extends BaseComponent implements OnInit {
  posts: Post[] = [];
  activateUserObject: any;
  existingPhotoId: string = '';
  form: FormGroup = this._formBuilder.group({});
  isLoading: boolean = true;
  noPosts: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _postService: PostService,
    private _postHelperService: PostHelperService,
    private _toastService: ToastService,
    private _profileHelperService: ProfileHelperService
  ) {
    super();
    this.activateUserObject = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this._profileHelperService.currentMessage.subscribe(isReloadPage => {
      if(isReloadPage) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit(): void {
    this.existingPhotoId = localStorage.getItem('currentUserPhotoId') || '{}';
    this.createPostForm();
    this.loadPosts();
  }

  private createPostForm() {
    this.form = this._formBuilder.group({
      post: ['', Validators.required],
      userId: [this.activateUserObject._id],
      userPhotoId: [this.existingPhotoId],
      userName: [this.activateUserObject.firstName + ' ' + this.activateUserObject.lastName],
      isAdmin: [this.activateUserObject.isAdmin],
      // postImage: [this.activateUserObject.postImage],
      profession: [this.activateUserObject.profession],
      // isMyPost: [this.activateUserObject.isMyPost],
      // isPostImage: [this.activateUserObject.isPostImage]
    });
  }

  private loadPosts() {
    this._postHelperService.loadPosts(this.activateUserObject._id).pipe(takeUntil(this.unsubscribe)).subscribe(finalPosts => {
      this.noPosts = finalPosts.length <=0 ? true: false;
      this.isLoading = false;
      this.posts = finalPosts;
    });
  }

  onSubmit() {
    this._postService.createPost(this.form.value).subscribe(() => {
      this.createPostForm();
      this.loadPosts();
      this._toastService.openSnackBar('Post sent successfully', '', 'success-snackbar')
    }, err => {
      this._toastService.openSnackBar('Invalid Post', '', 'error-snackbar');
      throw err;
    });
  }

  onHidePostClick(postToHide: Post) {
    postToHide.isActive = false;
    this._postService.updatePost(postToHide).subscribe(() => {
      this.loadPosts();
    });
  }

  onPostImageUpload(event: any) {
    let formObject = {
      id: '',
      userId: this.activateUserObject._id,
      userPhotoId: this.existingPhotoId,
      userName: this.activateUserObject.firstName + ' ' + this.activateUserObject.lastName,
      isAdmin: this.activateUserObject.isAdmin,
      profession: this.activateUserObject.profession
    };

    this._postHelperService.uploadPostImage(formObject, event).subscribe(result => {
      this.activateUserObject = result;
      this.activateUserObject._id = this.activateUserObject.userId;
      this.ngOnInit();
    });
  }

}
