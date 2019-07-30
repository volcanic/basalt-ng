import {AfterViewInit, Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DialogMode} from '../../../../core/entity/model/dialog-mode.enum';
import {Tasklet} from '../../../../core/entity/model/tasklet.model';
import {Task} from '../../../../core/entity/model/task.model';
import {Project} from '../../../../core/entity/model/project.model';
import {Tag} from '../../../../core/entity/model/tag.model';
import {Person} from '../../../../core/entity/model/person.model';
import {TaskletType} from '../../../../core/entity/model/tasklet-type.enum';
import {Media} from '../../../../core/ui/model/media.enum';
import {MatDialog, MatIconRegistry, MatSidenav} from '@angular/material';
import {CdkScrollable, ScrollDispatcher} from '@angular/cdk/overlay';
import {ColorService} from '../../../../core/ui/services/color.service';
import {EmailService} from '../../../../core/mail/services/mail/email.service';
import {FilterService} from '../../../../core/entity/services/filter.service';
import {MediaService} from '../../../../core/ui/services/media.service';
import {MaterialColorService} from '../../../../core/ui/services/material-color.service';
import {MaterialIconService} from '../../../../core/ui/services/material-icon.service';
import {PersonService} from '../../../../core/entity/services/person/person.service';
import {ProjectService} from '../../../../core/entity/services/project/project.service';
import {ScopeService} from '../../../../core/entity/services/scope.service';
import {SettingsService} from '../../../../core/settings/services/settings.service';
import {SnackbarService} from '../../../../core/ui/services/snackbar.service';
import {SuggestionService} from '../../../../core/entity/services/suggestion.service';
import {TagService} from '../../../../core/entity/services/tag/tag.service';
import {TaskletService} from '../../../../core/entity/services/tasklet/tasklet.service';
import {TaskService} from '../../../../core/entity/services/task/task.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {map} from 'rxjs/operators';
import {Action} from '../../../../core/entity/model/action.enum';
import {Animations, ScrollDirection, ScrollState} from './task.animation';
import {Setting} from '../../../../core/settings/model/setting.model';
import {SettingType} from '../../../../core/settings/model/setting-type.enum';
import {TaskDisplayAspect} from '../../../../core/entity/services/task/task-display.service';
import {BaseComponent} from '../base/base.component';

/**
 * Represents a tasklet type action button
 */
class TaskletTypeAction {

  /** Label to be displayed */
  label: string;
  /** Icon to be used */
  icon: string;
  /** Background color to be used */
  backgroundColor: string;
  /** Background color to be used */
  iconColor: string;
}

/**
 * Displays a task in fullscreen mode
 */
