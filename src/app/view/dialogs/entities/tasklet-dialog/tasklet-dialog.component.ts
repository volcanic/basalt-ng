import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {UUID} from '../../../../model/util/uuid';
import {Tasklet} from '../../../../model/entities/tasklet.model';
import {DialogMode} from '../../../../model/ui/dialog-mode.enum';
import {TaskletType} from '../../../../model/tasklet-type.enum';
import {Tag} from '../../../../model/entities/tag.model';
import {TaskletDailyScrum} from '../../../../model/entities/scrum/tasklet-daily-scrum.model';
import {Person} from '../../../../model/entities/person.model';
import {ConfirmationDialogComponent} from '../../other/confirmation-dialog/confirmation-dialog.component';
import {TaskletWeeklyDigest} from '../../../../model/entities/digest/tasklet-weekly-digest.model';
import {TaskletService} from '../../../../services/entities/tasklet.service';
import {TaskService} from '../../../../services/entities/task.service';
import {Task} from '../../../../model/entities/task.model';
import {Description} from '../../../../model/entities/fragments/description.model';
import {CloneService} from '../../../../services/util/clone.service';
import {TagService} from '../../../../services/entities/tag.service';
import {PersonService} from '../../../../services/entities/person.service';
import {Action} from '../../../../model/ui/action.enum';

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
  /** Descsription of previous tasklet */
  previousDescription = new Description();

  /** Temporarily displayed tags */
  tags: Tag[] = [];
  /** Temporarily displayed persons */
  persons: Person[] = [];
  /** Temporarily displayed task */
  task: Task;

  /**
   * Constructor
   * @param {TaskService} taskService
   * @param {TaskletService} taskletService
   * @param {TagService} tagService
   * @param {PersonService} personService
   * @param {MatDialog} dialog dialog
   * @param {MatDialogRef<ConfirmationDialogComponent>} dialogRef dialog reference
   * @param data dialog data
   */
  constructor(private taskService: TaskService,
              private taskletService: TaskletService,
              private tagService: TagService,
              private personService: PersonService,
              public dialog: MatDialog,
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
    this.initializeTasklet();

    // Temporary
    this.initializeTask();
    this.initializeTags();
    this.initializePersons();
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
  }

  /**
   * Initializes tasklet
   */
  private initializeTasklet() {
    this.tasklet = CloneService.cloneTasklet(this.data.tasklet);
    this.previousDescription = this.data.previousDescription;
  }

  /**
   * Initializes task
   */
  private initializeTask() {
    this.task = this.taskService.tasks.get(this.tasklet.taskId);
  }

  /**
   * Initializes tags
   */
  private initializeTags() {
    if (this.tasklet.tagIds != null) {
      this.tags = this.tasklet.tagIds.map(id => {
        return this.tagService.getTagById(id);
      }).filter(tag => {
        return tag != null;
      });
    }
  }

  /**
   * Initializes persons
   */
  private initializePersons() {
    if (this.tasklet.personIds != null) {
      this.persons = this.tasklet.personIds.map(id => {
        return this.personService.getPersonById(id);
      }).filter(person => {
        return person != null;
      });
    }
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
  onPersonChanged(persons: Person[]) {
    this.tasklet.personIds = persons.map(person => {
      return person.id;
    });
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
    this.evaluateTask();
    this.tasklet.tagIds = this.aggregateTagIds(this.tasklet);
    this.tasklet.personIds = this.aggregatePersonIds(this.tasklet);

    switch (this.tasklet.type) {
      case TaskletType.DAILY_SCRUM: {
        this.updateTaskletDailyScrum(this.tasklet as TaskletDailyScrum);
        break;
      }
      case TaskletType.LUNCH_BREAK:
      case TaskletType.FINISHING_TIME: {
        this.dialogRef.close(this.tasklet as Tasklet);
        break;
      }
      case TaskletType.WEEKLY_DIGEST: {
        this.dialogRef.close(this.tasklet as TaskletWeeklyDigest);
        break;
      }
      default: {
        this.dialogRef.close(this.tasklet);
      }
    }
  }

  /**
   * Handles click on update button
   */
  updateTasklet() {
    this.evaluateTask();
    this.tasklet.tagIds = this.aggregateTagIds(this.tasklet);
    this.tasklet.personIds = this.aggregatePersonIds(this.tasklet);

    switch (this.tasklet.type) {
      case TaskletType.DAILY_SCRUM: {
        this.updateTaskletDailyScrum(this.tasklet as TaskletDailyScrum);
        break;
      }
      case TaskletType.LUNCH_BREAK:
      case TaskletType.FINISHING_TIME: {
        this.dialogRef.close(this.tasklet as Tasklet);
        break;
      }
      default: {
        this.dialogRef.close(this.tasklet as Tasklet);
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
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, <MatDialogConfig>{
      disableClose: false,
      data: {
        title: 'Delete tasklet',
        text: 'Do you want to delete this tasklet?',
        action: 'Delete',
        value: this.tasklet
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.taskletService.deleteTasklet(result as Tasklet).then(() => {
        });
        this.dialogRef.close(null);
      }
    });
  }

  /**
   * Handles click on continue button
   */
  continueTasklet() {
    this.tasklet.id = new UUID().toString();
    this.tasklet.creationDate = new Date();

    this.dialogRef.close({action: Action.ADD, value: this.tasklet});
  }

  //
  // Helpers
  //

  // Tasks

  /**
   * Determines whether the selected task already exists, otherwise creates a new one
   */
  private evaluateTask() {
    if (this.task != null) {
      let task = this.taskService.getTaskByName(this.task.name);

      if (task != null) {
        // Existing task
        this.tasklet.taskId = task.id;
      } else if (this.task.name != null && this.task.name !== '') {
        // New task
        task = new Task(this.task.name);
        this.tasklet.taskId = task.id;
        this.taskService.createTask(task).then(() => {
        });
      } else {
        this.tasklet.taskId = null;
      }
    }
  }

  // Tags

  /**
   * Aggregates tag IDs
   * @param {Tasklet} tasklet
   * @returns {string[]}
   */
  private aggregateTagIds(tasklet: Tasklet): string[] {
    const aggregatedTagIds = new Map<string, string>();

    // Concatenate
    this.tags.forEach(t => {
      const tag = this.evaluateTag(t.name);
      aggregatedTagIds.set(tag.id, tag.id);
    });
    this.inferTags(tasklet).forEach(value => {
      const tag = this.evaluateTag(value);
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

  /**
   * Infers tags from a tasklet's description
   * @param {Tasklet} tasklet
   * @returns {Map<string, string>}
   */
  private inferTags(tasklet: Tasklet): Map<string, string> {
    const inferredTags = new Map<string, string>();

    if (tasklet.description != null && tasklet.description.value != null) {
      tasklet.description.value.split('\n').forEach(line => {
        line.split(' ').forEach(word => {
          if (word.startsWith('#')) {
            const tag = word.replace('#', '');
            inferredTags.set(tag, tag);
          }
        });
      });
    }

    return inferredTags;
  }

  // Person

  /**
   * Aggregates person IDs
   * @param {Tasklet} tasklet
   * @returns {string[]}
   */
  private aggregatePersonIds(tasklet: Tasklet): string[] {
    const aggregatedPersonIds = new Map<string, string>();

    // Concatenate
    this.persons.forEach(p => {
      const person = this.evaluatePerson(p.name);
      aggregatedPersonIds.set(person.id, person.id);
    });
    this.inferPersons(tasklet).forEach(value => {
      const person = this.evaluatePerson(value);
      aggregatedPersonIds.set(person.id, person.id);
    });

    return Array.from(aggregatedPersonIds.values());
  }

  /**
   * Gets an existing person by name or creates a new one if it does not exist
   * @param name person name
   */
  private evaluatePerson(name: string): Person {
    if (name != null) {
      let person = this.personService.getPersonByName(name);

      if (person == null) {
        person = new Person(name, true);
        this.personService.createPerson(person).then(() => {
        });
      }

      return person;
    }
  }

  /**
   * Infers persons from a tasklet's description
   * @param {Tasklet} tasklet
   * @returns {Map<string, string>}
   */
  private inferPersons(tasklet: Tasklet): Map<string, string> {
    const inferredPersons = new Map<string, string>();

    if (tasklet.description != null && tasklet.description.value != null) {
      tasklet.description.value.split('\n').forEach(line => {
        line.split(' ').forEach(word => {
          if (word.startsWith('@')) {
            const mention = word.replace('@', '').replace('_', ' ');
            inferredPersons.set(mention, mention);
          }
        });
      });
    }

    return inferredPersons;
  }
}
