import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Person} from '../../../../model/entities/person.model';
import {CloneService} from '../../../../services/util/clone.service';

@Component({
  selector: 'app-person-filter-dialog',
  templateUrl: './person-filter-dialog.component.html',
  styleUrls: ['./person-filter-dialog.component.scss']
})
export class PersonFilterDialogComponent implements OnInit {
  dialogTitle = '';
  persons: Person[] = [];
  personsNone = false;

  constructor(private cloneService: CloneService,
              public dialogRef: MatDialogRef<PersonFilterDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

    this.dialogTitle = data.dialogTitle;

    this.persons = this.cloneService.clonePersons(this.data.persons).sort((p1, p2) => {
      return p1.name > p2.name ? 1 : -1;
    });
    this.personsNone = this.data.personsNone;
  }

  ngOnInit() {
  }

  selectAll() {
    this.persons.forEach(p => {
      p.checked = true;
    });
    this.personsNone = true;
  }

  selectNone() {
    this.persons.forEach(p => {
      p.checked = false;
    });
    this.personsNone = false;
  }

  apply() {
    this.dialogRef.close({persons: this.persons, personsNone: this.personsNone});
  }
}
