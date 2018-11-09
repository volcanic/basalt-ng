import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Tag} from '../../../../../../core/entity/model/tag.model';
import {Task} from '../../../../../../core/entity/model/task.model';
import {Person} from '../../../../../../core/entity/model/person.model';
import {Project} from '../../../../../../core/entity/model/project.model';
import {RecurrenceInterval} from '../../../../../../core/entity/model/recurrence-interval.enum';
import {MatSlideToggleChange} from '@angular/material';
import {DateService} from '../../../../../../core/entity/services/date.service';

@Component({
  selector: 'app-task-properties-form',
  templateUrl: './task-properties-form.component.html',
  styleUrls: ['./task-properties-form.component.scss']
})
export class TaskPropertiesFormComponent implements OnInit {

  /** Task to be displayed */
  @Input() task: Task;
  /** Project assigned to this task */
  @Input() project: Project;
  /** Delegated to affiliated to this task */
  @Input() delegatedTo: Person;
  /** Tags assigned to this task */
  @Input() tags: Tag[] = [];
  /** Readonly dialog if true */
  @Input() readonly = false;

  /** Project options */
  @Input() projectOptions: string[];
  /** Tag options */
  @Input() tagOptions: string[];
  /** Person options */
  @Input() personOptions: string[];

  /** Event emitter indicating task changes */
  @Output() taskEventEmitter = new EventEmitter<{ task: Task, project: Project, delegatedTo: Person, tags: Tag[] }>();

  /** Recurring */
  recurring = false;

  /** Color for no priority */
  colorEmpty = '#cfd8dc';
  /** Colors for priorities */
  colorsPriorities = [
    '#990000',
    '#9c690e',
    '#3c8b09',
  ];
  /** Colors for flags */
  colorsFlags = [
    '#cfd8dc',
    '#cfd8dc',
    '#cfd8dc',
  ];

  /** Reference to static method */
  getTimeString = DateService.getTimeString;
  /** Reference to static method */
  getDateString = DateService.getDateString;
  /** Reference to static method */
  getRecurrenceIntervalString = DateService.getRecurrenceIntervalString;

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializePriority();
  }

  //
  // Initialization
  //

  /**
   * Initializes priority
   */
  private initializePriority() {
    const taskPriority = this.task.priority;

    this.colorsFlags.forEach((flagColor, index) => {
      if (index === taskPriority) {
        this.colorsFlags[index] = this.colorsPriorities[this.task.priority];
      } else {
        this.colorsFlags[index] = this.colorEmpty;
      }
    });
  }

  //
  // Actions
  //

  // Recurring

  /**
   * Handles changes in recurring flag
   * @param {MatSlideToggleChange} event event
   */
  onRecurringChanged(event: MatSlideToggleChange) {
    this.recurring = event.checked;
    if (!this.recurring) {
      this.task.recurrenceInterval = RecurrenceInterval.NONE;
    }
  }

  // Completion date

  /**
   * Handles completion date changes
   * @param {Date} value completion date
   */
  onCompletionDateChanged(value: Date) {
    this.task.completionDate = value;
    this.notify();
  }

  // Due date

  /**
   * Handles due date changes
   * @param {Date} value due date
   */
  onDueDateChanged(value: Date) {
    this.task.dueDate = value;
  }

  // Recurrence interval

  /**
   * Handles recurrence interval changes
   * @param {RecurrenceInterval} value recurrence interval
   */
  onRecurrenceIntervalChanged(value: RecurrenceInterval) {
    this.task.recurrenceInterval = value;
    this.notify();
  }

  // Priority

  /**
   * Handles hover over priority flags
   * @param {number} priority priority hovered over
   */
  onHoverFlag(priority: number) {
    if (!this.readonly) {
      this.colorsFlags[priority] = this.colorsPriorities[priority];
    }
  }

  /**
   * Handles leave of priority flags
   */
  onLeaveFlag() {
    if (!this.readonly) {
      this.initializePriority();
      this.notify();
    }
  }

  /**
   * Handles click on priority flags
   * @param {number} priority priority clicked on
   */
  onClickFlag(priority: number) {
    if (!this.readonly) {
      this.task.priority = priority;

      if (priority === 4) {
        this.colorsFlags = [
          '#cfd8dc',
          '#cfd8dc',
          '#cfd8dc',
        ];
      }
      this.notify();
    }
  }

  // Project

  /**
   * Handles project changes
   * @param {Project} project project value
   */
  onProjectChanged(project: Project) {
    this.project = project;
    this.task.projectId = project.id;
    this.notify();
  }

  // Delegated to

  /**
   * Handles delegated to changes
   * @param delegatedTo delegated to value
   */
  onDelegatedToChanged(delegatedTo: Person) {
    this.delegatedTo = delegatedTo;
    this.task.delegatedToId = delegatedTo.id;
    this.notify();
  }

  // Tags

  /**
   * Handles tag changes
   * @param tags new tags
   */
  onTagsChanged(tags: string[]) {
    this.tags = tags.map(t => {
      return new Tag(t, true);
    });
    this.notify();
  }

  // Description

  /**
   * Handles description changes
   * @param text text
   */
  onDescriptionChanged(text: string) {
    this.task.description.value = text;
    this.notify();
  }

  //
  // Notifications
  //

  private notify() {
    this.taskEventEmitter.emit({task: this.task, project: this.project, delegatedTo: this.delegatedTo, tags: this.tags});
  }
}
