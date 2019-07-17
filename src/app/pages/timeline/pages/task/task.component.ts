import {AfterViewInit, Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DialogMode} from '../../../../core/entity/model/dialog-mode.enum';
import {Tasklet} from '../../../../core/entity/model/tasklet.model';
import {Task} from '../../../../core/entity/model/task.model';
import {Project} from '../../../../core/entity/model/project.model';
import {Tag} from '../../../../core/entity/model/tag.model';
import {Person} from '../../../../core/entity/model/person.model';
import {TaskletType} from '../../../../core/entity/model/tasklet-type.enum';
import {Subject} from 'rxjs';
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
import {map, takeUntil} from 'rxjs/operators';
import {ConfirmationDialogComponent} from '../../../../ui/confirmation-dialog/confirmation-dialog/confirmation-dialog.component';
import {Action} from '../../../../core/entity/model/action.enum';
import {CloneService} from '../../../../core/entity/services/clone.service';
import {InformationDialogComponent} from '../../../../ui/information-dialog/information-dialog/information-dialog.component';
import {Animations, ScrollDirection, ScrollState} from './task.animation';
import {Setting} from '../../../../core/settings/model/setting.model';
import {SettingType} from '../../../../core/settings/model/setting-type.enum';
import {TaskDisplayAspect} from '../../../../core/entity/services/task/task-display.service';

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
export class TaskComponent implements OnInit, AfterViewInit, OnDestroy {

  /** ID passed as an argument */
  id: string;
  /** Enum of dialog modes */
  public modeType = DialogMode;
  /** Current dialog mode */
  public mode: DialogMode = DialogMode.NONE;

  /** Task to be displayed */
  task: Task = new Task();
  /** Recurring */
  recurring = false;
  /** Readonly dialog if true */
  readonly = false;

  /** Map of tasklets */
  public taskletsMap = new Map<string, Tasklet>();
  /** Map of tasks */
  public tasksMap = new Map<string, Task>();
  /** Map of projects */
  public projectsMap = new Map<string, Project>();
  /** Map of persons */
  public personsMap = new Map<string, Person>();
  /** Map of tags */
  public tagsMap = new Map<string, Tag>();

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

  /** Enum of tasklet types */
  taskletType = TaskletType;
  /** Tasklet type action */
  action: TaskletTypeAction;

  /** Placeholder text for description */
  placeholderDescription = 'empty';

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /** Current media */
  media: Media = Media.UNDEFINED;

  /** Enum for action types */
  actionType = Action;
  /** Enum of media types */
  mediaType = Media;
  /** Enum of display aspects */
  displayAspectType = TaskDisplayAspect;

  /** Vertical scroll position */
  private scrollPosLast = 0;
  /** Scroll direction */
  public scrollDirection: ScrollDirection = ScrollDirection.UP;
  /** Scroll state */
  public scrollState: ScrollState = ScrollState.NON_SCROLLING;

  /** Indicates whether properties form is opened */
  propertiesOpened = false;
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

  /**
   * Constructor
   * @param colorService color service
   * @param emailService email service
   * @param filterService filter service
   * @param mediaService media service
   * @param materialColorService material color service
   * @param materialIconService material icon service
   * @param scroll scroll
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
   * @param zone Angular zone
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
    this.initializeTaskletSubscription();
    this.initializeTaskSubscription();
    this.initializeProjectSubscription();
    this.initializeTagSubscription();
    this.initializePersonSubscription();

    this.initializeOptions();

    this.initializeMaterial();
    this.initializeMediaSubscription();

    this.initializeSettings();

    this.initializeData();
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
    if (this.route.snapshot != null) {
      this.id = this.route.snapshot.paramMap.get('id');
    }

    if (this.id === null) {
      this.mode = DialogMode.ADD;
    } else {
      this.mode = DialogMode.UPDATE;
    }
  }

  /**
   * Initializes resolved data
   */
  private initializeResolvedData(): Task {
    return (this.route.snapshot != null && this.route.snapshot.data != null) ? this.route.snapshot.data['task'] : null;
  }

