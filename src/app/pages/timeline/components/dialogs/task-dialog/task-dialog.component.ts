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
      && this.task.recurrenceInterval !== RecurrenceInterval.UNSPECIFIED
      && this.task.recurrenceInterval !== RecurrenceInterval.NONE;
  }

  //
  // Actions
  //

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
   * Handles task changes
   */
  private handleTaskChanges() {
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

  /**
   * Handles click on add button
   */
  addTask() {
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
   * Handles click on update button
   */
  updateTask() {
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
   * Handles click on delete button
   */
  deleteTask() {
    this.mode = DialogMode.DELETE;
    this.dialogRef.close({action: Action.DELETE, task: this.task});
  }

  /**
   * Handles click on fullscreen button
   */
  goToFullscreen() {
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

  //
  // Helpers
  //

  // Tags

  /**
   * Aggregates tags
   * @param {Task} task
   * @returns {Tag[]}
   */
  private aggregateTags(task: Task): Tag[] {
    const aggregatedTags = new Map<string, Tag>();

    // Concatenate
    this.tags.forEach(t => {
      aggregatedTags.set(t.id, t);
    });

    return Array.from(aggregatedTags.values());
  }
}
