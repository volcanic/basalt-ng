import {Component, Inject, OnInit} from '@angular/core';
import {Person} from '../../../../model/person.model';
import {DIALOG_MODE} from '../../../../model/dialog-mode.enum';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';

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

  personOptions = [];
  filteredPersonOptions: Observable<string[]>;
  formControl: FormControl = new FormControl();

  constructor(public dialogRef: MatDialogRef<PersonDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.filteredPersonOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterPersons(value))
      );
  }

  ngOnInit() {
    this.mode = this.data.mode;
    this.dialogTitle = this.data.dialogTitle;
    this.person = this.data.person;
    this.personOptions = this.data.personOptions;
  }

  addTasklet() {
    this.dialogRef.close(this.person);
  }

  updateTasklet() {
    this.dialogRef.close(this.person);
  }

  filterPersons(val: string): string[] {
    return this.personOptions.filter(option =>
      option.name.toLowerCase().includes(val.toLowerCase()));
  }
}
