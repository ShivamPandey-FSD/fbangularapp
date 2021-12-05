import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { UserHelperService } from '../../utilities/user-helper.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent extends BaseComponent implements OnInit {
  friends: User[] = [];
  activeUserObject: any;
  noFriends: boolean = true;
  isLoading: boolean = true;
  isRequest: any;

  constructor(private _userHelperService: UserHelperService) {
    super();
    this.activeUserObject = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  ngOnInit(): void {
    this._userHelperService.loadRequestingFriends(this.activeUserObject._id).pipe(takeUntil(this.unsubscribe)).subscribe(finalRequesters => {
      this.isLoading = false;
      this.noFriends = finalRequesters.length === 0 ? true : false;
      this.friends = finalRequesters;
      finalRequesters.forEach((element: any) => {
        this.isRequest = element.isRequest;
      });
    });
  }

  onAcceptButtonClick(friendClicked: any) {
    console.log(friendClicked);
    let friendRequestObject = {
      id: friendClicked.id,
      status: "You are friend"
    };

    this._userHelperService.updateFriendRequest(friendRequestObject).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.ngOnInit();
    });
  }

  onRejectButtonClick(friendClicked: any) {
    let friendRequestObject = {
      id: friendClicked.id,
      status: "Request Rejected"
    };

    this._userHelperService.updateFriendRequest(friendRequestObject).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.ngOnInit();
    });
  }

}
