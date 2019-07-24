import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {Tasklet} from '../../../../core/entity/model/tasklet.model';
import {Task} from '../../../../core/entity/model/task.model';
import {Project} from '../../../../core/entity/model/project.model';
import {Person} from '../../../../core/entity/model/person.model';
import {Tag} from '../../../../core/entity/model/tag.model';
import {Observable, Subject} from 'rxjs';
import {delay, filter, takeUntil} from 'rxjs/operators';
import {TaskletService} from '../../../../core/entity/services/tasklet/tasklet.service';
import {Scope} from '../../../../core/entity/model/scope.enum';
import {TaskletType} from '../../../../core/entity/model/tasklet-type.enum';
import {Action} from '../../../../core/entity/model/action.enum';
import {Media} from '../../../../core/ui/model/media.enum';
import {DialogMode} from '../../../../core/entity/model/dialog-mode.enum';
import {TaskService} from '../../../../core/entity/services/task/task.service';
import {PersonService} from '../../../../core/entity/services/person/person.service';
import {TagService} from '../../../../core/entity/services/tag/tag.service';
import {ProjectService} from '../../../../core/entity/services/project/project.service';
import {MaterialColorService} from '../../../../core/ui/services/material-color.service';
import {MaterialIconService} from '../../../../core/ui/services/material-icon.service';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {MediaService} from '../../../../core/ui/services/media.service';
import {ScopeService} from '../../../../core/entity/services/scope.service';
import {FilterService} from '../../../../core/entity/services/filter.service';
import {SuggestionService} from '../../../../core/entity/services/suggestion.service';
import {ConfirmationDialogComponent} from '../../../../ui/confirmation-dialog/confirmation-dialog/confirmation-dialog.component';
import {UnusedTagsDialogComponent} from '../../components/dialogs/unused-tags-dialog/unused-tags-dialog.component';
import {CloneService} from '../../../../core/entity/services/clone.service';
import {InformationDialogComponent} from '../../../../ui/information-dialog/information-dialog/information-dialog.component';
import {TagDialogComponent} from '../../components/dialogs/tag-dialog/tag-dialog.component';
import {DateService} from '../../../../core/entity/services/date.service';
import {TaskletDialogComponent} from '../../components/dialogs/tasklet-dialog/tasklet-dialog.component';
import {DailyScrumItemType} from '../../../../core/entity/model/daily-scrum/daily-scrum-item-type.enum';
import {UUID} from '../../../../core/entity/model/uuid';
import {Description} from '../../../../core/entity/model/description.model';
import {DateTimePickerDialogComponent} from '../../../../ui/date-time-picker-dialog/date-time-picker-dialog/date-time-picker-dialog.component';
import {SettingType} from '../../../../core/settings/model/setting-type.enum';
import {TaskDialogComponent} from '../../components/dialogs/task-dialog/task-dialog.component';
import {ProjectDialogComponent} from '../../components/dialogs/project-dialog/project-dialog.component';
import {PersonDialogComponent} from '../../components/dialogs/person-dialog/person-dialog.component';
import {SnackbarService} from '../../../../core/ui/services/snackbar.service';
import {Router} from '@angular/router';
import {EmailService} from '../../../../core/mail/services/mail/email.service';
import {SettingsService} from '../../../../core/settings/services/settings.service';
import {TaskletDisplayAspect} from '../../../../core/entity/services/tasklet/tasklet-display.service';
import {TaskDisplayAspect} from '../../../../core/entity/services/task/task-display.service';

/**
 * Base component for timeline pages
 */
