import {Component, Inject, OnInit} from '@angular/core';
import {FilterService} from '../../../../services/entities/filter/filter.service';
import {ConfirmationDialogComponent} from '../../other/confirmation-dialog/confirmation-dialog.component';
import {DateService} from '../../../../services/util/date.service';
import {Person} from '../../../../model/entities/person.model';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {InformationDialogComponent} from '../../other/information-dialog/information-dialog.component';
import {DIALOG_MODE} from '../../../../model/ui/dialog-mode.enum';
import {PersonService} from '../../../../services/entities/person.service';
import {CloneService} from '../../../../services/util/clone.service';
import {TaskletService} from '../../../../services/entities/tasklet.service';
import {Tasklet} from '../../../../model/entities/tasklet.model';

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

  inputDisabled = false;

  constructor(private personService: PersonService,
              private taskletService: TaskletService,
              private dateService: DateService,
              private filterService: FilterService,
              private cloneService: CloneService,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<PersonDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.mode = this.data.mode;
    this.dialogTitle = this.data.dialogTitle;

    // Deep copy
    this.person = this.cloneService.clonePerson(this.data.person);
  }

  //
  // Action
  //

  public onKeyDown(event: any) {
    const KEY_CODE_ENTER = 13;
    if (event.keyCode === KEY_CODE_ENTER && event.ctrlKey) {
      this.updatePerson();
    }
  }

  //
  // Buttons action
  //

  addPerson() {
    this.dialogRef.close(this.person);
  }

  updatePerson() {
    this.dialogRef.close(this.person);
  }

  deletePerson() {

    const references = Array.from(this.taskletService.tasklets.values()).some((tasklet: Tasklet) => {
      return tasklet.personIds.some(tagId => {
        return tagId === this.person.id;
      });
    });

    if (references) {
      this.dialog.open(InformationDialogComponent, <MatDialogConfig>{
        disableClose: false,
        data: {
          title: 'Cannot delete person',
          text: `There are still ${references} tasks associated with this person.`,
          action: 'Okay',
          value: this.person
        }
      });
    } else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, <MatDialogConfig>{
        disableClose: false,
        data: {
          title: 'Delete person',
          text: 'Do you want to delete this person?',
          action: 'Delete',
          value: this.person
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
          this.personService.deletePerson(result as Person);
          this.filterService.persons.delete((result as Person).id);
          this.dialogRef.close(null);
        }
      });
    }
  }
}
