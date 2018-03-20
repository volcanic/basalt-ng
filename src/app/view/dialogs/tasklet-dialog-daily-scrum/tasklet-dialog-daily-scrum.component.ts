import {Component, Input, OnInit} from '@angular/core';
import {TaskletDailyScrum} from '../../../model/tasklet-daily-scrum.model';
import {DailyScrumParticipant} from '../../../model/daily-scrum-participant';

@Component({
  selector: 'app-tasklet-dialog-daily-scrum',
  templateUrl: './tasklet-dialog-daily-scrum.component.html',
  styleUrls: ['./tasklet-dialog-daily-scrum.component.scss']
})
export class TaskletDialogDailyScrumComponent implements OnInit {
  @Input() tasklet: TaskletDailyScrum;

  constructor() {
  }

  ngOnInit() {
    if (this.tasklet.participants == null) {
      this.tasklet.participants = [];
    }

    this.ensureEmptyParticipant();
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
}
