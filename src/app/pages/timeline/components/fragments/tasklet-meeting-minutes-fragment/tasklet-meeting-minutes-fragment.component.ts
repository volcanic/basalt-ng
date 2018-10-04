import {Component, Input, OnInit} from '@angular/core';
import {Tasklet} from '../../../../../core/entity/model/tasklet.model';

/**
 * Displays meeting minute fragment
 */
@Component({
  selector: 'app-tasklet-meeting-minutes-fragment',
  templateUrl: './tasklet-meeting-minutes-fragment.component.html',
  styleUrls: ['./tasklet-meeting-minutes-fragment.component.scss']
})
export class TaskletMeetingMinutesFragmentComponent implements OnInit {

  /** Tasklet to be displayed */
  @Input() tasklet: Tasklet;

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
  }
}
