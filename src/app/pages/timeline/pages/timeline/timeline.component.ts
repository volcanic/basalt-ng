import {AfterViewInit, Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SnackbarService} from 'app/core/ui/services/snackbar.service';
import {MatDialog, MatIconRegistry, MatSidenav} from '@angular/material';
import {TaskletService} from 'app/core/entity/services/tasklet/tasklet.service';
import {TaskletDialogComponent} from '../../components/dialogs/tasklet-dialog/tasklet-dialog.component';
import {DialogMode} from 'app/core/entity/model/dialog-mode.enum';
import {AboutDialogComponent} from 'app/ui/about-dialog/about-dialog/about-dialog.component';
import {environment} from 'app/../environments/environment';
import {UploadDialogComponent} from '../../components/dialogs/upload-dialog/upload-dialog.component';
import {Tasklet} from 'app/core/entity/model/tasklet.model';
import {Project} from 'app/core/entity/model/project.model';
import {EntityService} from 'app/core/entity/services/entity.service';
import {ProjectService} from 'app/core/entity/services/project/project.service';
import {TaskService} from 'app/core/entity/services/task/task.service';
import {Task} from 'app/core/entity/model/task.model';
import {ProjectDialogComponent} from '../../components/dialogs/project-dialog/project-dialog.component';
import {FilterService} from 'app/core/entity/services/filter.service';
import {Tag} from 'app/core/entity/model/tag.model';
import {MediaService} from 'app/core/ui/services/media.service';
import {Media} from 'app/core/ui/model/media.enum';
import {map, takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs';
import {ProjectListDialogComponent} from '../../components/dialogs/project-list-dialog/project-list-dialog.component';
import {CdkScrollable, ScrollDispatcher} from '@angular/cdk/scrolling';
import {Animations, ScrollDirection, ScrollState} from './timeline.animation';
import {DateService} from 'app/core/entity/services/date.service';
import {Scope} from 'app/core/entity/model/scope.enum';
import {ScopeService} from 'app/core/entity/services/scope.service';
import {TagService} from 'app/core/entity/services/tag/tag.service';
import {TagDialogComponent} from '../../components/dialogs/tag-dialog/tag-dialog.component';
import {PersonDialogComponent} from '../../components/dialogs/person-dialog/person-dialog.component';
import {Person} from 'app/core/entity/model/person.model';
import {PersonService} from 'app/core/entity/services/person/person.service';
import {TagListDialogComponent} from '../../components/dialogs/tag-list-dialog/tag-list-dialog.component';
import {MatchService} from 'app/core/entity/services/match.service';
import {ConfirmationDialogComponent} from 'app/ui/confirmation-dialog/confirmation-dialog/confirmation-dialog.component';
import {InformationDialogComponent} from 'app/ui/information-dialog/information-dialog/information-dialog.component';
import {Action} from 'app/core/entity/model/action.enum';
import {TaskDialogComponent} from '../../components/dialogs/task-dialog/task-dialog.component';
import {TaskletType} from 'app/core/entity/model/tasklet-type.enum';
import {UUID} from 'app/core/entity/model/uuid';
import {Description} from 'app/core/entity/model/description.model';
import {SuggestionService} from 'app/core/entity/services/suggestion.service';
import {DigestService} from 'app/core/digest/services/digest/digest.service';
import {ProjectDigest} from 'app/core/digest/model/project-digest.model';
import {CloneService} from 'app/core/entity/services/clone.service';
import {DateTimePickerDialogComponent} from 'app/ui/date-time-picker-dialog/date-time-picker-dialog/date-time-picker-dialog.component';
import {DomSanitizer} from '@angular/platform-browser';
import {MaterialColorService} from '../../../../core/ui/services/material-color.service';
import {MaterialIconService} from '../../../../core/ui/services/material-icon.service';
import {EmailService} from '../../../../core/mail/services/mail/email.service';
import {Router} from '@angular/router';
import {SettingsService} from '../../../../core/settings/services/settings.service';
import {SettingType} from '../../../../core/settings/model/setting-type.enum';
import {Setting} from '../../../../core/settings/model/setting.model';
import {DailyScrumItemType} from '../../../../core/entity/model/daily-scrum/daily-scrum-item-type.enum';
import {TaskListDialogComponent} from '../../components/dialogs/task-list-dialog/task-list-dialog.component';
import {UnusedTagsDialogComponent} from '../../components/dialogs/unused-tags-dialog/unused-tags-dialog.component';

/**
 * Displays timeline page
 */
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  animations: [
    Animations.toolbarAnimation,
    Animations.fabAnimation,
    Animations.dateIndicatorAnimation,
  ]
})
export class TimelineComponent implements OnInit, AfterViewInit, OnDestroy {

