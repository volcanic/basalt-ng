import {Component, Inject, Input, OnInit} from '@angular/core';
import {TaskletDailyScrum} from '../../../model/tasklet-daily-scrum.model';
import {DailyScrumParticipant} from '../../../model/daily-scrum-participant';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {TaskletService} from '../../../services/entities/tasklet.service';

@Component({
  selector: 'app-daily-scrum-fragment',
  templateUrl: './daily-scrum-fragment.component.html',
  styleUrls: ['./daily-scrum-fragment.component.scss']
})
export class DailyScrumFragmentComponent implements OnInit {
  @Input() tasklet: TaskletDailyScrum;

  constructor(private taskletService: TaskletService,
              public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any) {
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