@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  animations: [
    Animations.toolbarAnimation,
    Animations.fabAnimation,
    Animations.dateIndicatorAnimation,
  ]
})
export class TaskComponent
  extends BaseComponent
  implements OnInit, AfterViewInit, OnDestroy {

  /** ID passed as an argument */
  id: string;
  /** Current dialog mode */
  public mode: DialogMode = DialogMode.NONE;

  /** Task to be displayed */
  task: Task = new Task();
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

  /** Tasklets associated with with task */
  tasklets: Tasklet[] = [];

  /** Project options */
  projectOptions = new Map<string, Project>();
  /** Person options */
  personOptions = new Map<string, Person>();
  /** Tag options */
  tagOptions = new Map<string, Tag>();

  /** Tasklet type action */
  action: TaskletTypeAction;

  /** Placeholder text for description */
  placeholderDescription = 'empty';

  /** Vertical scroll position */
  private scrollPosLast = 0;
  /** Scroll direction */
  public scrollDirection: ScrollDirection = ScrollDirection.UP;
  /** Scroll state */
  public scrollState: ScrollState = ScrollState.NON_SCROLLING;

  /** Indicates whether properties form is opened */
  propertiesOpened = true;
  /** Sidenav state */
  public sidenavOpened = false;

  /** Side navigation at start */
  @ViewChild('sidenavStart', {static: false}) sidenavStart: MatSidenav;
  /** Side navigation at end */
  @ViewChild('sidenavEnd', {static: false}) sidenavEnd: MatSidenav;
  /** Scrollable directive */
  @ViewChild(CdkScrollable, {static: false}) scrollable: CdkScrollable;

  /** Transparent color */
  transparent = 'transparent';

  /** Reference to static method */
  containsDisplayAspect = TaskComponent.containsDisplayAspect;
  /** Reference to static method */
  getIconByTaskletType = TaskComponent.getIconByTaskletType;

  //
  // Static methods
  //

  /**
   * Determines whether the displayed task contains a specific display aspect
   * @param displayAspect display aspect
   * @param task task
   */
  static containsDisplayAspect(displayAspect: TaskDisplayAspect, task: Task): boolean {
    return TaskService.containsDisplayAspect(displayAspect, task);
  }

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
   * @param personService person service
   * @param projectService project service
   * @param route route
   * @param router router
   * @param sanitizer sanitizer
   * @param scopeService scope service
   * @param scroll scroll
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
    this.initializeTaskletsSubscription().subscribe((value) => {
      this.initializeTasklets(value as Map<string, Tasklet>);
    });
    this.initializeTaskSubscription().subscribe((value) => {
      this.initializeTask(value as Task);
      this.initializeTaskletTypeAction();
    });
    this.initializeTasksSubscription().subscribe((value) => {
      this.initializeTasks(value as Map<string, Task>);
      this.initializeOptions();
    });
    this.initializeProjectsSubscription().subscribe((value) => {
      this.initializeProjects(value as Map<string, Project>);
      this.initializeTaskletTypeAction();
      this.initializeOptions();
    });
    this.initializePersonsSubscription().subscribe((value) => {
      this.initializePersons(value as Map<string, Person>);
      this.initializeOptions();
    });
    this.initializeTagsSubscription().subscribe((value) => {
      this.initializeTags(value as Map<string, Tag>);
      this.initializeOptions();
    });
    this.initializeMediaSubscription().subscribe((value) => {
      this.media = value as Media;
    });

    this.initializeMaterial();
    this.initializeSettings();

    this.route.params.subscribe(() => {
      if (this.route.snapshot != null) {
        this.id = this.route.snapshot.paramMap.get('id');
      }
      this.initializeMode();

      this.taskService.fetchTaskByID(this.id);
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
    super.ngOnDestroy();
  }

  // </editor-fold>

  //
  // Initialization
  //

  // <editor-fold defaultstate="collapsed" desc="Initialization">

  /**
   * Initializes task
   * @param task task to be initialized
   */
  private initializeTask(task: Task) {
    this.task = task;

    this.project = (this.task != null) ? this.projectsMap.get(this.task.projectId) : null;
    this.tasklets = this.taskletService
      .getTaskletsByTask(this.task, this.taskletsMap)
      .sort(TaskletService.sortTaskletsByCreationDate);

    this.delegatedTo = (this.task != null && this.personsMap != null) ? this.personsMap.get(this.task.delegatedToId) : null;

    this.tags = (this.task != null) ? this.task.tagIds.map(id => {
      return this.tagsMap.get(id);
    }).filter(tag => {
      return tag != null;
    }) : [];
  }

  /**
   * Initializes tasks
   * @param tasks tasks
   */
  private initializeTasks(tasks: Map<string, Task>) {
    this.tasksMap = tasks;
  }

  /**
   * Initialize tasklets
   */
  private initializeTasklets(taskletsMap: Map<string, Tasklet>) {
    this.taskletsMap = taskletsMap;
    this.tasklets = this.taskletService
      .getTaskletsByTask(this.task, this.taskletsMap)
      .sort(TaskletService.sortTaskletsByCreationDate);
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
    this.delegatedTo = (this.task != null && this.personsMap != null) ? this.personsMap.get(this.task.delegatedToId) : null;
  }

  /**
   * Initializes tags
   * @param tags tags
   */
  private initializeTags(tags: Map<string, Tag>) {
    this.tagsMap = tags;
    this.tags = (this.task != null) ? this.task.tagIds.map(id => {
      return this.tagsMap.get(id);
    }).filter(tag => {
      return tag != null;
    }) : [];
  }

  /**
   * Initializes options
   */
  private initializeOptions() {
    this.projectOptions = this.suggestionService.projectOptions;
    this.tagOptions = this.suggestionService.tagOptions;
    this.personOptions = this.suggestionService.personOptions;
  }

  /**
   * Initializes tasklet type action
   */
  private initializeTaskletTypeAction() {
    this.action = new TaskletTypeAction();
    this.action.backgroundColor = this.colorService.getProjectColor(this.project);
    this.action.iconColor = this.colorService.getProjectContrast(this.project);
    this.action.icon = 'alias_project';
  }

  /**
   * Initializes settings
   */
  private initializeSettings() {
    this.settingsService.fetch();
    this.settingsService.settingsSubject.subscribe(value => {
      if (value != null) {
        this.sidenavOpened = this.settingsService.isSettingActive(SettingType.TASK_SIDENAV_OPENED);
      }
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
          this.settingsService.updateSetting(new Setting(SettingType.TASK_SIDENAV_OPENED, this.sidenavStart.opened));
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
   * Handles click on update-properties button
   */
  onUpdatePropertiesClicked() {
    this.propertiesOpened = true;
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
    if (event.key === KEY_CODE_ENTER && event.ctrlKey) {
      switch (this.mode) {
        case DialogMode.ADD: {
          this.addTask();
          break;
        }
        case DialogMode.UPDATE: {
          this.updateTask();
          break;
        }
        case DialogMode.CONTINUE: {
          this.continueTask();
          break;
        }
      }
    }
  }

  // </editor-fold>

  //
  // Button actions
  //

  // <editor-fold defaultstate="collapsed" desc="Button actions">

  /**
   * Handles click on button
   * @param action action
   */
  onButtonClicked(action: Action) {
    switch (action) {
      case Action.ADD: {
        this.addTask();
        break;
      }
      case Action.UPDATE: {
        this.updateTask();
        break;
      }
      case Action.CONTINUE: {
        this.continueTask();
        break;
      }
      case Action.DELETE: {
        this.deleteTask();
        break;
      }
      case Action.COMPLETE: {
        this.completeTask();
        break;
      }
      case Action.REOPEN: {
        this.reopenTask();
        break;
      }
    }
  }

  // </editor-fold>

  //
  //
  //

  /**
   * Adds a task
   */
  private addTask() {
    this.tags = this.aggregateTags(this.task);

    this.onTaskEvent({
      action: Action.ADD,
      task: this.task,
      project: this.project,
      delegatedTo: this.delegatedTo,
      tags: this.tags,
    });
  }

  /**
   * Updates a task
   */
  private updateTask() {
    this.tags = this.aggregateTags(this.task);

    this.onTaskEvent({
      action: Action.UPDATE,
      task: this.task,
      project: this.project,
      delegatedTo: this.delegatedTo,
      tags: this.tags,
    });
  }

  /**
   * Continues a task
   */
  private continueTask() {
    // TODO
  }

  /**
   * Completes a task
   */
  private completeTask() {
    // TODO
  }

  /**
   * Deletes a task
   */
  private deleteTask() {
    this.onTaskEvent({action: Action.DELETE, task: this.task});
  }

  /**
   * Re-opens a task
   */
  private reopenTask() {
    // TODO
  }

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
    this.inferTags(task.description.value).forEach(t => {
      aggregatedTags.set(t.name, t);
    });

    return Array.from(aggregatedTags.values());
  }
}