  /** App title */
  title = environment.APP_NAME;

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
  /** Map of unused tags */
  public tagsMapUnused = new Map<string, Tag>();

  /** Indicates whether a filter is active */
  public filterActive = false;

  /** Search items options for auto-complete */
  public searchOptions = [];

  /** Indicator date */
  public indicatedDate = new Date();
  /** Indicator day */
  public indicatedDay;
  /** Indicator month */
  public indicatedMonth;

  /** Enum of media types */
  public mediaType = Media;
  /** Current media */
  public media: Media = Media.UNDEFINED;

  /** Enum of scope types */
  // public scopeType = Scope;
  /** Current scope */
  public scope: Scope = Scope.UNDEFINED;

  /** Weekly digest */
  public weeklyDigest: ProjectDigest;
  /** Daily digests */
  public dailyDigests: ProjectDigest[];

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

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

  /** Environment */
  env = environment;

  /**
   * Constructor
   * @param digestService digest service
   * @param emailService email service
   * @param entityService entity service
   * @param filterService filter service
   * @param iconRegistry icon registry
   * @param matchService match service
   * @param materialColorService material color service
   * @param materialIconService material icon service
   * @param router router
   * @param mediaService media service
   * @param sanitizer sanitizer
   * @param scopeService scope service
   * @param scroll scroll
   * @param snackbarService snackbar service
   * @param suggestionService suggestion service
   * @param personService person service
   * @param projectService project service
   * @param settingsService settings service
   * @param tagService tag service
   * @param taskService task service
   * @param taskletService tasklet service
   * @param dialog dialog
   * @param zone Angular zone
   */
  constructor(private digestService: DigestService,
              private emailService: EmailService,
              private entityService: EntityService,
              private filterService: FilterService,
              private iconRegistry: MatIconRegistry,
              private matchService: MatchService,
              private materialColorService: MaterialColorService,
              private materialIconService: MaterialIconService,
              private mediaService: MediaService,
              private router: Router,
              private sanitizer: DomSanitizer,
              private scopeService: ScopeService,
              private scroll: ScrollDispatcher,
              private snackbarService: SnackbarService,
              private suggestionService: SuggestionService,
              public personService: PersonService,
              public projectService: ProjectService,
              public settingsService: SettingsService,
              public tagService: TagService,
              public taskService: TaskService,
              public taskletService: TaskletService,
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
    this.initializePersonSubscription();
    this.initializeTagSubscription();

    this.initializeFilterSubscription();
    this.initializeSuggestionSubscription();

    this.initializeWeeklyDigest();
    this.initializeDailyDigests();

    this.initializeMaterial();
    this.initializeMediaSubscription();
    this.initializeScopeSubscription();

    this.initializeSettings();

    this.clearFilters();
    this.findEntities();

    this.initializeDateSubscription();
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

  //
  // Tasklet
  //

  /**
   * Initializes tasklet subscription
   */
  private initializeTaskletSubscription() {
    this.taskletService.taskletsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        this.initializeTasklets(value as Map<string, Tasklet>);
        this.initializeTaskletsFiltered(value as Map<string, Tasklet>);
        this.generateWeeklyDigest(this.indicatedDate);
        this.generateDailyDigests(this.indicatedDate);
      }
    });
  }

  /**
   * Initializes tasklets
   * @param taskletsMap tasklets map
   */
  private initializeTasklets(taskletsMap: Map<string, Tasklet>) {
    this.taskletsMap = new Map(taskletsMap);
  }

  /**
   * Initializes tasklets
   * @param taskletsMap tasklets map
   */
  private initializeTaskletsFiltered(taskletsMap: Map<string, Tasklet>) {
    const taskletsMapFiltered = new Map<string, Tasklet>();

    Array.from(taskletsMap.values()).filter(tasklet => {
      return this.filterTasklet(tasklet);
    }).forEach(tasklet => {
      taskletsMapFiltered.set(tasklet.id, tasklet);
    });

    this.taskletsMapFiltered = new Map(taskletsMapFiltered);
  }

  /**
   * Checks if a tasklet matches current filter criteria
   * @param tasklet tasklet
   */
  private filterTasklet(tasklet: Tasklet): boolean {
    const matchesSearchItem = this.matchService.taskletMatchesEveryItem(tasklet, this.filterService.searchItem,
      this.tasksMap, this.projectsMap, this.personsMap, this.tagsMap);
    const matchesInheritedSearchItem = this.matchService.taskMatchesEveryItem(this.tasksMap.get(tasklet.taskId),
      this.filterService.searchItem, this.projectsMap, this.tagsMap);
    const matchesTasks = this.matchService.taskletMatchesTasks(tasklet, this.filterService.tasks);
    const matchesProjects = this.matchService.taskletMatchesProjects(tasklet, this.tasksMap, this.filterService.projects);
    const matchesTags = this.matchService.taskletMatchesTags(tasklet, this.filterService.tags);
    const matchesInheritedTags = this.matchService.taskMatchesTags(this.tasksMap.get(tasklet.taskId), this.filterService.tags);
    const matchesPersons = this.matchService.taskletMatchesPersons(tasklet, this.filterService.persons);

    return (matchesSearchItem || matchesInheritedSearchItem)
      && matchesTasks
      && matchesProjects
      && (matchesTags || matchesInheritedTags)
      && matchesPersons;
  }

  //
  // Task
  //

  /**
   * Initializes task subscription
   */
  private initializeTaskSubscription() {
    this.taskService.tasksSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        this.initializeTasks(value as Map<string, Task>);
        this.initializeTasksFiltered(value as Map<string, Task>);
        this.generateWeeklyDigest(this.indicatedDate);
        this.generateDailyDigests(this.indicatedDate);
      }
    });
  }

  /**
   * Initializes tasks
   * @param tasksMap tasks map
   */
  private initializeTasks(tasksMap: Map<string, Task>) {
    this.tasksMap = new Map(tasksMap);
  }

  /**
   * Initializes tasks
   * @param tasksMap tasks map
   */
  private initializeTasksFiltered(tasksMap: Map<string, Task>) {
    const tasksMapFiltered = new Map<string, Task>();

    Array.from(tasksMap.values()).filter(task => {
      return this.filterTask(task);
    }).forEach(task => {
      tasksMapFiltered.set(task.id, task);
    });

    this.tasksMapFiltered = new Map(tasksMapFiltered);
  }

  /**
   * Checks if a task matches current filter criteria
   * @param task task
   */
  private filterTask(task: Task): boolean {
    const matchesSearchItem = this.matchService.taskMatchesEveryItem(task, this.filterService.searchItem, this.projectsMap, this.tagsMap);
    const matchesProjects = this.matchService.taskMatchesProjects(task, this.filterService.projects);
    const matchesTags = this.matchService.taskMatchesTags(task, this.filterService.tags);
    const matchesPersons = this.matchService.taskMatchesPersons(task, this.filterService.persons);

    return matchesSearchItem && matchesProjects && matchesTags && matchesPersons;
  }

  //
  // Projects
  //

  /**
   * Initializes project subscription
   */
  private initializeProjectSubscription() {
    this.projectService.projectsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      this.initializeProjects(value as Map<string, Project>);
      this.initializeProjectsFiltered(value as Map<string, Project>);
      this.generateWeeklyDigest(this.indicatedDate);
      this.generateDailyDigests(this.indicatedDate);
    });
  }

  /**
   * Initializes projects
   * @param projectsMap projects map
   */
  private initializeProjects(projectsMap: Map<string, Project>) {
    this.projectsMap = new Map(projectsMap);
  }

  /**
   * Initializes projects
   * @param projectsMap projects map
   */
  private initializeProjectsFiltered(projectsMap: Map<string, Project>) {
    const projectsMapFiltered = new Map<string, Project>();

    Array.from(projectsMap.values()).filter(project => {
      return this.filterProject(project);
    }).forEach(project => {
      projectsMapFiltered.set(project.id, project);
    });

    this.projectsMapFiltered = new Map(projectsMapFiltered);
  }

  /**
   * Checks if a project matches current filter criteria
   * @param project project
   */
  private filterProject(project: Project): boolean {
    const matchesSearchItem = this.matchService.projectMatchesEveryItem(project, this.filterService.searchItem);
    const matchesTasks = this.matchService.projectMatchesTasks(project,
      Array.from(this.filterService.tasks.values()));

    return matchesSearchItem && matchesTasks;
  }

  //
  // Person
  //

  /**
   * Initializes person subscription
   */
  private initializePersonSubscription() {
    this.personService.personsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      this.initializePersons(value as Map<string, Person>);
      this.initializePersonsFiltered(value as Map<string, Person>);
    });
  }

  /**
   * Initializes persons
   * @param personsMap persons map
   */
  private initializePersons(personsMap: Map<string, Person>) {
    this.personsMap = new Map(personsMap);
  }

  /**
   * Initializes persons
   * @param personsMap persons map
   */
  private initializePersonsFiltered(personsMap: Map<string, Person>) {
    const personsMapFiltered = new Map<string, Person>();

    Array.from(personsMap.values()).filter(person => {
      return this.filterPerson(person);
    }).forEach(person => {
      personsMapFiltered.set(person.id, person);
    });

    this.personsMapFiltered = new Map(personsMapFiltered);
  }

  /**
   * Checks if a person matches current filter criteria
   * @param person person
   */
  private filterPerson(person: Person): boolean {
    return this.matchService.personMatchesEveryItem(person, this.filterService.searchItem);
  }

  //
  // Tags
  //

  /**
   * Initializes tag subscription
   */
  private initializeTagSubscription() {
    this.tagService.tagsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      this.initializeTags(value as Map<string, Tag>);
      this.initializeTagsFiltered(value as Map<string, Tag>);
      this.initializeTagsUnused(this.taskletsMap, this.tasksMap);
    });
  }

  /**
   * Initializes tags
   * @param tagsMap tags map
   */
  private initializeTags(tagsMap: Map<string, Tag>) {
    this.tagsMap = new Map(tagsMap);
  }

  /**
   * Initializes tags
   * @param tagsMap tags map
   */
  private initializeTagsFiltered(tagsMap: Map<string, Tag>) {
    const tagsMapFiltered = new Map<string, Tag>();

    Array.from(tagsMap.values()).filter(tag => {
      return this.filterTag(tag);
    }).forEach(tag => {
      tagsMapFiltered.set(tag.id, tag);
    });

    this.tagsMapFiltered = new Map(tagsMapFiltered);
  }

  /**
   * Checks if a tag matches current filter criteria
   * @param tag tag
   */
  private filterTag(tag: Tag): boolean {
    return this.matchService.tagMatchesEveryItem(tag, this.filterService.searchItem);
  }

  /**
   * Initializes unused tags
   * @param taskletsMap tasklets map
   * @param tasksMap tasks map
   */
  private initializeTagsUnused(taskletsMap: Map<string, Tasklet>, tasksMap: Map<string, Task>) {
    const usedTagIds = new Map<string, string>();
    Array.from(taskletsMap.values()).forEach(tasklet => {
      if (tasklet != null && tasklet.tagIds != null) {
        tasklet.tagIds.forEach(tagId => {
          usedTagIds.set(tagId, tagId);
        });
      }
    });

    Array.from(tasksMap.values()).forEach(task => {
      if (task != null && task.tagIds != null) {
        task.tagIds.forEach(tagId => {
          usedTagIds.set(tagId, tagId);
        });
      }
    });

    this.tagsMapUnused = this.tagService.getUnusedTags(usedTagIds, this.tagsMap);
  }

  //
  // Other
  //

  /**
   * Initializes filter subscription
   */
  private initializeFilterSubscription() {
    this.filterService.filterSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe(() => {
      // Update filter lists and filter state
      this.tasksMapFilter = this.filterService.tasks;
      this.projectsMapFilter = this.filterService.projects;
      this.personsMapFilter = this.filterService.persons;
      this.tagsMapFilter = this.filterService.tags;
      this.filterActive = this.filterService.searchItem.length > 0
        || this.tasksMapFilter.size > 0
        || this.projectsMapFilter.size > 0
        || this.personsMapFilter.size > 0
        || this.tagsMapFilter.size > 0;

      this.initializeTaskletsFiltered(this.taskletsMap);
      this.initializeTasksFiltered(this.tasksMap);
      this.initializeProjectsFiltered(this.projectsMap);
      this.initializePersonsFiltered(this.personsMap);
      this.initializeTagsFiltered(this.tagsMap);
    });
  }

  /**
   * Initializes suggestion subscription
   */
  private initializeSuggestionSubscription() {
    this.searchOptions = Array.from(this.suggestionService.searchOptions.values()).reverse();
    this.suggestionService.searchOptionsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        this.searchOptions = (value as string[]).reverse();
      }
    });
  }

  /**
   * Initializes date subscription
   */
  private initializeDateSubscription() {
    setTimeout(() => {
      this.taskletService.dateQueueSubject.subscribe(date => {
        // Date indicator
        this.indicatedDate = date;
        this.indicatedDay = DateService.getDayOfMonthString(date);
        this.indicatedMonth = DateService.getMonthString(new Date(date).getMonth()).slice(0, 3);

        // Digests
        this.generateWeeklyDigest(this.indicatedDate);
        this.generateDailyDigests(this.indicatedDate);
      });
    }, 5000);
  }

  /**
   * Initializes weekly digest
   */
  private initializeWeeklyDigest() {
    this.generateWeeklyDigest(new Date());
  }

  /**
   * Initializes daily digest
   */
  private initializeDailyDigests() {
    this.generateDailyDigests(new Date());
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
   * Initializes scope subscription
   */
  private initializeScopeSubscription() {
    this.scope = this.scopeService.scope;
    this.scopeService.scopeSubject.subscribe(scope => {
      this.scope = scope;

      this.clearFilters();
      this.findEntities();
    });
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

  /**
   * Initializes settings
   */
  private initializeSettings() {
    this.settingsService.fetch();
    this.settingsService.settingsSubject.subscribe(value => {
      if (value != null) {
        this.sidenavOpened = this.settingsService.isSettingActive(SettingType.TIMELINE_SIDENAV_OPENED);
      }
    });
  }

  /**
   * Clears all filters
   */
  private clearFilters() {
    this.filterService.clearAllFilters();
  }

  /**
   * Triggers entity retrieval from database
   */
  private findEntities() {
    if (this.taskletsMap.size === 0) {
      this.taskletService.findTaskletsByScope(this.scope);
    }
    if (this.tasksMap.size === 0) {
      this.taskService.findTasksByScope(this.scope);
    }
    if (this.projectsMap.size === 0) {
      this.projectService.findProjectsByScope(this.scope);
    }
    if (this.personsMap.size === 0) {
      this.personService.findPersonsByScope(this.scope);
    }
    if (this.tagsMap.size === 0) {
      this.tagService.findTagsByScope(this.scope);
    }
  }

  //
  // Actions
  //

  /**
   * Handles click on add tasklet button
   */
  onAddTaskletClicked() {
    this.onTaskletEvent({action: Action.OPEN_DIALOG_ADD, tasklet: null});
  }

  /**
   * Handles click on add task button
   */
  onAddTaskClicked() {
    this.onTaskEvent({action: Action.OPEN_DIALOG_ADD, task: null});
  }

  /**
   * Handles click on add project button
   */
  onAddProjectClicked() {
    this.onProjectEvent({action: Action.OPEN_DIALOG_ADD, project: null});
  }

  /**
   * Handles click on add project button
   */
  onAddTagClicked() {
    this.onTagEvent({action: Action.OPEN_DIALOG_ADD, tag: null});
  }

  /**
   * Handles click on add project button
   */
  onAddPersonClicked() {
    this.onPersonEvent({action: Action.OPEN_DIALOG_ADD, person: null});
  }

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
        // Assemble data to be passed
        const data = {
          mode: DialogMode.ADD,
          dialogTitle: 'Add tasklet',
          tasklet: new Tasklet(),
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
          this.settingsService.updateSetting(new Setting(SettingType.TIMELINE_SIDENAV_OPENED, this.sidenavStart.opened));
        });
        this.sidenavEnd.toggle().then();
        break;
      }
      case 'settings': {
        this.router.navigate(['/settings']).then();
        break;
      }
      case 'task-list': {
        const dialogRef = this.dialog.open(TaskListDialogComponent, {
          disableClose: false,
          data: {
            dialogTitle: 'Tasks',
            tasksMap: this.tasksMap.values()
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const action = result.Action as Action;
            const task = result.value as Task;
            const project = result.project as Project;
            const tags = result.tags as Tag[];

            switch (action) {
              case Action.OPEN_DIALOG_ADD: {
                this.onTaskEvent({action, task});
                break;
              }
              case Action.OPEN_DIALOG_UPDATE: {
                this.onTaskEvent({action, task, project, tags});
                break;
              }
            }
          }
        });
        break;
      }
      case 'project-list': {
        const dialogRef = this.dialog.open(ProjectListDialogComponent, {
          disableClose: false,
          data: {
            dialogTitle: 'Projects',
            projectsMap: this.projectsMap.values()
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const resultingAction = result.action as Action;
            const resultingProject = result.project as Project;

            this.onProjectEvent({action: resultingAction, project: resultingProject});
          }
        });
        break;
      }
      case 'tag-list': {
        const dialogRef = this.dialog.open(TagListDialogComponent, {
          disableClose: false,
          data: {
            dialogTitle: 'Tags',
            tagsMap: this.tagsMap
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const resultingAction = result.action as Action;
            const resultingTag = result.tag as Tag;

            this.onTagEvent({action: resultingAction, tag: resultingTag});
          }
        });
        break;
      }
      case 'clear-filter': {
        this.filterService.clearAllFilters();
        this.snackbarService.showSnackbar('Filters cleared');
        break;
      }
      case 'upload': {
        this.dialog.open(UploadDialogComponent, {
          disableClose: false,
          data: {
            title: 'Upload'
          }
        });
        break;
      }
      case 'download': {
        this.entityService.downloadEntities(this.taskletsMap,
          this.tasksMap,
          this.projectsMap,
          this.personsMap,
          this.tagsMap);
        break;
      }
      case 'android-release': {
        const filename = 'basalt-release.apk';
        const element = document.createElement('a');
        element.setAttribute('href', 'assets/basalt.apk');
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        break;
      }
      case 'about': {
        this.dialog.open(AboutDialogComponent, {
          disableClose: false,
          data: {
            title: 'About',
            name: environment.NAME,
            version: environment.VERSION,
            license: environment.LICENSE,
            homepage: environment.HOMEPAGE,
          }
        });
        break;
      }
      case 'scope-work': {
        this.scopeService.switchScope(Scope.WORK);
        break;
      }
      case 'scope-freetime': {
        this.scopeService.switchScope(Scope.FREETIME);
        break;
      }
      default: {
        break;
      }
    }
  }

  /**
   * Handles search item typed into the search field
   * @param searchItem new search item
   */
  onSearchItemChanged(searchItem: string) {
    this.filterService.updateSearchItem(searchItem);
  }

  /**
   * Handles click on date indicator
   */
  onDateIndicatorClicked() {
    this.scrollState = ScrollState.NON_SCROLLING;
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
        aggregatedTagIds.set(tag.id, tag.id);
      });

      task.tagIds = Array.from(aggregatedTagIds.values());
    } else {
      // Unassign tags
      task.tagIds = [];
    }
  }

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
   * Generates weekly digest
   * @param date focus date
   */
  private generateWeeklyDigest(date: Date) {
    this.weeklyDigest = this.digestService.getWeeklyDigest(date,
      this.taskletsMap,
      this.tasksMap,
      this.projectsMap);
  }

  /**
   * Generates daily digests
   * @param date focus date
   */
  private generateDailyDigests(date: Date) {
    this.dailyDigests = [];
    const weekStart = DateService.getWeekStart(date);
    const day = new Date(weekStart);

    // Iterate over all weekdays
    [0, 1, 2, 3, 4, 5, 6].forEach(index => {
      const focusDate = new Date(day.setDate(weekStart.getDate() + index));
      const dailyDigest = this.digestService.getDailyDigest(focusDate,
        this.taskletsMap,
        this.tasksMap,
        this.projectsMap);

      if (dailyDigest.getProjectEffortSum() > 0) {
        this.dailyDigests.push(dailyDigest);
      }
    });
  }
}
