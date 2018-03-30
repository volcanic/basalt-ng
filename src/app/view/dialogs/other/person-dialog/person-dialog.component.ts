import {Component, Inject, OnInit} from '@angular/core';
import {Person} from '../../../../model/person.model';
import {DIALOG_MODE} from '../../../../model/dialog-mode.enum';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-person-dialog',
  templateUrl: './person-dialog.component.html',
  styleUrls: ['./person-dialog.component.scss']
})
export class PersonDialogComponent implements OnInit {
  DIALOG_MODE: typeof DIALOG_MODE = DIALOG_MODE;

  mode = DIALOG_MODE.NONE;
  dialogTitle = '';
  person: Person;

  constructor(public dialogRef: MatDialogRef<PersonDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.mode = this.data.mode;
    this.dialogTitle = this.data.dialogTitle;
    this.person = this.data.person;
  }

  addTasklet() {
    this.dialogRef.close(this.person);
  }

  updateTasklet() {
    this.dialogRef.close(this.person);
  }

}
