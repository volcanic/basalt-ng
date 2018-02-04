import {Component, Inject, Input, OnInit} from '@angular/core';
import {TaskletsService} from '../../../services/tasklets.service';
import {TaskletCall} from '../../../model/tasklet-call.model';
import {Person} from '../../../model/person.model';
import {DomSanitizer} from '@angular/platform-browser';
import {MAT_DIALOG_DATA, MatDialog, MatIconRegistry} from '@angular/material';
import {DIALOG_MODE} from '../../../model/dialog-mode.enum';
import {PersonDialogComponent} from '../person-dialog/person-dialog.component';

@Component({
  selector: 'app-tasklet-dialog-call',
  templateUrl: './tasklet-dialog-call.component.html',
  styleUrls: ['./tasklet-dialog-call.component.scss']
})
export class TaskletDialogCallComponent implements OnInit {
  @Input() tasklet: TaskletCall;

  existingPersons: Person[] = [];

  iconAdd = 'add';

  constructor(private taskletsService: TaskletsService,
              public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('add', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_add_black_24px.svg'));
  }

  ngOnInit() {
    if (this.tasklet.persons == null) {
      this.tasklet.persons = [];
    }

    this.existingPersons = this.taskletsService.getPersons();
    console.log(`DEBUG existingPersons ${JSON.stringify(this.existingPersons)}`);
  }

  addPerson() {
    const dialogRef = this.dialog.open(PersonDialogComponent, {
      disableClose: false,
      data: {
        mode: DIALOG_MODE.ADD,
        dialogTitle: 'Add person',
        person: new Person()
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        console.log(`DEBUG result ${JSON.stringify(result)}`);
        this.existingPersons.push(result);
      }
    });
  }

}
