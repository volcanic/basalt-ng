import {Component, Inject, Input, OnInit} from '@angular/core';
import {TaskletDailyScrum} from '../../../model/entities/scrum/tasklet-daily-scrum.model';
import {DailyScrumParticipant} from '../../../model/entities/scrum/daily-scrum-participant';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';

/**
 * Displays daily scrum fragment
 */
@Component({
  selector: 'app-daily-scrum-fragment',
  templateUrl: './daily-scrum-fragment.component.html',
  styleUrls: ['./daily-scrum-fragment.component.scss']
})
export class DailyScrumFragmentComponent implements OnInit {

  /** Tasklet to be displayed */
  @Input() tasklet: TaskletDailyScrum;

  /**
   * Constructor
   * @param {MatDialog} dialog dialog
   * @param data dialog data
   */
  constructor(public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.initializeParticipants();
  }

  //
  // Initialization
  //

  /**
   * Initializes participants
   */
  private initializeParticipants() {
    if (this.tasklet.participants == null) {
      this.tasklet.participants = [];
    }

    this.ensureEmptyParticipant();
  }

  //
  // Actions
  //

  /**
   * Handles person selection
   */
  onPersonSelected() {
    this.ensureEmptyParticipant();
  }

  //
  // Helpers
  //

  /**
   * Ensures that there is always an empty participant to fill
   */
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
