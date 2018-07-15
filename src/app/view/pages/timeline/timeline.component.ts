import {Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {SnackbarService} from '../../../services/snackbar.service';
import {MatDialog, MatDialogConfig, MatSidenav} from '@angular/material';
import {TaskletService} from '../../../services/entities/tasklet.service';
import {TaskletDialogComponent} from '../../dialogs/entities/tasklet-dialog/tasklet-dialog.component';
import {TagFilterDialogComponent} from '../../dialogs/filters/tag-filter-dialog/tag-filter-dialog.component';
import {MatchService} from '../../../services/match.service';
import {DIALOG_MODE} from '../../../model/dialog-mode.enum';
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
import {FilterService} from '../../../services/filter.service';
import {Tag} from '../../../model/tag.model';

@Component({
  selector: 'app-tasklets',
  templateUrl: './timeline.component.html',
  styles: [require('./timeline.component.scss')]
})
export class TimelineComponent implements OnInit, OnDestroy {
  title = 'Basalt';
  tasklets: Tasklet[] = [];

  private taskletsUnsubscribeSubject = new Subject();
  private projectsUnsubscribeSubject = new Subject();

  @ViewChild('sidenavStart') sidenavStart: MatSidenav;
  @ViewChild('sidenavEnd') sidenavEnd: MatSidenav;

  DISPLAY_LIMIT = 100;

  constructor(private entityService: EntityService,
              private projectService: ProjectService,
              private taskService: TaskService,
              private taskletService: TaskletService,
              private filterService: FilterService,
              private snackbarService: SnackbarService,
              private matchService: MatchService,
              public zone: NgZone,
              public dialog: MatDialog) {
  }

  ngOnInit() {

    this.initializeTaskletSubscription();
    this.initializeProjectSubscription();
  }

  ngOnDestroy(): void {
    this.taskletsUnsubscribeSubject.next();
    this.taskletsUnsubscribeSubject.complete();
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
        this.snackbarService.showSnackbar('Clicked on menu item Setting', '');
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
            this.filterService.updateTags(tasklet.tags, true);
            this.snackbarService.showSnackbar('Added tasklet', '');
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
            this.filterService.updateTags(task.tags, true);
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
            this.projectService.createProject(project);
          }
        });
        break;
      }
      case 'tags': {
        const dialogRef = this.dialog.open(TagFilterDialogComponent, {
          disableClose: false,
          data: {
            dialogTitle: 'Select tags',
            tags: Array.from(this.filterService.tags.values())
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const tags = result as Tag[];

            this.filterService.updateTags(tags, false);
            this.taskletService.notify();
            this.taskService.notify();
            this.projectService.notify();
            this.snackbarService.showSnackbar('Tags selected', '');
          }
        });
        break;
      }
      case 'projects': {
        const dialogRef = this.dialog.open(ProjectsFilterDialogComponent, {
          disableClose: false,
          data: {
            dialogTitle: 'Select projects',
            projects: Array.from(this.filterService.projects.values())
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const projects = result as Project[];

            this.filterService.updateProjects(projects, false);

            this.taskletService.notify();
            this.taskService.notify();
            this.projectService.notify();
            this.snackbarService.showSnackbar('Projects selected', '');
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
    this.filterService.searchItem = searchItem;
    this.taskletService.notify();
    this.taskService.notify();
    this.projectService.notify();
  }

  /**
   * Handles click on side menu items
   * @param menuItem
   */
  onSideMenuItemClicked(menuItem: string) {
    this.snackbarService.showSnackbar(`Clicked on side menu item ${menuItem}`, '');
  }

  //
  // Initialization
  //

  /**
   * Subscribes tasklet changes
   */
  private initializeTaskletSubscription() {

    this.taskletService.taskletsSubject.pipe(
      takeUntil(this.taskletsUnsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        const tasklets: Tasklet[] = (value as Tasklet[]);

        this.tasklets = tasklets.filter(tasklet => {
          const matchesSearchItem = this.matchService.taskletMatchesEveryItem(tasklet, this.filterService.searchItem);
          const matchesTags = this.matchService.taskletMatchesTags(tasklet, Array.from(this.filterService.tags.values()));
          const matchesProjects = this.matchService.taskletMatchesProjects(tasklet, Array.from(this.filterService.projects.values()));

          return matchesSearchItem && matchesTags && matchesProjects;
        }).sort((t1: Tasklet, t2: Tasklet) => {

          return new Date(t2.creationDate).getTime() - new Date(t1.creationDate).getTime();
        }).slice(0, this.DISPLAY_LIMIT);
      }

      this.zone.run(() => this.tasklets = JSON.parse(JSON.stringify(this.tasklets)));
    });
  }

  /**
   * Subscribes project changes
   */
  private initializeProjectSubscription() {

    this.projectService.projectsSubject.pipe(
      takeUntil(this.projectsUnsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {

        (value as Project[]).forEach(project => {
          if (!this.filterService.projects.has(project.id)) {
            this.filterService.projects.set(project.id, project);
          }
        });
      }
    });
  }
}
