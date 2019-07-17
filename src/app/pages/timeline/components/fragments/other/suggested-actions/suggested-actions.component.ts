import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ColorService} from '../../../../../../core/ui/services/color.service';
import {TaskletTypeGroup} from '../../../../../../core/entity/model/tasklet-type-group.enum';
import {TaskletService} from '../../../../../../core/entity/services/tasklet/tasklet.service';
import {TaskletType} from '../../../../../../core/entity/model/tasklet-type.enum';
import {Task} from '../../../../../../core/entity/model/task.model';
import {Tasklet} from '../../../../../../core/entity/model/tasklet.model';
import {Action} from '../../../../../../core/entity/model/action.enum';
import {TaskService} from '../../../../../../core/entity/services/task/task.service';
import {DateService} from '../../../../../../core/entity/services/date.service';

/**
 * Represents suggested actions
 */
class SuggestedActions {

  /** Label to be displayed */
  label: string;
  /** Icon to be used */
  icon: string;
  /** Background color to be used */
  backgroundColor: string;
  /** Background color to be used */
  iconColor: string;
  /** Tooltip */
  tooltip?: string;

  /** Task */
  task?: Task;
  /** Tasklet type */
  taskletType?: TaskletType;
}

/**
 * Displays suggestedd actions
 */
@Component({
  selector: 'app-suggested-actions',
  templateUrl: './suggested-actions.component.html',
  styleUrls: ['./suggested-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuggestedActionsComponent implements OnInit, OnChanges {

  /** Map of suggested tasks */
  @Input() suggestedTasks = new Map<string, Task>();
  /** Map of tasklets */
  @Input() taskletsMap = new Map<string, Tasklet>();

  /** Event emitter indicating tasklet action */
  @Output() taskletEventEmitter = new EventEmitter<{ action: Action, tasklet: Tasklet }>();
  /** Event emitter indicating task action */
  @Output() taskEventEmitter = new EventEmitter<{ action: Action, task: Task }>();

  /** List of suggested actions */
  suggestedActions: SuggestedActions[] = [];
  /** List of static suggested actions */
  staticSuggestedActions: SuggestedActions[] = [];

  /** Maximum number of dynamically picked tasks */
  MAX_NUMBER_DYNAMIC = 3;

  /**
   * Constructor
   * @param taskletService tasklet service
   * @param taskService task service
   * @param colorService color service
   */
  constructor(private taskletService: TaskletService,
              private taskService: TaskService,
              private colorService: ColorService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeStaticSuggestedActions();
  }

  /**
   * Handles on-change lifecycle phase
   */
  ngOnChanges(changes: SimpleChanges) {
    this.initializeDynamicSuggestedActions();
  }

  //
  // Initialization
  //

  /**
   * Initializes dynamic suggested actions which are fed by
   * <li> upcoming recurring tasks
   * <li> tasks being overdue
   * <li> tasks that are sorted by urgency and importance
   */
  private initializeDynamicSuggestedActions() {
    this.suggestedActions = [];

    // Recurring tasks
    let expectedNextOccurrence;
    Array.from(this.suggestedTasks.values()).filter(TaskService.isTaskRecurring).filter(task => {
      const tasklets = this.taskletService.getTaskletsByTask(task, this.taskletsMap);
      expectedNextOccurrence = TaskService.getExpectedNextOccurrence(task, tasklets);
      return TaskService.isTaskRelevantSoon(task, expectedNextOccurrence);
    }).slice(0, this.MAX_NUMBER_DYNAMIC - this.suggestedActions.length)
      .forEach(task => {
        const suggestedAction = new SuggestedActions();
        suggestedAction.icon = 'loop';
        suggestedAction.label = task.name;
        suggestedAction.backgroundColor = this.colorService.getTaskRecurringColor(task);
        suggestedAction.iconColor = this.colorService.getTaskRecurringContrast(task);
        suggestedAction.tooltip = `${task.name}
        (expected: ${DateService.getDateString(expectedNextOccurrence)},
        ${DateService.getTimeString(expectedNextOccurrence)})`;
        suggestedAction.task = task;
        this.suggestedActions.push(suggestedAction);
      });

    // Overdue tasks
    Array.from(this.suggestedTasks.values()).filter(TaskService.isTaskOverdue)
      .slice(0, this.MAX_NUMBER_DYNAMIC - this.suggestedActions.length)
      .forEach(task => {
        const suggestedAction = new SuggestedActions();
        suggestedAction.icon = 'warning';
        suggestedAction.label = task.name;
        suggestedAction.backgroundColor = this.colorService.getTaskOverdueColor(task);
        suggestedAction.iconColor = this.colorService.getTaskOverdueContrast(task);
        suggestedAction.tooltip = `${task.name}
        (due: ${DateService.getDateString(task.dueDate)},
        ${DateService.getTimeString(task.dueDate)})`;
        suggestedAction.task = task;
        this.suggestedActions.push(suggestedAction);
      });

    // Today's tasks
    Array.from(this.suggestedTasks.values()).filter(TaskService.isTaskToday)
      .slice(0, this.MAX_NUMBER_DYNAMIC - this.suggestedActions.length)
      .forEach(task => {
        const suggestedAction = new SuggestedActions();
        suggestedAction.icon = TaskletService.getIconByTaskletType(TaskletType.ACTION);
        suggestedAction.label = task.name;
        suggestedAction.backgroundColor = this.colorService.getTaskColor(task);
        suggestedAction.iconColor = this.colorService.getTaskContrast(task);
        suggestedAction.tooltip = `${task.name}
        (due: ${DateService.getDateString(task.dueDate)},
        ${DateService.getTimeString(task.dueDate)})`;
        suggestedAction.task = task;
        this.suggestedActions.push(suggestedAction);
      });

    // Later tasks
    Array.from(this.suggestedTasks.values()).filter(TaskService.isTaskLater)
      .slice(0, this.MAX_NUMBER_DYNAMIC - this.suggestedActions.length)
      .forEach(task => {
        const suggestedAction = new SuggestedActions();
        suggestedAction.icon = TaskletService.getIconByTaskletType(TaskletType.ACTION);
        suggestedAction.label = task.name;
        suggestedAction.backgroundColor = this.colorService.getTaskColor(task);
        suggestedAction.iconColor = this.colorService.getTaskContrast(task);
        suggestedAction.tooltip = `${task.name}
        (due: ${DateService.getDateString(task.dueDate)},
        ${DateService.getTimeString(task.dueDate)})`;
        suggestedAction.task = task;
        this.suggestedActions.push(suggestedAction);
      });
  }

  /**
   * Initializes static suggested actions
   */
  private initializeStaticSuggestedActions() {
    const suggestedActionLunchBreak = new SuggestedActions();
    suggestedActionLunchBreak.taskletType = TaskletType.LUNCH_BREAK;
    suggestedActionLunchBreak.icon = TaskletService.getIconByTaskletType(TaskletType.LUNCH_BREAK);
    suggestedActionLunchBreak.label = TaskletType.LUNCH_BREAK.toString();
    suggestedActionLunchBreak.backgroundColor = this.colorService.getTaskletTypeGroupColor(TaskletTypeGroup.BREAK).color;
    suggestedActionLunchBreak.iconColor = this.colorService.getTaskletTypeGroupColor(TaskletTypeGroup.BREAK).contrast;
    this.staticSuggestedActions.push(suggestedActionLunchBreak);

    const suggestedActionFinishingTime = new SuggestedActions();
    suggestedActionFinishingTime.taskletType = TaskletType.FINISHING_TIME;
    suggestedActionFinishingTime.icon = TaskletService.getIconByTaskletType(TaskletType.FINISHING_TIME);
    suggestedActionFinishingTime.label = TaskletType.FINISHING_TIME.toString();
    suggestedActionFinishingTime.backgroundColor = this.colorService.getTaskletTypeGroupColor(TaskletTypeGroup.BREAK).color;
    suggestedActionFinishingTime.iconColor = this.colorService.getTaskletTypeGroupColor(TaskletTypeGroup.BREAK).contrast;
    this.staticSuggestedActions.push(suggestedActionFinishingTime);
  }

  //
  // Actions
  //

  /**
   * Handles click on dynamic suggested action
   * @param task task
   */
  onDynamicSuggestedActionClicked(task: Task) {
    this.taskEventEmitter.emit({action: Action.OPEN_DIALOG_CONTINUE, task});
  }

  /**
   * Handles click on static suggested action
   * @param taskletType tasklet type
   */
  onStaticSuggestedActionClicked(taskletType: TaskletType) {
    const tasklet = new Tasklet();
    tasklet.type = taskletType;
    this.taskletEventEmitter.emit({action: Action.ADD, tasklet});
  }
}
