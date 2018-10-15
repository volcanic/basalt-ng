import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskletType} from 'app/core/entity/model/tasklet-type.enum';
import {Tasklet} from 'app/core/entity/model/tasklet.model';
import {ColorService} from '../../../../../../core/ui/services/color.service';
import {TaskletTypeGroup} from '../../../../../../core/entity/model/tasklet-type-group.enum';

class TaskletTypeGroupAction {
  group: TaskletTypeGroup;
  label: string;
  icon: string;
  backgroundColor: string;
  iconColor: string;
  taskletTypes = [];
}

/**
 * Displays tasklet type fragment
 */
@Component({
  selector: 'app-tasklet-type-fragment',
  templateUrl: './tasklet-type-fragment.component.html',
  styleUrls: ['./tasklet-type-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskletTypeFragmentComponent implements OnInit {

  /** Tasklet to be displayed */
  @Input() tasklet: Tasklet;
  /** Event emitter indicating tasklet type selection */
  @Output() taskletTypeEventEmitter = new EventEmitter<TaskletType>();

  /** Available tasklet types */
  taskletTypes = Object.keys(TaskletType).map(key => TaskletType[key]);
  /** Available tasklet type groups */
  taskletTypeGroups = Object.keys(TaskletTypeGroup).map(key => TaskletTypeGroup[key]);

  taskletTypeActions = [];

  /**
   * Constructor
   * @param colorService color service
   */
  constructor(private colorService: ColorService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeTaskletTypeGroups();
  }

  //
  // Initialization
  //

  /**
   * Initializes tasklet types
   */
  initializeTaskletTypeGroups() {
    this.taskletTypeGroups.forEach(group => {
      const action = new TaskletTypeGroupAction();
      action.group = group;
      action.backgroundColor = this.getGroupColor(group);
      action.iconColor = this.getGroupContrast(group);
      action.icon = this.getGroupIcon(group);
      action.label = group.toString();
      action.taskletTypes = this.getTaskletTypes(group);
      this.taskletTypeActions.push(action);
    });
  }


  //
  // Actions
  //

  /**
   * Handles selection of tasklet type group
   * @param taskletTypeGroupAction tasklet type group action
   */
  onTaskletTypeGroupSelected(taskletTypeGroupAction: TaskletTypeGroupAction) {
    // this.taskletTypeEventEmitter.emit(taskletTypeAction.type);
  }

  /**
   * Handles selection of tasklet type
   * @param taskletType tasklet type action
   */
  onTaskletTypeSelected(taskletType: TaskletType) {
    this.taskletTypeEventEmitter.emit(taskletType);
  }

  //
  // Helpers
  //

  /**
   * Retrieves a color by tasklet type group
   * @param group tasklet type group
   */
  private getGroupColor(group: TaskletTypeGroup): string {
    return this.colorService.getTaskletTypeGroupColor(group).color;
  }

  /**
   * Retrieves a contrast color by tasklet type group
   * @param group tasklet type group
   */
  private getGroupContrast(group: TaskletTypeGroup): string {
    return this.colorService.getTaskletTypeGroupColor(group).contrast;
  }

  /**
   * Retrieves an icon by tasklet type
   * @param group tasklet type group
   */
  private getGroupIcon(group: TaskletTypeGroup) {
    switch (group) {
      case TaskletTypeGroup.ACTION: {
        return 'turned_in_not';
      }
      case TaskletTypeGroup.COMMUNICATION: {
        return 'chat';
      }
      case TaskletTypeGroup.CODING: {
        return 'code_braces';
      }
      case TaskletTypeGroup.IDEA: {
        return 'lightbulb_outline';
      }
      case TaskletTypeGroup.BREAK: {
        return 'local_cafe';
      }
    }
  }

  /**
   * Retrieves an icon by tasklet type
   * @param type tasklet type
   */
  public getTypeIcon(type: TaskletType) {
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

  /**
   * Returns a list of tasklet types contained in a given tasklet type group
   * @param group tasklet type group
   */
  getTaskletTypes(group: TaskletTypeGroup): TaskletType[] {
    const types: TaskletType[] = [];

    switch (group) {
      case TaskletTypeGroup.ACTION: {
        types.push(TaskletType.ACTION);
        break;
      }
      case TaskletTypeGroup.COMMUNICATION: {
        types.push(TaskletType.MEETING);
        types.push(TaskletType.CALL);
        types.push(TaskletType.CHAT);
        types.push(TaskletType.DAILY_SCRUM);
        break;
      }
      case TaskletTypeGroup.CODING: {
        types.push(TaskletType.DEVELOPMENT);
        types.push(TaskletType.DEBUGGING);
        break;
      }
      case TaskletTypeGroup.IDEA: {
        types.push(TaskletType.IDEA);
        break;
      }
      case TaskletTypeGroup.BREAK: {
        types.push(TaskletType.LUNCH_BREAK);
        types.push(TaskletType.FINISHING_TIME);
        break;
      }
    }

    return types;
  }
}