@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit, OnDestroy {

  /** App title */
  public title = environment.APP_NAME;

  /** Current scope */
  public scope: Scope = Scope.UNDEFINED;
  /** Current media */
  public media: Media = Media.UNDEFINED;

  /** Map of tasklets */
  public taskletsMap = new Map<string, Tasklet>();
  /** Array of filtered tasklets */
  public taskletsMapFiltered = new Map<string, Tasklet>();

  /** Map of tasks */
  public tasksMap = new Map<string, Task>();
  /** Map of tasks used for filtering */
  public tasksMapFilter = new Map<string, Task>();
  /** Map of filtered tasks */
  public tasksMapFiltered = new Map<string, Task>();

  /** Map of projects */
  public projectsMap = new Map<string, Project>();
  /** Map of projects used for filtering */
  public projectsMapFilter = new Map<string, Project>();
  /** Map of filtered projects */
  public projectsMapFiltered = new Map<string, Project>();

  /** Map of persons */
  public personsMap = new Map<string, Person>();
  /** Map of person used for filtering */
  public personsMapFilter = new Map<string, Person>();
  /** Map of filtered persons */
  public personsMapFiltered = new Map<string, Person>();

  /** Map of tags */
  public tagsMap = new Map<string, Tag>();
  /** Map of tags used for filtering */
  public tagsMapFilter = new Map<string, Tag>();
  /** Map of filtered tags */
  public tagsMapFiltered = new Map<string, Tag>();

  /** Enum of tasklet types */
  public taskletType = TaskletType;
  /** Enum for action types */
  public actionType = Action;
  /** Enum of dialog modes */
  public modeType = DialogMode;
  /** Enum of tasklet display aspects */
  public taskletDisplayAspectType = TaskletDisplayAspect;
  /** Enum of task display aspects */
  public taskDisplayAspectType = TaskDisplayAspect;
  /** Enum of media types */
  public mediaType = Media;
  /** Enum of scope types */
  public scopeType = Scope;
  /** Environment */
  public env = environment;

  /** Helper subject used to finish other subscriptions */
  public unsubscribeSubject = new Subject();

  /**
   * Constructor
   * @param dialog dialog
   * @param emailService email service
   * @param filterService filter service
   * @param iconRegistry icon registry
   * @param materialColorService material color service
   * @param materialIconService material icon service
   * @param mediaService media service
   * @param projectService project service
   * @param personService person service
   * @param router router
   * @param sanitizer sanitzer
   * @param scopeService scope service
   * @param settingsService settings service
   * @param snackbarService snackbar service
   * @param suggestionService suggestion service
   * @param tagService tag service
   * @param taskletService tasklet service
   * @param taskService task service
   */
  constructor(protected dialog: MatDialog,
              protected emailService: EmailService,
              protected filterService: FilterService,
              protected iconRegistry: MatIconRegistry,
              protected materialColorService: MaterialColorService,
              protected materialIconService: MaterialIconService,
              protected mediaService: MediaService,
              protected projectService: ProjectService,
              protected personService: PersonService,
              protected router: Router,
              protected sanitizer: DomSanitizer,
              protected scopeService: ScopeService,
              protected settingsService: SettingsService,
              protected snackbarService: SnackbarService,
              protected suggestionService: SuggestionService,
              protected tagService: TagService,
              protected taskletService: TaskletService,
              protected taskService: TaskService,
  ) {
  }

  //
  // Lifecycle hooks
  //

  // <editor-fold defaultstate="collapsed" desc="Lifecycle hooks">

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.mediaService.fetchMedia();
  }

  /**
   * Handles on-destroy lifecycle phase
   */
  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

  // </editor-fold>

  //
  // Initialization
  //

  // <editor-fold defaultstate="collapsed" desc="Initialization">

  /**
   * Initializes tasklet subscription
   */
  protected initializeTaskletSubscription(): Observable<Tasklet> {
    return this.taskletService.taskletSubject.pipe(
      takeUntil(this.unsubscribeSubject),
      filter(value => value != null)
    );
  }

  /**
   * Initializes tasklets subscription
   */
  protected initializeTaskletsSubscription(): Observable<Map<string, Tasklet>> {
    return this.taskletService.taskletsSubject.pipe(
      takeUntil(this.unsubscribeSubject),
      filter(value => value != null)
    );
  }

  /**
   * Initializes task subscription
   */
  protected initializeTaskSubscription(): Observable<Task> {
    return this.taskService.taskSubject.pipe(
      takeUntil(this.unsubscribeSubject),
      filter(value => value != null)
    );
  }

  /**
   * Initializes tasks subscription
   */
  protected initializeTasksSubscription(): Observable<Map<string, Task>> {
    return this.taskService.tasksSubject.pipe(
      takeUntil(this.unsubscribeSubject),
      filter(value => value != null)
    );
  }

  /**
   * Initializes project subscription
   */
  protected initializeProjectSubscription(): Observable<Project> {
    return this.projectService.projectSubject.pipe(
      takeUntil(this.unsubscribeSubject),
      filter(value => value != null)
    );
  }

  /**
   * Initializes projects subscription
   */
  protected initializeProjectsSubscription(): Observable<Map<string, Project>> {
    return this.projectService.projectsSubject.pipe(
      takeUntil(this.unsubscribeSubject),
      filter(value => value != null)
    );
  }

  /**
   * Initializes person subscription
   */
  protected initializePersonSubscription(): Observable<Person> {
    return this.personService.personSubject.pipe(
      takeUntil(this.unsubscribeSubject),
      filter(value => value != null)
    );
  }

  /**
   * Initializes persons subscription
   */
  protected initializePersonsSubscription(): Observable<Map<string, Person>> {
    return this.personService.personsSubject.pipe(
      takeUntil(this.unsubscribeSubject),
      filter(value => value != null)
    );
  }

  /**
   * Initializes tag subscription
   */
  protected initializeTagSubscription(): Observable<Tag> {
    return this.tagService.tagSubject.pipe(
      takeUntil(this.unsubscribeSubject),
      filter(value => value != null)
    );
  }

  /**
   * Initializes tags subscription
   */
  protected initializeTagsSubscription(): Observable<Map<string, Tag>> {
    return this.tagService.tagsSubject.pipe(
      takeUntil(this.unsubscribeSubject),
      filter(value => value != null)
    );
  }

  protected initializeMediaSubscription(): Observable<Media> {
    return this.mediaService.mediaSubject.pipe(
      takeUntil(this.unsubscribeSubject),
      filter(value => value != null)
    );
  }

  /**
   * Initializes scope subscription
   */
  protected initializeScopeSubscription(): Observable<Scope> {
    return this.scopeService.scopeSubject.pipe(
      takeUntil(this.unsubscribeSubject),
      filter(value => value != null)
    );
  }

  /**
   * Initializes filter subscription
   */
  protected initializeFilterSubscription() {
    return this.filterService.filterSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    );
  }

  /**
   * Initializes suggestion subscription
   */
  protected initializeSuggestionSubscription() {
    return this.suggestionService.searchOptionsSubject.pipe(
      takeUntil(this.unsubscribeSubject),
      filter(value => value != null)
    );
  }

  /**
   * Initializes date subscription
   */
  protected initializeDateSubscription() {
    return this.taskletService.dateQueueSubject.pipe(
      takeUntil(this.unsubscribeSubject),
      filter(value => value != null),
      delay(5000)
    );
  }

  /**
   * Initializes material colors and icons
   */
  protected initializeMaterial() {
    this.materialColorService.initializeColors();
    this.materialIconService.initializeIcons(this.iconRegistry, this.sanitizer);
  }

  // </editor-fold>

  //
  //
  //

  /**
   * Triggers entity retrieval from database
   * @param forceReload force reload
   */
  protected findEntities(forceReload = false) {
    this.taskletService.fetchTasklets(forceReload);
    this.taskService.fetchTasks(forceReload);
    this.projectService.fetchProjects(forceReload);
    this.personService.fetchPersons(forceReload);
    this.tagService.fetchTags(forceReload);
  }

  //
  // Actions
  //

  // <editor-fold defaultstate="collapsed" desc="Actions">

  /**
   * Handles events targeting a tasklet
   * @param event event parameters
   */
  onTaskletEvent(event: { action: Action, tasklet: Tasklet, task?: Task, tags?: Tag[], persons?: Person[] }) {
    const tasklet = CloneService.cloneTasklet(event.tasklet as Tasklet);
    const task = CloneService.cloneTask(event.task as Task);
    const tags = CloneService.cloneTags(event.tags as Tag[]);
    const persons = CloneService.clonePersons(event.persons as Person[]);

    switch (event.action) {
      case Action.ADD: {
        // Create new entities if necessary
        this.evaluateTaskletTask(tasklet, task);
        this.evaluateTaskletTags(tasklet, task, tags);
        this.evaluateTaskletPersons(tasklet, persons);

        // Create tasklet itself
        this.taskletService.createTasklet(tasklet, this.taskletsMap, this.tasksMap, this.projectsMap, this.personsMap, this.tagsMap).then(() => {
          this.snackbarService.showSnackbar('Added tasklet');
        });
        break;
      }
      case Action.UPDATE: {
        // Create new entities if necessary
        this.evaluateTaskletTask(tasklet, task);
        this.evaluateTaskletTags(tasklet, task, tags);
        this.evaluateTaskletPersons(tasklet, persons);

        // Update tasklet itself
        this.taskletService.updateTasklet(tasklet, this.taskletsMap, this.tasksMap, this.projectsMap, this.personsMap, this.tagsMap).then(() => {
          this.snackbarService.showSnackbar('Updated tasklet');
        });
        break;
      }
      case Action.DELETE: {
        const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          data: {
            title: 'Delete tasklet',
            text: 'Do you want to delete this tasklet?',
            action: 'Delete',
            value: tasklet
          }
        });
        confirmationDialogRef.afterClosed().subscribe(confirmationResult => {
          if (confirmationResult != null) {
            this.taskletService.deleteTasklet(confirmationResult as Tasklet, this.taskletsMap).then(() => {
            });
          }
        });
        break;
      }
      case Action.SEND_MAIL_MEETING_MINUTES: {
        // Update tasklet
        this.onTaskletEvent({
          action: Action.UPDATE,
          tasklet,
          task,
          tags,
          persons
        });

        const recipients = persons.filter(p => {
          return p.email != null;
        }).map(p => {
          return p.email;
        });
        const subject = task.name;
        let body = `Please find the meeting minutes below\n`;

        this.taskletService.getTopics(tasklet).forEach(topic => {
          body += `\nTopic ${topic}`;
          this.taskletService.getMeetingMinuteItemsByTopic(tasklet, topic).forEach(item => {
            body += `\n -`;
            if (item.person != null) {
              body += ` ${item.person.name} `;
            }
            body += ` ${item.type.toString()}: `;
            body += ` ${item.statement}`;
          });
        });

        this.emailService.sendMail(recipients, [], `Meeting Minutes - ${subject}`, body);
        break;
      }
      case Action.SEND_MAIL_DAILY_SCRUM_SUMMARY: {
        // Update tasklet
        this.onTaskletEvent({
          action: Action.UPDATE,
          tasklet,
          task,
          tags,
          persons
        });

        const recipients = persons.filter(p => {
          return p.email != null;
        }).map(p => {
          return p.email;
        });
        const subject = `Daily scrum ${DateService.getSimpleDateString(tasklet.creationDate)}`;
        let body = `Please find the summary of Daily Scrum below\n`;

        this.taskletService.getParticipants(tasklet).forEach(participant => {
          body += `\nParticipant ${participant}`;
          this.taskletService.getDailyScrumActivitiesByParticipant(tasklet, participant).forEach(item => {
            body += `\n -`;
            body += ` ${item.type.toString()}: `;
            body += ` ${item.statement}`;
          });
        });

        this.emailService.sendMail(recipients, [], subject, body);
        break;
      }
      case Action.OPEN_DIALOG_ADD: {
        // Create default tasklet
        const t = new Tasklet();
        t.type = TaskletType.ACTION;

        // Assemble data to be passed
        const data = {
          mode: DialogMode.ADD,
          dialogTitle: 'Add tasklet',
          tasklet: t,
          task: new Task(),
          tags: [],
          persons: [],
          previousDescription: null,
          taskletsMap: this.taskletsMap,
          tasksMap: this.tasksMap,
          tagMap: this.tagsMap,
        };

        // Open dialog
        const dialogRef = this.dialog.open(TaskletDialogComponent, {
          disableClose: false,
          data
        });

        // Handle dialog close
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const resultingAction = result.action as Action;
            const resultingTasklet = result.tasklet as Tasklet;
            const resultingTask = result.task as Task;
            const resultingTags = result.tags as Tag[];
            const resultingPersons = result.persons as Person[];

            this.onTaskletEvent({
              action: resultingAction,
              tasklet: resultingTasklet,
              task: resultingTask,
              tags: resultingTags,
              persons: resultingPersons
            });
          }
        });
        break;
      }
      case Action.OPEN_DIALOG_UPDATE: {
        // Assemble data to be passed
        const data = {
          mode: DialogMode.UPDATE,
          dialogTitle: 'Update tasklet',
          tasklet,
          task: this.tasksMap.get(tasklet.taskId),
          tags: tasklet.tagIds != null ? tasklet.tagIds.map(id => {
            return this.tagsMap.get(id);
          }).filter(tag => {
            return tag != null;
          }) : [],
          persons: tasklet.personIds != null ? tasklet.personIds.map(id => {
            return this.personsMap.get(id);
          }).filter(person => {
            return person != null;
          }) : [],
          previousDescription: null,
          taskletsMap: this.taskletsMap,
          tasksMap: this.tasksMap,
          tagMap: this.tagsMap,
        };

        // Open dialog
        const dialogRef = this.dialog.open(TaskletDialogComponent, {
          disableClose: false,
          data
        });

        // Handle dialog close
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const resultingAction = result.action as Action;
            const resultingTasklet = result.tasklet as Tasklet;
            const resultingTask = result.task as Task;
            const resultingTags = result.tags as Tag[];
            const resultingPersons = result.persons as Person[];

            this.onTaskletEvent({
              action: resultingAction,
              tasklet: resultingTasklet,
              task: resultingTask,
              tags: resultingTags,
              persons: resultingPersons
            });
          }
        });
        break;
      }
      case Action.OPEN_DIALOG_CONTINUE: {
        const previousDescription = tasklet.description;
        const previousDailyScrumItems = tasklet.dailyScrumItems.filter(dailyScrumItem => {
          return dailyScrumItem.type === DailyScrumItemType.WILL_DO;
        });

        tasklet['_rev'] = null;
        tasklet.id = new UUID().toString();
        tasklet.description = new Description();
        tasklet.dailyScrumItems = [];
        tasklet.creationDate = new Date();

        // Assemble data to be passed
        const data = {
          mode: DialogMode.CONTINUE,
          dialogTitle: 'Continue tasklet',
          tasklet,
          task: this.tasksMap.get(tasklet.taskId),
          tags: tasklet.tagIds.map(id => {
            return this.tagsMap.get(id);
          }).filter(tag => {
            return tag != null;
          }),
          persons: tasklet.personIds.map(id => {
            this.personsMap.get(id);
          }).filter(person => {
            return person != null;
          }),
          previousDescription,
          previousDailyScrumItems,
          taskletsMap: this.taskletsMap,
          tasksMap: this.tasksMap,
          tagMap: this.tagsMap,
        };

        // Open dialog
        const continueTaskletDialogRef = this.dialog.open(TaskletDialogComponent, {
          disableClose: false,
          data
        });

        // Handle dialog close
        continueTaskletDialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const resultingAction = result.action as Action;
            const resultingTasklet = result.tasklet as Tasklet;

            this.onTaskletEvent({
              action: resultingAction,
              tasklet: resultingTasklet,
              task: this.tasksMap.get(resultingTasklet.taskId),
              tags: resultingTasklet.tagIds.map(id => {
                return this.tagsMap.get(id);
              }).filter(tag => {
                return tag != null;
              }),
              persons: resultingTasklet.personIds.map(id => {
                return this.personsMap.get(id);
              }).filter(person => {
                return person != null;
              })
            });
          }
        });
        break;
      }
      case Action.OPEN_DIALOG_CREATION_TIME: {
        const dialogRef = this.dialog.open(DateTimePickerDialogComponent, {
          disableClose: false,
          data: {
            dialogTitle: 'Set creation time',
            date: tasklet.creationDate
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const resultingAction = result.action as Action;
            tasklet.creationDate = result.date as Date;

            this.onTaskletEvent({
              action: resultingAction,
              tasklet,
              task: this.tasksMap.get(tasklet.taskId),
              tags: tasklet.tagIds.map(id => {
                return this.tagsMap.get(id);
              }).filter(tag => {
                return tag != null;
              }),
              persons: tasklet.personIds.map(id => {
                return this.personsMap.get(id);
              }).filter(person => {
                return person != null;
              })
            });
          }
        });
        break;
      }
      case Action.FULLSCREEN: {
        this.router.navigate([`/tasklet/${tasklet.id}`]).then(() => {
        });
        break;
      }
      case Action.POMODORO_START: {
        // Set pomodoro duration and start time
        tasklet.pomodoroDuration = +this.settingsService.settings.get(SettingType.POMODORO_DURATION).value;
        tasklet.pomodoroStartTime = new Date();

        // Update tasklet
        this.onTaskletEvent({
          action: Action.UPDATE,
          tasklet,
          task,
          tags,
          persons
        });

        this.router.navigate([`/tasklet/${tasklet.id}`]).then(() => {
        });
        break;
      }
    }
  }

  /**
   * Handles events targeting a tasklet creation date
   * @param creationDate creation date
   */
  onTaskletCreationDateEvent(creationDate: Date) {
    this.taskletService.addElementToDateQueue(creationDate);
  }

  /**
   * Handles events targeting a task
   * @param event event parameters
   */
  onTaskEvent(event: {
    action: Action, task: Task, tasks?: Task[], project?: Project, delegatedTo?:
      Person, tags?: Tag[], omitReferenceEvaluation?: boolean
  }) {
    const task = CloneService.cloneTask(event.task as Task);
    const tasks = CloneService.cloneTasks(event.tasks as Task[]);
    const project = CloneService.cloneProject(event.project as Project);
    const delegatedTo = CloneService.clonePerson(event.delegatedTo as Person);
    const tags = CloneService.cloneTags(event.tags as Tag[]);
    const omitReferenceEvaluation = event.omitReferenceEvaluation;

    switch (event.action) {
      case Action.ADD: {
        // Create new entities if necessary
        this.evaluateTaskProject(task, project);
        this.evaluateTaskDelegatedTo(task, delegatedTo);
        this.evaluateTaskTags(task, tags);

        // Create task itself
        this.taskService.createTask(task, this.tasksMap, this.projectsMap, this.tagsMap).then(() => {
          this.filterService.updateTasksListIfNotEmpty([task]);
          this.snackbarService.showSnackbar('Added task');
        });
        break;
      }
      case Action.UPDATE: {
        // Create new entities if necessary
        this.evaluateTaskProject(task, project);
        this.evaluateTaskDelegatedTo(task, delegatedTo);
        this.evaluateTaskTags(task, tags);

        // Update task itself
        this.taskService.updateTask(task, this.tasksMap, this.projectsMap, this.tagsMap).then(() => {
          this.filterService.updateTasksListIfNotEmpty([task]);
          this.snackbarService.showSnackbar('Updated task');
        });
        break;
      }
      case Action.DELETE: {
        const references = Array.from(this.taskletsMap.values()).some((tasklet: Tasklet) => {
          return tasklet.taskId === task.id;
        });

        if (references) {
          this.dialog.open(InformationDialogComponent, {
            disableClose: false,
            data: {
              title: 'Cannot delete task',
              text: `There are still tasklets associated with this task.`,
              action: 'Okay',
              value: task
            }
          });
        } else {
          const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            data: {
              title: 'Delete task',
              text: 'Do you want to delete this task?',
              action: 'Delete',
              value: task
            }
          });
          confirmationDialogRef.afterClosed().subscribe(confirmationResult => {
            if (confirmationResult != null) {
              this.taskService.deleteTask((confirmationResult as Task), this.tasksMap).then(() => {
              });
            }
          });
        }
        break;
      }
      case Action.COMPLETE: {
        if (!omitReferenceEvaluation) {
          // Create new entities if necessary
          this.evaluateTaskProject(task, project);
          this.evaluateTaskDelegatedTo(task, delegatedTo);
          this.evaluateTaskTags(task, tags);
        }

        task.completionDate = new Date();
        this.taskService.updateTask(task, this.tasksMap, this.projectsMap, this.tagsMap).then(() => {
          this.snackbarService.showSnackbar('Completed task');
        });
        break;
      }
      case Action.REOPEN: {
        task.completionDate = null;
        this.taskService.updateTask(task, this.tasksMap, this.projectsMap, this.tagsMap).then(() => {
          this.snackbarService.showSnackbar('Re-opened task');
        });

        break;
      }
      case Action.OPEN_DIALOG_ADD: {
        // Assemble data to be passed
        const data = {
          mode: DialogMode.ADD,
          dialogTitle: 'Add task',
          task: new Task(''),
          project: null,
          delegatedTo: null,
          tags: []
        };

        // Open dialog
        const dialogRef = this.dialog.open(TaskDialogComponent, {
          disableClose: false,
          data
        });

        // Handle dialog close
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const resultingAction = result.action as Action;
            const resultingTask = result.task as Task;
            const resultingProject = result.project as Project;
            const resultingDelegatedTo = result.delegatedTo as Person;
            const resultingTags = result.tags as Tag[];

            this.onTaskEvent({
              action: resultingAction,
              task: resultingTask,
              project: resultingProject,
              delegatedTo: resultingDelegatedTo,
              tags: resultingTags
            });
          }
        });
        break;
      }
      case Action.OPEN_DIALOG_UPDATE: {
        // Assemble data to be passed
        const data = {
          mode: DialogMode.UPDATE,
          dialogTitle: 'Update task',
          task,
          project: this.projectsMap.get(task.projectId),
          delegatedTo: this.personsMap.get(task.delegatedToId),
          tags: task.tagIds != null ? task.tagIds.map(id => {
            return this.tagsMap.get(id);
          }).filter(tag => {
            return tag != null;
          }) : []
        };

        // Open dialog
        const dialogRef = this.dialog.open(TaskDialogComponent, {
          disableClose: false,
          data
        });

        // Handle dialog close
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const resultingAction = result.action as Action;
            const resultingTask = result.task as Task;
            const resultingProject = result.project as Project;
            const resultingDelegatedTo = result.delegatedTo as Person;
            const resultingTags = result.tags as Tag[];

            this.onTaskEvent({
              action: resultingAction,
              task: resultingTask,
              project: resultingProject,
              delegatedTo: resultingDelegatedTo,
              tags: resultingTags
            });
          }
        });
        break;
      }
      case Action.OPEN_DIALOG_CONTINUE: {
        const tasklet = new Tasklet();
        tasklet.taskId = task.id;
        tasklet.type = TaskletType.ACTION;

        this.onTaskletEvent({
          action: Action.OPEN_DIALOG_CONTINUE,
          tasklet,
          tags: [],
          task: this.tasksMap.get(tasklet.taskId),
          persons: []
        });
        break;
      }
      case Action.FILTER_SINGLE: {
        this.filterService.clearTasks();
        this.filterService.updateTasksList(tasks);
        break;
      }
      case Action.FILTER_LIST: {
        this.filterService.updateTasksList(tasks);
        break;
      }
      case Action.FULLSCREEN: {
        this.router.navigate([`/task/${task.id}`]).then(() => {
        });
        break;
      }
    }
  }

  /**
   * Handles events targeting a project
   * @param event event parameters
   */
  onProjectEvent(event: { action: Action, project?: Project, projects?: Project[] }) {
    const project = CloneService.cloneProject(event.project as Project);
    const projects = CloneService.cloneProjects(event.projects as Project[]);

    switch (event.action) {
      case Action.ADD: {
        this.filterService.updateProjectsListIfNotEmpty([project]);
        this.projectService.createProject(project, this.projectsMap).then(() => {
        });
        break;
      }
      case Action.UPDATE: {
        this.filterService.updateProjectsListIfNotEmpty([project]);
        this.projectService.updateProject(project, this.projectsMap).then(() => {
        });
        break;
      }
      case Action.DELETE: {
        const references = Array.from(this.tasksMap.values()).some((task: Task) => {
          return task.projectId === project.id;
        });

        if (references) {
          this.dialog.open(InformationDialogComponent, {
            disableClose: false,
            data: {
              title: 'Cannot delete project',
              text: `There are still tasks associated with this project.`,
              action: 'Okay',
              value: project
            }
          });
        } else {
          const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            data: {
              title: 'Delete project',
              text: 'Do you want to delete this project?',
              action: 'Delete',
              value: project
            }
          });
          confirmationDialogRef.afterClosed().subscribe(confirmationResult => {
            if (confirmationResult != null) {
              this.projectService.deleteProject((confirmationResult as Project), this.projectsMap).then(() => {
              });
              this.filterService.projects.delete((confirmationResult as Project).id);
            }
          });
        }
        break;
      }
      case Action.OPEN_DIALOG_ADD: {
        // Assemble data to be passed
        const data = {
          mode: DialogMode.ADD,
          dialogTitle: 'Add project',
          project: new Project(''),
          projects: Array.from(this.projectsMap.values())
        };

        // Open dialog
        const dialogRef = this.dialog.open(ProjectDialogComponent, {
          disableClose: false,
          data
        });

        // Handle dialog close
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const resultingAction = result.action as Action;
            const resultingProject = result.project as Project;

            this.onProjectEvent({
              action: resultingAction,
              project: resultingProject
            });
          }
        });
        break;
      }
      case Action.OPEN_DIALOG_UPDATE: {
        // Assemble data to be passed
        const data = {
          mode: DialogMode.UPDATE,
          dialogTitle: 'Update project',
          project,
          projects: Array.from(this.projectsMap.values())
        };

        // Open dialog
        const dialogRef = this.dialog.open(ProjectDialogComponent, {
          disableClose: false,
          data
        });

        // Handle dialog close
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const resultingAction = result.action as Action;
            const resultingProject = result.project as Project;

            this.onProjectEvent({
              action: resultingAction,
              project: resultingProject
            });
          }
        });
        break;
      }
      case Action.FILTER_SINGLE: {
        this.filterService.clearProjects();
        this.filterService.updateProjectsList(projects);
        break;
      }
      case Action.FILTER_LIST: {
        this.filterService.updateProjectsList(projects);
        break;
      }
    }
  }

  /**
   * Handles events targeting a person
   * @param event event parameters
   */
  onPersonEvent(event: { action: Action, person?: Person, persons?: Person[] }) {
    const person = CloneService.clonePerson(event.person as Person);
    const persons = CloneService.clonePersons(event.persons as Person[]);

    switch (event.action) {
      case Action.ADD: {
        this.filterService.updatePersonsListIfNotEmpty([person]);
        this.personService.createPerson(person, this.personsMap).then(() => {
        });
        break;
      }
      case Action.UPDATE: {
        this.filterService.updatePersonsListIfNotEmpty([person]);
        this.personService.updatePerson(person, this.personsMap).then(() => {
        });
        break;
      }
      case Action.DELETE: {
        const referencesTasklets = Array.from(this.taskletsMap.values()).some((tasklet: Tasklet) => {
          return tasklet.personIds != null && tasklet.personIds.some(personId => {
            return personId === person.id;
          });
        });

        if (referencesTasklets) {
          this.dialog.open(InformationDialogComponent, {
            disableClose: false,
            data: {
              title: 'Cannot delete person',
              text: `There are still tasks associated with this person.`,
              action: `Okay`,
              value: person
            }
          });
        } else {
          const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            data: {
              title: 'Delete person',
              text: 'Do you want to delete this person?',
              action: 'Delete',
              value: person
            }
          });
          confirmationDialogRef.afterClosed().subscribe(confirmationResult => {
            if (confirmationResult != null) {
              this.personService.deletePerson((confirmationResult as Person), this.personsMap).then(() => {
              });
              this.filterService.persons.delete((confirmationResult as Person).id);
            }
          });
        }
        break;
      }
      case Action.OPEN_DIALOG_ADD: {
        // Assemble data to be passed
        const data = {
          mode: DialogMode.ADD,
          dialogTitle: 'Add person',
          person: new Person('')
        };

        // Open dialog
        const dialogRef = this.dialog.open(PersonDialogComponent, {
          disableClose: false,
          data
        });

        // Handle dialog close
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const resultingAction = result.action as Action;
            const resultingPerson = result.person as Person;

            this.onPersonEvent({
              action: resultingAction,
              person: resultingPerson
            });
          }
        });
        break;
      }
      case Action.OPEN_DIALOG_UPDATE: {
        // Assemble data to be passed
        const data = {
          mode: DialogMode.UPDATE,
          dialogTitle: 'Update person',
          person
        };

        // Open dialog
        const dialogRef = this.dialog.open(PersonDialogComponent, {
          disableClose: false,
          data
        });

        // Handle dialog close
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const resultingAction = result.action as Action;
            const resultingPerson = result.person as Person;

            this.onPersonEvent({
              action: resultingAction,
              person: resultingPerson
            });
          }
        });
        break;
      }
      case Action.FILTER_SINGLE: {
        this.filterService.clearPersons();
        this.filterService.updatePersonsList(persons);
        break;
      }
      case Action.FILTER_LIST: {
        this.filterService.updatePersonsList(persons);
        break;
      }
    }
  }

  /**
   * Handles events targeting a tag
   * @param event event parameters
   */
  onTagEvent(event: { action: Action, tag?: Tag, tags?: Tag[] }) {
    const tag = CloneService.cloneTag(event.tag as Tag);
    const tags = CloneService.cloneTags(event.tags as Tag[]);

    switch (event.action) {
      case Action.ADD: {
        this.filterService.updateTagsListIfNotEmpty([tag]);
        this.tagService.createTag(tag, this.tagsMap).then(() => {
        });
        break;
      }
      case Action.UPDATE: {
        this.filterService.updateTagsListIfNotEmpty([tag]);
        this.tagService.updateTag(tag, this.tagsMap).then(() => {
        });
        break;
      }
      case Action.DELETE: {
        const referencesTasklets = Array.from(this.taskletsMap.values()).some((tasklet: Tasklet) => {
          return tasklet.tagIds != null && tasklet.tagIds.some(tagId => {
            return tagId === tag.id;
          });
        });
        const referencesTasks = Array.from(this.tasksMap.values()).some((task: Task) => {
          return task.tagIds != null && task.tagIds.some(tagId => {
            return tagId === tag.id;
          });
        });

        if (referencesTasklets || referencesTasks) {
          this.dialog.open(InformationDialogComponent, {
            disableClose: false,
            data: {
              title: 'Cannot delete tag',
              text: `There are still tasks associated with this tag.`,
              action: 'Okay',
              value: tag
            }
          });
        } else {
          const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            data: {
              title: 'Delete tag',
              text: 'Do you want to delete this tag?',
              action: 'Delete',
              value: tag
            }
          });
          confirmationDialogRef.afterClosed().subscribe(confirmationResult => {
            if (confirmationResult != null) {
              this.tagService.deleteTag((confirmationResult as Tag), this.tagsMap).then(() => {
              });
              this.filterService.tags.delete((confirmationResult as Tag).id);
            }
          });
        }
        break;
      }
      case Action.OPEN_DIALOG_ADD: {
        // Assemble data to be passed
        const data = {
          mode: DialogMode.ADD,
          dialogTitle: 'Add tag',
          tag: new Tag('')
        };

        // Open dialog
        const dialogRef = this.dialog.open(TagDialogComponent, {
          disableClose: false,
          data
        });

        // Handle dialog close
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const resultingAction = result.action as Action;
            const resultingTag = result.tag as Tag;

            this.onTagEvent({
              action: resultingAction,
              tag: resultingTag,
            });
          }
        });
        break;
      }
      case Action.OPEN_DIALOG_UPDATE: {
        // Assemble data to be passed
        const data = {
          mode: DialogMode.UPDATE,
          dialogTitle: 'Update tag',
          tag
        };

        // Open dialog
        const dialogRef = this.dialog.open(TagDialogComponent, {
          disableClose: false,
          data
        });

        // Handle dialog close
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const resultingAction = result.action as Action;
            const resultingTag = result.tag as Tag;

            this.onTagEvent({
              action: resultingAction,
              tag: resultingTag
            });
          }
        });
        break;
      }
      case Action.OPEN_DIALOG_REMOVE_UNUSED: {
        // Assemble data to be passed
        const data = {
          dialogTitle: 'Remove unused tags',
          tags
        };

        // Open dialog
        const dialogRef = this.dialog.open(UnusedTagsDialogComponent, {
          disableClose: false,
          data
        });

        // Handle dialog close
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const tagsToDelete = result.tags as Tag[];

            const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
              disableClose: false,
              data: {
                title: 'Delete tags',
                text: `Do you want to delete these tags?\n${tagsToDelete.map(t => {
                  return t.name;
                }).join(', ')}`,
                action: 'Delete',
                value: tagsToDelete
              }
            });
            confirmationDialogRef.afterClosed().subscribe(confirmationResult => {
              if (confirmationResult != null) {
                (confirmationResult as Tag[]).forEach(t => {
                  this.tagService.deleteTag(t, this.tagsMap).then(() => {
                  });
                  this.filterService.tags.delete(t.id);
                });
              }
            });
          }
        });
        break;
      }
      case Action.FILTER_SINGLE: {
        this.filterService.clearTags();
        this.filterService.updateTagsList(tags);
        break;
      }
      case Action.FILTER_LIST: {
        this.filterService.updateTagsList(tags);
        break;
      }
    }
  }

  // </editor-fold>

  //
  // Evaluation
  //

  // <editor-fold defaultstate="collapsed" desc="Evaluation">

  /**
   * Determines whether the task assigned to a given tasklet already exists, otherwise creates a new one
   * @param tasklet tasklet to assign task to
   * @param task task to be checked
   */
  private evaluateTaskletTask(tasklet: Tasklet, task: Task) {
    if (task != null && task.name != null && task.name !== '') {
      // Assign task
      let t = this.taskService.getTaskByName(task.name, this.tasksMap);

      // New task
      if (t == null && task.name != null && task.name !== '') {
        t = new Task(task.name);
        this.taskService.createTask(t, this.tasksMap, this.projectsMap, this.tagsMap).then(() => {
        });
      }

      this.filterService.updateTasksListIfNotEmpty([t]);
      tasklet.taskId = t.id;
    } else {
      // Unassign task
      tasklet.taskId = null;
    }
  }

  /**
   * Determines whether the tags assigned to a given tasklet already exixst, otherwise creates new ones
   * @param tasklet tasklet to assign tags to
   * @param task task the tasklet is associated to
   * @param tags array of tags to be checked
   */
  private evaluateTaskletTags(tasklet: Tasklet, task: Task, tags: Tag[]) {
    const aggregatedTags = new Map<string, Tag>();

    // New tag
    if (tags != null) {
      tags.filter(t => {
        return t != null;
      }).forEach(t => {
        const tag = this.lookupTag(t.name);

        // Exclude tags that are inherited from task
        if (task.tagIds.some(id => id === tag.id)) {
          return;
        }

        aggregatedTags.set(tag.id, tag);
      });
    }

    // Infer tags from meeting minutes
    if (tasklet.meetingMinuteItems != null) {
      tasklet.meetingMinuteItems.filter(m => {
        return m.topic != null;
      }).map(m => {
        return m.topic;
      }).forEach(t => {
        const tag = this.lookupTag(t);

        // Exclude tags that are inherited from task
        if (task.tagIds.some(id => id === tag.id)) {
          return;
        }

        aggregatedTags.set(tag.id, tag);
      });
    }

    const values = Array.from(aggregatedTags.values());
    const keys = Array.from(aggregatedTags.keys());

    this.filterService.updateTagsListIfNotEmpty(values);
    tasklet.tagIds = Array.from(keys);
  }

  /**
   * Returns existing tag if exists or creates a new one if not
   * @param t tag name
   */
  private lookupTag(t: string): Tag {
    let tag = this.tagService.getTagByName(t, this.tagsMap);

    if (tag == null) {
      tag = new Tag(t);
      this.tagService.createTag(tag, this.tagsMap).then(() => {
      });
    }

    return tag;
  }

  /**
   * Determines whether the persons assigned to a given tasklet already exixst, otherwise creates new ones
   * @param tasklet tasklet assign persons to
   * @param persons array of persons to be checked
   */
  private evaluateTaskletPersons(tasklet: Tasklet, persons: Person[]) {
    const aggregatedPersons = new Map<string, Person>();

    // New person
    if (persons != null) {
      persons.filter(p => {
        return p != null;
      }).forEach(p => {
        const person = this.lookupPerson(p.name);
        aggregatedPersons.set(person.id, person);
      });
    }

    // Infer persons from meeting minutes
    if (tasklet.meetingMinuteItems != null) {
      tasklet.meetingMinuteItems.filter(m => {
        return m.person != null;
      }).filter(m => {
        return m.person.name !== this.personService.myself.name;
      }).map(m => {
        return m.person;
      }).forEach(p => {
        const person = this.lookupPerson(p.name);
        aggregatedPersons.set(person.id, person);
      });
    }

    // Infer persons from daily scrum
    if (tasklet.dailyScrumItems != null) {
      tasklet.dailyScrumItems.filter(d => {
        return d.person != null;
      }).filter(m => {
        return m.person.name !== this.personService.myself.name;
      }).map(d => {
        return d.person;
      }).forEach(p => {
        const person = this.lookupPerson(p.name);
        aggregatedPersons.set(person.id, person);
      });
    }

    const values = Array.from(aggregatedPersons.values());
    const keys = Array.from(aggregatedPersons.keys());

    this.filterService.updatePersonsListIfNotEmpty(values);
    tasklet.personIds = Array.from(keys);
  }

  /**
   * Returns existing person if exists or creates a new one if not
   * @param p person name
   */
  private lookupPerson(p: string): Person {
    let person = this.personService.getPersonByName(p, this.personsMap);

    if (person == null) {
      person = new Person(p);
      this.personService.createPerson(person, this.personsMap).then(() => {
      });
    }

    return person;
  }

  /**
   * Determines whether the project assigned to a given task already exists, otherwise creates a new one
   * @param task task to assign project to
   * @param project project to be checked
   */
  private evaluateTaskProject(task: Task, project: Project) {
    if (project != null && project.name != null && project.name !== '') {
      // Assign project
      let p = this.projectService.getProjectByName(project.name, this.projectsMap);

      // New project
      if (p == null && project.name != null && project.name !== '') {
        p = new Project(project.name);
        this.projectService.createProject(p, this.projectsMap).then(() => {
        });
      }

      this.filterService.updateProjectsListIfNotEmpty([p]);
      task.projectId = p.id;
    } else {
      // Unassign project
      task.projectId = null;
    }
  }

  /**
   * Determines whether the delegated-to assigned to a given task already exists, otherwise creates a new person
   * @param task task to be delegated
   * @param delegatedTo person to delegate a task to
   */
  private evaluateTaskDelegatedTo(task: Task, delegatedTo: Person) {
    if (delegatedTo != null && delegatedTo.name != null && delegatedTo.name !== '') {
      // Assign delegatedTo
      let p = this.personService.getPersonByName(delegatedTo.name, this.personsMap);

      // New person
      if (p == null && delegatedTo.name != null && delegatedTo.name !== '') {
        p = new Person(delegatedTo.name);
        this.personService.createPerson(p, this.personsMap).then(() => {
        });
      }

      this.filterService.updatePersonsListIfNotEmpty([p]);
      task.delegatedToId = p.id;
    } else {
      // Unassign delegated-to
      task.delegatedToId = null;
    }
  }

  /**
   * Determines whether the tags assigned to a given task already exixst, otherwise creates new ones
   * @param task task assign tags to
   * @param tags array of tags to be checked
   */
  private evaluateTaskTags(task: Task, tags: Tag[]) {
    if (tags != null) {
      const aggregatedTagIds = new Map<string, string>();

      // New tag
      tags.forEach(t => {
        let tag = this.tagService.getTagByName(t.name, this.tagsMap);

        if (tag == null) {
          tag = new Tag(t.name);
          this.tagService.createTag(tag, this.tagsMap).then(() => {
          });
        }

        this.filterService.updateTagsListIfNotEmpty([tag]);
        aggregatedTagIds.set(tag.id, tag.id);
      });

      task.tagIds = Array.from(aggregatedTagIds.values());
    } else {
      // Unassign tags
      task.tagIds = [];
    }
  }

  // </editor-fold>

  //
  // Inference
  //

  // <editor-fold defaultstate="collapsed" desc="Inference">

  /**
   * Infers persons from a tasklet's description
   * @param text text
   * @returns persons
   */
  protected inferPersons(text: string): Person[] {
    const inferredPersons = new Map<string, Person>();

    if (text != null) {
      text.split('\n').forEach(line => {
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

  /**
   * Infers tags from text
   * @param text text
   * @returns tags
   */
  protected inferTags(text: string): Tag[] {
    const inferredTags = new Map<string, Tag>();

    if (text != null) {
      text.split('\n').forEach(line => {
        line.split(' ').forEach(word => {
          if (word.startsWith('#')
            && word.length > 1 // Exclude single hashes
            && word.charAt(1) !== '#' // Exclude markdown tags
          ) {
            const hashtag = word.replace('#', '');
            inferredTags.set(hashtag, new Tag(hashtag));
          }
        });
      });
    }

    return Array.from(inferredTags.values());
  }

  // </editor-fold>
}
