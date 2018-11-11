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
import {DisplayAspect} from '../../../../../core/entity/services/tasklet/tasklet-display.service';
import {TaskletService} from '../../../../../core/entity/services/tasklet.service';

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
  previousDescription: Description;
  /** Will-do daily scrum activities of previous tasklet */
  previousDailyScrumItems: DailyScrumItem[];

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

  /** Enum of tasklet types */
  taskletType = TaskletType;
  /** Enum of display aspects */
  displayAspectType = DisplayAspect;

  /**
   * Constructor
   * @param personService person service
   * @param suggestionService suggestion service
   * @param taskletService tasklet service
   * @param {MatDialogRef<ConfirmationDialogComponent>} dialogRef dialog reference
   * @param data dialog data
   */
  constructor(private personService: PersonService,
              private suggestionService: SuggestionService,
              private taskletService: TaskletService,
              public dialogRef: MatDialogRef<TaskletDialogComponent>,
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
  }

  /**
   * Handles on-destroy lifecycle phase
   */
  ngOnDestroy() {
    // this.handleTaskletChanges();
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
    this.task = this.data.task != null ? this.data.task : new Task();
    this.tags = this.data.tags != null ? this.data.tags : [];
    this.persons = this.data.persons != null ? this.data.persons : [];
    this.previousDescription = this.data.previousDescription;
    this.previousDailyScrumItems = this.data.previousDailyScrumItems;
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
   * Handles task name changes
   * @param taskName new task name
   */
  onTaskNameChanged(taskName: string) {
    this.task.name = taskName;
  }

  /**
   * Handles description changes
   * @param text text
   */
  onDescriptionChanged(text: string) {
    this.tasklet.description.value = text;
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
   * @param text text
   */
  onPomodoroTaskChanged(text: string) {
    this.tasklet.pomodoroTask.value = text;
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
        if (this.containsDisplayAspect(DisplayAspect.CAN_BE_CREATED, this.tasklet)) {
          this.addTasklet();
        }
        break;
      }
      case DialogMode.UPDATE: {
        if (this.containsDisplayAspect(DisplayAspect.CAN_BE_UPDATED, this.tasklet)) {
          this.updateTasklet();
        }
        break;
      }
      case DialogMode.CONTINUE: {
        if (this.containsDisplayAspect(DisplayAspect.CAN_BE_CONTINUED, this.tasklet)) {
          this.continueTasklet();
        }
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
   * Determines whether the displayed tasklet contains a specific display aspect
   * @param displayAspect display aspect
   * @param tasklet tasklet
   */
  public containsDisplayAspect(displayAspect: DisplayAspect, tasklet: Tasklet): boolean {
    return this.taskletService.containsDisplayAspect(displayAspect, tasklet);
  }

  /**
   * Determines whether the displayed tasklet contains a previous description
   * @param tasklet tasklet
   */
  public containsPreviousDescription(tasklet: Tasklet): boolean {
    return this.previousDescription != null && this.previousDescription.value !== '';
  }

  /**
   * Determines whether the displayed tasklet contains previous scrum items
   * @param tasklet tasklet
   */
  public containsPreviousDailyScrumItems(tasklet: Tasklet): boolean {
    return this.previousDailyScrumItems != null && this.previousDailyScrumItems.length > 0;
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
