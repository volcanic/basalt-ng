import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {SnackbarService} from '../../../services/snackbar.service';
import {MatDialog, MatDialogConfig, MatSidenav} from '@angular/material';
import {TaskletService} from '../../../services/entities/tasklet.service';
import {TaskletDialogComponent} from '../../dialogs/entities/tasklet-dialog/tasklet-dialog.component';
import {TagFilterDialogComponent} from '../../dialogs/filters/tag-filter-dialog/tag-filter-dialog.component';
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
import {MediaService} from '../../../services/media.service';
import {MEDIA} from '../../../model/media.enum';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs/Rx';
import {TaskListDialogComponent} from '../../dialogs/lists/task-list-dialog/task-list-dialog.component';
import {ProjectListDialogComponent} from '../../dialogs/lists/project-list-dialog/project-list-dialog.component';

@Component({
  selector: 'app-tasklets',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  title = 'Basalt';

  public mediaType = MEDIA;
  public media: MEDIA = MEDIA.UNDEFINED;

  private unsubscribeSubject = new Subject();

  @ViewChild('sidenavStart') sidenavStart: MatSidenav;
  @ViewChild('sidenavEnd') sidenavEnd: MatSidenav;

  constructor(private entityService: EntityService,
              private projectService: ProjectService,
              private taskService: TaskService,
              private taskletService: TaskletService,
              private filterService: FilterService,
              private snackbarService: SnackbarService,
              private mediaService: MediaService,
              public zone: NgZone,
              public dialog: MatDialog) {
  }

  ngOnInit() {

    this.initializeMediaSubscription();
  }

  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

  //
  // Initialization
  //

  private initializeMediaSubscription() {
    this.media = this.mediaService.media;
    this.mediaService.mediaSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      this.media = value as MEDIA;
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
            this.filterService.updateTagsList(tasklet.tags, true);
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
            this.filterService.updateTagsList(task.tags, true);
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
        this.snackbarService.showSnackbar('Filters cleared', '');
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
            this.snackbarService.showSnackbar('Tags selected', '');
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
      case 'android': {
        const filename = 'basalt.apk';
        const element = document.createElement('a');
        element.setAttribute('href', 'assets/android-release-unsigned.apk');
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
}
