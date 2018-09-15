import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Tasklet} from 'app/core/entity/model/tasklet.model';
import {DialogMode} from 'app/core/entity/model/dialog-mode.enum';
import {TaskletType} from 'app/core/entity/model/tasklet-type.enum';
import {Tag} from 'app/core/entity/model/tag.model';
import {TaskletDailyScrum} from 'app/core/entity/model/tasklet-daily-scrum.model';
import {Person} from 'app/core/entity/model/person.model';
import {ConfirmationDialogComponent} from 'app/ui/confirmation-dialog/confirmation-dialog/confirmation-dialog.component';
import {Task} from 'app/core/entity/model/task.model';
import {Description} from 'app/core/entity/model/description.model';
import {Action} from 'app/core/entity/model/action.enum';
import {SuggestionService} from 'app/core/entity/services/suggestion.service';

/**
 * Displays tasklet dialog
 */
@Component({
  selector: 'app-tasklet-dialog',
  templateUrl: './tasklet-dialog.component.html',
  styleUrls: ['./tasklet-dialog.component.scss'],
})
export class TaskletDialogComponent implements OnInit {

  /** Enum of dialog modes */
  public modeType = DialogMode;
  /** Current media */
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

  /**
   * Constructor
   * @param suggestionService suggestion service
   * @param {MatDialogRef<ConfirmationDialogComponent>} dialogRef dialog reference
   * @param data dialog data
   */
  constructor(private suggestionService: SuggestionService,
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
  }

  //
  // Actions
  //

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
   * Handles tag changes
   * @para tags new tags
   */
  onTagsChanged(tags: Tag[]) {
    this.tags = tags;
  }

  /**
   * Handles person changes
   * @para persons new persons
   */
  onPersonsChanged(persons: Person[]) {
    this.persons = persons;
  }

  /**
   * Handles key down event
   * @param event
   */
  onKeyDown(event: any) {
    const KEY_CODE_ENTER = 13;
    if (event.keyCode === KEY_CODE_ENTER && event.ctrlKey) {
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

    switch (this.tasklet.type) {
      case TaskletType.DAILY_SCRUM: {
        this.updateTaskletDailyScrum(this.tasklet as TaskletDailyScrum);
        break;
      }
      default: {
        this.dialogRef.close({
          action: Action.ADD,
          tasklet: this.tasklet,
          task: this.task,
          tags: this.tags,
          persons: this.persons
        });
      }
    }
  }

  /**
   * Handles click on update button
   */
  updateTasklet() {
    this.tags = this.aggregateTags(this.tasklet);
    this.persons = this.aggregatePersons(this.tasklet);

    switch (this.tasklet.type) {
      case TaskletType.DAILY_SCRUM: {
        this.updateTaskletDailyScrum(this.tasklet as TaskletDailyScrum);
        break;
      }
      default: {
        this.dialogRef.close({
          action: Action.UPDATE,
          tasklet: this.tasklet,
          task: this.task,
          tags: this.tags,
          persons: this.persons
        });
        break;
      }
    }
  }

  /**
   * Handles click on update button for daily scrum tasklets
   */
  updateTaskletDailyScrum(tasklet: TaskletDailyScrum) {
    tasklet.participants = tasklet.participants.filter(p => {
      return p.person != null && p.person.name.length > 0;
    });
    tasklet.participants.forEach(p => {
      p.activities = p.activities.filter(a => {
        return a.topic.length > 0;
      });
    });
    this.dialogRef.close(this.tasklet);
  }

  /**
   * Handles click on delete button
   */
  deleteTasklet() {
    this.dialogRef.close({action: Action.DELETE, tasklet: this.tasklet});
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
          if (word.startsWith('#')) {
            const hashtag = word.replace('#', '');
            inferredTags.set(hashtag, new Tag(hashtag));
          }
        });
      });
    }

    return Array.from(inferredTags.values());
  }

  // Person

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
