import {AfterViewInit, Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SnackbarService} from 'app/core/ui/services/snackbar.service';
import {MatDialog, MatIconRegistry, MatSidenav} from '@angular/material';
import {TaskletService} from 'app/core/entity/services/tasklet/tasklet.service';
import {AboutDialogComponent} from 'app/ui/about-dialog/about-dialog/about-dialog.component';
import {environment} from 'app/../environments/environment';
import {UploadDialogComponent} from '../../components/dialogs/upload-dialog/upload-dialog.component';
import {Tasklet} from 'app/core/entity/model/tasklet.model';
import {Project} from 'app/core/entity/model/project.model';
import {EntityService} from 'app/core/entity/services/entity.service';
import {ProjectService} from 'app/core/entity/services/project/project.service';
import {TaskService} from 'app/core/entity/services/task/task.service';
import {Task} from 'app/core/entity/model/task.model';
import {FilterService} from 'app/core/entity/services/filter.service';
import {Tag} from 'app/core/entity/model/tag.model';
import {MediaService} from 'app/core/ui/services/media.service';
import {Media} from 'app/core/ui/model/media.enum';
import {map} from 'rxjs/internal/operators';
import {ProjectListDialogComponent} from '../../components/dialogs/project-list-dialog/project-list-dialog.component';
import {CdkScrollable, ScrollDispatcher} from '@angular/cdk/scrolling';
import {Animations, ScrollDirection, ScrollState} from './timeline.animation';
import {DateService} from 'app/core/entity/services/date.service';
import {Scope} from 'app/core/entity/model/scope.enum';
import {ScopeService} from 'app/core/entity/services/scope.service';
import {TagService} from 'app/core/entity/services/tag/tag.service';
import {Person} from 'app/core/entity/model/person.model';
import {PersonService} from 'app/core/entity/services/person/person.service';
import {TagListDialogComponent} from '../../components/dialogs/tag-list-dialog/tag-list-dialog.component';
import {MatchService} from 'app/core/entity/services/match.service';
import {Action} from 'app/core/entity/model/action.enum';
import {SuggestionService} from 'app/core/entity/services/suggestion.service';
import {DigestService} from 'app/core/digest/services/digest/digest.service';
import {ProjectDigest} from 'app/core/digest/model/project-digest.model';
import {DomSanitizer} from '@angular/platform-browser';
import {MaterialColorService} from '../../../../core/ui/services/material-color.service';
import {MaterialIconService} from '../../../../core/ui/services/material-icon.service';
import {EmailService} from '../../../../core/mail/services/mail/email.service';
import {Router} from '@angular/router';
import {SettingsService} from '../../../../core/settings/services/settings.service';
import {SettingType} from '../../../../core/settings/model/setting-type.enum';
import {Setting} from '../../../../core/settings/model/setting.model';
import {TaskListDialogComponent} from '../../components/dialogs/task-list-dialog/task-list-dialog.component';
import {BaseComponent} from '../base/base.component';

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
export class TimelineComponent
  extends BaseComponent
  implements OnInit, AfterViewInit, OnDestroy {

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

  /** Current media */
  public media: Media = Media.UNDEFINED;

  /** Weekly digest */
  public weeklyDigest: ProjectDigest;
  /** Daily digests */
  public dailyDigests: ProjectDigest[];

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

  /**
   * Constructor
   * @param dialog dialog
   * @param digestService digest service
   * @param emailService email service
   * @param entityService entity service
   * @param filterService filter service
   * @param iconRegistry icon registry
   * @param matchService match service
   * @param materialColorService material color service
   * @param materialIconService material icon service
   * @param mediaService media service
   * @param personService person service
   * @param projectService project service
   * @param router router
   * @param sanitizer sanitizer
   * @param scopeService scope service
   * @param scroll scroll
   * @param snackbarService snackbar service
   * @param settingsService settings service
   * @param suggestionService suggestion service
   * @param tagService tag service
   * @param taskService task service
   * @param taskletService tasklet service
   * @param zone Angular zone
   */
  constructor(protected dialog: MatDialog,
              private digestService: DigestService,
              protected emailService: EmailService,
              private entityService: EntityService,
              protected filterService: FilterService,
              protected iconRegistry: MatIconRegistry,
              private matchService: MatchService,
              protected materialColorService: MaterialColorService,
              protected materialIconService: MaterialIconService,
              protected mediaService: MediaService,
              protected personService: PersonService,
              protected projectService: ProjectService,
              protected router: Router,
              protected sanitizer: DomSanitizer,
              protected scopeService: ScopeService,
              private scroll: ScrollDispatcher,
              protected settingsService: SettingsService,
              protected snackbarService: SnackbarService,
              protected suggestionService: SuggestionService,
              protected tagService: TagService,
              protected taskService: TaskService,
              protected taskletService: TaskletService,
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

    this.initializeWeeklyDigest();
    this.initializeDailyDigests();

    this.initializeMaterial();

    this.clearFilters();
    this.findEntities();
    this.findSettings();
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

  //
  // Events
  //

  // <editor-fold defaultstate="collapsed" desc="Events">

  /**
   * Handles tasklet updates
   * @param tasklets tasklets
   */
  onTaskletsUpdated(tasklets: Map<string, Tasklet>) {
    this.initializeTasklets(tasklets);
    this.initializeTaskletsFiltered(tasklets);
    this.generateWeeklyDigest(this.indicatedDate);
    this.generateDailyDigests(this.indicatedDate);
  }

  /**
   * Handles task updates
   * @param tasks tasks
   */
  onTasksUpdated(tasks: Map<string, Task>) {
    this.initializeTasks(tasks);
    this.initializeTasksFiltered(tasks);
    this.generateWeeklyDigest(this.indicatedDate);
    this.generateDailyDigests(this.indicatedDate);
  }

  /**
   * Handles project updates
   * @param projects projects
   */
  onProjectsUpdated(projects: Map<string, Project>) {
    this.initializeProjects(projects);
    this.initializeProjectsFiltered(projects);
    this.generateWeeklyDigest(this.indicatedDate);
    this.generateDailyDigests(this.indicatedDate);
  }

  /**
   * Handles person updates
   * @param persons persons
   */
  onPersonsUpdated(persons: Map<string, Person>) {
    this.initializePersons(persons);
    this.initializePersonsFiltered(persons);
  }

  /**
   * Handles tag updates
   * @param tags tags
   */
  onTagsUpdated(tags: Map<string, Tag>) {
    this.initializeTags(tags);
    this.initializeTagsFiltered(tags);
    this.initializeTagsUnused(this.taskletsMap, this.tasksMap);
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

  /**
   * Handles scope updates
   * @param scope scope
   */
  onScopeUpdated(scope: Scope) {
    this.scope = scope;

    this.clearFilters();
    this.findEntities();
    this.findSettings();
  }

  /**
   * Handles filter updates
   */
  onFilterUpdated() {
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
  }

  /**
   * Handles suggestions updates
   * @param suggestions suggestions
   */
  private onSuggestionUpdated(suggestions: string[]) {
    if (suggestions != null) {
      this.searchOptions = (suggestions as string[]).reverse();
    }
  }

  /**
   * Handles date updates
   * @param date date
   */
  private onDateUpdated(date: Date) {
    // Date indicator
    this.indicatedDate = date;
    this.indicatedDay = DateService.getDayOfMonthString(date);
    this.indicatedMonth = DateService.getMonthString(new Date(date).getMonth()).slice(0, 3);

    // Digests
    this.generateWeeklyDigest(this.indicatedDate);
    this.generateDailyDigests(this.indicatedDate);
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
    this.initializeScopeSubscription().subscribe(value => {
      this.onScopeUpdated(value as Scope);
    });

    this.initializeFilterSubscription().subscribe(() => {
      this.onFilterUpdated();
    });
    this.initializeSuggestionSubscription().subscribe(value => {
      this.onSuggestionUpdated(value as string[]);
    });
    this.initializeDateSubscription().subscribe(value => {
      this.onDateUpdated(value as Date);
    });
  }

  // Tasklets

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

  // Tasks

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

  // Projects

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

  // Persons

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

  // Tags

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

  // Settings

  /**
   * Initializes settings
   * @param settingsMap settings map
   */
  private initializeSettings(settingsMap: Map<string, Setting>) {
    this.settingsMap = new Map(settingsMap);
    this.sidenavOpened = SettingsService.isSettingActive(SettingType.TIMELINE_SIDENAV_OPENED, this.settingsMap);
  }

  // Other

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
   * Clears all filters
   */
  private clearFilters() {
    this.filterService.clearAllFilters();
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
            tasksMap: this.tasksMap
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const action = result.action as Action;
            const task = result.task as Task;
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
            projectsMap: this.projectsMap
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
        EntityService.downloadEntities(this.taskletsMap,
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

  // </editor-fold>

  //
  // Button actions
  //

  /**
   * Handles key down events
   */
  onKeyDown(keyboardEvent: KeyboardEvent) {
    if (keyboardEvent.ctrlKey && keyboardEvent.altKey) {
      switch (keyboardEvent.key) {
        case 'n': {
          this.onAddTaskClicked();
          break;
        }
        default: {
          break;
        }
      }
    }
  }


  // <editor-fold defaultstate="collapsed" desc="Button action">

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

  // </editor-fold>

  //
  //
  //

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
