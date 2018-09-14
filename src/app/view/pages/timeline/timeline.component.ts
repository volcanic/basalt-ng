import {AfterViewInit, Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SnackbarService} from '../../../core/ui/services/snackbar.service';
import {MatDialog, MatDialogConfig, MatSidenav} from '@angular/material';
import {TaskletService} from '../../../services/entities/tasklet.service';
import {TaskletDialogComponent} from '../../dialogs/entities/tasklet-dialog/tasklet-dialog.component';
import {TagFilterDialogComponent} from '../../dialogs/filters/tag-filter-dialog/tag-filter-dialog.component';
import {DialogMode} from '../../../model/ui/dialog-mode.enum';
import {AboutDialogComponent} from '../../dialogs/app-info/about-dialog/about-dialog.component';
import {environment} from '../../../../environments/environment';
import {ProjectFilterDialogComponent} from '../../dialogs/filters/project-filter-dialog/project-filter-dialog.component';
import {UploadDialogComponent} from '../../dialogs/other/upload-dialog/upload-dialog.component';
import {Tasklet} from '../../../model/entities/tasklet.model';
import {Project} from '../../../model/entities/project.model';
import {EntityService} from '../../../services/entities/entity.service';
import {ProjectService} from '../../../services/entities/project.service';
import {TaskService} from '../../../services/entities/task.service';
import {Task} from '../../../model/entities/task.model';
import {ProjectDialogComponent} from '../../dialogs/entities/project-dialog/project-dialog.component';
import {FilterService} from '../../../services/entities/filter/filter.service';
import {Tag} from '../../../model/entities/tag.model';
import {MediaService} from '../../../core/ui/services/media.service';
import {Media} from '../../../core/ui/model/media.enum';
import {map, takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs/Subject';
import {TaskListDialogComponent} from '../../dialogs/lists/task-list-dialog/task-list-dialog.component';
import {ProjectListDialogComponent} from '../../dialogs/lists/project-list-dialog/project-list-dialog.component';
import {CdkScrollable, ScrollDispatcher} from '@angular/cdk/scrolling';
import {Animations, ScrollDirection, ScrollState} from './timeline.animation';
import {DateService} from '../../../services/util/date.service';
import {Scope} from '../../../model/scope.enum';
import {ScopeService} from '../../../services/entities/scope/scope.service';
import {TagService} from '../../../services/entities/tag.service';
import {TagDialogComponent} from '../../dialogs/entities/tag-dialog/tag-dialog.component';
import {PersonDialogComponent} from '../../dialogs/entities/person-dialog/person-dialog.component';
import {Person} from '../../../model/entities/person.model';
import {PersonService} from '../../../services/entities/person.service';
import {PersonFilterDialogComponent} from '../../dialogs/filters/person-filter-dialog/person-filter-dialog.component';
import {TagListDialogComponent} from '../../dialogs/lists/tag-list-dialog/tag-list-dialog.component';
import {MatchService} from '../../../services/entities/filter/match.service';
import {ConfirmationDialogComponent} from '../../dialogs/other/confirmation-dialog/confirmation-dialog.component';
import {InformationDialogComponent} from '../../dialogs/other/information-dialog/information-dialog.component';
import {Action} from '../../../model/ui/action.enum';
import {TaskDialogComponent} from '../../dialogs/entities/task-dialog/task-dialog.component';
import {TaskletType} from '../../../model/tasklet-type.enum';
import {UUID} from '../../../model/util/uuid';
import {Description} from '../../../model/entities/fragments/description.model';
import {TimePickerDialogComponent} from '../../dialogs/other/time-picker-dialog/time-picker-dialog.component';
import {SuggestionService} from '../../../services/entities/filter/suggestion.service';
import {DigestService} from '../../../services/entities/digest/digest.service';
import {ProjectDigest} from '../../../model/entities/digest/project-digest.model';
import {CloneService} from '../../../services/util/clone.service';

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

  /** Enum for action types */
  action = Action;

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
   * @param {EntityService} entityService
   * @param {FilterService} filterService
   * @param {MatchService} matchService
   * @param {MediaService} mediaService
   * @param {ScopeService} scopeService
   * @param {ScrollDispatcher} scroll
   * @param {SnackbarService} snackbarService
   * @param {SuggestionService} suggestionService
   * @param {PersonService} personService person service
   * @param {ProjectService} projectService project service
   * @param {TagService} tagService tag service
   * @param {TaskService} taskService task service
   * @param {DateService} dateService date service
   * @param {TaskletService} taskletService tasklet service
   * @param {MatDialog} dialog dialog
   * @param {NgZone} zone Angular zone
   */
  constructor(private digestService: DigestService,
              private entityService: EntityService,
              private filterService: FilterService,
              private matchService: MatchService,
              private mediaService: MediaService,
              private scopeService: ScopeService,
              private scroll: ScrollDispatcher,
              private snackbarService: SnackbarService,
              private suggestionService: SuggestionService,
              public personService: PersonService,
              public projectService: ProjectService,
              public tagService: TagService,
              public taskService: TaskService,
              public dateService: DateService,
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

    this.initializeMediaSubscription();
    this.initializeScopeSubscription();
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

  /**
   * Initializes tasklet subscription
   */
  private initializeTaskletSubscription() {
    this.taskletService.taskletsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        this.tasklets = (value as Tasklet[]).filter(tasklet => {
          const matchesSearchItem = this.matchService.taskletMatchesEveryItem(tasklet, this.filterService.searchItem);
          const matchesProjects = this.matchService.taskletMatchesProjects(tasklet,
            Array.from(this.filterService.projects.values()),
            this.filterService.projectsNone);

          return matchesSearchItem && matchesProjects;
        });

        // Digests
        this.generateWeeklyDigest(this.indicatedDate);
        this.generateDailyDigests(this.indicatedDate);
      }
    });
  }

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
        this.tasks = (value as Task[]).filter(task => {
          const matchesSearchItem = this.matchService.taskMatchesEveryItem(task, this.filterService.searchItem);
          const matchesProjects = this.matchService.taskMatchesProjects(task,
            Array.from(this.filterService.projects.values()),
            this.filterService.projectsNone);

          return matchesSearchItem && matchesProjects;
        });
      }
    });
  }

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
        this.projects = (value as Project[]).filter(project => {
          const matchesSearchItem = this.matchService.projectMatchesEveryItem(project, this.filterService.searchItem);
          const matchesProjects = this.matchService.projectMatchesProjects(project,
            Array.from(this.filterService.projects.values()),
            this.filterService.projectsNone);

          return matchesSearchItem && matchesProjects;
        });
      }
    });
  }

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
        this.tags = (value as Tag[]).filter(tag => {
          const matchesSearchItem = this.matchService.tagMatchesEveryItem(tag, this.filterService.searchItem);
          const matchesTags = this.matchService.tagMatchesTags(tag,
            Array.from(this.filterService.tags.values()),
            this.filterService.tagsNone);

          return matchesSearchItem && matchesTags;
        });
      }
    });
  }

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
        this.persons = (value as Person[]).filter(person => {
          const matchesSearchItem = this.matchService.personMatchesEveryItem(person, this.filterService.searchItem);
          const matchesPersons = this.matchService.personMatchesPersons(person,
            Array.from(this.filterService.persons.values()),
            this.filterService.personsNone);

          return matchesSearchItem && matchesPersons;
        });
      }
    });
  }

  /**
   * Initializes filter subscription
   */
  private initializeFilterSubscription() {
    this.filterService.filterSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe(() => {
      // Filter tasklets
      this.tasklets = Array.from(this.taskletService.tasklets.values()).filter(tasklet => {
        const matchesSearchItem = this.matchService.taskletMatchesEveryItem(tasklet, this.filterService.searchItem);
        const matchesProjects = this.matchService.taskletMatchesProjects(tasklet,
          Array.from(this.filterService.projects.values()),
          this.filterService.projectsNone);
        const matchesTags = this.matchService.taskletMatchesTags(tasklet, Array.from(this.filterService.tags.values()),
          this.filterService.tagsNone);
        const matchesPersons = this.matchService.taskletMatchesPersons(tasklet,
          Array.from(this.filterService.persons.values()), this.filterService.personsNone);

        return matchesSearchItem && matchesProjects && matchesTags && matchesPersons;
      }).sort((t1, t2) => {
        return new Date(t2.creationDate).getTime() > new Date(t1.creationDate).getTime() ? 1 : -1;
      });

      // Filter tasks
      this.tasks = Array.from(this.taskService.tasks.values()).filter(task => {
        const matchesSearchItem = this.matchService.taskMatchesEveryItem(task, this.filterService.searchItem);
        const matchesProjects = this.matchService.taskMatchesProjects(task,
          Array.from(this.filterService.projects.values()),
          this.filterService.projectsNone);
        const matchesTags = this.matchService.taskMatchesTags(task, Array.from(this.filterService.tags.values()),
          this.filterService.tagsNone);

        return matchesSearchItem && matchesProjects && matchesTags;
      }).sort((t1, t2) => {
        return new Date(t2.modificationDate).getTime() > new Date(t1.modificationDate).getTime() ? 1 : -1;
      });

      // Filter projects
      this.projects = Array.from(this.projectService.projects.values()).filter(project => {
        const matchesSearchItem = this.matchService.projectMatchesEveryItem(project, this.filterService.searchItem);
        const matchesProjects = this.matchService.projectMatchesProjects(project,
          Array.from(this.filterService.projects.values()),
          this.filterService.projectsNone);

        return matchesSearchItem && matchesProjects;
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
        const matchesSearchItem = this.matchService.tagMatchesEveryItem(tag, this.filterService.searchItem);
        const matchesTags = this.matchService.tagMatchesTags(tag,
          Array.from(this.filterService.tags.values()),
          this.filterService.tagsNone);

        return matchesSearchItem && matchesTags;
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
        const matchesSearchItem = this.matchService.personMatchesEveryItem(person, this.filterService.searchItem);
        const matchesPersons = this.matchService.personMatchesPersons(person,
          Array.from(this.filterService.persons.values()),
          this.filterService.personsNone);

        return matchesSearchItem && matchesPersons;
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
    this.scopeService.scopeSubject.subscribe(scope => {
      this.scope = scope;

      this.filterService.clearSearchItem();
      this.filterService.clearTags();
      this.filterService.clearProjects();
      this.filterService.clearPersons();

      this.taskletService.findTaskletsByScope(scope);
      this.taskService.findOpenTasksByScope(scope);
      this.projectService.findProjectsByScope(scope);
      this.tagService.findTagsByScope(scope);
      this.personService.findPersonsByScope(scope);
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

  //
  // Actions
  //

  /**
   * Handles events targeting a tasklet
   * @param {any} event event parameters
   */
  onTaskletEvent(event: { action: Action, tasklet: Tasklet, task: Task, tags: Tag[], persons: Person[] }) {
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
        tasklet.tagIds = tags.map(tag => {
          return tag.id;
        });
        tasklet.participants.forEach(p => {
            p.activities = [];
          }
        );

        // Assemble data to be passed
        const data = {
          mode: DialogMode.CONTINUE,
          dialogTitle: 'Continue tasklet',
          tasklet: tasklet
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
        const dialogRef = this.dialog.open(TimePickerDialogComponent, <MatDialogConfig>{
          disableClose: false,
          data: {
            dialogTitle: 'Set creation time',
            tasklet: tasklet
          }
        });

        dialogRef.afterClosed().subscribe(result => {
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
  onTaskEvent(event: { action: Action, task: Task, project?: Project, tags?: Tag[] }) {
    const task = CloneService.cloneTask(event.task as Task);
    const project = CloneService.cloneProject(event.project as Project);
    const tags = CloneService.cloneTags(event.tags as Tag[]);

    switch (event.action) {
      case Action.ADD: {
        // Create new entities if necessary
        this.evaluateTaskProject(task, project);
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
        this.evaluateTaskProject(task, project);

        task.completionDate = new Date();
        this.taskService.updateTask(task, false).then(() => {
        });
        this.snackbarService.showSnackbar('Completed task');
        break;
      }
      case Action.REOPEN: {
        this.evaluateTaskProject(task, project);

        task.completionDate = null;
        this.taskService.updateTask(task, false).then(() => {
        });
        this.snackbarService.showSnackbar('Re-opened task');
        break;
      }
      case Action.OPEN_DIALOG_ADD: {
        // Assemble data to be passed
        const data = {
          mode: DialogMode.ADD,
          dialogTitle: 'Add task',
          task: new Task(''),
          project: null,
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
            const resultingTags = result.tags as Tag[];

            this.onTaskEvent({
              action: resultingAction,
              task: resultingTask,
              project: resultingProject,
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
            const resultingTags = result.tags as Tag[];

            this.onTaskEvent({
              action: resultingAction,
              task: resultingTask,
              project: resultingProject,
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
      case 'todo': {
        this.sidenavStart.toggle().then(() => {
        });
        this.sidenavEnd.toggle().then(() => {
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
   * Determines whether the tags assigned to a given task already exixst, otherwise creates new ones
   * @param {Task} task task assign tags to
   * @param {Tag[]} tags array of tags to be checked
   */
  private evaluateTaskTags(task: Task, tags: Tag[]) {
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

    tasklet.tagIds = Array.from(aggregatedTagIds.values());
  }

  /**
   * Determines whether the persons assigned to a given tasklet already exixst, otherwise creates new ones
   * @param {Tasklet} tasklet tasklet assign persons to
   * @param {Person[]} persons array of persons to be checked
   */
  private evaluateTaskletPersons(tasklet: Tasklet, persons: Person[]) {
    const aggregatedPersonIds = new Map<string, string>();

    // New person
    persons.forEach(t => {
      let person = this.personService.getPersonByName(t.name);

      if (person == null) {
        person = new Person(t.name, true);
        this.personService.createPerson(person).then(() => {
        });
      }

      this.filterService.updatePersonsList([person], true);
      aggregatedPersonIds.set(person.id, person.id);
    });

    tasklet.personIds = Array.from(aggregatedPersonIds.values());
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
