import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-information-dialog',
  templateUrl: './information-dialog.component.html',
  styleUrls: ['./information-dialog.component.scss']
})
export class InformationDialogComponent implements OnInit {

  dialogTitle = '';
  text = '';
  action = '';
  value: any;

  constructor(public dialogRef: MatDialogRef<InformationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.dialogTitle = this.data.title;
    this.text = this.data.text;
    this.action = this.data.action;
    this.value = this.data.value;
  }

  confirm() {
    this.dialogRef.close(this.value);
  }

}
