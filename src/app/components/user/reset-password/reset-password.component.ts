import { Component, OnInit } from '@angular/core';
import { Router, Params } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent extends BaseComponent implements OnInit {
  form: FormGroup = this._formBuilder.group({});
  existingUser: any;
  isNewForm: Observable<boolean> = observableOf(false);

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _toastService: ToastService,
    private _userService: UserService
  ) {
    super();
    this.existingUser = this._router.getCurrentNavigation()?.extras.queryParams;
  }

  ngOnInit(): void {
    this.isNewForm = observableOf(true);
    this.form = this._formBuilder.group({
      id: [this.existingUser.id],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      confirmPassword: ['', [
        Validators.required,
        Validators.minLength(8)
      ]]
    });
  }

  isFieldInvalid(field: string) {
    return (this.form.controls[field].invalid && (this.form.controls[field].dirty || this.form.controls[field].touched));
  }

  onSubmit() {
    if(this.form.value.password !== this.form.value.confirmPassword) {
      this._toastService.openSnackBar('Password entered do not match', '', 'error-snackbar');
      return;
    }

    this._userService.updateUser(this.form.value).pipe(takeUntil(this.unsubscribe)).subscribe();
    this.isNewForm = observableOf(false);
  }

}
