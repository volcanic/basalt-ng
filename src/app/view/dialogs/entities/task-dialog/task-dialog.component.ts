import {Component, Inject, OnInit} from '@angular/core';
import {Task} from '../../../../model/entities/task.model';
import {Project} from '../../../../model/entities/project.model';
import {DateAdapter, MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {DIALOG_MODE} from '../../../../model/ui/dialog-mode.enum';
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

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent implements OnInit {

  DIALOG_MODE: typeof DIALOG_MODE = DIALOG_MODE;

  mode = DIALOG_MODE.NONE;
  dialogTitle = '';
  task: Task;

  inputDisabled = false;

  // Priority
  colorEmpty = '#cfd8dc';
  colorsPriorities = [
    '#90a4ae',
    '#78909c',
    '#607d8b',
    '#546e7a',
    '#455a64',
  ];
  colorsFlags = [
    '#cfd8dc',
    '#cfd8dc',
    '#cfd8dc',
    '#cfd8dc',
    '#cfd8dc'
  ];

  // Temporary
  project: Project;
  tags: Tag[] = [];

  constructor(private projectService: ProjectService,
              private taskService: TaskService,
              private taskletService: TaskletService,
              private tagService: TagService,
              private cloneService: CloneService,
              public dateService: DateService,
              private adapter: DateAdapter<any>,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<TaskDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.adapter.setLocale('en-GB');

    this.mode = this.data.mode;
    this.dialogTitle = this.data.dialogTitle;

    // Deep copy
    this.task = this.cloneService.cloneTask(this.data.task);

    this.inputDisabled = this.task.completionDate != null;

    this.initializePriority();
    this.initializeProject();
    this.initializeTags();
  }

  //
  // Initialization
  //

  initializePriority() {
    this.colorsFlags.forEach((flagColor, index) => {
      if (index <= this.task.priority) {
        this.colorsFlags[index] = this.colorsPriorities[this.task.priority];
      } else {
        this.colorsFlags[index] = this.colorEmpty;
      }
    });
  }

  initializeProject() {
    this.project = this.projectService.projects.get(this.task.projectId);
  }

  initializeTags() {
    this.tags = this.task.tagIds.map(id => {
      return this.tagService.getTagById(id);
    }).filter(tag => {
      return tag != null;
    });
  }

  //
  // Actions
  //

  public onKeyDown(event: any) {
    const KEY_CODE_ENTER = 13;
    if (event.keyCode === KEY_CODE_ENTER && event.ctrlKey) {
      this.updateTask();
    }
  }

  // Completion date

  onCompletionDateChanged(value: Date) {
    this.task.completionDate = value;
  }

  // Due date

  onDueDateChanged(value: Date) {
    this.task.dueDate = value;
  }

  // Priority

  onHoverFlag(priority: number) {
    if (!this.inputDisabled) {
      this.colorsFlags.forEach((flagColor, index) => {
        if (index <= priority) {
          this.colorsFlags[index] = this.colorsPriorities[priority];
        } else {
          this.colorsFlags[index] = this.colorEmpty;
        }
      });
    }
  }

  onLeaveFlag() {
    if (!this.inputDisabled) {
      this.initializePriority();
    }
  }

  onClickFlag(priority: number) {
    if (!this.inputDisabled) {
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

  onProjectChanged(project: Project) {
    this.project = project;
    this.task.projectId = project.id;
  }

  // Tags

  onTagsChanged(tags: Tag[]) {
    this.task.tagIds = tags.map(tag => {
      return tag.id;
    });
  }

  //
  // Button actions
  //

  addTask() {
    this.evaluateProject();
    this.task.tagIds = this.aggregateTagIds(this.task);
    this.dialogRef.close(this.task);
  }

  updateTask() {
    this.evaluateProject();
    this.task.tagIds = this.aggregateTagIds(this.task);
    this.dialogRef.close(this.task);
  }

  completeTask() {
    this.evaluateProject();
    this.task.completionDate = new Date();
    this.dialogRef.close(this.task);
  }

  reopenTask() {
    this.evaluateProject();
    this.task.completionDate = null;
    this.dialogRef.close(this.task);
  }

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
          this.taskService.deleteTask(result as Task);
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
        this.projectService.createProject(project);
      } else {
        this.task.projectId = null;
      }
    }
  }

  /**
   * Aggregates tag IDs
   * @param {Task} task
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
        this.tagService.createTag(tag);
      }

      return tag;
    }
  }
}
