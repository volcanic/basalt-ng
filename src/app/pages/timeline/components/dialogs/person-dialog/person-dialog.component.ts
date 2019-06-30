import {Component, Inject, OnInit} from '@angular/core';
import {Person} from 'app/core/entity/model/person.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DialogMode} from 'app/core/entity/model/dialog-mode.enum';
import {Action} from 'app/core/entity/model/action.enum';

/**
 * Displays person dialog
 */
@Component({
  selector: 'app-person-dialog',
  templateUrl: './person-dialog.component.html',
  styleUrls: ['./person-dialog.component.scss']
})
export class PersonDialogComponent implements OnInit {

  /** Enum of dialog modes */
  public modeType = DialogMode;
  /** Current media */
  public mode: DialogMode = DialogMode.NONE;

  /** Dialog title */
  dialogTitle = '';

  /** Person to be displayed */
  person: Person;

  /** Readonly dialog if true */
  readonly = false;

  /**
   * Constructor
   * @param dialogRef dialog reference
   * @param data dialog data
   */
  constructor(public dialogRef: MatDialogRef<PersonDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
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
    this.mode = this.data.mode;
    this.dialogTitle = this.data.dialogTitle;
    this.person = this.data.person;
  }

  //
  // Actions
  //

  /**
   * Handles key down event
   * @param event event
   */
  onKeyDown(event: any) {
    const KEY_CODE_ENTER = 13;
    if (event.keyCode === KEY_CODE_ENTER && event.ctrlKey) {
      switch (this.mode) {
        case DialogMode.ADD: {
          this.addPerson();
          break;
        }
        case DialogMode.UPDATE: {
          this.updatePerson();
          break;
        }
      }
    }
  }

  //
  // Button actions
  //

  /**
   * Handles click on add button
   */
  addPerson() {
    this.dialogRef.close({action: Action.ADD, person: this.person});
  }

  /**
   * Handles click on update button
   */
  updatePerson() {
    this.dialogRef.close({action: Action.UPDATE, person: this.person});
  }

  /**
   * Handles click on delete button
   */
  deletePerson() {
    this.dialogRef.close({action: Action.DELETE, person: this.person});
  }
}
