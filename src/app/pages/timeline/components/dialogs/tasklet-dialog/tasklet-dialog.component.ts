import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Tasklet} from 'app/core/entity/model/tasklet.model';
import {DialogMode} from 'app/core/entity/model/dialog-mode.enum';
import {TaskletType} from 'app/core/entity/model/tasklet-type.enum';
import {Tag} from 'app/core/entity/model/tag.model';
import {Person} from 'app/core/entity/model/person.model';
import {ConfirmationDialogComponent} from 'app/ui/confirmation-dialog/confirmation-dialog/confirmation-dialog.component';
import {Task} from 'app/core/entity/model/task.model';
import {Description} from 'app/core/entity/model/description.model';
import {Action} from 'app/core/entity/model/action.enum';
import {SuggestionService} from 'app/core/entity/services/suggestion.service';
import {MeetingMinuteItem} from 'app/core/entity/model/meeting-minutes/meeting-minute-item.model';
import {PersonService} from 'app/core/entity/services/person.service';
import {DailyScrumItem} from '../../../../../core/entity/model/daily-scrum/daily-scrum-item.model';

/**
 * Displays tasklet dialog
 */
@Component({
  selector: 'app-tasklet-dialog',
  templateUrl: './tasklet-dialog.component.html',
  styleUrls: ['./tasklet-dialog.component.scss'],
})
export class TaskletDialogComponent implements OnInit, OnDestroy {

  /** Enum of dialog modes */
  public modeType = DialogMode;
  /** Current dialog mode */
  public mode: DialogMode = DialogMode.NONE;

  /** Dialog title */
  dialogTitle = '';

  /** Tasklet to be displayed */
  tasklet: Tasklet;
  /** Description of previous tasklet */
  previousDescription = new Description();

  /** Temporarily displayed task */
  task: Task;
  /** Temporarily displayed tags */
  tags: Tag[] = [];
  /** Temporarily displayed persons */
  persons: Person[] = [];

  /** Task options */
  taskOptions: string[];
  /** Tag options */
  tagOptions: string[];
  /** Person options */
  personOptions: string[];
  /** Person option representing the user */
  myselfOption: string;

  /** Enum of dialog modes */
  taskletType = TaskletType;

  /**
   * Constructor
   * @param personService person service
   * @param suggestionService suggestion service
   * @param {MatDialogRef<ConfirmationDialogComponent>} dialogRef dialog reference
   * @param data dialog data
   */
  constructor(private personService: PersonService,
              private suggestionService: SuggestionService,
              public dialogRef: MatDialogRef<TaskletDialogComponent>,
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
  }

  ngOnDestroy() {
    this.handleTaskletChanges();
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
    this.tasklet = this.data.tasklet;
    this.task = this.data.task;
    this.tags = this.data.tags;
    this.persons = this.data.persons;
    this.previousDescription = this.data.previousDescription;
  }

