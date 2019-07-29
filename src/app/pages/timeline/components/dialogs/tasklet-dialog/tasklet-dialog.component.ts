import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Tasklet} from 'app/core/entity/model/tasklet.model';
import {DialogMode} from 'app/core/entity/model/dialog-mode.enum';
import {TaskletType} from 'app/core/entity/model/tasklet-type.enum';
import {Tag} from 'app/core/entity/model/tag.model';
import {Person} from 'app/core/entity/model/person.model';
import {Task} from 'app/core/entity/model/task.model';
import {Description} from 'app/core/entity/model/description.model';
import {Action} from 'app/core/entity/model/action.enum';
import {SuggestionService} from 'app/core/entity/services/suggestion.service';
import {MeetingMinuteItem} from 'app/core/entity/model/meeting-minutes/meeting-minute-item.model';
import {PersonService} from 'app/core/entity/services/person/person.service';
import {DailyScrumItem} from '../../../../../core/entity/model/daily-scrum/daily-scrum-item.model';
import {TaskletDisplayAspect} from '../../../../../core/entity/services/tasklet/tasklet-display.service';
import {TaskletService} from '../../../../../core/entity/services/tasklet/tasklet.service';
import {CloneService} from '../../../../../core/entity/services/clone.service';
import {TaskService} from '../../../../../core/entity/services/task/task.service';
import {TagService} from '../../../../../core/entity/services/tag/tag.service';
import {MaterialColorService} from '../../../../../core/ui/services/material-color.service';
import {PaletteType} from '../../../../../core/ui/model/palette-type.enum';
import {HueType} from '../../../../../core/ui/model/hue-type.enum';
import {SelectableItem} from '../../../../../ui/checkable-list/selectable-item';
import {AcceptanceCriterium} from '../../../../../core/entity/model/acceptance-criterium.model';
import {Project} from '../../../../../core/entity/model/project.model';
import {ProjectService} from '../../../../../core/entity/services/project/project.service';

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
  /** Temporarily displayed project */
  project: Project;
  /** Temporarily displayed tags inherited from task */
  inheritedTags: Tag[] = [];
  /** Temporarily displayed tags */
  tags: Tag[] = [];
  /** Temporarily displayed persons */
  persons: Person[] = [];

  /** Map of tasklets */
  taskletsMap = new Map<string, Tasklet>();
  /** Map of tasks */
  tasksMap = new Map<string, Task>();
  /** Map of projects */
  projectsMap = new Map<string, Project>();
  /** Map of tag */
  tagsMap = new Map<string, Tag>();

  /** Task options */
  taskOptionNames: string[];
  /** Project options */
  projectOptionNames: string[];
  /** Person options */
  personOptionNames: string[];
  /** Tag options */
  tagOptionNames: string[];
  /** Person option representing the user */
  myselfOption: string;

  /** Enum for action types */
  actionType = Action;
  /** Enum of tasklet types */
  taskletType = TaskletType;
  /** Enum of display aspects */
  displayAspectType = TaskletDisplayAspect;
  /** Enum of palettes */
  paletteType = PaletteType;
  /** Enum of hues */
  hueType = HueType;

  /**
   * Constructor
   * @param materialColorService material color service
   * @param personService person service
   * @param projectService project service
   * @param suggestionService suggestion service
   * @param tagService tag service
   * @param taskletService tasklet service
   * @param taskService task service
   * @param dialogRef dialog reference
   * @param data dialog data
   */
  constructor(public materialColorService: MaterialColorService,
              private personService: PersonService,
              private projectService: ProjectService,
              private suggestionService: SuggestionService,
              private tagService: TagService,
              private taskletService: TaskletService,
              private taskService: TaskService,
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
    this.initializeInheritedTags();
  }

  /**
   * Handles on-destroy lifecycle phase
   */
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
    this.tasklet = this.data.tasklet != null ? CloneService.cloneTasklet(this.data.tasklet) : new Tasklet();
    this.task = this.data.task != null ? CloneService.cloneTask(this.data.task) : new Task();
    this.project = this.data.project != null ? CloneService.cloneProject(this.data.project) : null;
    this.tags = this.data.tags != null ? CloneService.cloneTags(this.data.tags) : [];
    this.persons = this.data.persons != null ? CloneService.clonePersons(this.data.persons) : [];
    this.previousDescription = this.data.previousDescription != null ? CloneService.cloneDescription(this.data.previousDescription) : null;
    this.previousDailyScrumItems = this.data.previousDailyScrumItems;

    this.taskletsMap = this.data.taskletsMap;
    this.tasksMap = this.data.tasksMap;
    this.projectsMap = this.data.projectsMap;
    this.tagsMap = this.data.tagMap;
  }

  /**
   * Initializes options
   */
  private initializeOptions() {
    this.taskOptionNames = Array.from(this.suggestionService.taskOptions.values()).sort((t1, t2) => {
      return new Date(t2.modificationDate).getTime() > new Date(t1.modificationDate).getTime() ? 1 : -1;
    }).map(t => {
      return t.name;
    });
    this.projectOptionNames = Array.from(this.suggestionService.projectOptions.values()).sort((t1, t2) => {
      return new Date(t2.modificationDate).getTime() > new Date(t1.modificationDate).getTime() ? 1 : -1;
    }).map(t => {
      return t.name;
    });
    this.personOptionNames = Array.from(this.suggestionService.personOptions.values()).sort((p1, p2) => {
      return new Date(p2.modificationDate).getTime() > new Date(p1.modificationDate).getTime() ? 1 : -1;
    }).map(p => {
      return p.name;
    });
    this.tagOptionNames = Array.from(this.suggestionService.tagOptions.values()).sort((t1, t2) => {
      return new Date(t2.modificationDate).getTime() > new Date(t1.modificationDate).getTime() ? 1 : -1;
    }).map(t => {
      return t.name;
    });
    this.myselfOption = this.personService.myself.name;
  }

  /**
   * Initializes inherited tags
   */
  private initializeInheritedTags() {
    if (this.task != null && this.task.tagIds != null) {
      this.inheritedTags = this.task.tagIds.map(id => {
        return this.tagsMap.get(id);
      });
    } else {
      this.inheritedTags = [];
    }
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
    this.task = this.taskService.getTaskByName(taskName, this.tasksMap);
    this.task = (this.task != null) ? this.task : new Task();
    this.task.name = taskName;

    this.project = this.projectsMap.get(this.task.projectId);

    this.initializeInheritedTags();
  }

  /**
   * Handles projec name changes
   * @param projectName new project name
   */
  onProjectNameChanged(projectName: string) {
    this.project = this.projectService.getProjectByName(projectName, this.projectsMap);
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
   * Handles acceptance criteria changes
   * @param items acceptance criteria
   */
  onAcceptanceCriteriaChanged(items: SelectableItem[]) {
    this.tasklet.acceptanceCriteria = items as AcceptanceCriterium[];
  }

  /**
   * Handles tag changes
   * @param tags new tags
   */
  onTagsChanged(tags: string[]) {
    this.tags = tags.map(t => {
      return new Tag(t);
    });
  }

  /**
   * Handles person changes
   * @param persons new persons
   */
  onPersonsChanged(persons: string[]) {
    this.persons = persons.map(p => {
      return new Person(p);
    });
  }

  /**
   * Handles key down event
   * @param event event
   */
  onKeyDown(event: any) {
    const KEY_CODE_ENTER = 13;
    if (event.key === KEY_CODE_ENTER && event.ctrlKey) {
      this.handleTaskletChanges();
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
        this.deleteTasklet();
        break;
      }
      case Action.FULLSCREEN: {
        this.goToFullscreen();
        break;
      }
      case Action.POMODORO_START: {
        this.startPomodoro();
        break;
      }
      case Action.SEND_MAIL_MEETING_MINUTES: {
        this.sendMeetingMinutes();
        break;
      }
      case Action.SEND_MAIL_DAILY_SCRUM_SUMMARY: {
        this.sendDailyScrumSummary();
        break;
      }
    }
  }

  //
  //
  //

  /**
   * Handles the creation, updating or continuation of a task
   */
  private handleTaskletChanges() {
    switch (this.mode) {
      case DialogMode.ADD: {
        if (this.containsDisplayAspect(TaskletDisplayAspect.CAN_BE_CREATED, this.tasklet, this.task, this.project)) {
          this.addTasklet();
        }
        break;
      }
      case DialogMode.UPDATE: {
        if (this.containsDisplayAspect(TaskletDisplayAspect.CAN_BE_UPDATED, this.tasklet, this.task)) {
          this.updateTasklet();
        }
        break;
      }
      case DialogMode.CONTINUE: {
        if (this.containsDisplayAspect(TaskletDisplayAspect.CAN_BE_UPDATED, this.tasklet, this.task)) {
          this.updateTasklet();
        }
        break;
      }
    }
  }

  /**
   * Adds a tasklet
   */
  private addTasklet() {
    this.tags = this.aggregateTags(this.tasklet);
    this.persons = this.aggregatePersons(this.tasklet);

    this.dialogRef.close({
      action: Action.ADD,
      tasklet: this.tasklet,
      task: this.task,
      project: this.project,
      tags: this.tags,
      persons: this.persons
    });
  }

  /**
   * Updates a tasklet
   */
  private updateTasklet() {
    this.tags = this.aggregateTags(this.tasklet);
    this.persons = this.aggregatePersons(this.tasklet);

    this.dialogRef.close({
      action: Action.UPDATE,
      tasklet: this.tasklet,
      task: this.task,
      project: this.project,
      tags: this.tags,
      persons: this.persons
    });
  }

  /**
   * Deletes a tasklet
   */
  private deleteTasklet() {
    this.mode = DialogMode.DELETE;
    this.dialogRef.close({action: Action.DELETE, tasklet: this.tasklet});
  }

  /**
   * Goes to fullscreen
   */
  private goToFullscreen() {
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
   * Start a pomodoro
   */
  private startPomodoro() {
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
  private sendMeetingMinutes() {
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
  private sendDailyScrumSummary() {
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

  //
  // Helpers
  //

  /**
   * Determines whether the displayed tasklet contains a specific display aspect
   * @param displayAspect display aspect
   * @param tasklet tasklet
   * @param task task
   * @param project project
   */
  public containsDisplayAspect(displayAspect: TaskletDisplayAspect, tasklet: Tasklet, task?: Task, project?: Project): boolean {
    return this.taskletService.containsDisplayAspect(displayAspect, tasklet, task, project);
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
   * @param tasklet tasklet
   * @returns tags
   */
  private aggregateTags(tasklet: Tasklet): Tag[] {
    const aggregatedTags = new Map<string, Tag>();

    // Concatenate
    this.tags.forEach(t => {
      aggregatedTags.set(t.name, t);
    });
    this.inferTags(tasklet).forEach(t => {
      aggregatedTags.set(t.name, t);
    });

    return Array.from(aggregatedTags.values());
  }

  /**
   * Infers tags from a tasklet's description
   * @param tasklet tasklet
   * @returns tags
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
   * @param tasklet tasklet
   * @returns persons
   */
  private aggregatePersons(tasklet: Tasklet): Person[] {
    const aggregatedPersons = new Map<string, Person>();

    // Concatenate
    this.persons.forEach(p => {
      aggregatedPersons.set(p.name, p);
    });
    this.inferPersons(tasklet).forEach(p => {
      aggregatedPersons.set(p.name, p);
    });

    return Array.from(aggregatedPersons.values());
  }

  /**
   * Infers persons from a tasklet's description
   * @param tasklet tasklet
   * @returns persons
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

  //
  // Lookup
  //

  /**
   * Retrieves a project by a given name
   * @param name name to find project by
   * @param projectsMap projects map
   * @returns project identified by given name, null if no such project exists
   */
  public getProjectByName(name: string, projectsMap: Map<string, Project>): Project {
    let project: Project = null;

    Array.from(projectsMap.values()).forEach(p => {
      if (p.name === name) {
        project = p;
      }
    });

    return project;
  }
}
