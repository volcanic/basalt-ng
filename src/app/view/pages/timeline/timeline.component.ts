import {Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {SnackbarService} from '../../../services/snackbar.service';
import {MatDialog, MatDialogConfig, MatSidenav} from '@angular/material';
import {TaskletService} from '../../../services/entities/tasklet.service';
import {TaskletDialogComponent} from '../../dialogs/tasklet/tasklet-dialog/tasklet-dialog.component';
import {TagDialogComponent} from '../../dialogs/filters/tag-filter-dialog/tag-filter-dialog.component';
import {MatchService} from '../../../services/match.service';
import {Tag} from '../../../model/tag.model';
import {DIALOG_MODE} from '../../../model/dialog-mode.enum';
import {AboutDialogComponent} from '../../dialogs/app-info/about-dialog/about-dialog.component';
import {environment} from '../../../../environments/environment';
import {ProjectsFilterDialogComponent} from '../../dialogs/filters/project-filter-dialog/project-filter-dialog.component';
import {UploadDialogComponent} from '../../dialogs/other/upload-dialog/upload-dialog.component';
import {PlaceholderValues} from '../../../model/placeholder-values.model';
import {Tasklet} from '../../../model/entities/tasklet.model';
import {Project} from '../../../model/entities/project.model';
import {EntityService} from '../../../services/entities/entity.service';
import {ProjectService} from '../../../services/entities/project.service';
import {TaskService} from '../../../services/entities/task.service';

@Component({
  selector: 'app-tasklets',
  templateUrl: './timeline.component.html',
  styles: [require('./timeline.component.scss')]
})
export class TimelineComponent implements OnInit, OnDestroy {
  title = 'Basalt';
  tasklets: Tasklet[] = [];
  private taskletsUnsubscribeSubject = new Subject();

  @ViewChild('sidenavStart') sidenavStart: MatSidenav;
  @ViewChild('sidenavEnd') sidenavEnd: MatSidenav;

  // Page specific filters
  searchItem = '';
  tags: Map<string, Tag> = new Map<string, Tag>();
  projects: Map<string, Project> = new Map<string, Project>();

  DISPLAY_LIMIT = 100;

  // private windowHeight = 0;
  // private windowWidth = 0;

  constructor(private entityService: EntityService,
              private projectService: ProjectService,
              private taskletService: TaskletService,
              private taskService: TaskService,
              private snackbarService: SnackbarService,
              private matchService: MatchService,
              public zone: NgZone,
              public dialog: MatDialog) {
  }

  /*
   @HostListener('window:resize', ['$event'])
   onResize(event) {
   this.windowHeight = event.target.innerHeight;
   this.windowWidth = event.target.innerWidth;
   }
   */

  ngOnInit() {
    // Add empty elements
    let tag = new Tag(PlaceholderValues.EMPTY_TAG, true);
    let project = new Project(PlaceholderValues.EMPTY_PROJECT, true);
    project.id = PlaceholderValues.EMPTY_PROJECT_ID;
    this.tags.set(tag.name, tag);
    this.projects.set(project.id, project);

    // Subscribe tasklet changes
    this.taskletService.taskletsSubject.pipe(
      takeUntil(this.taskletsUnsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {

        // Get initial list of tags
        if (this.tags.size < 2) {
          this.taskletService.updateTags();
          this.taskletService.tags.forEach((tag: Tag, key: string) => {
            tag.checked = true;
            this.tags.set(tag.name, tag);
          });
        }

        // Get initial list of projects
        if (this.projects.size < 2) {
          this.projectService.projects.forEach((project: Project, key: string) => {
            project.checked = true;
            this.projects.set(project.id, project);
          });
        }

        this.tasklets = value.filter(tasklet => {

          const matchesSearchItem = this.matchService.taskletMatchesEveryItem(tasklet, this.searchItem);
          const matchesTags = this.matchService.taskletMatchesTags(tasklet, Array.from(this.tags.values()));
          const matchesProjects = this.matchService.taskletMatchesProjects(tasklet, Array.from(this.projects.values()));

          return matchesSearchItem && matchesTags && matchesProjects;
        }).sort((t1: Tasklet, t2: Tasklet) => {
            const date1 = new Date(t1.creationDate).getTime();
            const date2 = new Date(t2.creationDate).getTime();

            return date2 - date1;
          }).slice(0, this.DISPLAY_LIMIT);
      }

      this.zone.run(() => this.tasklets = JSON.parse(JSON.stringify(this.tasklets)));
    });

    this.taskletService.notify();
  }

  ngOnDestroy(): void {
    this.taskletsUnsubscribeSubject.next();
    this.taskletsUnsubscribeSubject.complete();
  }

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
      case 'add': {
        const dialogRef = this.dialog.open(TaskletDialogComponent, {
          disableClose: false,
          data: {
            mode: DIALOG_MODE.ADD,
            dialogTitle: 'Add tasklet',
            tasklet: new Tasklet(),
            tags: Array.from(this.tags.values()).filter(tag => {
              return tag.name !== PlaceholderValues.EMPTY_TAG;
            }),
          }
        });
        dialogRef.afterClosed().subscribe(tasklet => {
          if (tasklet != null) {
            // Select all tags that are contained in tasklet
            (tasklet as Tasklet).tags.forEach(t => {
              this.tags.set(t.name, t);
            });

            this.taskletService.createTasklet(tasklet as Tasklet);
            this.snackbarService.showSnackbar('Added tasklet', '');
          }
        });
        break;
      }
      case 'tags': {
        const dialogRef = this.dialog.open(TagDialogComponent, {
          disableClose: true,
          data: {
            dialogTitle: 'Select tags',
            tags: Array.from(this.tags.values())
          }
        });
        dialogRef.afterClosed().subscribe(Timeline => {
          if (Timeline != null) {
            Timeline.forEach(t => {
              this.tags.set(t.name, t);
            });
            this.taskletService.notify();
            this.snackbarService.showSnackbar('Tags selected', '');
          }
        });
        break;
      }
      case 'projects': {
        const dialogRef = this.dialog.open(ProjectsFilterDialogComponent, {
          disableClose: true,
          data: {
            dialogTitle: 'Select projects',
            projects: Array.from(this.projects.values())
          }
        });
        dialogRef.afterClosed().subscribe(Timeline => {
          if (Timeline != null) {
            Timeline.forEach(p => {
              this.projects.set(p.id, p);
            });
            this.taskletService.notify();
            this.snackbarService.showSnackbar('Projects selected', '');
          }
        });
        break;
      }
      case 'todo': {
        this.sidenavStart.toggle();
        this.sidenavEnd.toggle();
        break;
      }
      case 'upload': {
        const dialogRef = this.dialog.open(UploadDialogComponent, <MatDialogConfig>{
          disableClose: true,
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
        const dialogRef = this.dialog.open(AboutDialogComponent, <MatDialogConfig>{
          disableClose: true,
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
   * Reacts on search item typed into the search box
   * @param searchItem
   */
  onSearchItemChanged(searchItem: string) {
    this.searchItem = searchItem;
    console.log(`DEBUG searchItem ${searchItem}`);
    this.taskletService.notify();
  }

  /**
   * Handles click on side menu items
   * @param menuItem
   */
  onSideMenuItemClicked(menuItem: string) {
    this.snackbarService.showSnackbar(`Clicked on side menu item ${menuItem}`, '');
  }

  /**
   * Returns an array of unique tags
   * @returns {Tag[]}
   */
  getAllTags(tasklets: Tasklet[]): Tag[] {
    const ts = [];

    tasklets.forEach(tasklet => {
      if (tasklet.tags != null) {
        tasklet.tags.forEach(tag => {
            let unique = true;
            ts.forEach(t => {
              if (tag.name === t.name) {
                unique = false;
              }
            });

            if (unique) {
              ts.push(tag);
            }
          }
        );
      }
    });

    return ts.sort((t1, t2) => {
      return (t1.name > t2.name) ? 1 : -1;
    });
  }
}