  /**
   * Initializes options
   */
  private initializeOptions() {
    this.taskOptions = Array.from(this.suggestionService.taskOptions.values()).sort((t1, t2) => {
      return new Date(t2.modificationDate).getTime() > new Date(t1.modificationDate).getTime() ? 1 : -1;
    }).map(t => {
      return t.name;
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
    this.myselfOption = this.personService.myself.name;
  }

  //
  // Actions
  //

  /**
   * Handles tasklet type changes
   * @param type tasklet type
   */
  onTaskletTypeChanged(type: TaskletType) {
    this.tasklet.type = type;
  }

  /**
   * Handles task changes
   * @param task new task
   */
  onTaskChanged(task: Task) {
    this.task = task;
  }

  /**
   * Handles description changes
   * @param description new description
   */
  onDescriptionChanged(description: Description) {
    this.tasklet.description = description;
  }

  /**
   * Handles meeting minute item updates
   * @param meetingMinuteItems meeting minute items
   */
  onMeetingMinuteItemsUpdated(meetingMinuteItems: MeetingMinuteItem[]) {
    this.tasklet.meetingMinuteItems = meetingMinuteItems;
  }

  /**
   * Handles pomodoro task changes
   * @param pomodoroTask new pomodoro task
   */
  onPomodoroTaskChanged(pomodoroTask: Description) {
    this.tasklet.pomodoroTask = pomodoroTask;
  }

  /**
   * Handles daily scrum item updates
   * @param dailyScrumItems daily scrum items
   */
  onDailyScrumItemsUpdated(dailyScrumItems: DailyScrumItem[]) {
    this.tasklet.dailyScrumItems = dailyScrumItems;
  }

  /**
   * Handles tag changes
   * @param tags new tags
   */
  onTagsChanged(tags: string[]) {
    this.tags = tags.map(t => {
      return new Tag(t, true);
    });
  }

  /**
   * Handles person changes
   * @param persons new persons
   */
  onPersonsChanged(persons: string[]) {
    this.persons = persons.map(p => {
      return new Person(p, true);
    });
  }

  /**
   * Handles key down event
   * @param event
   */
  onKeyDown(event: any) {
    const KEY_CODE_ENTER = 13;
    if (event.keyCode === KEY_CODE_ENTER && event.ctrlKey) {
      this.handleTaskletChanges();
    }
  }

  /**
   * Handles the creation, updating or continuation of a task
   */
  private handleTaskletChanges() {
    switch (this.mode) {
      case DialogMode.ADD: {
        this.addTasklet();
        break;
      }
      case DialogMode.UPDATE: {
        this.updateTasklet();
        break;
      }
      case DialogMode.CONTINUE: {
        this.continueTasklet();
        break;
      }
      case DialogMode.DELETE: {
        break;
      }
      case DialogMode.NONE: {
        break;
      }
    }
  }

  //
  // Button actions
  //

  /**
   * Handles click on add button
   */
  addTasklet() {
    this.tags = this.aggregateTags(this.tasklet);
    this.persons = this.aggregatePersons(this.tasklet);

    this.dialogRef.close({
      action: Action.ADD,
      tasklet: this.tasklet,
      task: this.task,
      tags: this.tags,
      persons: this.persons
    });
  }

  /**
   * Handles click on update button
   */
  updateTasklet() {
    this.tags = this.aggregateTags(this.tasklet);
    this.persons = this.aggregatePersons(this.tasklet);

    this.dialogRef.close({
      action: Action.UPDATE,
      tasklet: this.tasklet,
      task: this.task,
      tags: this.tags,
      persons: this.persons
    });
  }

  /**
   * Handles click on delete button
   */
  deleteTasklet() {
    this.mode = DialogMode.DELETE;
    this.dialogRef.close({action: Action.DELETE, tasklet: this.tasklet});
  }

  /**
   * Handles click on fullscreen button
   */
  goToFullscreen() {
    this.mode = DialogMode.NONE;
    this.dialogRef.close({
      action: Action.FULLSCREEN,
      tasklet: this.tasklet,
      task: this.task,
      tags: this.tags,
      persons: this.persons
    });
  }

  /**
   * Handles click on pomodoro start button
   */
  startPomodoro() {
    this.mode = DialogMode.NONE;
    this.dialogRef.close({
      action: Action.POMODORO_START,
      tasklet: this.tasklet,
      task: this.task,
      tags: this.tags,
      persons: this.persons
    });
  }

  /**
   * Sends meeting minutes via mail
   */
  sendMeetingMinutes() {
    this.tags = this.aggregateTags(this.tasklet);
    this.persons = this.aggregatePersons(this.tasklet);

    this.dialogRef.close({
      action: Action.SEND_MAIL_MEETING_MINUTES,
      tasklet: this.tasklet,
      task: this.task,
      tags: this.tags,
      persons: this.persons
    });
  }

  /**
   * Sends daily scrum summary via mail
   */
  sendDailyScrumSummary() {
    this.tags = this.aggregateTags(this.tasklet);
    this.persons = this.aggregatePersons(this.tasklet);

    this.dialogRef.close({
      action: Action.SEND_MAIL_DAILY_SCRUM_SUMMARY,
      tasklet: this.tasklet,
      task: this.task,
      tags: this.tags,
      persons: this.persons
    });
  }

  /**
   * Handles click on continue button
   */
  continueTasklet() {
    this.dialogRef.close({action: Action.ADD, tasklet: this.tasklet, tags: this.tags, task: this.task});
  }

  //
  // Helpers
  //

  /**
   * Determines whether the displayed tasklet can be assigned to a task
   * @param tasklet tasklet
   */
  public canBeAssignedToTask(tasklet: Tasklet): boolean {
    return tasklet != null && (tasklet.type === TaskletType.ACTION
      || tasklet.type === TaskletType.POMODORO
      || tasklet.type === TaskletType.MEETING
      || tasklet.type === TaskletType.CALL
      || tasklet.type === TaskletType.MAIL
      || tasklet.type === TaskletType.CHAT
      || tasklet.type === TaskletType.DEVELOPMENT
      || tasklet.type === TaskletType.CODING
      || tasklet.type === TaskletType.DEBUGGING
      || tasklet.type === TaskletType.DOCUMENTATION
      || tasklet.type === TaskletType.REVIEW
      || tasklet.type === TaskletType.TESTING
      || tasklet.type === TaskletType.IDEA);
  }

  /**
   * Determines whether the displayed tasklet contains a description
   * @param tasklet tasklet
   */
  public containsDescription(tasklet: Tasklet): boolean {
    return tasklet != null && (tasklet.type === TaskletType.ACTION
      || (tasklet.type === TaskletType.MEETING
        && tasklet.description != null
        && tasklet.description.value != null
        && tasklet.description.value !== '')
      || (tasklet.type === TaskletType.CALL
        && tasklet.description != null
        && tasklet.description.value != null
        && tasklet.description.value !== '')
      || tasklet.type === TaskletType.MAIL
      || tasklet.type === TaskletType.CHAT
      || tasklet.type === TaskletType.DEVELOPMENT
      || tasklet.type === TaskletType.CODING
      || tasklet.type === TaskletType.DEBUGGING
      || tasklet.type === TaskletType.DOCUMENTATION
      || tasklet.type === TaskletType.REVIEW
      || tasklet.type === TaskletType.TESTING);
  }

  /**
   * Determines whether the displayed tasklet contains meeting minutes
   * @param tasklet tasklet
   */
  public containsMeetingMinutes(tasklet: Tasklet) {
    return tasklet != null && (tasklet.type === TaskletType.MEETING
      || tasklet.type === TaskletType.CALL
      || tasklet.type === TaskletType.MAIL
      || tasklet.type === TaskletType.CHAT);
  }

  /**
   * Determines whether the displayed tasklet contains pomodoro tasks
   * @param tasklet tasklet
   */
  public containsPomodoroTask(tasklet: Tasklet) {
    return tasklet != null && tasklet.type === TaskletType.POMODORO;
  }

  /**
   * Determines whether a given tasklet contains persons
   * @param tasklet tasklet
   */
  public containsPersons(tasklet: Tasklet): boolean {
    return tasklet != null && (tasklet.type === TaskletType.MEETING
      || tasklet.type === TaskletType.CALL
      || tasklet.type === TaskletType.MAIL
      || tasklet.type === TaskletType.CHAT);
  }

  /**
   * Determines whether a given tasklet contains tags
   * @param tasklet tasklet
   */
  public containsTags(tasklet: Tasklet): boolean {
    return tasklet != null && (tasklet.type !== TaskletType.LUNCH_BREAK
      && tasklet.type !== TaskletType.FINISHING_TIME
      && tasklet.type !== TaskletType.UNSPECIFIED);
  }

  /**
   * Determines whether a given tasklet can be created
   * @param tasklet tasklet
   */
  public canBeCreated(tasklet: Tasklet): boolean {
    return tasklet != null && (tasklet.type !== TaskletType.LUNCH_BREAK
      && tasklet.type !== TaskletType.FINISHING_TIME);
  }

  /**
   * Determines whether a given tasklet can be updated
   * @param tasklet tasklet
   */
  public canBeUpdated(tasklet: Tasklet): boolean {
    return tasklet != null && (tasklet.type !== TaskletType.LUNCH_BREAK
      && tasklet.type !== TaskletType.FINISHING_TIME);
  }

  /**
   * Determines whether the displayed tasklet contains a previous description
   * @param tasklet tasklet
   */
  public containsPreviousDescription(tasklet: Tasklet): boolean {
    return this.previousDescription != null;
  }

  // Tags

  /**
   * Aggregates tags
   * @param {Tasklet} tasklet
   * @returns {Tag[]}
   */
  private aggregateTags(tasklet: Tasklet): Tag[] {
    const aggregatedTags = new Map<string, Tag>();

    // Concatenate
    this.tags.forEach(t => {
      aggregatedTags.set(t.id, t);
    });
    this.inferTags(tasklet).forEach(t => {
      aggregatedTags.set(t.id, t);
    });

    return Array.from(aggregatedTags.values());
  }

  /**
   * Infers tags from a tasklet's description
   * @param {Tasklet} tasklet
   * @returns {Tag[]}
   */
  private inferTags(tasklet: Tasklet): Tag[] {
    const inferredTags = new Map<string, Tag>();

    if (tasklet.description != null && tasklet.description.value != null) {
      tasklet.description.value.split('\n').forEach(line => {
        line.split(' ').forEach(word => {
          if (word.startsWith('#') &&
            word.length > 1 &&
            word.charAt(1) !== '#') {
            const hashtag = word.replace('#', '');
            inferredTags.set(hashtag, new Tag(hashtag));
          }
        });
      });
    }

    return Array.from(inferredTags.values());
  }

  // Persons

  /**
   * Aggregates persons
   * @param {Tasklet} tasklet
   * @returns {Person[]}
   */
  private aggregatePersons(tasklet: Tasklet): Person[] {
    const aggregatedPersons = new Map<string, Person>();

    // Concatenate
    this.persons.forEach(p => {
      aggregatedPersons.set(p.id, p);
    });
    this.inferPersons(tasklet).forEach(p => {
      aggregatedPersons.set(p.id, p);
    });

    return Array.from(aggregatedPersons.values());
  }

  /**
   * Infers persons from a tasklet's description
   * @param {Tasklet} tasklet
   * @returns {Person[]}
   */
  private inferPersons(tasklet: Tasklet): Person[] {
    const inferredPersons = new Map<string, Person>();

    if (tasklet.description != null && tasklet.description.value != null) {
      tasklet.description.value.split('\n').forEach(line => {
        line.split(' ').forEach(word => {
          if (word.startsWith('@')) {
            const mention = word.replace('@', '').replace('_', ' ');
            inferredPersons.set(mention, new Person(mention));
          }
        });
      });
    }

    return Array.from(inferredPersons.values());
  }
}
