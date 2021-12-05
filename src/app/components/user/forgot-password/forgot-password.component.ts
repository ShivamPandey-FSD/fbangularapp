import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent extends BaseComponent implements OnInit {
  form: FormGroup = this._formBuilder.group({});

  constructor(
    private _toastService: ToastService,
    private _userService: UserService,
    private _formBuilder: FormBuilder,
    private _router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]]
    });
  }

  isFieldInvalid(field: string) {
    return (this.form.controls[field].invalid && (this.form.controls[field].touched || this.form.controls[field].dirty));
  }

  onSubmit() {
    this._userService.getUserByEmail(this.form.value.email).pipe(takeUntil(this.unsubscribe)).subscribe((userFetched: any) => {
      if(!userFetched || userFetched.length <= 0) {
        this._toastService.openSnackBar('Email does not exist', '', 'error-snackbar');
        return;
      }

      let existingUser = userFetched[0];
      this._router.navigate(['reset-password'], { queryParams: { id: existingUser.id } });
    });
  }

}
