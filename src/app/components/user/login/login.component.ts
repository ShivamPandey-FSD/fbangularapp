import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first, takeUntil } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BaseComponent } from '../../base/base.component';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseComponent implements OnInit {
  form: FormGroup = this._formBuilder.group({});

  constructor(
    private _formBuilder: FormBuilder,
    private _authenticationService: AuthenticationService,
    private _toastService: ToastService,
    private _router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  isFieldInvalid(field: string) {
    return (this.form.controls[field].invalid && (this.form.controls[field].dirty || this.form.controls[field].touched));
  }

  onSubmit() {
    this._authenticationService.login(this.form.value.email, this.form.value.password).pipe(first()).pipe(takeUntil(this.unsubscribe)).subscribe(loginResponse => {
      if(loginResponse && loginResponse.message) {
        this._toastService.openSnackBar(loginResponse.message, '', 'error-snackbar');
        return;
      }
      this._toastService.openSnackBar("You have been logged in", '', 'success-snackbar');
      this._router.navigate(['dashboard']);
    }, err => {
      this._toastService.openSnackBar('Invalid Credentials', '', 'error-snackbar');
    });
  }

  onForgotPassword() {
    this._router.navigate(['forgot-password']);
  }

}
