import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DailyScrumParticipant} from '../../../../model/daily-scrum-participant';
import {DailyScrumActivity} from '../../../../model/daily-scrum-activity';
import {TaskletService} from '../../../../services/entities/tasklet.service';

@Component({
  selector: 'app-tasklet-dialog-daily-scrum-participant',
  templateUrl: './tasklet-dialog-daily-scrum-participant.component.html',
  styleUrls: ['./tasklet-dialog-daily-scrum-participant.component.scss']
})
export class TaskletDialogDailyScrumParticipantComponent implements OnInit {
  @Input() dailyScrumParticipant: DailyScrumParticipant;
  @Input() existingPersons: string[];
  @Output() onPersonSelectedEmitter = new EventEmitter<string>();

  constructor(private taskletService: TaskletService) {
  }

  ngOnInit() {
    this.ensureEmptyActivity();
  }

  onPersonSelected() {
    this.onPersonSelectedEmitter.next('');
  }

  onActivityEdited() {
    this.ensureEmptyActivity();
  }

  ensureEmptyActivity() {
    let noEmptyActivity = true;

    this.dailyScrumParticipant.activities.forEach(a => {
        if (a != null && a.topic.trim().length === 0) {
          noEmptyActivity = false;
        }
      }
    );

    if (noEmptyActivity) {
      this.dailyScrumParticipant.activities.push(new DailyScrumActivity());
    }
  }
}
