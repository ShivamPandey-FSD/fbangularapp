import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public _matSnackBar: MatSnackBar) { }

  openSnackBar(message: string, action: string, className: string) {
    this._matSnackBar.open(message, action, {
      duration: 3600,
      verticalPosition: 'top',
      horizontalPosition: 'end',
      panelClass: [className]
    })
  }

}
