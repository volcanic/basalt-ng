import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Task} from 'app/core/entity/model/task.model';
import {Project} from 'app/core/entity/model/project.model';
import {DateAdapter, MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {Tag} from 'app/core/entity/model/tag.model';
import {DialogMode} from 'app/core/entity/model/dialog-mode.enum';
import {SuggestionService} from 'app/core/entity/services/suggestion.service';
import {CloneService} from 'app/core/entity/services/clone.service';
import {Action} from 'app/core/entity/model/action.enum';
import {RecurrenceInterval} from '../../../../../core/entity/model/recurrence-interval.enum';
import {Person} from '../../../../../core/entity/model/person.model';
import {TaskDisplayAspect} from '../../../../../core/entity/services/task/task-display.service';
import {TaskService} from '../../../../../core/entity/services/task/task.service';

/**
 * Displays task dialog
 */
@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent implements OnInit, OnDestroy {

  /** Enum of dialog modes */
  public modeType = DialogMode;
  /** Current media */
  public mode: DialogMode = DialogMode.NONE;

  /** Dialog title */
  dialogTitle = '';

  /** Task to be displayed */
  task: Task;
  /** Task as passed to this dialog */
  taskBefore: Task;
  /** Recurring */
  recurring = false;

  /** Readonly dialog if true */
  readonly = false;

  /** Project assigned to this task */
  project: Project;
  /** Delegated to affiliated to this task */
  delegatedTo: Person;
  /** Tags assigned to this task */
  tags: Tag[] = [];

  /** Project options */
  projectOptions: string[];
  /** Tag options */
  tagOptions: string[];
  /** Person options */
  personOptions: string[];

  /** Enum for action types */
  actionType = Action;
  /** Enum of display aspects */
  displayAspectType = TaskDisplayAspect;

  /**
   * Constructor
   * @param taskService task service
   * @param suggestionService suggestion service
   * @param adapter date adapter
   * @param dialog dialog
   * @param dialogRef dialog reference
   * @param data dialog data
   */
  constructor(private taskService: TaskService,
              private suggestionService: SuggestionService,
              private adapter: DateAdapter<any>,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<TaskDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeData();
    this.initializeOptions();
    this.initializeInput();
    this.initializeTask();
    this.initializeRecurring();
  }

  /**
   * Handles on-destroy lifecycle phase
   */
  ngOnDestroy() {
    this.handleTaskChanges();
  }

  /**
   * Initializes data
   */
  private initializeData() {
    this.mode = this.data.mode;
    this.dialogTitle = this.data.dialogTitle;
    this.task = this.data.task;
    this.project = this.data.project;
    this.delegatedTo = this.data.delegatedTo;
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
    this.tagOptions = Array.from(this.suggestionService.tagOptions.values()).sort((t1, t2) => {
      return new Date(t2.modificationDate).getTime() > new Date(t1.modificationDate).getTime() ? 1 : -1;
    }).map(t => {
      return t.name;
    });
    this.personOptions = Array.from(this.suggestionService.personOptions.values()).sort((p1, p2) => {
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
    this.readonly = this.task != null && this.task.completionDate != null;
  }

  /**
   * Initializes task
   */
  private initializeTask() {
    this.task = CloneService.cloneTask(this.data.task);
    this.taskBefore = CloneService.cloneTask(this.data.task);
  }

  /**
   * Initializes recurring flag
   */
  private initializeRecurring() {
    this.recurring = this.task != null && this.task.recurrenceInterval != null
      && this.task.recurrenceInterval !== RecurrenceInterval.UNSPECIFIED
      && this.task.recurrenceInterval !== RecurrenceInterval.NONE;
  }

  //
  // Actions
  //

  /**
   * Handles task name changes
   * @param event event
   */
  onTaskNameChanged(event: { task: Task }) {
    this.task = event.task;
  }

  /**
   * Handles task changes
   * @param event event
   */
  onTaskChanged(event: { task: Task, project?: Project, delegatedTo?: Person, tags?: Tag[] }) {
    this.task = event.task;
    this.project = event.project;
    this.delegatedTo = event.delegatedTo;
    this.tags = event.tags;
  }

  /**
   * Handles key down event
   * @param event event
   */
  onKeyDown(event: any) {
    const KEY_CODE_ENTER = 13;
    if (event.keyCode === KEY_CODE_ENTER && event.ctrlKey) {
      this.handleTaskChanges();
    }
  }

  //
  // Button actions
  //

  /**
   * Handles click on button
   * @param action action
   */
  onButtonClicked(action: Action) {
    switch (action) {
      case Action.ADD: {
        this.dialogRef.close();
        break;
      }
      case Action.UPDATE: {
        this.dialogRef.close();
        break;
      }
      case Action.CONTINUE: {
        this.dialogRef.close();
        break;
      }
      case Action.DELETE: {
        this.deleteTask();
        break;
      }
      case Action.FULLSCREEN: {
        this.goToFullscreen();
        break;
      }
      case Action.REOPEN: {
        this.reopenTask();
        break;
      }
      case Action.COMPLETE: {
        this.completeTask();
        break;
      }
    }
  }

  //
  //
  //

  /**
   * Handles task changes
   */
  private handleTaskChanges() {
    if (this.hasChanged()) {
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

  /**
   * Determines task has changed
   */
  private hasChanged(): boolean {
    return JSON.stringify(this.task) !== JSON.stringify(this.taskBefore);
  }

  /**
   * Adds a task
   */
  private addTask() {
    this.tags = this.aggregateTags(this.task);

    this.dialogRef.close({
      action: Action.ADD,
      task: this.task,
      project: this.project,
      delegatedTo: this.delegatedTo,
      tags: this.tags
    });
  }

  /**
   * Updates a task
   */
  private updateTask() {
    this.tags = this.aggregateTags(this.task);

    this.dialogRef.close({
      action: Action.UPDATE,
      task: this.task,
      project: this.project,
      delegatedTo: this.delegatedTo,
      tags: this.tags
    });
  }

  /**
   * Deletes a task
   */
  private deleteTask() {
    this.mode = DialogMode.DELETE;
    this.dialogRef.close({action: Action.DELETE, task: this.task});
  }

  /**
   * Goes to fullscreen
   */
  private goToFullscreen() {
    this.mode = DialogMode.NONE;
    this.dialogRef.close({
      action: Action.FULLSCREEN,
      task: this.task,
      project: this.project,
      delegatedTo: this.delegatedTo,
      tags: this.tags
    });
  }

  /**
   * Completes a task
   */
  private completeTask() {
    this.task.completionDate = new Date();
    this.dialogRef.close({action: Action.COMPLETE, task: this.task, project: this.project});
  }

  /**
   * Re-opens a task
   */
  private reopenTask() {
    this.task.completionDate = null;
    this.dialogRef.close({action: Action.REOPEN, task: this.task, project: this.project});
  }

  //
  // Helpers
  //

  /**
   * Determines whether the displayed task contains a specific display aspect
   * @param displayAspect display aspect
   * @param task task
   */
  public containsDisplayAspect(displayAspect: TaskDisplayAspect, task: Task): boolean {
    return this.taskService.containsDisplayAspect(displayAspect, task);
  }

  // Tags

  /**
   * Aggregates tags
   * @param task task
   * @returns tags
   */
  private aggregateTags(task: Task): Tag[] {
    const aggregatedTags = new Map<string, Tag>();

    // Concatenate
    this.tags.forEach(t => {
      aggregatedTags.set(t.name, t);
    });

    return Array.from(aggregatedTags.values());
  }
}
