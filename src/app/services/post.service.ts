import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../models/post.model';
import { HeaderService } from './header.service';
import { AppConfig } from '../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  apiUrl = AppConfig.settings.apiServer.baseURL;

  constructor(
    private _headerService: HeaderService,
    private _httpClient: HttpClient
  ) { }

  createPost(newPost: Post) {
    return this._httpClient.post<Post>(this.apiUrl + 'posts/createpost', newPost, this._headerService.requestHeaders()).pipe(res => {
      return res;
    });
  }

  getAllPosts() {
    return this._httpClient.get<Post[]>(this.apiUrl + 'posts/');
  }

  getPostById(postId: string): any {
    return this._httpClient.get(this.apiUrl + 'posts/' + postId).pipe(res => {
      return res;
    });
  }

  getPostByUserId(userId: string): any {
    return this._httpClient.post(this.apiUrl + 'posts/findpostbyuserid', { id: userId }, this._headerService.requestHeaders()).pipe(res => {
      return res;
    });
  }

  updateBulkPosts(updatePayload: any) {
    return this._httpClient.post<Post>(this.apiUrl + 'posts/updatemanyposts', updatePayload).pipe(res => {
      return res;
    });
  }

  updatePost(updatedPost: any) {
    return this._httpClient.put<Post>(this.apiUrl + 'posts/' + updatedPost.id, updatedPost).pipe(res => {
      return res;
    });
  }

}
