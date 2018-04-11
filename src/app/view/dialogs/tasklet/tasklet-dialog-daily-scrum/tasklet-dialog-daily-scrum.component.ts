import {Component, Inject, Input, OnInit} from '@angular/core';
import {TaskletDailyScrum} from '../../../../model/tasklet-daily-scrum.model';
import {DailyScrumParticipant} from '../../../../model/daily-scrum-participant';
import {TaskletsService} from '../../../../services/tasklets.service';
import {MAT_DIALOG_DATA, MatDialog, MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {DIALOG_MODE} from '../../../../model/dialog-mode.enum';
import {PersonDialogComponent} from '../../other/person-dialog/person-dialog.component';
import {Person} from '../../../../model/person.model';

@Component({
  selector: 'app-tasklet-dialog-daily-scrum',
  templateUrl: './tasklet-dialog-daily-scrum.component.html',
  styleUrls: ['./tasklet-dialog-daily-scrum.component.scss']
})
export class TaskletDialogDailyScrumComponent implements OnInit {
  @Input() tasklet: TaskletDailyScrum;

  existingPersons: string[] = [];

  iconAdd = 'add';

  constructor(private taskletsService: TaskletsService,
              public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('add', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_add_black_24px.svg'));
  }

  ngOnInit() {
    if (this.tasklet.participants == null) {
      this.tasklet.participants = [];
    }

    this.ensureEmptyParticipant();

    this.existingPersons = this.taskletsService.getPersons().reverse().map(p => {
      return p.name;
    });
  }

  onPersonSelected() {
    this.ensureEmptyParticipant();
  }

  ensureEmptyParticipant() {
    let noEmptyPerson = true;

    this.tasklet.participants.forEach(p => {
        if (p != null && ((p.person == null) || (p.person != null && p.person.name.trim().length === 0))) {
          noEmptyPerson = false;
        }
      }
    );

    if (noEmptyPerson) {
      this.tasklet.participants.push(new DailyScrumParticipant());
    }
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
        this.existingPersons.unshift(result.name);
      }
    });
  }
}