  /**
   * Initializes task subscription
   */
  private initializeTaskSubscription() {
    this.taskService.taskSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        this.initializeTask(value as Task);
        this.initializeTaskletTypeAction();
      }
    });

    this.taskService.tasksSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        this.initializeTasks(value as Map<string, Task>);
        this.initializeOptions();
      }
    });
  }

  /**
   * Initializes task
   * @param task task to be initialized
   */
  private initializeTask(task: Task) {
    this.task = task;
    if (task != null) {
      this.project = this.projectsMap.get(this.task.projectId);
      this.tags = task.tagIds.map(id => {
        return this.tagsMap.get(id);
      }).filter(tag => {
        return tag != null;
      });
      this.delegatedTo = this.personsMap.get(task.delegatedToId);

      // After task has been initialized associated tasklets can be determined
      this.taskletService.findTaskletsByScope(this.scopeService.scope);
    }
  }

  /**
   * Initializes tasks
   * @param tasks tasks
   */
  private initializeTasks(tasks: Map<string, Task>) {
    this.tasksMap = tasks;
  }

  /**
   * Initializes tasklet subscription
   */
  private initializeTaskletSubscription() {
    this.taskletService.taskletsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        this.initializeTasklets(value as Map<string, Tasklet>);
      }
    });
  }

  /**
   * Initialize tasklets
   */
  private initializeTasklets(taskletsMap: Map<string, Tasklet>) {
    this.tasklets = this.taskletService.getTaskletsByTask(this.task, taskletsMap);
  }

  /**
   * Initializes project subscription
   */
  private initializeProjectSubscription() {
    this.projectService.projectsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      this.initializeProjects(value as Map<string, Project>);
      this.initializeOptions();
    });
  }

  /**
   * Initializes projects
   * @param projects projects
   */
  private initializeProjects(projects: Map<string, Project>) {
    this.projectsMap = projects;
  }

  /**
   * Initializes person subscription
   */
  private initializePersonSubscription() {
    this.personService.personsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      this.initializePersons(value as Map<string, Person>);
      this.initializeOptions();
    });
  }

  /**
   * Initializes persons
   * @param persons persons
   */
  private initializePersons(persons: Map<string, Person>) {
    this.personsMap = persons;
  }

  /**
   * Initializes tag subscription
   */
  private initializeTagSubscription() {
    this.tagService.tagsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      this.initializeTags(value as Map<string, Tag>);
      this.initializeOptions();
    });
  }

  /**
   * Initializes tags
   * @param tags tags
   */
  private initializeTags(tags: Map<string, Tag>) {
    this.tagsMap = tags;
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
   * Initializes data
   */
  private initializeData() {
    const resolved = this.initializeResolvedData();
    if (resolved != null) {
      // Take data from resolver
      this.initializeTask(resolved as Task);
      this.initializeTaskletTypeAction();
    } else {
      // Load data from scratch
      this.route.params.pipe(
        takeUntil(this.unsubscribeSubject)
      ).subscribe(() => {
        this.initializeParameters();
        this.findEntities();
      });
    }
  }

  /**
   * Triggers entity retrieval from database
   */
  private findEntities() {
    this.taskService.findTaskByID(this.id);
    this.taskService.findTasksByScope(this.scopeService.scope);
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
   * Handles events targeting a task
   * @param event event parameters
   */
  private onTaskEvent(event: {
    action: Action, task: Task, tasks?: Task[],
    project?: Project, delegatedTo?: Person, tags?: Tag[], omitReferenceEvaluation?: boolean
  }) {
    const task = CloneService.cloneTask(event.task as Task);
    // const tasks = CloneService.cloneTasks(event.tasks as Task[]);
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
              title: 'Delete person',
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
    }
  }

  //
  // Helpers
  //

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
        aggregatedTagIds.set(tag.name, tag.id);
      });

      task.tagIds = Array.from(aggregatedTagIds.values());
    } else {
      // Unassign tags
      task.tagIds = [];
    }
  }

  //
  // Helpers (UI)
  //

  /**
   * Retrieves an icon by tasklet type
   * @param type tasklet type
   */
  public getIconByTaskletType(type: TaskletType): string {
    return TaskletService.getIconByTaskletType(type);
  }

  /**
   * Determines whether the displayed task contains a specific display aspect
   * @param displayAspect display aspect
   * @param task task
   */
  public containsDisplayAspect(displayAspect: TaskDisplayAspect, task: Task): boolean {
    return TaskService.containsDisplayAspect(displayAspect, task);
  }

  // Tags

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
    this.inferTags(task).forEach(t => {
      aggregatedTags.set(t.name, t);
    });

    return Array.from(aggregatedTags.values());
  }

  /**
   * Infers tags from a task's description
   * @param task task
   * @returns tags
   */
  private inferTags(task: Task): Tag[] {
    const inferredTags = new Map<string, Tag>();

    if (task.description != null && task.description.value != null) {
      task.description.value.split('\n').forEach(line => {
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
}
