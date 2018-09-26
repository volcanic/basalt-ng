import {Component, Inject, OnInit} from '@angular/core';
import {Task} from 'app/core/entity/model/task.model';
import {Project} from 'app/core/entity/model/project.model';
import {DateAdapter, MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSlideToggleChange} from '@angular/material';
import {Tag} from 'app/core/entity/model/tag.model';
import {DateService} from 'app/core/entity/services/date.service';
import {DialogMode} from 'app/core/entity/model/dialog-mode.enum';
import {SuggestionService} from 'app/core/entity/services/suggestion.service';
import {CloneService} from 'app/core/entity/services/clone.service';
import {Action} from 'app/core/entity/model/action.enum';
import {RecurrenceInterval} from '../../../../../core/entity/model/recurrence-interval.enum';

/**
 * Displays task dialog
 */
@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent implements OnInit {

  /** Enum of dialog modes */
  public modeType = DialogMode;
  /** Current media */
  public mode: DialogMode = DialogMode.NONE;

  /** Dialog title */
  dialogTitle = '';

  /** Task to be displayed */
  task: Task;
  /** Recurring */
  recurring = false;

  /** Readonly dialog if true */
  readonly = false;

  /** Color for no priority */
  colorEmpty = '#cfd8dc';
  /** Color for priorities */
  colorsPriorities = [
    '#90a4ae',
    '#78909c',
    '#607d8b',
    '#546e7a',
    '#455a64',
  ];
  /** Color for flags */
  colorsFlags = [
    '#cfd8dc',
    '#cfd8dc',
    '#cfd8dc',
    '#cfd8dc',
    '#cfd8dc'
  ];

  /** Project assigned to this task */
  project: Project;
  /** Tags assigned to this task */
  tags: Tag[] = [];

  /** Project options */
  projectOptions: string[];

  /** Reference to static method */
  getTimeString = DateService.getTimeString;
  /** Reference to static method */
  getDateString = DateService.getDateString;
  /** Reference to static method */
  getRecurrenceIntervalString = DateService.getRecurrenceIntervalString;

  /**
   * Constructor
   * @param suggestionService suggestion service
   * @param {DateAdapter<any>} adapter
   * @param {MatDialog} dialog dialog
   * @param {MatDialogRef<ConfirmationDialogComponent>} dialogRef dialog reference
   * @param data dialog data
   */
  constructor(private suggestionService: SuggestionService,
              private adapter: DateAdapter<any>,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<TaskDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.initializeData();
    this.initializeOptions();
    this.initializeInput();
    this.initializeTask();
    this.initializeRecurring();
    this.initializePriority();
  }

  //
  // Initialization
  //

  /**
   * Initializes data
   */
  private initializeData() {
    this.mode = this.data.mode;
    this.dialogTitle = this.data.dialogTitle;
    this.task = this.data.task;
    this.project = this.data.project;
    this.tags = this.data.tags;
  }

  /**
   * Initializes options
   */
  private initializeOptions() {
    this.projectOptions = Array.from(this.suggestionService.projectOptions.values()).sort((p1, p2) => {
      return new Date(p2.modificationDate).getTime() > new Date(p1.modificationDate).getTime() ? 1 : -1;
    }).map(p => {
      return p.name;
    });
  }

  /**
   * Initializes input
   */
  private initializeInput() {
    this.adapter.setLocale('en-GB');
    this.readonly = this.task.completionDate != null;
  }

  /**
   * Initializes task
   */
  private initializeTask() {
    this.task = CloneService.cloneTask(this.data.task);
  }

  /**
   * Initializes recurring flag
   */
  private initializeRecurring() {
    this.recurring = this.task.recurrenceInterval != null
      && this.task.recurrenceInterval != RecurrenceInterval.UNSPECIFIED
      && this.task.recurrenceInterval != RecurrenceInterval.NONE;
  }

  /**
   * Initializes priority
   */
  private initializePriority() {
    this.colorsFlags.forEach((flagColor, index) => {
      if (index <= this.task.priority) {
        this.colorsFlags[index] = this.colorsPriorities[this.task.priority];
      } else {
        this.colorsFlags[index] = this.colorEmpty;
      }
    });
  }

  //
  // Actions
  //

  /**
   * Handles key down event
   * @param event event
   */
  onKeyDown(event: any) {
    const KEY_CODE_ENTER = 13;
    if (event.keyCode === KEY_CODE_ENTER && event.ctrlKey) {
      switch (this.mode) {
        case DialogMode.ADD: {
          this.addTask();
          break;
        }
        case DialogMode.UPDATE: {
          this.updateTask();
          break;
        }
      }

    }
  }

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
  }

  // Priority

  /**
   * Handles hover over priority flags
   * @param {number} priority priority hovered over
   */
  onHoverFlag(priority: number) {
    if (!this.readonly) {
      this.colorsFlags.forEach((flagColor, index) => {
        if (index <= priority) {
          this.colorsFlags[index] = this.colorsPriorities[priority];
        } else {
          this.colorsFlags[index] = this.colorEmpty;
        }
      });
    }
  }

  /**
   * Handles leave of priority flags
   */
  onLeaveFlag() {
    if (!this.readonly) {
      this.initializePriority();
    }
  }

  /**
   * Handles click on priority flags
   * @param {number} priority priority clicked on
   */
  onClickFlag(priority: number) {
    if (!this.readonly) {
      this.task.priority = priority;

      if (priority === -1) {
        this.colorsFlags = [
          '#cfd8dc',
          '#cfd8dc',
          '#cfd8dc',
          '#cfd8dc',
          '#cfd8dc'
        ];
      }
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
  }

  // Tags

  /**
   * Handles tag changes
   * @param {Tag[]} tags tags value
   */
  onTagsChanged(tags: Tag[]) {
    this.task.tagIds = tags.map(tag => {
      return tag.id;
    });
  }

  //
  // Button actions
  //

  /**
   * Handles click on add button
   */
  addTask() {
    this.dialogRef.close({action: Action.ADD, task: this.task, project: this.project, tags: this.tags});
  }

  /**
   * Handles click on update button
   */
  updateTask() {
    this.dialogRef.close({action: Action.UPDATE, task: this.task, project: this.project, tags: this.tags});
  }

  /**
   * Handles click on delete button
   */
  deleteTask() {
    this.dialogRef.close({action: Action.DELETE, task: this.task});
  }

  /**
   * Handles click on complete button
   */
  completeTask() {
    this.task.completionDate = new Date();
    this.dialogRef.close({action: Action.COMPLETE, task: this.task, project: this.project});
  }

  /**
   * Handles click on re-open button
   */
  reopenTask() {
    this.task.completionDate = null;
    this.dialogRef.close({action: Action.REOPEN, task: this.task, project: this.project});
  }
}
