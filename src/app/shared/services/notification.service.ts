import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  public openSnackBar(message: string, color: string = 'green-snackbar') {
    this.snackBar.open(message, '', {
      duration: 5000,
      panelClass: [color],
    });
  }
}
