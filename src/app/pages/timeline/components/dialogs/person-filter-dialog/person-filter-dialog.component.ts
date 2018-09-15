import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Person} from 'app/core/entity/model/person.model';
import {CloneService} from 'app/core/entity/services/clone.service';

/**
 * Displays person filter dialog
 */
@Component({
  selector: 'app-person-filter-dialog',
  templateUrl: './person-filter-dialog.component.html',
  styleUrls: ['./person-filter-dialog.component.scss']
})
export class PersonFilterDialogComponent implements OnInit {

  /** Dialog title */
  dialogTitle = '';

  /** Persons to be displayed */
  persons: Person[] = [];

  /** Flag indicating whether entities without person shall be displayed */
  personsNone = false;

  /**
   * Constructor
   * @param {MatDialogRef<PersonFilterDialogComponent>} dialogRef dialog reference
   * @param data dialog data
   */
  constructor(public dialogRef: MatDialogRef<PersonFilterDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.initializeData();
  }

  //
  // Initialization
  //

  /**
   * Initializes data
   */
  private initializeData() {
    this.dialogTitle = this.data.dialogTitle;
    this.persons = CloneService.clonePersons(this.data.persons).sort((p1, p2) => {
      return p1.name > p2.name ? 1 : -1;
    });
    this.personsNone = this.data.personsNone;
  }

  //
  // Button actions
  //

  /**
   * Handles click on select-all button
   */
  selectAll() {
    this.persons.forEach(p => {
      p.checked = true;
    });
    this.personsNone = true;
  }

  /**
   * Handles click on select-none button
   */
  selectNone() {
    this.persons.forEach(p => {
      p.checked = false;
    });
    this.personsNone = false;
  }

  /**
   * Handles click on apply button
   */
  apply() {
    this.dialogRef.close({persons: this.persons, personsNone: this.personsNone});
  }
}
