import {AfterViewInit, Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskletService} from '../../../../core/entity/services/tasklet/tasklet.service';
import {Tasklet} from '../../../../core/entity/model/tasklet.model';
import {map} from 'rxjs/operators';
import {TaskletType} from '../../../../core/entity/model/tasklet-type.enum';
import {Task} from '../../../../core/entity/model/task.model';
import {Description} from '../../../../core/entity/model/description.model';
import {MeetingMinuteItem} from '../../../../core/entity/model/meeting-minutes/meeting-minute-item.model';
import {DailyScrumItem} from '../../../../core/entity/model/daily-scrum/daily-scrum-item.model';
import {Tag} from '../../../../core/entity/model/tag.model';
import {Person} from '../../../../core/entity/model/person.model';
import {DialogMode} from '../../../../core/entity/model/dialog-mode.enum';
import {Action} from '../../../../core/entity/model/action.enum';
import {PersonService} from '../../../../core/entity/services/person/person.service';
import {SuggestionService} from '../../../../core/entity/services/suggestion.service';
import {FilterService} from '../../../../core/entity/services/filter.service';
import {SnackbarService} from '../../../../core/ui/services/snackbar.service';
import {TagService} from '../../../../core/entity/services/tag/tag.service';
import {MatDialog, MatIconRegistry, MatSelect, MatSidenav} from '@angular/material';
import {EmailService} from '../../../../core/mail/services/mail/email.service';
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
import {ProjectService} from '../../../../core/entity/services/project/project.service';
import {ScopeService} from '../../../../core/entity/services/scope.service';
import {SettingType} from '../../../../core/settings/model/setting-type.enum';
import {SettingsService} from '../../../../core/settings/services/settings.service';
import {TaskletDisplayAspect} from '../../../../core/entity/services/tasklet/tasklet-display.service';
import {Setting} from '../../../../core/settings/model/setting.model';
// tslint:disable-next-line:max-line-length
import {PomodoroFinishedDialogComponent} from '../../../../ui/pomodoro-finished-dialog/pomodoro-finished-dialog/pomodoro-finished-dialog.component';
import {BaseComponent} from '../base/base.component';
import {Scope} from '../../../../core/entity/model/scope.enum';

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
export class TaskletComponent
  extends BaseComponent
  implements OnInit, AfterViewInit, OnDestroy {

  /** ID passed as an argument */
  id: string;
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
  taskOptionNames: string[];
  /** Tag options */
  tagOptionNames: string[];
  /** Person options */
  personOptionNames: string[];
  /** Person option representing the user */
  myselfOption: string;

  /** Tasklet type action */
  action: TaskletTypeAction;

  /** Vertical scroll position */
  private scrollPosLast = 0;
  /** Scroll direction */
  public scrollDirection: ScrollDirection = ScrollDirection.UP;
  /** Scroll state */
  public scrollState: ScrollState = ScrollState.NON_SCROLLING;

  /** Sidenav state */
  public sidenavOpened = false;

  /** Side navigation at start */
  @ViewChild('sidenavStart', {static: false}) sidenavStart: MatSidenav;
  /** Side navigation at end */
  @ViewChild('sidenavEnd', {static: false}) sidenavEnd: MatSidenav;
  /** Scrollable directive */
  @ViewChild(CdkScrollable, {static: false}) scrollable: CdkScrollable;
  /** Tasklet type selection */
  @ViewChild('select', {static: false}) select: MatSelect;

  /** Transparent color */
  transparent = 'transparent';

  /** Reference to static method */
  getIconByTaskletType = TaskletComponent.getIconByTaskletType;

  //
  // Static methods
  //

  /**
   * Retrieves an icon by tasklet type
   * @param type tasklet type
   */
  static getIconByTaskletType(type: TaskletType): string {
    return TaskletService.getIconByTaskletType(type);
  }

  /**
   * Constructor
   * @param colorService color service
   * @param dialog dialog
   * @param emailService email service
   * @param filterService filter service
   * @param iconRegistry iconRegistry
   * @param mediaService media service
   * @param materialColorService material color service
   * @param materialIconService material icon service
   * @param scroll scroll
   * @param personService person service
   * @param projectService project service
   * @param route route
   * @param router router
   * @param sanitizer sanitizer
   * @param scopeService scope service
   * @param settingsService settings service
   * @param snackbarService snackbar service
   * @param tagService tag service
   * @param suggestionService suggestion service
   * @param taskletService tasklet service
   * @param taskService task service
   * @param zone Angular zone
   */
  constructor(private colorService: ColorService,
              protected dialog: MatDialog,
              protected emailService: EmailService,
              protected filterService: FilterService,
              protected iconRegistry: MatIconRegistry,
              protected mediaService: MediaService,
              protected materialColorService: MaterialColorService,
              protected materialIconService: MaterialIconService,
              protected personService: PersonService,
              protected projectService: ProjectService,
              private route: ActivatedRoute,
              protected router: Router,
              protected sanitizer: DomSanitizer,
              protected scopeService: ScopeService,
              private scroll: ScrollDispatcher,
              protected settingsService: SettingsService,
              protected snackbarService: SnackbarService,
              protected suggestionService: SuggestionService,
              protected tagService: TagService,
              protected taskletService: TaskletService,
              protected taskService: TaskService,
              protected zone: NgZone) {
    super(dialog,
      emailService,
      filterService,
      iconRegistry,
      materialColorService,
      materialIconService,
      mediaService,
      projectService,
      personService,
      router,
      sanitizer,
      scopeService,
      settingsService,
      snackbarService,
      suggestionService,
      tagService,
      taskletService,
      taskService);
  }

  //
  // Lifecycle hooks
  //

  // <editor-fold defaultstate="collapsed" desc="Lifecycle hooks">

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    super.ngOnInit();
    this.initializeSubscriptions();
    this.initializeMaterial();

    this.route.params.subscribe(() => {
      if (this.route.snapshot != null) {
        this.id = this.route.snapshot.paramMap.get('id');
      }
      this.initializeMode();

      this.taskletService.fetchTaskletByID(this.id);
      this.findEntities();
      this.findSettings();
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
    super.ngOnDestroy();
  }

  // </editor-fold>

  //
  // Events
  //

  // <editor-fold defaultstate="collapsed" desc="Events">

  /**
   * Handles tasklet updates
   * @param tasklet tasklet
   */
  onTaskletUpdated(tasklet: Tasklet) {
    this.initializeTasklet(tasklet);
    this.initializeTaskletTypeAction();
  }

  /**
   * Handles tasklet updates
   * @param tasklets tasklets
   */
  onTaskletsUpdated(tasklets: Map<string, Tasklet>) {
    this.initializeTasklets(tasklets);
    this.initializeOptions();
  }

  /**
   * Handles task updates
   * @param tasks tasks
   */
  onTasksUpdated(tasks: Map<string, Task>) {
    this.initializeTasks(tasks);
    this.initializeTasklet(this.tasklet);
    this.initializeOptions();
  }

  /**
   * Handles project updates
   * @param projects projects
   */
  onProjectsUpdated(projects: Map<string, Project>) {
    this.initializeProjects(projects);
    this.initializeOptions();
  }

  /**
   * Handles person updates
   * @param persons persons
   */
  onPersonsUpdated(persons: Map<string, Person>) {
    this.initializePersons(persons);
    this.initializeOptions();
  }

  /**
   * Handles tag updates
   * @param tags tags
   */
  onTagsUpdated(tags: Map<string, Tag>) {
    this.initializeTags(tags);
    this.initializeOptions();
  }

  /**
   * Handles setting updates
   * @param settings settings
   */
  onSettingsUpdated(settings: Map<string, Setting>) {
    this.initializeSettings(settings);
  }

  /**
   * Handles media updates
   * @param media media
   */
  onMediaUpdated(media: Media) {
    this.media = media as Media;
  }

  // </editor-fold>

  //
  // Initialization
  //

  // <editor-fold defaultstate="collapsed" desc="Initialization">

  /**
   * Initialize subscriptions
   */
  private initializeSubscriptions() {
    this.initializeTaskletSubscription().subscribe(value => {
      this.onTaskletUpdated(value as Tasklet);
    });
    this.initializeTaskletsSubscription().subscribe(value => {
      this.onTaskletsUpdated(value as Map<string, Tasklet>);
    });
    this.initializeTasksSubscription().subscribe(value => {
      this.onTasksUpdated(value as Map<string, Task>);
    });
    this.initializeProjectsSubscription().subscribe(value => {
      this.onProjectsUpdated(value as Map<string, Project>);
    });
    this.initializePersonsSubscription().subscribe(value => {
      this.onPersonsUpdated(value as Map<string, Person>);
    });
    this.initializeTagsSubscription().subscribe(value => {
      this.onTagsUpdated(value as Map<string, Tag>);
    });
    this.initializeSettingsSubscription().subscribe(value => {
      this.onSettingsUpdated(value as Map<string, Setting>);
    });
    this.initializeMediaSubscription().subscribe(value => {
      this.onMediaUpdated(value as Media);
    });
  }

  /**
   * Initializes tasklet
   * @param tasklet tasklet to be initialized
   */
  private initializeTasklet(tasklet: Tasklet) {
    this.tasklet = tasklet;

    this.task = (this.tasklet != null) ? this.tasksMap.get(this.tasklet.taskId) : null;
    this.project = (this.task != null) ? this.projectsMap.get(this.task.projectId) : null;

    this.tasklets = (this.tasklet != null) ? this.taskletService
      .getTaskletsByTask(this.task, this.taskletsMap)
      .filter(t => {
        // Exclude current tasklet from history
        return t.id !== this.tasklet.id;
      }).sort(TaskletService.sortTaskletsByCreationDate) : [];

    this.persons = (this.tasklet != null) ? this.tasklet.personIds.map(id => {
      return this.personsMap.get(id);
    }).filter(person => {
      return person != null;
    }) : [];

    this.tags = (this.tasklet != null) ? this.tasklet.tagIds.map(id => {
      return this.tagsMap.get(id);
    }).filter(tag => {
      return tag != null;
    }) : [];
  }

  /**
   * Initializes tasklets by filtering them
   * @param taskletsMap tasklets map
   */
  private initializeTasklets(taskletsMap: Map<string, Tasklet>) {
    this.taskletsMap = new Map(taskletsMap);
    this.tasklets = this.taskletService
      .getTaskletsByTask(this.task, taskletsMap)
      .sort(TaskletService.sortTaskletsByCreationDate);
  }

  /**
   * Initializes tasks
   * @param tasks tasks
   */
  private initializeTasks(tasks: Map<string, Task>) {
    this.tasksMap = tasks;
    this.task = (this.tasklet != null) ? this.tasksMap.get(this.tasklet.taskId) : null;
  }

  /**
   * Initializes projects
   * @param projects projects
   */
  private initializeProjects(projects: Map<string, Project>) {
    this.projectsMap = projects;
    this.project = (this.task != null) ? this.projectsMap.get(this.task.projectId) : null;
  }

  /**
   * Initializes persons
   * @param persons persons
   */
  private initializePersons(persons: Map<string, Person>) {
    this.personsMap = persons;
    this.persons = (this.tasklet != null) ? this.tasklet.personIds.map(id => {
      return this.personsMap.get(id);
    }).filter(person => {
      return person != null;
    }) : [];
  }

  /**
   * Initializes tags
   * @param tags tags
   */
  private initializeTags(tags: Map<string, Tag>) {
    this.tagsMap = tags;
    this.tags = (this.tasklet != null) ? this.tasklet.tagIds.map(id => {
      return this.tagsMap.get(id);
    }).filter(tag => {
      return tag != null;
    }) : [];
  }

  /**
   * Initialize settings
   * @param settings settings
   */
  private initializeSettings(settings: Map<string, Setting>) {
    this.settingsMap = settings;
    this.sidenavOpened = SettingsService.isSettingActive(SettingType.TASKLET_SIDENAV_OPENED, this.settingsMap);
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
    this.tagOptionNames = Array.from(this.suggestionService.tagOptions.values()).sort((t1, t2) => {
      return new Date(t2.modificationDate).getTime() > new Date(t1.modificationDate).getTime() ? 1 : -1;
    }).map(t => {
      return t.name;
    });
    this.personOptionNames = Array.from(this.suggestionService.personOptions.values()).sort((p1, p2) => {
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
    this.action.icon = TaskletService.getIconByTaskletType(this.tasklet.type);
    this.action.label = this.tasklet.type.toString();
    this.action.taskletTypes = Object.keys(TaskletType).map(key => TaskletType[key]).filter(type => {
      const settingDevelopmemt = this.settingsMap.get(SettingType.DEVELOPMENT);
      const settingPomodoro = this.settingsMap.get(SettingType.POMODORO);
      const settingScrum = this.settingsMap.get(SettingType.SCRUM);

      return type !== TaskletType.DEVELOPMENT
        && !(this.taskletService.groupContainsType(TaskletTypeGroup.DEVELOPMENT, type)
          && !(settingDevelopmemt != null && settingDevelopmemt.value))
        && !(type === TaskletType.POMODORO && !(settingPomodoro != null && settingPomodoro.value))
        && !(type === TaskletType.DAILY_SCRUM && !(settingScrum != null && settingScrum.value))
        && type !== TaskletType.POMODORO_BREAK;
    });
  }

  /**
   * Initializes mode
   */
  private initializeMode() {
    if (this.id === null) {
      this.mode = DialogMode.ADD;
    } else {
      this.mode = DialogMode.UPDATE;
    }
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

  // </editor-fold>

  //
  // Actions
  //

  // <editor-fold defaultstate="collapsed" desc="Actions">

  /**
   * Handles click on menu items
   * @param menuItem menu item that has been clicked
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
      default: {
        break;
      }
    }
  }

  /**
   * Handles click on tasklet type action button
   */
  onTaskletTypeActionButtonClicked() {
    if (this.containsDisplayAspect(TaskletDisplayAspect.IS_POMODORO_STARTED, this.tasklet)) {
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
    taskletPomodoroBreak.pomodoroBreak = +this.settingsMap.get(SettingType.POMODORO_BREAK).value;

    // Save finished pomodoro tasklet
    this.updateTasklet();

    const confirmationDialogRef = this.dialog.open(PomodoroFinishedDialogComponent, {
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
   * @param event event
   */
  onKeyDown(event: any) {
    if (event.key === 'Enter' && event.ctrlKey) {
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

  // </editor-fold>

  //
  // Button actions
  //

  // <editor-fold defaultstate="collapsed" desc="Button action">

  /**
   * Handles click on button
   * @param action action
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

  // </editor-fold>

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
  private sendMeetingMinutes() {
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
  private sendDailyScrumSummary() {
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
   * Determines whether the displayed tasklet contains a specific display aspect
   * @param displayAspect display aspect
   * @param tasklet tasklet
   * @param task task
   */
  public containsDisplayAspect(displayAspect: TaskletDisplayAspect, tasklet: Tasklet, task?: Task): boolean {
    return this.taskletService.containsDisplayAspect(displayAspect, tasklet, task);
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
    this.inferTags(tasklet.description.value).forEach(t => {
      aggregatedTags.set(t.name, t);
    });

    return Array.from(aggregatedTags.values());
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
    this.inferPersons(tasklet.description.value).forEach(p => {
      aggregatedPersons.set(p.name, p);
    });

    return Array.from(aggregatedPersons.values());
  }
}
