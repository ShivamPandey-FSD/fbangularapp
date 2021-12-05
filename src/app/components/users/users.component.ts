import { Component, OnInit, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as _ from 'underscore';
import { BaseComponent } from '../base/base.component';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent extends BaseComponent implements OnInit {
  displayedColumns = ['firstName', 'city', 'phone', 'email', 'profession', 'actions'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  users: User[] = [];
  isLoading: boolean = true;
  noUsers: boolean = false;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(
    private _userService: UserService,
    private _toastService: ToastService
  ) {
    super();
  }

  ngOnInit(): void {
    this._userService.getUsers().pipe(takeUntil(this.unsubscribe)).subscribe(users => {
      users = _.filter(users, function(user) {
        return user.isAdmin !== true;
      });
      this.isLoading = false;
      this.noUsers = users.length === 0 ? true : false;
      this.dataSource = new MatTableDataSource(users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, err=> {
      this._toastService.openSnackBar('Data loading error: ' + err.status + ' - ' + err.statusText, '', 'error-snackbar');
    });
  }

  onDisableUserClick(userSelected: User) {
    let detailsToUpdate = {
      id: userSelected.id,
      isActive: false
    };

    this._userService.updateUser(detailsToUpdate).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.ngOnInit();
    });
  }

  onEnableUserClick(userSelected: User) {
    let detailsToUpdate = {
      id: userSelected.id,
      isActive: true
    };

    this._userService.updateUser(detailsToUpdate).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.ngOnInit();
    });
  }

}
