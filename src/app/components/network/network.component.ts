import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../base/base.component';
import { UserHelperService } from 'src/app/utilities/user-helper.service';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent extends BaseComponent implements OnInit {
  networkUsers: User[] = [];
  activeUserObject: any;
  noUsers: boolean = false;
  isLoading: boolean = true;

  constructor(
    private _userHelperService: UserHelperService,
    private _userService: UserService
  ) {
    super();
    this.activeUserObject = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  ngOnInit(): void {
    this._userService.getUsers().pipe(takeUntil(this.unsubscribe)).subscribe(allUsers => {
      if(allUsers.length <= 1) {
        this.isLoading = false;
        this.noUsers = true;
        return;
      }

      this._userHelperService.createNetworkUserList(this.activeUserObject._id, allUsers).pipe(takeUntil(this.unsubscribe)).subscribe(networkUsers => {
        this.isLoading = false;
        this.noUsers = networkUsers.length === 0 ? true : false;
        this.networkUsers = networkUsers;
      });
    });
  }

  onRequestButtonClick(userClicked: any) {
    let friendRequestObject = {
      id: '',
      userId: this.activeUserObject._id,
      friendId: userClicked.id,
      status: 'Request Pending'
    }

    this._userHelperService.createNewFriendRequest(friendRequestObject).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.ngOnInit();
    });
  }

}
