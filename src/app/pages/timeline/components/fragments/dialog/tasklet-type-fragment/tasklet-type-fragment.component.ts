import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {TaskletType} from 'app/core/entity/model/tasklet-type.enum';
import {Tasklet} from 'app/core/entity/model/tasklet.model';

/**
 * Displays tasklet type fragment
 */
@Component({
  selector: 'app-header-fragment',
  templateUrl: './tasklet-type-fragment.component.html',
  styleUrls: ['./tasklet-type-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskletTypeFragmentComponent {

  /** Tasklet to be displayed */
  @Input() tasklet: Tasklet;

  /** Available tasklet types */
  taskletTypes = Object.keys(TaskletType).map(key => TaskletType[key]);

  /** Reference to static method */
  selectIcon = TaskletTypeFragmentComponent.selectIcon;

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
