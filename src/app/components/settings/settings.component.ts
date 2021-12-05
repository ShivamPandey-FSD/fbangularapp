import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../base/base.component';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/services/utility.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent extends BaseComponent implements OnInit {
  cities: string[] = ['Bhopal', 'Mumbai', 'Jaipur', 'Ranchi', 'Delhi', 'Agra', 'Pune', 'Ahmedabad', 'Jodhpur', 'Indore', 'Surat', 'Kota', 'Jamshedpur', 'Nagpur', 'Rajkot', 'Godda'];
  states: string[] = ['MP', 'UP', 'Maharashtra', 'Rajasthan', 'Gujrat', 'Delhi', 'Jharkhand'];
  countries: string[] = ['India'];
  isLoading = true;
  form: FormGroup = this._formBuilder.group({});
  activeUserObject: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _utilityService: UtilityService,
    private _toastService: ToastService
  ) {
    super();
    this.activeUserObject = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  ngOnInit(): void {
    this._userService.getUserById(this.activeUserObject._id).pipe(takeUntil(this.unsubscribe)).subscribe((currentUser: any) => {
      if(currentUser !== null && currentUser !== undefined) {
        this.createUserForm(currentUser);
        this.isLoading = false;
      }
    });
  }

  createUserForm(currentUser: any) {
    this.form = this._formBuilder.group({
      id: [ currentUser.id ],
      firstName: [ currentUser.firstName, Validators.required ],
      lastName: [ currentUser.lastName, Validators.required ],
      dob: [{ value: this._utilityService.covertDateFormat(currentUser.dob), disabled: true }],
      email: [{ value: currentUser.email, disabled: true }],
      gender: [{ value: currentUser.gender, disabled: true }],
      phone: [ currentUser.phone, [Validators.required, Validators.minLength(10), Validators.minLength(10)] ],
      country: [ currentUser.country, Validators.required ],
      state: [ currentUser.state, Validators.required ],
      city: [ currentUser.city, Validators.required ],
      profession: [ currentUser.profession, Validators.required ],
      password: ['', [ Validators.required, Validators.minLength(8) ]],
      confirmPassword: ['', [ Validators.required, Validators.minLength(8) ]]
    });
  }

  isFieldInvalid(field: string) {
    return (this.form.controls[field].invalid && (this.form.controls[field].dirty || this.form.controls[field].touched));
  }

  changePassword() {
    if(this.form.value.password === undefined || this.form.value.password === '' || (this.form.value.password).length !== 0) {
      this._toastService.openSnackBar("Please enter 8 character password!", "", "error-snackbar");
      return;
    }

    if(this.form.value.password !== this.form.value.confirmPassword) {
      this._toastService.openSnackBar("Password entered do not match", "", "error-snackbar");
      return;
    }

    this._userService.updateUser(this.form.value).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.ngOnInit();
    })
  }

  onSubmit() {
    let detailsToUpdate = {
      id: this.form.value.id,
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      phone: this.form.value.phone,
      country: this.form.value.country,
      state: this.form.value.state,
      city: this.form.value.city,
      profession: this.form.value.profession,
    };

    this._userService.updateUser(detailsToUpdate).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.ngOnInit();
    });
  }

}
