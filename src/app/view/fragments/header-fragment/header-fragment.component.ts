import {Component, Input} from '@angular/core';
import {TaskletType} from '../../../model/tasklet-type.enum';
import {MatDialog} from '@angular/material';
import {Project} from '../../../model/entities/project.model';
import {Tasklet} from '../../../model/entities/tasklet.model';
import {TaskletService} from '../../../services/entities/tasklet.service';

/**
 * Displays header fragment
 */
@Component({
  selector: 'app-header-fragment',
  templateUrl: './header-fragment.component.html',
  styleUrls: ['./header-fragment.component.scss']
})
export class HeaderFragmentComponent {

  /** Tasklet to be displayed */
  @Input() tasklet: Tasklet;

  /** Project to be displayed */
  project: Project;

  /** Available tasklet types */
  taskletTypes = Object.keys(TaskletType).map(key => TaskletType[key]);

  /** Reference to static method */
  selectIcon = HeaderFragmentComponent.selectIcon;

  /**
   * Constructor
   * @param {TaskletService} taskletService
   * @param {MatDialog} dialog dialog
   */
  constructor(private taskletService: TaskletService,
              public dialog: MatDialog) {

    this.project = this.taskletService.getProjectByTasklet(this.tasklet);
  }

  /**
   * Retrieves an icon by tasklet type
   * @param type tasklet type
   */
  static selectIcon(type: TaskletType) {
    switch (type) {
      case TaskletType.ACTION: {
        return 'turned_in_not';
      }
      case TaskletType.MEETING: {
        return 'people';
      }
      case TaskletType.CALL: {
        return 'call';
      }
      case TaskletType.DAILY_SCRUM: {
        return 'scrum';
      }
      case TaskletType.MAIL: {
        return 'mail';
      }
      case TaskletType.CHAT: {
        return 'chat';
      }
      case TaskletType.DEVELOPMENT: {
        return 'code';
      }
      case TaskletType.DEBUGGING: {
        return 'bug_report';
      }
      case TaskletType.IDEA: {
        return 'lightbulb_outline';
      }
      case TaskletType.LUNCH_BREAK: {
        return 'local_dining';
      }
      case TaskletType.FINISHING_TIME: {
        return 'directions_run';
      }
    }
  }
}
