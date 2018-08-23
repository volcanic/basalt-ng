import {AfterViewInit, Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SnackbarService} from '../../../services/ui/snackbar.service';
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
import {TaskDialogComponent} from '../../dialogs/entities/task-dialog/task-dialog.component';
import {Task} from '../../../model/entities/task.model';
import {ProjectDialogComponent} from '../../dialogs/entities/project-dialog/project-dialog.component';
import {FilterService} from '../../../services/entities/filter/filter.service';
import {Tag} from '../../../model/entities/tag.model';
import {MediaService} from '../../../services/ui/media.service';
import {Media} from '../../../model/ui/media.enum';
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
import {DialogAction} from '../../../model/ui/dialog-action.enum';

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
  title = 'Basalt';

  /** Array of projects */
  public projects: Project[] = [];
  /** Array of projects with filter values */
  public projectsFilter: Project[] = [];
  /** Flag indicating whether entities without project shall be displayed */
  public projectsNone = false;

  /** Array of persons */
  public persons: Person[] = [];
  /** Array of persons with filter values */
  public personsFilter: Person[] = [];
  /** Flag indicating whether entities without person shall be displayed */
  public personsNone = false;

  /** Indicator date */
  public indicatedDate;
  /** Indicator day */
  public indicatedDay;
  /** Indicator month */
  public indicatedMonth;

  /** Enum of media types */
  public mediaType = Media;
  /** Current media */
  public media: Media = Media.UNDEFINED;

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
   * @param {EntityService} entityService
   * @param {FilterService} filterService
   * @param {MatchService} matchService
   * @param {MediaService} mediaService
   * @param {PersonService} personService
   * @param {ProjectService} projectService
   * @param {ScopeService} scopeService
   * @param {ScrollDispatcher} scroll
   * @param {SnackbarService} snackbarService
   * @param {TagService} tagService
   * @param {TaskService} taskService
   * @param {DateService} dateService date service
   * @param {TaskletService} taskletService tasklet service
   * @param {MatDialog} dialog dialog
   * @param {NgZone} zone Angular zone
   */
  constructor(private entityService: EntityService,
              private filterService: FilterService,
              private matchService: MatchService,
              private mediaService: MediaService,
              private personService: PersonService,
              private projectService: ProjectService,
              private scopeService: ScopeService,
              private scroll: ScrollDispatcher,
              private snackbarService: SnackbarService,
              private tagService: TagService,
              private taskService: TaskService,
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
    this.initializeProjectSubscription();
    this.initializePersonSubscription();
    this.initializeFilterSubscription();

    this.initializeDateSubscription();
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
   * Initializes project subscription
   */
  private initializeProjectSubscription() {
    this.projects = Array.from(this.projectService.projects.values());
    this.projectService.projectsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
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
   * Initializes person subscription
   */
  private initializePersonSubscription() {
    this.persons = Array.from(this.personService.persons.values());
    this.personService.personsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
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
      // Filter projects
      this.projects = Array.from(this.projectService.projects.values()).filter(project => {
        const matchesSearchItem = this.matchService.projectMatchesEveryItem(project, this.filterService.searchItem);
        const matchesProjects = this.matchService.projectMatchesProjects(project,
          Array.from(this.filterService.projects.values()),
          this.filterService.projectsNone);

        return matchesSearchItem && matchesProjects;
      });
      // Sort filter
      this.projectsFilter = Array.from(this.filterService.projects.values()).sort((p1, p2) => {
        return p2.name < p1.name ? 1 : -1;
      });
      this.projectsNone = this.filterService.projectsNone;

      // Filter persons
      this.persons = Array.from(this.personService.persons.values()).filter(person => {
        const matchesSearchItem = this.matchService.personMatchesEveryItem(person, this.filterService.searchItem);
        const matchesPersons = this.matchService.personMatchesPersons(person,
          Array.from(this.filterService.persons.values()),
          this.filterService.personsNone);

        return matchesSearchItem && matchesPersons;
      });
      // Sort filter
      this.personsFilter = Array.from(this.filterService.persons.values()).sort((p1, p2) => {
        return p2.name < p1.name ? 1 : -1;
      });
      this.personsNone = this.filterService.personsNone;
    });
  }

  /**
   * Initializes date subscription
   */
  private initializeDateSubscription() {
    this.taskletService.dateQueueSubject.subscribe(date => {
      this.indicatedDate = date;
      this.indicatedDay = DateService.getDayOfMonthString(date);
      this.indicatedMonth = DateService.getMonthString(new Date(date).getMonth()).slice(0, 3);
    });
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
  // Actions - Projects
  //

  /**
   * Handles project upserts
   * @param {Project} project project to be upserted
   */
  onUpsertProject(project: Project) {
    // Determine mode
    const mode = (project != null) ? DialogMode.UPDATE : DialogMode.ADD;

    // Assemble data to be passed
    let data = {};
    switch (mode) {
      case DialogMode.ADD: {
        data = {
          mode: mode,
          dialogTitle: 'Add project',
          project: new Project('')
        };
        break;
      }
      case DialogMode.UPDATE: {
        data = {
          mode: mode,
          dialogTitle: 'Update project',
          project: project
        };
        break;
      }
    }

    // Open dialog
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      disableClose: false,
      data: data
    });

    // Handle dialog close
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        const resultingProject = result.value as Project;
        this.filterService.updateProjectsList([resultingProject], true);

        switch (result.action) {
          case DialogAction.ADD: {
            this.projectService.createProject(resultingProject).then(() => {
            });
            break;
          }
          case DialogAction.UPDATE: {
            this.projectService.updateProject(resultingProject, true).then(() => {
            });
            break;
          }
          case DialogAction.DELETE: {
            const references = Array.from(this.taskService.tasks.values()).some((task: Task) => {
              return task.projectId === resultingProject.id;
            });

            if (references) {
              this.dialog.open(InformationDialogComponent, <MatDialogConfig>{
                disableClose: false,
                data: {
                  title: 'Cannot delete project',
                  text: `There are still tasks associated with this project.`,
                  action: 'Okay',
                  value: resultingProject
                }
              });
            } else {
              const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, <MatDialogConfig>{
                disableClose: false,
                data: {
                  title: 'Delete project',
                  text: 'Do you want to delete this project?',
                  action: 'Delete',
                  value: resultingProject
                }
              });
              confirmationDialogRef.afterClosed().subscribe(confirmationResult => {
                if (confirmationResult != null) {
                  this.projectService.deleteProject(confirmationResult as Project).then(() => {
                  });
                  this.filterService.projects.delete((confirmationResult as Project).id);
                  dialogRef.close(null);
                }
              });
            }
            break;
          }
        }
      }
    });
  }

  /**
   * Handles filter project changes
   * @param {Project[]} projects array of projects to be used for filtering
   */
  onFilterProjects(projects: Project[]) {
    this.filterService.updateProjectsList(projects);
  }

  /**
   * Handles filter project-none changes
   * @param {boolean} projectsNone whether entities without project shall be displayed
   */
  onFilterProjectsNone(projectsNone: boolean) {
    this.filterService.updateProjectsNone(projectsNone);
  }

  //
  // Actions - Persons
  //

  /**
   * Handles person upserts
   * @param {Person} person person to be upserted
   */
  onUpsertPerson(person: Person) {
    // Determine mode
    const mode = (person != null) ? DialogMode.UPDATE : DialogMode.ADD;

    // Assemble data to be passed
    let data = {};
    switch (mode) {
      case DialogMode.ADD: {
        data = {
          mode: mode,
          dialogTitle: 'Add person',
          person: new Person('')
        };
        break;
      }
      case DialogMode.UPDATE: {
        data = {
          mode: mode,
          dialogTitle: 'Update person',
          person: person
        };
        break;
      }
    }

    // Open dialog
    const dialogRef = this.dialog.open(PersonDialogComponent, {
      disableClose: false,
      data: data
    });

    // Handle dialog close
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        const resultingPerson = result.value as Person;
        this.filterService.updatePersonsList([resultingPerson], true);

        switch (result.action) {
          case DialogAction.ADD: {
            this.personService.createPerson(resultingPerson).then(() => {
            });
            break;
          }
          case DialogAction.UPDATE: {
            this.personService.updatePerson(resultingPerson, true).then(() => {
            });
            break;
          }
          case DialogAction.DELETE: {
            const references = Array.from(this.taskletService.tasklets.values()).some((tasklet: Tasklet) => {
              return tasklet.personIds.some(tagId => {
                return tagId === resultingPerson.id;
              });
            });

            if (references) {
              this.dialog.open(InformationDialogComponent, <MatDialogConfig>{
                disableClose: false,
                data: {
                  title: 'Cannot delete person',
                  text: `There are still tasks associated with this person.`,
                  action: 'Okay',
                  value: resultingPerson
                }
              });
            } else {
              const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, <MatDialogConfig>{
                disableClose: false,
                data: {
                  title: 'Delete person',
                  text: 'Do you want to delete this person?',
                  action: 'Delete',
                  value: resultingPerson
                }
              });
              confirmationDialogRef.afterClosed().subscribe(confirmationResult => {
                if (confirmationResult != null) {
                  this.personService.deletePerson(confirmationResult as Person).then(() => {
                  });
                  this.filterService.persons.delete((confirmationResult as Person).id);
                  dialogRef.close(null);
                }
              });
            }
            break;
          }
        }
      }
    });
  }

  /**
   * Handles filter person changes
   * @param {Person[]} persons array of persons to be used for filtering
   */
  onFilterPersons(persons: Person[]) {
    this.filterService.updatePersonsList(persons);
  }

  /**
   * Handles filter person-none changes
   * @param {boolean} personsNone whether entities without person shall be displayed
   */
  onFilterPersonsNone(personsNone: boolean) {
    this.filterService.updatePersonsNone(personsNone);
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
      case 'add-tasklet': {
        const dialogRef = this.dialog.open(TaskletDialogComponent, {
          disableClose: false,
          data: {
            mode: DialogMode.ADD,
            dialogTitle: 'Add tasklet',
            tasklet: new Tasklet(),
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const tasklet = result as Tasklet;

            this.taskletService.createTasklet(tasklet).then(() => {
            });
            this.filterService.updateTagsList(tasklet.tagIds.map(id => {
              return this.tagService.getTagById(id);
            }).filter(tag => {
              return tag != null;
            }), true);
            this.filterService.updatePersonsList(tasklet.personIds.map(id => {
              return this.personService.getPersonById(id);
            }).filter(person => {
              return person != null;
            }), true);
          }
        });
        break;
      }
      case 'add-task': {
        const dialogRef = this.dialog.open(TaskDialogComponent, {
          disableClose: false,
          data: {
            mode: DialogMode.ADD,
            dialogTitle: 'Add task',
            task: new Task('')
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const task = result as Task;

            this.taskService.createTask(task).then(() => {
            });
            this.filterService.updateTagsList(task.tagIds.map(id => {
              return this.tagService.getTagById(id);
            }).filter(tag => {
              return tag != null;
            }), true);
          }
        });
        break;
      }
      case 'add-project': {
        this.onUpsertProject(null);
        break;
      }
      case 'add-tag': {
        const dialogRef = this.dialog.open(TagDialogComponent, {
          disableClose: false,
          data: {
            mode: DialogMode.ADD,
            dialogTitle: 'Add tag',
            tag: new Tag('', true)
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const tag = result as Tag;
            this.filterService.updateTagsList([tag], true);
            this.tagService.createTag(tag).then(() => {
            });
          }
        });
        break;
      }
      case 'task-list': {
        this.dialog.open(TaskListDialogComponent, {
          disableClose: false,
          data: {
            dialogTitle: 'Tasks',
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
            const project = result.value as Project;
            this.onUpsertProject(project);
          }
        });
        break;
      }
      case 'tag-list': {
        this.dialog.open(TagListDialogComponent, {
          disableClose: false,
          data: {
            dialogTitle: 'Tags',
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
   * Handles search item typed into the search box
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
}
