import {AfterViewInit, Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SnackbarService} from 'app/core/ui/services/snackbar.service';
import {MatDialog, MatDialogConfig, MatIconRegistry, MatSidenav} from '@angular/material';
import {TaskletService} from 'app/core/entity/services/tasklet.service';
import {TaskletDialogComponent} from '../../components/dialogs/tasklet-dialog/tasklet-dialog.component';
import {TagFilterDialogComponent} from '../../components/dialogs/tag-filter-dialog/tag-filter-dialog.component';
import {DialogMode} from 'app/core/entity/model/dialog-mode.enum';
import {AboutDialogComponent} from 'app/ui/about-dialog/about-dialog/about-dialog.component';
import {environment} from 'app/../environments/environment';
import {ProjectFilterDialogComponent} from '../../components/dialogs/project-filter-dialog/project-filter-dialog.component';
import {UploadDialogComponent} from '../../components/dialogs/upload-dialog/upload-dialog.component';
import {Tasklet} from 'app/core/entity/model/tasklet.model';
import {Project} from 'app/core/entity/model/project.model';
import {EntityService} from 'app/core/entity/services/entity.service';
import {ProjectService} from 'app/core/entity/services/project.service';
import {TaskService} from 'app/core/entity/services/task.service';
import {Task} from 'app/core/entity/model/task.model';
import {ProjectDialogComponent} from '../../components/dialogs/project-dialog/project-dialog.component';
import {FilterService} from 'app/core/entity/services/filter.service';
import {Tag} from 'app/core/entity/model/tag.model';
import {MediaService} from 'app/core/ui/services/media.service';
import {Media} from 'app/core/ui/model/media.enum';
import {map, takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs/Subject';
import {TaskListDialogComponent} from '../../components/dialogs/task-list-dialog/task-list-dialog.component';
import {ProjectListDialogComponent} from '../../components/dialogs/project-list-dialog/project-list-dialog.component';
import {CdkScrollable, ScrollDispatcher} from '@angular/cdk/scrolling';
import {Animations, ScrollDirection, ScrollState} from './timeline.animation';
import {DateService} from 'app/core/entity/services/date.service';
import {Scope} from 'app/core/entity/model/scope.enum';
import {ScopeService} from 'app/core/entity/services/scope.service';
import {TagService} from 'app/core/entity/services/tag.service';
import {TagDialogComponent} from '../../components/dialogs/tag-dialog/tag-dialog.component';
import {PersonDialogComponent} from '../../components/dialogs/person-dialog/person-dialog.component';
import {Person} from 'app/core/entity/model/person.model';
import {PersonService} from 'app/core/entity/services/person.service';
import {PersonFilterDialogComponent} from '../../components/dialogs/person-filter-dialog/person-filter-dialog.component';
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
import {Settings} from '../../../../core/settings/model/settings.enum';

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

  /** Array of tasklets */
  public tasklets: Tasklet[] = [];

  /** Map of tasks */
  public tasksMap = new Map<string, Task>();
  /** Array of tasks */
  public tasks: Task[] = [];

  /** Map of projects */
  public projectsMap = new Map<string, Project>();
  /** Array of projects */
  public projects: Project[] = [];
  /** Array of projects with filter values */
  public projectsFilter: Project[] = [];
  /** Flag indicating whether entities without project shall be displayed */
  public projectsNone = false;

  /** Map of tags */
  public tagsMap = new Map<string, Tag>();
  /** Array of tags */
  public tags: Tag[] = [];
  /** Array of tags with filter values */
  public tagsFilter: Tag[] = [];
  /** Flag indicating whether entities without tag shall be displayed */
  public tagsNone = false;

  /** Map of persons */
  public personsMap = new Map<string, Person>();
  /** Array of persons */
  public persons: Person[] = [];
  /** Array of persons with filter values */
  public personsFilter: Person[] = [];
  /** Flag indicating whether entities without person shall be displayed */
  public personsNone = false;

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
  public scopeType = Scope;
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

  /** Side navigation at start */
  @ViewChild('sidenavStart') sidenavStart: MatSidenav;
  /** Side navigation at end */
  @ViewChild('sidenavEnd') sidenavEnd: MatSidenav;
  /** Scrollable directive */
  @ViewChild(CdkScrollable) scrollable: CdkScrollable;

  /**
   * Constructor
   * @param {DigestService} digestService
   * @param {EmailService} emailService
   * @param {EntityService} entityService
   * @param {FilterService} filterService
   * @param {MatIconRegistry} iconRegistry
   * @param {MatchService} matchService
   * @param {MaterialColorService} materialColorService
   * @param {MaterialIconService} materialIconService
   * @param {Router} router
   * @param {MediaService} mediaService
   * @param {DomSanitizer} sanitizer
   * @param {ScopeService} scopeService
   * @param {ScrollDispatcher} scroll
   * @param {SnackbarService} snackbarService
   * @param {SuggestionService} suggestionService
   * @param {PersonService} personService person service
   * @param {ProjectService} projectService project service
   * @param {SettingsService} settingsService settings service
   * @param {TagService} tagService tag service
   * @param {TaskService} taskService task service
   * @param {TaskletService} taskletService tasklet service
   * @param {MatDialog} dialog dialog
   * @param {NgZone} zone Angular zone
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
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.tasksMap = new Map(this.taskService.tasks);
    this.projectsMap = new Map(this.projectService.projects);
    this.tagsMap = new Map(this.tagService.tags);
    this.personsMap = new Map(this.personService.persons);

    this.initializeTasklets(Array.from(this.taskletService.tasklets.values()));
    this.initializeTasks(Array.from(this.taskService.tasks.values()));
    this.initializeProjects(Array.from(this.projectService.projects.values()));
    this.initializeTags(Array.from(this.tagService.tags.values()));
    this.initializePersons(Array.from(this.personService.persons.values()));

    this.initializeTaskletSubscription();
    this.initializeTaskSubscription();
    this.initializeProjectSubscription();
    this.initializeTagSubscription();
    this.initializePersonSubscription();

    this.initializeFilterSubscription();
    this.initializeSuggestionSubscription();

    this.initializeDateSubscription();
    this.initializeWeeklyDigest();
    this.initializeDailyDigests();

    this.initializeMaterial();
    this.initializeMediaSubscription();
    this.initializeScopeSubscription();

    this.clearFilters();
    this.findEntities();
  }

  /**
   * Handles after-view-init lifecycle hook
   */
  ngAfterViewInit() {
    this.initializeScrollDetection();
  }

  /**
   * Handles on-destroy lifecycle hook
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
        this.initializeTasklets(value as Tasklet[]);
      }
    });
  }

  /**
   * Initializes tasklets by filtering them
   * @param tasklets tasklets
   */
  private initializeTasklets(tasklets: Tasklet[]) {
    this.tasklets = tasklets.filter(tasklet => {
      return this.filterTasklet(tasklet);
    });

    // Digests
    this.generateWeeklyDigest(this.indicatedDate);
    this.generateDailyDigests(this.indicatedDate);
  }

  /**
   * Checks if a tasklet matches current filter criteria
   * @param tasklet tasklet
   */
  private filterTasklet(tasklet: Tasklet): boolean {
    const matchesSearchItem = this.matchService.taskletMatchesEveryItem(tasklet, this.filterService.searchItem);
    const matchesTasks = this.matchService.taskletMatchesTasks(tasklet,
      Array.from(this.filterService.tasks.values()),
      this.filterService.tasksNone);
    const matchesProjects = this.matchService.taskletMatchesProjects(tasklet,
      Array.from(this.filterService.projects.values()),
      this.filterService.projectsNone);
    const matchesTags = this.matchService.taskletMatchesTags(tasklet, Array.from(this.filterService.tags.values()),
      this.filterService.tagsNone);
    const matchesPersons = this.matchService.taskletMatchesPersons(tasklet,
      Array.from(this.filterService.persons.values()), this.filterService.personsNone);

    return matchesSearchItem && matchesTasks && matchesProjects && matchesTags && matchesPersons;
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
      // Create new instance to trigger change detection of child components
      this.tasksMap = new Map(this.taskService.tasks);
      // Notify parent service (if a task's name is changed the label on a tasklet shall be updated as well)
      this.taskletService.notify();

      if (value != null) {
        this.initializeTasks(value as Task[]);
      }
    });
  }

  /**
   * Initializes tasks by filtering them
   * @param tasks tasks
   */
  private initializeTasks(tasks: Task[]) {
    this.tasks = tasks.filter(task => {
      return this.filterTask(task);
    });
  }

  /**
   * Checks if a task matches current filter criteria
   * @param task task
   */
  private filterTask(task: Task): boolean {
    const matchesSearchItem = this.matchService.taskMatchesEveryItem(task, this.filterService.searchItem);
    const matchesProjects = this.matchService.taskMatchesProjects(task,
      Array.from(this.filterService.projects.values()),
      this.filterService.projectsNone);
    const matchesTags = this.matchService.taskMatchesTags(task, Array.from(this.filterService.tags.values()),
      this.filterService.tagsNone);
    const matchesPersons = this.matchService.taskMatchesPersons(task, Array.from(this.filterService.persons.values()), this.filterService.personsNone);

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
      // Create new instance to trigger change detection of child components
      this.projectsMap = new Map(this.projectService.projects);
      // Notify parent service (if a project's name is changed the lable on a tasklet shall be updated as well)
      this.taskletService.notify();

      if (value != null) {
        this.initializeProjects((value as Project[]));
      }
    });
  }

  /**
   * Initializes projects by filtering them
   * @param projects projects
   */
  private initializeProjects(projects: Project[]) {
    this.projects = projects.filter(project => {
      return this.filterProject(project);
    });
  }

  /**
   * Checks if a project matches current filter criteria
   * @param project project
   */
  private filterProject(project: Project): boolean {
    const matchesSearchItem = this.matchService.projectMatchesEveryItem(project, this.filterService.searchItem);
    const matchesTasks = this.matchService.projectMatchesTasks(project,
      Array.from(this.filterService.tasks.values()),
      this.filterService.tasksNone);

    return matchesSearchItem && matchesTasks;
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
      // Create new instance to trigger change detection of child components
      this.tagsMap = new Map(this.tagService.tags);

      if (value != null) {
        this.initializeTags(value as Tag[]);
      }
    });
  }

  /**
   * Initializes tags by filtering them
   * @param tags tags
   */
  private initializeTags(tags: Tag[]) {
    this.tags = tags.filter(tag => {
      return this.filterTag(tag);
    });
  }

  /**
   * Checks if a tag matches current filter criteria
   * @param tag tag
   */
  private filterTag(tag: Tag): boolean {
    const matchesSearchItem = this.matchService.tagMatchesEveryItem(tag, this.filterService.searchItem);
    /*
    const matchesTags = this.matchService.tagMatchesTags(tag,
      Array.from(this.filterService.tags.values()),
      this.filterService.tagsNone);
    */
    return matchesSearchItem /* && matchesTags */;
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
      // Create new instance to trigger change detection of child components
      this.personsMap = new Map(this.personService.persons);

      if (value != null) {
        this.initializePersons(value as Person[]);
      }
    });
  }

  /**
   * Initializes persons by filtering them
   * @param persons persons
   */
  private initializePersons(persons: Person[]) {
    this.persons = persons.filter(person => {
      return this.filterPerson(person);
    });
  }

  /**
   * Checks if a person matches current filter criteria
   * @param person person
   */
  private filterPerson(person: Person): boolean {
    const matchesSearchItem = this.matchService.personMatchesEveryItem(person, this.filterService.searchItem);

    /*
    const matchesPersons = this.matchService.personMatchesPersons(person,
      Array.from(this.filterService.persons.values()),
      this.filterService.personsNone);
    */

    return matchesSearchItem /* && matchesPersons */;
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
      // Filter tasklets
      this.tasklets = Array.from(this.taskletService.tasklets.values()).filter(tasklet => {
        return this.filterTasklet(tasklet);
      }).sort((t1, t2) => {
        return new Date(t2.creationDate).getTime() > new Date(t1.creationDate).getTime() ? 1 : -1;
      });

      // Filter tasks
      this.tasks = Array.from(this.taskService.tasks.values()).filter(task => {
        return this.filterTask(task);
      }).sort((t1, t2) => {
        return new Date(t2.modificationDate).getTime() > new Date(t1.modificationDate).getTime() ? 1 : -1;
      });

      // Filter projects
      this.projects = Array.from(this.projectService.projects.values()).filter(project => {
        return this.filterProject(project);
      }).sort((p1, p2) => {
        return new Date(p2.modificationDate).getTime() > new Date(p1.modificationDate).getTime() ? 1 : -1;
      });

      // Sort filter
      this.projectsFilter = Array.from(this.filterService.projects.values()).sort((p1, p2) => {
        return p2.name < p1.name ? 1 : -1;
      });
      this.projectsNone = this.filterService.projectsNone;

      // Filter tags
      this.tags = Array.from(this.tagService.tags.values()).filter(tag => {
        return this.filterTag(tag);
      }).sort((t1, t2) => {
        return new Date(t2.modificationDate).getTime() > new Date(t1.modificationDate).getTime() ? 1 : -1;
      });

      // Sort filter
      this.tagsFilter = Array.from(this.filterService.tags.values()).sort((t1, t2) => {
        return t2.name < t1.name ? 1 : -1;
      });
      this.tagsNone = this.filterService.tagsNone;

      // Filter persons
      this.persons = Array.from(this.personService.persons.values()).filter(person => {
        return this.filterPerson(person);
      }).sort((p1, p2) => {
        return new Date(p2.modificationDate).getTime() > new Date(p1.modificationDate).getTime() ? 1 : -1;
      });

      // Sort filter
      this.personsFilter = Array.from(this.filterService.persons.values()).sort((p1, p2) => {
        return p2.name < p1.name ? 1 : -1;
      });
      this.personsNone = this.filterService.personsNone;
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
    this.taskletService.dateQueueSubject.subscribe(date => {
      // Date indicator
      this.indicatedDate = date;
      this.indicatedDay = DateService.getDayOfMonthString(date);
      this.indicatedMonth = DateService.getMonthString(new Date(date).getMonth()).slice(0, 3);

      // Digests
      this.generateWeeklyDigest(this.indicatedDate);
      this.generateDailyDigests(this.indicatedDate);
    });
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
   * Clears all filters
   */
  private clearFilters() {
    this.filterService.clearSearchItem();
    this.filterService.clearTags();
    this.filterService.clearProjects();
    this.filterService.clearPersons();
  }

  /**
   * Triggers entity retrieval from database
   */
  private findEntities() {
    if (this.tasklets.length === 0) {
      this.taskletService.findTaskletsByScope(this.scope);
    }
    if (this.tasks.length === 0) {
      this.taskService.findTasksByScope(this.scope);
    }
    if (this.projects.length === 0) {
      this.projectService.findProjectsByScope(this.scope);
    }
    if (this.tags.length === 0) {
      this.tagService.findTagsByScope(this.scope);
    }
    if (this.persons.length === 0) {
      this.personService.findPersonsByScope(this.scope);
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
      case Action.OPEN_DIALOG_ADD: {
        // Assemble data to be passed
        const data = {
          mode: DialogMode.ADD,
          dialogTitle: 'Add tasklet',
          tasklet: new Tasklet(),
          task: null,
          tags: [],
          persons: [],
          previousDescription: null
        };

        // Open dialog
        const dialogRef = this.dialog.open(TaskletDialogComponent, {
          disableClose: false,
          data: data
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
          tasklet: tasklet,
          task: this.taskService.tasks.get(tasklet.taskId),
          tags: tasklet.tagIds.map(id => {
            return this.tagService.tags.get(id);
          }).filter(tag => {
            return tag != null;
          }),
          persons: tasklet.personIds.map(id => {
            return this.personService.persons.get(id);
          }).filter(person => {
            return person != null;
          }),
          previousDescription: null
        };

        // Open dialog
        const dialogRef = this.dialog.open(TaskletDialogComponent, {
          disableClose: false,
          data: data
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

        tasklet['_rev'] = null;
        tasklet.id = new UUID().toString();
        tasklet.description = new Description();
        tasklet.creationDate = new Date();

        // Assemble data to be passed
        const data = {
          mode: DialogMode.CONTINUE,
          dialogTitle: 'Continue tasklet',
          tasklet: tasklet,
          task: this.taskService.tasks.get(tasklet.taskId),
          tags: tasklet.tagIds.map(id => {
            return this.tagService.tags.get(id);
          }).filter(tag => {
            return tag != null;
          }),
          persons: tasklet.personIds.map(id => {
            this.personService.persons.get(id);
          }).filter(person => {
            return person != null;
          }),
          previousDescription: previousDescription
        };

        // Open dialog
        const continueTaskletDialogRef = this.dialog.open(TaskletDialogComponent, {
          disableClose: false,
          data: data
        });

        // Handle dialog close
        continueTaskletDialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const resultingAction = result.action as Action;
            const resultingTasklet = result.tasklet as Tasklet;

            this.onTaskletEvent({
              action: resultingAction,
              tasklet: resultingTasklet,
              task: this.taskService.tasks.get(resultingTasklet.taskId),
              tags: resultingTasklet.tagIds.map(id => {
                return this.tagService.tags.get(id);
              }).filter(tag => {
                return tag != null;
              }),
              persons: resultingTasklet.personIds.map(id => {
                return this.personService.persons.get(id);
              }).filter(person => {
                return person != null;
              })
            });
          }
        });
        break;
      }
      case Action.OPEN_DIALOG_TEMPLATE: {
        tasklet['_rev'] = null;
        tasklet.id = new UUID().toString();
        tasklet.description = new Description();
        tasklet.creationDate = new Date();

        // Assemble data to be passed
        const data = {
          mode: DialogMode.CONTINUE,
          dialogTitle: 'Template tasklet',
          tasklet: tasklet,
          tags: tasklet.tagIds.map(id => {
            return this.tagService.tags.get(id);
          }).filter(tag => {
            return tag != null;
          }),
        };

        // Open dialog
        const continueTaskletDialogRef = this.dialog.open(TaskletDialogComponent, {
          disableClose: false,
          data: data
        });

        // Handle dialog close
        continueTaskletDialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const resultingTasklet = result.tasklet as Tasklet;

            switch (result.action) {
              case Action.ADD: {
                this.taskletService.createTasklet(resultingTasklet).then(() => {
                });
                break;
              }
            }
          }
        });
        break;
      }
      case Action.OPEN_DIALOG_CREATION_TIME: {
        const dialogRef = this.dialog.open(DateTimePickerDialogComponent, <MatDialogConfig>{
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
              tasklet: tasklet,
              task: this.taskService.tasks.get(tasklet.taskId),
              tags: tasklet.tagIds.map(id => {
                return this.tagService.tags.get(id);
              }).filter(tag => {
                return tag != null;
              }),
              persons: tasklet.personIds.map(id => {
                return this.personService.persons.get(id);
              }).filter(person => {
                return person != null;
              })
            });
          }
        });
        break;
      }
      case Action.FULLSCREEN: {
        // Update tasklet
        this.onTaskletEvent({
          action: Action.UPDATE,
          tasklet: tasklet,
          task: task,
          tags: tags,
          persons: persons
        });

        this.router.navigate([`/tasklet/${tasklet.id}`]).then(() => {
        });
        break;
      }
      case Action.POMODORO_START: {
        // Set pomodoro duration and start time
        tasklet.pomodoroDuration = +this.settingsService.settings.get(Settings.POMODORO_DURATION).value;
        tasklet.pomodoroStartTime = new Date();

        // Update tasklet
        this.onTaskletEvent({
          action: Action.UPDATE,
          tasklet: tasklet,
          task: task,
          tags: tags,
          persons: persons
        });

        this.router.navigate([`/tasklet/${tasklet.id}`]).then(() => {
        });
        break;
      }
    }
  }

  /**
   * Handles events targeting a tasklet creation date
   * @param {Date} creationDate creation date
   */
  onTaskletCreationDateEvent(creationDate: Date) {
    this.taskletService.addElementToDateQueue(creationDate);
  }

  /**
   * Handles events targeting a task
   * @param {any} event event parameters
   */
  onTaskEvent(event: { action: Action, task: Task, tasks?: Task[], project?: Project, delegatedTo?: Person, tags?: Tag[], omitReferenceEvaluation?: boolean }) {
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
        this.taskService.createTask(task).then(() => {
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
          data: data
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
          task: task,
          project: this.projectService.projects.get(task.projectId),
          delegatedTo: this.personService.persons.get(task.delegatedToId),
          tags: task.tagIds.map(id => {
            return this.tagService.tags.get(id);
          }).filter(tag => {
            return tag != null;
          })
        };

        // Open dialog
        const dialogRef = this.dialog.open(TaskDialogComponent, {
          disableClose: false,
          data: data
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
          tasklet: tasklet,
          tags: [],
          task: this.taskService.tasks.get(tasklet.taskId),
          persons: []
        });
        break;
      }
      case Action.FILTER_SINGLE: {
        this.filterService.uncheckTasks();
        this.filterService.updateTasksList(tasks, true);
        break;
      }
    }
  }

  /**
   * Handles events targeting a project
   * @param {any} event event parameters
   */
  onProjectEvent(event: { action: Action, project?: Project, projects?: Project[], projectsNone?: boolean }) {
    const project = CloneService.cloneProject(event.project as Project);
    const projects = CloneService.cloneProjects(event.projects as Project[]);
    const projectsNone = event.projectsNone as boolean;

    switch (event.action) {
      case Action.ADD: {
        this.filterService.updateProjectsList([project], true);
        this.projectService.createProject(project, true).then(() => {
        });
        break;
      }
      case Action.UPDATE: {
        this.filterService.updateProjectsList([project], true);
        this.projectService.updateProject(project).then(() => {
        });
        break;
      }
      case Action.DELETE: {
        const references = Array.from(this.taskService.tasks.values()).some((task: Task) => {
          return task.projectId === project.id;
        });

        if (references) {
          this.dialog.open(InformationDialogComponent, <MatDialogConfig>{
            disableClose: false,
            data: {
              title: 'Cannot delete project',
              text: `There are still tasks associated with this project.`,
              action: 'Okay',
              value: project
            }
          });
        } else {
          const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, <MatDialogConfig>{
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
              this.projectService.deleteProject(confirmationResult as Project).then(() => {
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
          project: new Project('')
        };

        // Open dialog
        const dialogRef = this.dialog.open(ProjectDialogComponent, {
          disableClose: false,
          data: data
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
          project: project
        };

        // Open dialog
        const dialogRef = this.dialog.open(ProjectDialogComponent, {
          disableClose: false,
          data: data
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
        this.filterService.uncheckProjects();
        this.filterService.updateProjectsList(projects, true);
        break;
      }
      case Action.FILTER_ALL: {
        this.filterService.updateProjects(projects, false, projectsNone);
        break;
      }
      case Action.FILTER_LIST: {
        this.filterService.updateProjectsList(projects);
        break;
      }
      case Action.FILTER_NONE: {
        this.filterService.updateProjectsNone(projectsNone);
        break;
      }
    }
  }

  /**
   * Handles events targeting a tag
   * @param {any} event event parameters
   */
  onTagEvent(event: { action: Action, tag?: Tag, tags?: Tag[], tagsNone?: boolean }) {
    const tag = CloneService.cloneTag(event.tag as Tag);
    const tags = CloneService.cloneTags(event.tags as Tag[]);
    const tagsNone = event.tagsNone as boolean;

    switch (event.action) {
      case Action.ADD: {
        this.filterService.updateTagsList([tag], true);
        this.tagService.createTag(tag).then(() => {
        });
        break;
      }
      case Action.UPDATE: {
        this.filterService.updateTagsList([tag], true);
        this.tagService.updateTag(tag).then(() => {
        });
        break;
      }
      case Action.DELETE: {
        const referencesTasklets = Array.from(this.taskletService.tasklets.values()).some((tasklet: Tasklet) => {
          return tasklet.tagIds != null && tasklet.tagIds.some(tagId => {
            return tagId === tag.id;
          });
        });
        const referencesTasks = Array.from(this.taskService.tasks.values()).some((task: Task) => {
          return task.tagIds != null && task.tagIds.some(tagId => {
            return tagId === tag.id;
          });
        });

        if (referencesTasklets || referencesTasks) {
          this.dialog.open(InformationDialogComponent, <MatDialogConfig>{
            disableClose: false,
            data: {
              title: 'Cannot delete tag',
              text: `There are still tasks associated with this tag.`,
              action: 'Okay',
              value: tag
            }
          });
        } else {
          const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, <MatDialogConfig>{
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
              this.tagService.deleteTag(confirmationResult as Tag).then(() => {
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
          data: data
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
          tag: tag
        };

        // Open dialog
        const dialogRef = this.dialog.open(TagDialogComponent, {
          disableClose: false,
          data: data
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
      case Action.FILTER_SINGLE: {
        this.filterService.uncheckTags();
        this.filterService.updateTagsList(tags, true);
        break;
      }
      case Action.FILTER_ALL: {
        this.filterService.updateTags(tags, false, tagsNone);
        break;
      }
      case Action.FILTER_LIST: {
        this.filterService.updateTagsList(tags);
        break;
      }
      case Action.FILTER_NONE: {
        this.filterService.updateTagsNone(tagsNone);
        break;
      }
    }
  }

  /**
   * Handles events targeting a person
   * @param {any} event event parameters
   */
  onPersonEvent(event: { action: Action, person?: Person, persons?: Person[], personsNone?: boolean }) {
    const person = CloneService.clonePerson(event.person as Person);
    const persons = CloneService.clonePersons(event.persons as Person[]);
    const personsNone = event.personsNone;

    switch (event.action) {
      case Action.ADD: {
        this.filterService.updatePersonsList([person], true);
        this.personService.createPerson(person).then(() => {
        });
        break;
      }
      case Action.UPDATE: {
        this.filterService.updatePersonsList([person], true);
        this.personService.updatePerson(person).then(() => {
        });
        break;
      }
      case Action.DELETE: {
        const referencesTasklets = Array.from(this.taskletService.tasklets.values()).some((tasklet: Tasklet) => {
          return tasklet.personIds != null && tasklet.personIds.some(personId => {
            return personId === person.id;
          });
        });

        if (referencesTasklets) {
          this.dialog.open(InformationDialogComponent, <MatDialogConfig>{
            disableClose: false,
            data: {
              title: 'Cannot delete person',
              text: `There are still tasks associated with this person.`,
              action: 'Okay',
              value: person
            }
          });
        } else {
          const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, <MatDialogConfig>{
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
              this.personService.deletePerson(confirmationResult as Person).then(() => {
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
          data: data
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
          person: person
        };

        // Open dialog
        const dialogRef = this.dialog.open(PersonDialogComponent, {
          disableClose: false,
          data: data
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
        this.filterService.uncheckPerson();
        this.filterService.updatePersonsList(persons, true);
        break;
      }
      case Action.FILTER_ALL: {
        this.filterService.updatePersons(persons, false, personsNone);
        break;
      }
      case Action.FILTER_LIST: {
        this.filterService.updatePersonsList(persons);
        break;
      }
      case Action.FILTER_NONE: {
        this.filterService.updatePersonsNone(personsNone);
        break;
      }
    }
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
        });
        this.sidenavEnd.toggle().then(() => {
        });
        break;
      }
      case 'settings': {
        this.snackbarService.showSnackbar('Clicked on menu item Setting');
        break;
      }
      case 'task-list': {
        const dialogRef = this.dialog.open(TaskListDialogComponent, {
          disableClose: false,
          data: {
            dialogTitle: 'Tasks',
            tasks: this.tasks
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
                this.onTaskEvent({action: action, task: task});
                break;
              }
              case Action.OPEN_DIALOG_UPDATE: {
                this.onTaskEvent({action: action, task: task, project: project, tags: tags});
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
            projects: this.projects
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
            tags: this.tags
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
      case 'filter-tags': {
        const dialogRef = this.dialog.open(TagFilterDialogComponent, {
          disableClose: false,
          data: {
            dialogTitle: 'Select tags',
            tags: Array.from(this.filterService.tags.values()),
            tagsNone: this.filterService.tagsNone
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const tags = result.tags as Tag[];
            const tagsNone = result.tagsNone as boolean;

            this.filterService.updateTags(tags, false, tagsNone);
            this.snackbarService.showSnackbar('Tags selected');
          }
        });
        break;
      }
      case 'filter-projects': {
        const dialogRef = this.dialog.open(ProjectFilterDialogComponent, {
          disableClose: false,
          data: {
            dialogTitle: 'Select projects',
            projects: Array.from(this.filterService.projects.values()),
            projectsNone: this.filterService.projectsNone
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const projects = result.projects as Project[];
            const projectsNone = result.projectsNone as boolean;

            this.filterService.updateProjects(projects, false, projectsNone);
            this.snackbarService.showSnackbar('Projects selected');
          }
        });
        break;
      }
      case 'filter-persons': {
        const dialogRef = this.dialog.open(PersonFilterDialogComponent, {
          disableClose: false,
          data: {
            dialogTitle: 'Select persons',
            persons: Array.from(this.filterService.persons.values()),
            personsNone: this.filterService.personsNone
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const persons = result.persons as Person[];
            const personsNone = result.personsNone as boolean;

            this.filterService.updatePersons(persons, false, personsNone);
            this.snackbarService.showSnackbar('Persons selected');
          }
        });
        break;
      }
      case 'upload': {
        this.dialog.open(UploadDialogComponent, <MatDialogConfig>{
          disableClose: false,
          data: {
            title: 'Upload'
          }
        });
        break;
      }
      case 'download': {
        this.entityService.downloadEntities();
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
        this.dialog.open(AboutDialogComponent, <MatDialogConfig>{
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
   * @param {string} searchItem new search item
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
      let p = this.projectService.getProjectByName(project.name);

      // New project
      if (p == null && project.name != null && project.name !== '') {
        p = new Project(project.name, true);
        this.projectService.createProject(p, false).then(() => {
        });
      }

      this.filterService.updateProjectsList([p], true);
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
        p = new Person(delegatedTo.name, true);
        this.personService.createPerson(p).then(() => {
        });
      }

      this.filterService.updatePersonsList([p], true);
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
          tag = new Tag(t.name, true);
          this.tagService.createTag(tag).then(() => {
          });
        }

        this.filterService.updateTagsList([tag], true);
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
      let t = this.taskService.getTaskByName(task.name);

      // New task
      if (t == null && task.name != null && task.name !== '') {
        t = new Task(task.name);
        this.taskService.createTask(t, false).then(() => {
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
    tags.filter(t => {
      return t != null;
    }).forEach(t => {
      const tag = this.lookupTag(t.name);
      aggregatedTags.set(tag.id, tag);
    });

    // Infer tags from meeting minutes
    if (tasklet.meetingMinuteItems != null) {
      tasklet.meetingMinuteItems.filter(m => {
        return m.topic != null;
      }).map(m => {
        return m.topic;
      }).forEach(t => {
        const tag = this.lookupTag(t);
        aggregatedTags.set(tag.id, tag);
      });
    }

    const values = Array.from(aggregatedTags.values());
    const keys = Array.from(aggregatedTags.keys());

    this.filterService.updateTagsList(values, true);
    tasklet.tagIds = Array.from(keys);
  }

  /**
   * Returns existing tag if exists or creates a new one if not
   * @param t tag name
   */
  private lookupTag(t: string): Tag {
    let tag = this.tagService.getTagByName(t);

    if (tag == null) {
      tag = new Tag(t, true);
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
    persons.filter(p => {
      return p != null;
    }).forEach(p => {
      const person = this.lookupPerson(p.name);
      aggregatedPersons.set(person.id, person);
    });

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

    this.filterService.updatePersonsList(values, true);
    tasklet.personIds = Array.from(keys);
  }

  /**
   * Returns existing person if exists or creates a new one if not
   * @param p person name
   */
  private lookupPerson(p: string): Person {
    let person = this.personService.getPersonByName(p);

    if (person == null) {
      person = new Person(p, true);
      this.personService.createPerson(person).then(() => {
      });
    }

    return person;
  }

  /**
   * Generates weekly digest
   * @param {Date} date focus date
   */
  private generateWeeklyDigest(date: Date) {
    this.weeklyDigest = this.digestService.getWeeklyDigest(date);
  }

  /**
   * Generates daily digests
   * @param {Date} date focus date
   */
  private generateDailyDigests(date: Date) {
    this.dailyDigests = [];
    const weekStart = DateService.getWeekStart(date);
    const day = new Date(weekStart);

    // Iterate over all weekdays
    [0, 1, 2, 3, 4, 5, 6].forEach(index => {
      const focusDate = new Date(day.setDate(weekStart.getDate() + index));
      const dailyDigest = this.digestService.getDailyDigest(focusDate);

      if (dailyDigest.getProjectEffortSum() > 0) {
        this.dailyDigests.push(dailyDigest);
      }
    });
  }
}
