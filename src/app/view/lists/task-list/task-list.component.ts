import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {DateService} from '../../../services/util/date.service';
import {Media} from '../../../model/ui/media.enum';
import {Action} from '../../../model/ui/action.enum';

/**
 * Displays task list
 */
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent implements OnInit, OnChanges {

  /** Tasks to be displayed */
  @Input() tasks = [];
  /** Current media */
  @Input() media: Media;
  /** Event emitter indicating task action */
  @Output() taskEventEmitter = new EventEmitter<{ Action, Task }>();

  /** Tasks having a due date before now */
  tasksOverdue = [];
  /** Tasks having a due date after now */
  tasksNext = [];
  /** Tasks not having a due date */
  tasksInbox = [];
  /** Tasks with a completion date */
  tasksCompleted = [];

  /** Background color for overdue badge */
  tasksOverdueBadgeColor = 'transparent';
  /** Background color for next badge */
  tasksNextBadgeColor = 'transparent';
  /** Background color for inbox badge */
  tasksInboxBadgeColor = 'transparent';

  /** Enum for action types */
  action = Action;

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit(): void {
    this.initializeTaskCategories();
  }

  /**
   * Handles on-changes lifecycle hook
   * @param changes changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    this.initializeTaskCategories();
  }

  //
  // Initialization
  //

  initializeTaskCategories() {
    this.tasksOverdue = this.tasks.filter(task => {
      return task != null
        && task.completionDate == null
        && task.dueDate != null
        && DateService.isBefore(task.dueDate, new Date());
    });
    this.tasksNext = this.tasks.filter(task => {
      return task != null
        && task.completionDate == null
        && task.dueDate != null
        && DateService.isAfter(task.dueDate, new Date());
    });
    this.tasksInbox = this.tasks.filter(task => {
      return task != null
        && task.completionDate == null
        && task.dueDate == null;
    });
    this.tasksCompleted = this.tasks.filter(task => {
      return task != null && task.completionDate != null;
    });

    this.tasksOverdueBadgeColor = (this.tasksOverdue.length > 0) ? 'warn' : 'primary';
    this.tasksNextBadgeColor = (this.tasksNext.length > 0) ? 'accent' : 'primary';
    this.tasksInboxBadgeColor = (this.tasksInbox.length > 0) ? 'accent' : 'primary';
  }
}
