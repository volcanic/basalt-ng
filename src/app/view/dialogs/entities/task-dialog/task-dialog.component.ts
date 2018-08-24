import {Component, Inject, OnInit} from '@angular/core';
import {Task} from '../../../../model/entities/task.model';
import {Project} from '../../../../model/entities/project.model';
import {DateAdapter, MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {DialogMode} from '../../../../model/ui/dialog-mode.enum';
import {ProjectService} from '../../../../services/entities/project.service';
import {Tag} from '../../../../model/entities/tag.model';
import {Tasklet} from '../../../../model/entities/tasklet.model';
import {ConfirmationDialogComponent} from '../../other/confirmation-dialog/confirmation-dialog.component';
import {InformationDialogComponent} from '../../other/information-dialog/information-dialog.component';
import {TaskletService} from '../../../../services/entities/tasklet.service';
import {TaskService} from '../../../../services/entities/task.service';
import {CloneService} from '../../../../services/util/clone.service';
import {DateService} from '../../../../services/util/date.service';
import {TagService} from '../../../../services/entities/tag.service';
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

  /** Temporary project */
  project: Project;
  /** Temporary tags */
  tags: Tag[] = [];

  /** Reference to static method */
  getTimeString = DateService.getTimeString;
  /** Reference to static method */
  getDateString = DateService.getDateString;

  /**
   * Constructor
   * @param {ProjectService} projectService
   * @param {TaskService} taskService
   * @param {TaskletService} taskletService
   * @param {TagService} tagService
   * @param {CloneService} cloneService
   * @param {DateAdapter<any>} adapter
   * @param {DateService} dateService date service
   * @param {MatDialog} dialog dialog
   * @param {MatDialogRef<ConfirmationDialogComponent>} dialogRef dialog reference
   * @param data dialog data
   */
  constructor(private projectService: ProjectService,
              private taskService: TaskService,
              private taskletService: TaskletService,
              private tagService: TagService,
              private cloneService: CloneService,
              private adapter: DateAdapter<any>,
              public dateService: DateService,
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
    this.initializeProject();
    this.initializeTags();
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

  /**
   * Initializes project
   */
  private initializeProject() {
    this.project = this.projectService.projects.get(this.task.projectId);
  }

  /**
   * Initializes tags
   */
  private initializeTags() {
    this.tags = this.task.tagIds.map(id => {
      return this.tagService.getTagById(id);
    }).filter(tag => {
      return tag != null;
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
    this.evaluateProject();
    this.task.tagIds = this.aggregateTagIds(this.task);
    this.dialogRef.close({action: Action.ADD, value: this.task});
  }

  /**
   * Handles click on update button
   */
  updateTask() {
    this.evaluateProject();
    this.task.tagIds = this.aggregateTagIds(this.task);
    console.log("updateTask");
    this.dialogRef.close({action: Action.UPDATE, value: this.task});
  }

  /**
   * Handles click on complete button
   */
  completeTask() {
    this.evaluateProject();
    this.task.completionDate = new Date();
    this.dialogRef.close({action: Action.COMPLETE, value: this.task});
  }

  /**
   * Handles click on re-open button
   */
  reopenTask() {
    this.evaluateProject();
    this.task.completionDate = null;
    this.dialogRef.close({action: Action.REOPEN, value: this.task});
  }

  /**
   * Handles click on delete button
   */
  deleteTask() {
    const references = Array.from(this.taskletService.tasklets.values()).filter((tasklet: Tasklet) => {
      return tasklet.taskId === this.task.id;
    }).length;

    if (references > 0) {
      this.dialog.open(InformationDialogComponent, <MatDialogConfig>{
        disableClose: false,
        data: {
          title: 'Cannot delete task',
          text: `There are still ${references} tasklets associated with this task.`,
          action: 'Okay',
          value: this.task
        }
      });
    } else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, <MatDialogConfig>{
        disableClose: false,
        data: {
          title: 'Delete task',
          text: 'Do you want to delete this task?',
          action: 'Delete',
          value: this.task
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
          this.taskService.deleteTask(result as Task).then(() => {
          });
          this.dialogRef.close(null);
        }
      });
    }
  }

  //
  // Helpers
  //

  /**
   * Determines whether the selected project already exists, otherwise creates a new one
   */
  private evaluateProject() {
    if (this.project != null) {
      let project = this.projectService.getProjectByName(this.project.name);

      if (project != null) {
        // Existing project
        this.task.projectId = project.id;
      } else if (this.project.name != null && this.project.name !== '') {
        // New project
        project = new Project(this.project.name, true);
        this.task.projectId = project.id;
        this.projectService.createProject(project).then(() => {
        });
      } else {
        this.task.projectId = null;
      }
    }
  }

  /**
   * Aggregates tag IDs
   * @param {Task} task task to aggregate tag IDs of
   * @returns {string[]}
   */
  private aggregateTagIds(task: Task): string[] {
    const aggregatedTagIds = new Map<string, string>();

    // Concatenate
    this.tags.forEach(t => {
      const tag = this.evaluateTag(t.name);
      aggregatedTagIds.set(tag.id, tag.id);
    });

    return Array.from(aggregatedTagIds.values());
  }

  /**
   * Gets an existing tag by name or creates a new one if it does not exist
   * @param name tag name
   */
  private evaluateTag(name: string): Tag {
    if (name != null) {
      let tag = this.tagService.getTagByName(name);

      if (tag == null) {
        tag = new Tag(name, true);
        this.tagService.createTag(tag).then(() => {
        });
      }

      return tag;
    }
  }
}
