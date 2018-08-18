import {Component, Input, OnInit} from '@angular/core';
import {DailyDigest} from '../../../../model/entities/digest/daily-digest.model';
import {MatDialog} from '@angular/material';
import {DigestService} from '../../../../services/entities/digest/digest.service';
import {Tasklet} from '../../../../model/entities/tasklet.model';

/**
 * Displays daily tasklet part of tasklet
 */
@Component({
  selector: 'app-tasklet-daily-digest',
  templateUrl: './tasklet-daily-digest.component.html',
  styleUrls: ['./tasklet-daily-digest.component.scss']
})
export class TaskletDailyDigestComponent implements OnInit {

  /** Tasklet to be displayed */
  @Input() tasklet: Tasklet;

  /** Daily digest */
  dailyDigest: DailyDigest;

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
    this.initializeDailyDigest();
  }

  //
  // Initialization
  //

  /**
   * Initializes daily digest
   */
  private initializeDailyDigest() {
    this.dailyDigest = this.digestService.getDailyDigest(new Date(this.tasklet.creationDate));
  }
}
