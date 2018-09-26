import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DailyScrumParticipant} from 'app/core/entity/model/daily-scrum-participant';
import {DailyScrumActivity} from 'app/core/entity/model/daily-scrum-activity';
import {Person} from 'app/core/entity/model/person.model';
import {TaskletService} from '../../../../../core/entity/services/tasklet.service';

/**
 * Displays daily scrum participant fragment
 */
@Component({
  selector: 'app-daily-scrum-participant-fragment',
  templateUrl: './daily-scrum-participant-fragment.component.html',
  styleUrls: ['./daily-scrum-participant-fragment.component.scss']
})
export class DailyScrumParticipantFragmentComponent implements OnInit {

  /** Daily scrum participant to be displayed */
  @Input() dailyScrumParticipant: DailyScrumParticipant;
  /** Array of person options */
  @Input() personOptions: string[] = [];
  /** Event emitter indicating changes in person */
  @Output() personSelectedEmitter = new EventEmitter<string>();

  /** Array of activity options */
  activityOptions: string[] = [];

  /**
   * Constructor
   * @param {TaskletService} taskletService
   */
  constructor(private taskletService: TaskletService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.initializeActivities();
    this.initializeActivityOptions();
  }

  //
  // Initialization
  //

  /**
   * Initializes activities
   */
  private initializeActivities() {
    this.ensureEmptyActivity();
  }

  /**
   * Initializes activity taskOptions
   */
  private initializeActivityOptions() {
    this.activityOptions = Array.from(this.taskletService
      .getDailyScrumActivities(this.dailyScrumParticipant.person).values()).reverse();
  }

  //
  // Actions
  //

  /**
   * Handles person changes
   * @param {Person} person new person
   */
  onPersonChanged(person: Person) {
    this.dailyScrumParticipant.person = person;
    this.personSelectedEmitter.emit('');
  }

  /**
   * Handles activity updates
   */
  onActivityUpdated() {
    this.ensureEmptyActivity();
  }

  //
  // Helpers
  //

  /**
   * Makes sure that there is always one empty activity
   */
  private ensureEmptyActivity() {
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
