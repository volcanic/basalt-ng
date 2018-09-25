import {Component, Input, OnInit} from '@angular/core';
import {Tasklet} from '../../../../../core/entity/model/tasklet.model';
import {TaskletType} from '../../../../../core/entity/model/tasklet-type.enum';

/**
 * Displays future tasklet
 */
@Component({
  selector: 'app-future-tasklet-fragment',
  templateUrl: './future-tasklet-fragment.component.html',
  styleUrls: ['./future-tasklet-fragment.component.scss']
})
export class FutureTaskletFragmentComponent implements OnInit {

  /** Tasklet to be displayed */
  @Input() tasklet: Tasklet;
  /** Topic (typically derived from task name */
  @Input() topic = '';

  /** Icon name */
  icon = '';

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.initializeIcon();
  }

  //
  // Initialization
  //

  /**
   * Initializes icon
   */
  private initializeIcon() {
    switch (this.tasklet.type) {
      case TaskletType.ACTION: {
        this.icon = 'turned_in_not';
        break;
      }
      case TaskletType.MEETING: {
        this.icon = 'people';
        break;
      }
      case TaskletType.CALL: {
        this.icon = 'call';
        break;
      }
      case TaskletType.DAILY_SCRUM: {
        this.icon = 'scrum';
        break;
      }
      case TaskletType.MAIL: {
        this.icon = 'mail';
        break;
      }
      case TaskletType.CHAT: {
        this.icon = 'chat';
        break;
      }
      case TaskletType.DEVELOPMENT: {
        this.icon = 'code';
        break;
      }
      case TaskletType.DEBUGGING: {
        this.icon = 'bug_report';
        break;
      }
      case TaskletType.IDEA: {
        this.icon = 'lightbulb_outline';
        break;
      }
      case TaskletType.LUNCH_BREAK: {
        this.icon = 'local_dining';
        break;
      }
      case TaskletType.FINISHING_TIME: {
        this.icon = 'directions_run';
        break;
      }
    }
  }
}
