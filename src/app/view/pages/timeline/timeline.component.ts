import {AfterViewInit, Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SnackbarService} from '../../../services/ui/snackbar.service';
import {MatDialog, MatDialogConfig, MatSidenav} from '@angular/material';
import {TaskletService} from '../../../services/entities/tasklet.service';
import {TaskletDialogComponent} from '../../dialogs/entities/tasklet-dialog/tasklet-dialog.component';
import {TagFilterDialogComponent} from '../../dialogs/filters/tag-filter-dialog/tag-filter-dialog.component';
import {DIALOG_MODE} from '../../../model/ui/dialog-mode.enum';
import {AboutDialogComponent} from '../../dialogs/app-info/about-dialog/about-dialog.component';
import {environment} from '../../../../environments/environment';
import {ProjectsFilterDialogComponent} from '../../dialogs/filters/project-filter-dialog/project-filter-dialog.component';
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
import {MEDIA} from '../../../model/ui/media.enum';
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

@Component({
  selector: 'app-tasklets',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  animations: [
    Animations.toolbarAnimation,
    Animations.fabAnimation,
    Animations.dateIndicatorAnimation,
  ]
})
export class TimelineComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'Basalt';

  public indicatedDate;
  public indicatedDay;
  public indicatedMonth;

  public mediaType = MEDIA;
  public media: MEDIA = MEDIA.UNDEFINED;

  private unsubscribeSubject = new Subject();

  private scrollPosLast = 0;
  public scrollDirection: ScrollDirection = ScrollDirection.UP;
  public scrollState: ScrollState = ScrollState.NON_SCROLLING;

  @ViewChild('sidenavStart') sidenavStart: MatSidenav;
  @ViewChild('sidenavEnd') sidenavEnd: MatSidenav;
  @ViewChild(CdkScrollable) scrollable: CdkScrollable;

  constructor(private entityService: EntityService,
              private projectService: ProjectService,
              private taskService: TaskService,
              public taskletService: TaskletService,
              private tagService: TagService,
              private filterService: FilterService,
              private snackbarService: SnackbarService,
              private mediaService: MediaService,
              private scopeService: ScopeService,
              public dateService: DateService,
              public zone: NgZone,
              public dialog: MatDialog,
              private scroll: ScrollDispatcher) {
  }

  ngOnInit() {
    this.initializeDateSubscription();
    this.initializeMediaSubscription();
    this.initializeScopeSubscription();
  }

  ngAfterViewInit() {

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

  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

  //
  // Initialization
  //

  private initializeDateSubscription() {
    this.taskletService.dateQueueSubject.subscribe(date => {
      this.indicatedDate = date;
      this.indicatedDay = this.dateService.getDay(date);
      this.indicatedMonth = this.dateService.getMonthString(new Date(date).getMonth()).slice(0, 3);
    });
  }

  private initializeMediaSubscription() {
    this.media = this.mediaService.media;
    this.mediaService.mediaSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      this.media = value as MEDIA;
    });
  }

  private initializeScopeSubscription() {
    this.scopeService.scopeSubject.subscribe(scope => {

      this.filterService.clearSearchItem();
      this.filterService.clearTags();
      this.filterService.clearProjects();

      this.taskletService.findTaskletsByScope(scope);
      this.taskService.findOpenTasksByScope(scope);
      this.projectService.findProjectsByScope(scope);
    });
  }

  //
  // Handlers
  //

  /**
   * Handles click on menu items
   * @param menuItem
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
            mode: DIALOG_MODE.ADD,
            dialogTitle: 'Add tasklet',
            tasklet: new Tasklet(),
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const tasklet = result as Tasklet;

            this.taskletService.createTasklet(tasklet);
            this.filterService.updateTagsList(tasklet.tagIds.map(id => {
              return this.tagService.getTagById(id);
            }).filter(tag => {
              return tag != null;
            }), true);
          }
        });
        break;
      }
      case 'add-task': {
        const dialogRef = this.dialog.open(TaskDialogComponent, {
          disableClose: false,
          data: {
            mode: DIALOG_MODE.ADD,
            dialogTitle: 'Add task',
            task: new Task('')
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const task = result as Task;

            this.taskService.createTask(task);
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
        const dialogRef = this.dialog.open(ProjectDialogComponent, {
          disableClose: false,
          data: {
            mode: DIALOG_MODE.ADD,
            dialogTitle: 'Add project',
            project: new Project('', true)
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const project = result as Project;
            this.filterService.updateProjectsList([project], true);
            this.projectService.createProject(project);
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
        this.dialog.open(ProjectListDialogComponent, {
          disableClose: false,
          data: {
            dialogTitle: 'Projects',
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
        const dialogRef = this.dialog.open(ProjectsFilterDialogComponent, {
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

            this.filterService.updateProjectsList(projects, false);
            this.filterService.updateProjectsNone(projectsNone);
            this.snackbarService.showSnackbar('Projects selected');
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
   * @param searchItem
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
