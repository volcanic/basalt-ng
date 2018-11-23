import {AfterViewInit, Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskletService} from '../../../../core/entity/services/tasklet/tasklet.service';
import {Tasklet} from '../../../../core/entity/model/tasklet.model';
import {map, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {TaskletType} from '../../../../core/entity/model/tasklet-type.enum';
import {Task} from '../../../../core/entity/model/task.model';
import {Description} from '../../../../core/entity/model/description.model';
import {MeetingMinuteItem} from '../../../../core/entity/model/meeting-minutes/meeting-minute-item.model';
import {DailyScrumItem} from '../../../../core/entity/model/daily-scrum/daily-scrum-item.model';
import {Tag} from '../../../../core/entity/model/tag.model';
import {Person} from '../../../../core/entity/model/person.model';
import {DialogMode} from '../../../../core/entity/model/dialog-mode.enum';
import {Action} from '../../../../core/entity/model/action.enum';
import {PersonService} from '../../../../core/entity/services/person.service';
import {SuggestionService} from '../../../../core/entity/services/suggestion.service';
import {CloneService} from '../../../../core/entity/services/clone.service';
import {FilterService} from '../../../../core/entity/services/filter.service';
import {SnackbarService} from '../../../../core/ui/services/snackbar.service';
import {TagService} from '../../../../core/entity/services/tag.service';
import {MatDialog, MatDialogConfig, MatIconRegistry, MatSelect, MatSidenav} from '@angular/material';
import {ConfirmationDialogComponent} from '../../../../ui/confirmation-dialog/confirmation-dialog/confirmation-dialog.component';
import {EmailService} from '../../../../core/mail/services/mail/email.service';
import {DateService} from '../../../../core/entity/services/date.service';
import {TaskService} from '../../../../core/entity/services/task/task.service';
import {MaterialColorService} from '../../../../core/ui/services/material-color.service';
import {MaterialIconService} from '../../../../core/ui/services/material-icon.service';
import {DomSanitizer} from '@angular/platform-browser';
import {CdkScrollable, ScrollDispatcher} from '@angular/cdk/overlay';
import {Media} from '../../../../core/ui/model/media.enum';
import {MediaService} from '../../../../core/ui/services/media.service';
import {Animations, ScrollDirection, ScrollState} from './tasklet.animation';
import {TaskletTypeGroup} from '../../../../core/entity/model/tasklet-type-group.enum';
import {ColorService} from '../../../../core/ui/services/color.service';
import {Project} from '../../../../core/entity/model/project.model';
import {ProjectService} from '../../../../core/entity/services/project.service';
import {ScopeService} from '../../../../core/entity/services/scope.service';
import {SettingType} from '../../../../core/settings/model/setting-type.enum';
import {SettingsService} from '../../../../core/settings/services/settings.service';
import {DisplayAspect} from '../../../../core/entity/services/tasklet/tasklet-display.service';
import {Setting} from '../../../../core/settings/model/setting.model';
import {PomodoroFinishedDialogComponent} from '../../../../ui/pomodoro-finished-dialog/pomodoro-finished-dialog/pomodoro-finished-dialog.component';

/**
 * Represents a tasklet type action button
 */
class TaskletTypeAction {

  /** Tasklet type group */
  group: TaskletTypeGroup;
  /** Label to be displayed */
  label: string;
  /** Icon to be used */
  icon: string;
  /** Background color to be used */
  backgroundColor: string;
  /** Background color to be used */
  iconColor: string;
  /** Tasklet types in context menu */
  taskletTypes = [];
}

/**
 * Displays a tasklet in fullscreen mode
 */
@Component({
  selector: 'app-tasklet',
  templateUrl: './tasklet.component.html',
  styleUrls: ['./tasklet.component.scss'],
  animations: [
    Animations.toolbarAnimation,
    Animations.fabAnimation,
    Animations.dateIndicatorAnimation,
  ]
})
export class TaskletComponent implements OnInit, AfterViewInit, OnDestroy {

  /** ID passed as an argument */
  id: string;
  /** Enum of dialog modes */
  public modeType = DialogMode;
  /** Current dialog mode */
  public mode: DialogMode = DialogMode.NONE;

  /** Tasklet to be displayed */
  tasklet: Tasklet = new Tasklet();
  /** Description of previous tasklet */
  previousDescription = new Description();

  /** Temporarily displayed task */
  task: Task;
  /** Temporarily displayed project */
  project: Project;
  /** Temporarily displayed tags */
  tags: Tag[] = [];
  /** Temporarily displayed persons */
  persons: Person[] = [];

  /** Tasklets associated with with task */
  tasklets: Tasklet[] = [];

  /** Placeholder text for description */
  placeholderDescription = 'Empty';

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
  /** Tasklet type action */
  action: TaskletTypeAction;

  /** Enum of display aspects */
  displayAspectType = DisplayAspect;

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /** Enum of media types */
  public mediaType = Media;
  /** Current media */
  public media: Media = Media.UNDEFINED;

  /** Vertical scroll position */
  private scrollPosLast = 0;
  /** Scroll direction */
  public scrollDirection: ScrollDirection = ScrollDirection.UP;
  /** Scroll state */
  public scrollState: ScrollState = ScrollState.NON_SCROLLING;

  /** Sidenav state */
  public sidenavOpened = false;

  /** Side navigation at start */
  @ViewChild('sidenavStart') sidenavStart: MatSidenav;
  /** Side navigation at end */
  @ViewChild('sidenavEnd') sidenavEnd: MatSidenav;
  /** Scrollable directive */
  @ViewChild(CdkScrollable) scrollable: CdkScrollable;
  /** Tasklet type selection */
  @ViewChild('select') select: MatSelect;

  /** Transparent color */
  transparent = 'transparent';

  /**
   * Constructor
   * @param colorService color service
   * @param emailService email service
   * @param filterService filter service
   * @param mediaService media service
   * @param {MaterialColorService} materialColorService
   * @param {MaterialIconService} materialIconService
   * @param {ScrollDispatcher} scroll scroll
   * @param personService person service
   * @param projectService project service
   * @param scopeService scope service
   * @param settingsService settings service
   * @param snackbarService snackbar service
   * @param tagService tag service
   * @param suggestionService suggestion service
   * @param taskletService tasklet service
   * @param taskService task service
   * @param route route
   * @param router router
   * @param iconRegistry iconRegistry
   * @param sanitizer sanitizer
   * @param dialog dialog
   * @param {NgZone} zone Angular zone
   */
  constructor(private colorService: ColorService,
              private emailService: EmailService,
              private filterService: FilterService,
              private mediaService: MediaService,
              private materialColorService: MaterialColorService,
              private materialIconService: MaterialIconService,
              private personService: PersonService,
              private projectService: ProjectService,
              private scopeService: ScopeService,
              private scroll: ScrollDispatcher,
              private settingsService: SettingsService,
              private snackbarService: SnackbarService,
              private suggestionService: SuggestionService,
              private tagService: TagService,
              private taskletService: TaskletService,
              private taskService: TaskService,
              private route: ActivatedRoute,
              private router: Router,
              private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer,
              public dialog: MatDialog,
              public zone: NgZone) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeParameters();
    this.initializeResolvedData();
    this.initializeTaskletSubscription();

    this.initializeMaterial();
    this.initializeMediaSubscription();

    this.initializeSettings();

    this.findEntities();

    this.route.params.subscribe(() => {
      this.id = this.route.snapshot.paramMap.get('id');
      this.findEntities();
    });
  }

  /**
   * Handles after-view-init lifecycle phase
   */
  ngAfterViewInit() {
    this.initializeScrollDetection();
  }

  /**
   * Handles on-destroy lifecycle phase
   */
  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

  //
  // Initialization
  //

  /**
   * Initializes parameters
   */
  private initializeParameters() {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id === null) {
      this.mode = DialogMode.ADD;
    } else {
      this.mode = DialogMode.UPDATE;
    }
  }

  /**
   * Initializes resolved data
   */
  private initializeResolvedData() {
    const resolved = this.route.snapshot.data['tasklet'];
    if (resolved != null) {
      this.initializeTasklet(resolved as Tasklet);
      this.initializeTaskletTypeAction();
    }
  }

  /**
   * Initializes tasklet subscription
   */
  private initializeTaskletSubscription() {
    this.taskletService.taskletSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        this.initializeTasklet(value as Tasklet);
        this.initializeTaskletTypeAction();
      }
    });

    this.taskletService.taskletsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        this.initializeOptions();
      }
    });
  }

  /**
   * Initializes tasklet
   * @param tasklet tasklet to be initialized
   */
  private initializeTasklet(tasklet: Tasklet) {
    this.tasklet = tasklet;
    if (tasklet != null) {
      this.task = this.taskService.tasks.get(tasklet.taskId);
      if (this.task != null) {
        this.project = this.projectService.projects.get(this.task.projectId);
        this.tasklets = this.taskletService.getTaskletsByTask(this.task).filter(t => {
          // Exclude current tasklet from history
          return t.id !== this.tasklet.id;
        });
      }
      this.tags = tasklet.tagIds.map(id => {
        return this.tagService.tags.get(id);
      }).filter(tag => {
        return tag != null;
      });
      this.persons = tasklet.personIds.map(id => {
        return this.personService.persons.get(id);
      }).filter(person => {
        return person != null;
      });
    }
  }

  /**
   * Initializes material colors and icons
   */
  private initializeMaterial() {
    this.materialColorService.initializeColors();
    this.materialIconService.initializeIcons(this.iconRegistry, this.sanitizer);
  }

  /**
   * Initializes media subscription
   */
  private initializeMediaSubscription() {
    this.media = this.mediaService.media;
    this.mediaService.mediaSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      this.media = value as Media;
    });
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

  /**
   * Initializes tasklet type action
   */
  private initializeTaskletTypeAction() {
    const group = this.taskletService.getTaskletGroupByType(this.tasklet.type);

    this.action = new TaskletTypeAction();
    this.action.group = group;
    this.action.backgroundColor = this.colorService.getTaskletTypeGroupColor(group).color;
    this.action.iconColor = this.colorService.getTaskletTypeGroupColor(group).contrast;
    this.action.icon = this.taskletService.getIconByTaskletType(this.tasklet.type);
    this.action.label = this.tasklet.type.toString();
    this.action.taskletTypes = Object.keys(TaskletType).map(key => TaskletType[key]).filter(type => {
      const settingDevelopmemt = this.settingsService.settings.get(SettingType.DEVELOPMENT);
      const settingPomodoro = this.settingsService.settings.get(SettingType.POMODORO);
      const settingScrum = this.settingsService.settings.get(SettingType.SCRUM);

      return type !== TaskletType.DEVELOPMENT
        && !(this.taskletService.groupContainsType(TaskletTypeGroup.DEVELOPMENT, type) && !(settingDevelopmemt != null && settingDevelopmemt.value))
        && !(type === TaskletType.POMODORO && !(settingPomodoro != null && settingPomodoro.value))
        && !(type === TaskletType.DAILY_SCRUM && !(settingScrum != null && settingScrum.value))
        && type !== TaskletType.POMODORO_BREAK;
    });
  }

  /**
   * Initializes settings
   */
  private initializeSettings() {
    this.settingsService.fetch();
    this.settingsService.settingsSubject.subscribe(value => {
      if (value != null) {
        this.sidenavOpened = this.settingsService.isSettingActive(SettingType.TASKLET_SIDENAV_OPENED);
      }
    });
  }

  /**
   * Triggers entity retrieval from database
   */
  private findEntities() {
    this.taskletService.findTaskletByID(this.id);
    this.taskletService.findTaskletsByScope(this.scopeService.scope);
  }

  /**
   * Initializes scroll detection
   */
  private initializeScrollDetection() {
    let scrollTimeout = null;

    this.scroll.scrolled(0)
      .pipe(map(() => {
        // Update scroll state
        this.scrollState = ScrollState.SCROLLING;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          this.scrollState = ScrollState.NON_SCROLLING;
        }, 500);

        // Update scroll direction
        const scrollPos = this.scrollable.getElementRef().nativeElement.scrollTop;
        if (this.scrollDirection === ScrollDirection.UP && scrollPos > this.scrollPosLast) {
          this.scrollDirection = ScrollDirection.DOWN;
          // Since scroll is run outside Angular zone change detection must be triggered manually
          this.zone.run(() => {
          });
        } else if (this.scrollDirection === ScrollDirection.DOWN && scrollPos < this.scrollPosLast) {
          this.scrollDirection = ScrollDirection.UP;
          // Since scroll is run outside Angular zone change detection must be triggered manually
          this.zone.run(() => {
          });
        }

        // Save current scroll position
        this.scrollPosLast = scrollPos;
      })).subscribe();
  }

  //
  // Actions
  //

  /**
   * Handles click on menu items
   * @param {string} menuItem menu item that has been clicked
   */
  onMenuItemClicked(menuItem: string) {
    switch (menuItem) {
      case 'menu': {
        this.sidenavStart.toggle().then(() => {
          this.settingsService.updateSetting(new Setting(SettingType.TASKLET_SIDENAV_OPENED, this.sidenavStart.opened));
        });
        this.sidenavEnd.toggle().then(() => {
        });
        break;
      }
    }
  }

  /**
   * Handles click on tasklet type action button
   */
  ontTaskletTypeActionButtonClicked() {
    if (this.containsDisplayAspect(DisplayAspect.IS_POMODORO_STARTED, this.tasklet)) {
      this.snackbarService.showSnackbar('Tasklet type cannot be changed after pomodoro session has been started');
    } else {
      this.select.open();
    }
  }

  /**
   * Handles selection of tasklet type
   * @param taskletType tasklet type action
   */
  onTaskletTypeSelected(taskletType: TaskletType) {
    this.tasklet.type = taskletType;
    this.initializeTaskletTypeAction();
  }

  /**
   * Handles task name changes
   * @param taskName new task name
   */
  onTaskNameChanged(taskName: string) {
    this.task.name = taskName;
  }

  /**
   * Handles pomodoro task changes
   * @param text text
   */
  onPomodoroTaskChanged(text: string) {
    this.tasklet.pomodoroTask.value = text;
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
   * Handles pomodoro timer running out
   */
  onPomodoroTimerOver() {
    const taskletPomodoroBreak = new Tasklet();
    taskletPomodoroBreak.type = TaskletType.POMODORO_BREAK;
    taskletPomodoroBreak.pomodoroBreak = +this.settingsService.settings.get(SettingType.POMODORO_BREAK).value;

    // Save finished pomodoro tasklet
    this.updateTasklet();

    const confirmationDialogRef = this.dialog.open(PomodoroFinishedDialogComponent, <MatDialogConfig>{
      disableClose: false,
      data: {
        title: 'Pomodoro completed',
        text: 'Check it like a polaroid picture!',
        action: `Have a ${taskletPomodoroBreak.pomodoroBreak}min break`,
        value: taskletPomodoroBreak
      }
    });
    confirmationDialogRef.afterClosed().subscribe(confirmationResult => {
      if (confirmationResult != null) {
        this.onTaskletEvent({action: Action.ADD, tasklet: confirmationResult as Tasklet});
        this.router.navigate([`/tasklet/${taskletPomodoroBreak.id}`]).then(() => {
        });
      }
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
   * Handles click on button
   * @param action
   */
  onButtonClicked(action: Action) {
    switch (action) {
      case Action.ADD: {
        this.addTasklet();
        break;
      }
      case Action.UPDATE: {
        this.updateTasklet();
        break;
      }
      case Action.CONTINUE: {
        this.continueTasklet();
        break;
      }
      case Action.DELETE: {
        this.deleteTasklet();
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
   * Adds a tasklet
   */
  private addTasklet() {
    this.tags = this.aggregateTags(this.tasklet);
    this.persons = this.aggregatePersons(this.tasklet);

    this.onTaskletEvent({
      action: Action.ADD,
      tasklet: this.tasklet,
      task: this.task,
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

    this.onTaskletEvent({
      action: Action.UPDATE,
      tasklet: this.tasklet,
      task: this.task,
      tags: this.tags,
      persons: this.persons
    });
  }

  /**
   * Continues a tasklet
   */
  private continueTasklet() {
    this.onTaskletEvent({action: Action.ADD, tasklet: this.tasklet, tags: this.tags, task: this.task});
  }

  /**
   * Deletes a tasklet
   */
  private deleteTasklet() {
    this.onTaskletEvent({action: Action.DELETE, tasklet: this.tasklet});
  }

  /**
   * Start a pomodoro
   */
  private startPomodoro() {
    this.onTaskletEvent({
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

    this.onTaskletEvent({
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

    this.onTaskletEvent({
      action: Action.SEND_MAIL_DAILY_SCRUM_SUMMARY,
      tasklet: this.tasklet,
      task: this.task,
      tags: this.tags,
      persons: this.persons
    });
  }

  /**
   * Handles events targeting a tasklet
   * @param {any} event event parameters
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
        this.evaluateTaskletTags(tasklet, tags);
        this.evaluateTaskletPersons(tasklet, persons);

        // Create tasklet itself
        this.taskletService.createTasklet(tasklet).then(() => {
          this.snackbarService.showSnackbar('Added tasklet');
        });
        break;
      }
      case Action.UPDATE: {
        // Create new entities if necessary
        this.evaluateTaskletTask(tasklet, task);
        this.evaluateTaskletTags(tasklet, tags);
        this.evaluateTaskletPersons(tasklet, persons);

        // Update tasklet itself
        this.taskletService.updateTasklet(tasklet).then(() => {
          this.snackbarService.showSnackbar('Updated tasklet');
        });
        break;
      }
      case Action.DELETE: {
        const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, <MatDialogConfig>{
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
            this.taskletService.deleteTasklet(confirmationResult as Tasklet).then(() => {
            });
          }
        });
        break;
      }
      case Action.SEND_MAIL_MEETING_MINUTES: {
        // Update tasklet
        this.onTaskletEvent({
          action: Action.UPDATE,
          tasklet: tasklet,
          task: task,
          tags: tags,
          persons: persons
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
          tasklet: tasklet,
          task: task,
          tags: tags,
          persons: persons
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
      case Action.POMODORO_START: {
        // Set pomodoro duration and start time
        tasklet.pomodoroDuration = +this.settingsService.settings.get(SettingType.POMODORO_DURATION).value;
        tasklet.pomodoroBreak = +this.settingsService.settings.get(SettingType.POMODORO_BREAK).value;
        tasklet.pomodoroStartTime = new Date();

        // Update tasklet
        this.onTaskletEvent({
          action: Action.UPDATE,
          tasklet: tasklet,
          task: task,
          tags: tags,
          persons: persons
        });

        break;
      }
    }
  }

  //
  // Helpers
  //

  /**
   * Determines whether the task assigned to a given tasklet already exists, otherwise creates a new one
   * @param tasklet tasklet to assign task to
   * @param task task to be checked
   */
  private evaluateTaskletTask(tasklet: Tasklet, task: Task) {
    if (task != null && task.name != null && task.name !== '') {
      // Assign task
      let t = this.taskService.getTaskByName(task.name);

      // New task
      if (t == null && task.name != null && task.name !== '') {
        t = new Task(task.name);
        this.taskService.createTask(t, false).then(() => {
          this.filterService.updateTasksListIfNotEmpty([task]);
        });
      }

      tasklet.taskId = t.id;
    } else {
      // Unassign task
      tasklet.taskId = null;
    }
  }

  /**
   * Determines whether the tags assigned to a given tasklet already exixst, otherwise creates new ones
   * @param {Tasklet} tasklet tasklet to assign tags to
   * @param {Tag[]} tags array of tags to be checked
   */
  private evaluateTaskletTags(tasklet: Tasklet, tags: Tag[]) {

    const aggregatedTags = new Map<string, Tag>();

    // New tag
    if (tags != null) {
      tags.filter(t => {
        return t != null;
      }).forEach(t => {
        const tag = this.lookupTag(t.name);
        aggregatedTags.set(tag.name, tag);
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
        aggregatedTags.set(tag.name, tag);
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
    let tag = this.tagService.getTagByName(t);

    if (tag == null) {
      tag = new Tag(t);
      this.tagService.createTag(tag).then(() => {
      });
    }

    return tag;
  }

  /**
   * Determines whether the persons assigned to a given tasklet already exixst, otherwise creates new ones
   * @param {Tasklet} tasklet tasklet assign persons to
   * @param {Person[]} persons array of persons to be checked
   */
  private evaluateTaskletPersons(tasklet: Tasklet, persons: Person[]) {
    const aggregatedPersons = new Map<string, Person>();

    // New person
    if (persons != null) {
      persons.filter(p => {
        return p != null;
      }).forEach(p => {
        const person = this.lookupPerson(p.name);
        aggregatedPersons.set(person.name, person);
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
        aggregatedPersons.set(person.name, person);
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
        aggregatedPersons.set(person.name, person);
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
    let person = this.personService.getPersonByName(p);

    if (person == null) {
      person = new Person(p);
      this.personService.createPerson(person).then(() => {
      });
    }

    return person;
  }

  //
  // Helpers (UI)
  //

  /**
   * Retrieves an icon by tasklet type
   * @param type tasklet type
   */
  public getIconByTaskletType(type: TaskletType): string {
    return this.taskletService.getIconByTaskletType(type);
  }

  /**
   * Determines whether the displayed tasklet contains a specific display aspect
   * @param displayAspect display aspect
   * @param tasklet tasklet
   * @param task task
   */
  public containsDisplayAspect(displayAspect: DisplayAspect, tasklet: Tasklet, task?: Task): boolean {
    return this.taskletService.containsDisplayAspect(displayAspect, tasklet, task);
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
      aggregatedTags.set(t.name, t);
    });
    this.inferTags(tasklet).forEach(t => {
      aggregatedTags.set(t.name, t);
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
      aggregatedPersons.set(p.name, p);
    });
    this.inferPersons(tasklet).forEach(p => {
      aggregatedPersons.set(p.name, p);
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
