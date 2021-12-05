import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of as observableOf } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { ToastService } from 'src/app/services/toast.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent extends BaseComponent implements OnInit {
  form: FormGroup = this._formBuilder.group({});
  isNewForm: Observable<boolean> = observableOf(false);
  genders: String[] = ['Male', 'Female'];

  constructor(
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _toastService: ToastService
  ) {
    super();
  }

  ngOnInit(): void {
    this.isNewForm = observableOf(true);
    this.form = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      profession: [''],
      phone: [''],
      city: [''],
      state: [''],
      pincode: [''],
      country: [''],
      isActive: [true]
    });
  }

  isFieldInvalid(field: string) {
    return (this.form.controls[field].invalid && (this.form.controls[field].dirty || this.form.controls[field].touched));
  }

  onSubmit() {
    this._userService.getUserByEmail(this.form.value.email).pipe(takeUntil(this.unsubscribe)).subscribe((users: any) => {
      if(users && users.length > 0) {
        this._toastService.openSnackBar('Email already exists', '', 'error-snackbar');
        return;
      }

      this._userService.register(this.form.value).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
        this.isNewForm = observableOf(false);
      });
    })
  }

}
