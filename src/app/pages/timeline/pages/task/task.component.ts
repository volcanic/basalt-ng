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
import {MatDialog, MatDialogConfig, MatIconRegistry, MatSidenav} from '@angular/material';
import {CdkScrollable, ScrollDispatcher} from '@angular/cdk/overlay';
import {ColorService} from '../../../../core/ui/services/color.service';
import {EmailService} from '../../../../core/mail/services/mail/email.service';
import {FilterService} from '../../../../core/entity/services/filter.service';
import {MediaService} from '../../../../core/ui/services/media.service';
import {MaterialColorService} from '../../../../core/ui/services/material-color.service';
import {MaterialIconService} from '../../../../core/ui/services/material-icon.service';
import {PersonService} from '../../../../core/entity/services/person.service';
import {ProjectService} from '../../../../core/entity/services/project.service';
import {ScopeService} from '../../../../core/entity/services/scope.service';
import {SettingsService} from '../../../../core/settings/services/settings.service';
import {SnackbarService} from '../../../../core/ui/services/snackbar.service';
import {SuggestionService} from '../../../../core/entity/services/suggestion.service';
import {TagService} from '../../../../core/entity/services/tag.service';
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
import {DisplayAspect} from '../../../../core/entity/services/tasklet/tasklet-display.service';

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
  task: Task;
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
  projectOptions: string[] = [];
  /** Tag options */
  tagOptions: string[] = [];
  /** Person options */
  personOptions: string[] = [];

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
  displayAspectType = DisplayAspect;

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
  @ViewChild('sidenavStart') sidenavStart: MatSidenav;
  /** Side navigation at end */
  @ViewChild('sidenavEnd') sidenavEnd: MatSidenav;
  /** Scrollable directive */
  @ViewChild(CdkScrollable) scrollable: CdkScrollable;

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
    this.initializeTaskSubscription();
    this.initializeProjectSubscription();
    this.initializeTagSubscription();
    this.initializePersonSubscription();

    this.initializeOptions();

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
    const resolved = this.route.snapshot.data['task'];
    if (resolved != null) {
      this.initializeTask(resolved as Task);
      this.initializeTaskletTypeAction();
    }
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
      this.project = this.projectService.projects.get(this.task.projectId);
      this.tags = task.tagIds.map(id => {
        return this.tagService.tags.get(id);
      }).filter(tag => {
        return tag != null;
      });
      this.delegatedTo = this.personService.persons.get(task.delegatedToId);

      // After task has been initialized associated tasklets can be determined
      this.taskletService.findTaskletsByScope(this.scopeService.scope);
    }
  }

  /**
   * Initializes tasklet subscription
   */
  private initializeTaskletSubscription() {
    this.taskletService.taskletsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        this.tasklets = this.taskletService.getTaskletsByTask(this.task);
      }
    });
  }

  /**
   * Initializes project subscription
   */
  private initializeProjectSubscription() {
    this.projectService.projectsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe(() => {
      this.initializeOptions();
    });
  }

  /**
   * Initializes tag subscription
   */
  private initializeTagSubscription() {
    this.tagService.tagsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe(() => {
      this.initializeOptions();
    });
  }

  /**
   * Initializes person subscription
   */
  private initializePersonSubscription() {
    this.personService.personsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe(() => {
      this.initializeOptions();
    });
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
    this.projectOptions = Array.from(this.suggestionService.projectOptions.values()).sort((p1, p2) => {
      return new Date(p2.modificationDate).getTime() > new Date(p1.modificationDate).getTime() ? 1 : -1;
    }).map(p => {
      return p.name;
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
   * @param {string} menuItem menu item that has been clicked
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
   * @param event
   */
  onKeyDown(event: any) {
    const KEY_CODE_ENTER = 13;
    if (event.keyCode === KEY_CODE_ENTER && event.ctrlKey) {
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
   * @param action
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
   * @param {any} event event parameters
   */
  private onTaskEvent(event: { action: Action, task: Task, tasks?: Task[], project?: Project, delegatedTo?: Person, tags?: Tag[], omitReferenceEvaluation?: boolean }) {
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
        this.taskService.createTask(task).then(() => {
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
        this.taskService.updateTask(task).then(() => {
          this.snackbarService.showSnackbar('Updated task');
        });
        break;
      }
      case Action.DELETE: {
        const references = Array.from(this.taskletService.tasklets.values()).some((tasklet: Tasklet) => {
          return tasklet.taskId === task.id;
        });

        if (references) {
          this.dialog.open(InformationDialogComponent, <MatDialogConfig>{
            disableClose: false,
            data: {
              title: 'Cannot delete task',
              text: `There are still tasklets associated with this task.`,
              action: 'Okay',
              value: task
            }
          });
        } else {
          const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, <MatDialogConfig>{
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
              this.taskService.deleteTask(confirmationResult as Task).then(() => {
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
        this.taskService.updateTask(task, false).then(() => {
          this.snackbarService.showSnackbar('Completed task');
        });
        break;
      }
      case Action.REOPEN: {
        task.completionDate = null;
        this.taskService.updateTask(task, false).then(() => {
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
      let p = this.projectService.getProjectByName(project.name);

      // New project
      if (p == null && project.name != null && project.name !== '') {
        p = new Project(project.name);
        this.projectService.createProject(p, false).then(() => {
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
      let p = this.personService.getPersonByName(delegatedTo.name);

      // New person
      if (p == null && delegatedTo.name != null && delegatedTo.name !== '') {
        p = new Person(delegatedTo.name);
        this.personService.createPerson(p).then(() => {
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
   * @param {Task} task task assign tags to
   * @param {Tag[]} tags array of tags to be checked
   */
  private evaluateTaskTags(task: Task, tags: Tag[]) {
    if (tags != null) {
      const aggregatedTagIds = new Map<string, string>();

      // New tag
      tags.forEach(t => {
        let tag = this.tagService.getTagByName(t.name);

        if (tag == null) {
          tag = new Tag(t.name);
          this.tagService.createTag(tag).then(() => {
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
    return this.taskletService.getIconByTaskletType(type);
  }

  // Tags

  /**
   * Aggregates tags
   * @param {Task} task
   * @returns {Tag[]}
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
   * @param {Task} task
   * @returns {Tag[]}
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
