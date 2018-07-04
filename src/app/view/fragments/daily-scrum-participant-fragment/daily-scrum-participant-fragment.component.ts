import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DailyScrumParticipant} from '../../../model/daily-scrum-participant';
import {DailyScrumActivity} from '../../../model/daily-scrum-activity';
import {TaskletService} from '../../../services/entities/tasklet.service';
import {Person} from '../../../model/person.model';

@Component({
  selector: 'app-daily-scrum-participant-fragment',
  templateUrl: './daily-scrum-participant-fragment.component.html',
  styleUrls: ['./daily-scrum-participant-fragment.component.scss']
})
export class DailyScrumParticipantFragmentComponent implements OnInit {
  @Input() dailyScrumParticipant: DailyScrumParticipant;
  @Output() onPersonSelectedEmitter = new EventEmitter<string>();

  constructor(private taskletService: TaskletService) {
  }

  ngOnInit() {
    this.ensureEmptyActivity();
  }

  onPersonChanged(person: Person) {
    this.dailyScrumParticipant.person = person;
    console.log(`DEBUG dailyScrumParticipant ${JSON.stringify(this.dailyScrumParticipant)}`);
    this.onPersonSelectedEmitter.next('');
  }

  onActivityEdited() {
    this.ensureEmptyActivity();
  }

  /**
   * Makes sure that there is always one empty activity
   */
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
