import {Component, Inject, OnInit} from '@angular/core';
import {Task} from '../../../../model/entities/task.model';
import {Project} from '../../../../model/entities/project.model';
import {DateAdapter, MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {DialogMode} from '../../../../model/ui/dialog-mode.enum';
import {Tag} from '../../../../model/entities/tag.model';
import {ConfirmationDialogComponent} from '../../other/confirmation-dialog/confirmation-dialog.component';
import {CloneService} from '../../../../services/util/clone.service';
import {DateService} from '../../../../services/util/date.service';
import {Action} from '../../../../model/ui/action.enum';

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

  /** Reference to static method */
  getTimeString = DateService.getTimeString;
  /** Reference to static method */
  getDateString = DateService.getDateString;

  /**
   * Constructor
   * @param {DateAdapter<any>} adapter
   * @param {MatDialog} dialog dialog
   * @param {MatDialogRef<ConfirmationDialogComponent>} dialogRef dialog reference
   * @param data dialog data
   */
  constructor(private adapter: DateAdapter<any>,
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
    this.initializeInput();
    this.initializeTask();
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
   * @param {Project} project project inputFieldValue
   */
  onProjectChanged(project: Project) {
    this.project = project;
    this.task.projectId = project.id;
  }

  // Tags

  /**
   * Handles tag changes
   * @param {Tag[]} tags tags inputFieldValue
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
    this.dialogRef.close({action: Action.ADD, value: this.task, project: this.project, tags: this.tags});
  }

  /**
   * Handles click on update button
   */
  updateTask() {
    this.dialogRef.close({action: Action.UPDATE, value: this.task, project: this.project, tags: this.tags});
  }

  /**
   * Handles click on delete button
   */
  deleteTask() {
    this.dialogRef.close({action: Action.DELETE, value: this.task});
  }

  /**
   * Handles click on complete button
   */
  completeTask() {
    this.task.completionDate = new Date();
    this.dialogRef.close({action: Action.COMPLETE, value: this.task, project: this.project});
  }

  /**
   * Handles click on re-open button
   */
  reopenTask() {
    this.task.completionDate = null;
    this.dialogRef.close({action: Action.REOPEN, value: this.task, project: this.project});
  }
}
