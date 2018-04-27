import {Component, Inject, Input, OnInit} from '@angular/core';
import {TaskletsService} from '../../../../services/tasklets.service';
import {Person} from '../../../../model/person.model';
import {DomSanitizer} from '@angular/platform-browser';
import {MAT_DIALOG_DATA, MatDialog, MatIconRegistry} from '@angular/material';
import {DIALOG_MODE} from '../../../../model/dialog-mode.enum';
import {PersonDialogComponent} from '../../other/person-dialog/person-dialog.component';
import {Tasklet} from '../../../../model/tasklet.model';

@Component({
  selector: 'app-tasklet-dialog-participants',
  templateUrl: './tasklet-dialog-participants.component.html',
  styleUrls: ['./tasklet-dialog-participants.component.scss']
})
export class TaskletDialogParticipantsComponent implements OnInit {
  @Input() tasklet: Tasklet;

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
    this.existingPersons = Array.from(this.taskletsService.getPersons().values()).reverse();
  }

  addPerson() {
    const dialogRef = this.dialog.open(PersonDialogComponent, {
      disableClose: false,
      data: {
        mode: DIALOG_MODE.ADD,
        dialogTitle: 'Add person',
        person: new Person('')
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.tasklet.persons.push(result);
        this.existingPersons.unshift(result);
      }
    });
  }

  comparePerson(p1: Person, p2: Person) {
    return p1.name === p2.name;
  }
}
