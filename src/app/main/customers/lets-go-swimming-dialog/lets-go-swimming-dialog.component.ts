import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-lets-go-swimming-dialog',
  templateUrl: './lets-go-swimming-dialog.component.html',
  styleUrls: ['./lets-go-swimming-dialog.component.scss']
})
export class LetsGoSwimmingDialogComponent implements OnInit {
  code: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private _dialogRef: MatDialogRef<LetsGoSwimmingDialogComponent>) {
    this.code = this.data.user.code;

  }

  ngOnInit() {
  }


  closeDialog(success) {
    this._dialogRef.close({success: success});
  }
}
