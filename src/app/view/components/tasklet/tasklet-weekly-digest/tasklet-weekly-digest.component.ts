import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {DigestService} from '../../../../services/entities/digest/digest.service';
import {TaskletWeeklyDigest} from '../../../../model/entities/digest/tasklet-weekly-digest.model';
import {WeeklyDigest} from '../../../../model/entities/digest/weekly-digest.model';

/**
 * Displays weekly digest part of a tasklet
 */
@Component({
  selector: 'app-tasklet-weekly-digest',
  templateUrl: './tasklet-weekly-digest.component.html',
  styleUrls: ['./tasklet-weekly-digest.component.scss']
})
export class TaskletWeeklyDigestComponent implements OnInit {

  /** Tasklet weekly digest to be displayed */
  @Input() tasklet: TaskletWeeklyDigest;

  /** Weekly digest */
  weeklyDigest: WeeklyDigest;

  /**
   * Constructor
   * @param {DigestService} digestService
   * @param {MatDialog} dialog dialog
   */
  constructor(private digestService: DigestService,
              public dialog: MatDialog) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.initializeWeeklyDigest();
  }

  //
  // Initialization
  //

  /**
   * Initializes weekly digest
   */
  private initializeWeeklyDigest() {
    this.weeklyDigest = this.digestService.getWeeklyDigest(this.tasklet.focusDate);
  }
}
