import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {SnackbarService} from '../../../services/snackbar.service';
import {MatDialog, MatDialogConfig, MatIconRegistry, MatSidenav} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {Tasklet} from '../../../model/tasklet.model';
import {TaskletsService} from '../../../services/tasklets.service';
import {TaskletDialogComponent} from '../../dialogs/tasklet/tasklet-dialog/tasklet-dialog.component';
import {TagDialogComponent} from '../../dialogs/filters/tag-filter-dialog/tag-filter-dialog.component';
import {MatchService} from '../../../services/match.service';
import {Tag} from '../../../model/tag.model';
import {DIALOG_MODE} from '../../../model/dialog-mode.enum';
import {AboutDialogComponent} from '../../dialogs/app-info/about-dialog/about-dialog.component';
import {environment} from '../../../../environments/environment';
import {ProjectsFilterDialogComponent} from '../../dialogs/filters/project-filter-dialog/project-filter-dialog.component';
import {UploadDialogComponent} from '../../dialogs/other/upload-dialog/upload-dialog.component';
import {Project} from '../../../model/project.model';
import {PlaceholderValues} from '../../../model/placeholder-values.model';

@Component({
  selector: 'app-tasklets',
  templateUrl: './tasklets.component.html',
  styles: [require('./tasklets.component.scss')]
})
export class TaskletsComponent implements OnInit, OnDestroy {
  title = 'Basalt';
  tasklets: Tasklet[] = [];
  private taskletsUnsubscribeSubject = new Subject();

  @ViewChild('sidenavStart') sidenavStart: MatSidenav;
  @ViewChild('sidenavEnd') sidenavEnd: MatSidenav;

  // Page specific filters
  searchItem = '';
  tags = new Map<string, Tag>();
  projects = [];

  DISPLAY_LIMIT = 100;

  // private windowHeight = 0;
  // private windowWidth = 0;

  constructor(private taskletsService: TaskletsService,
              private snackbarService: SnackbarService,
              private matchService: MatchService,
              public dialog: MatDialog,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('add', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_add_white_24px.svg'));
  }

  /*
   @HostListener('window:resize', ['$event'])
   onResize(event) {
   this.windowHeight = event.target.innerHeight;
   this.windowWidth = event.target.innerWidth;
   }
   */

  ngOnInit() {
    // Subscribe tasklet changes
    this.taskletsService.taskletsSubject.pipe(
      takeUntil(this.taskletsUnsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {

        // Get initial list of tags
        if (this.tags.size < 2) {
          this.tags = this.taskletsService.getTags();
          this.tags.forEach((tag: Tag, key: string) => {
            tag.checked = true;
          });
          this.tags.set(PlaceholderValues.EMPTY_TAG, new Tag(PlaceholderValues.EMPTY_TAG, true));
        }

        // Get initial list of projects
        if (this.projects.length < 2) {
          this.projects = Array.from(this.taskletsService.getProjects().values()).map(p => {
            p.checked = true;
            return p;
          });
          this.projects.push(new Project(PlaceholderValues.EMPTY_PROJECT, true));
        }

        this.tasklets = value
          .filter(t => {
            if (this.searchItem !== '') {
              return this.matchService.taskletMatchesEveryItem(t, this.searchItem);
            } else {
              return true;
            }
          })
          .filter(tasklet => {
            let match = false;

            // Filter tasklets that match selected tags
            this.tags.forEach(tag => {
                if (tag.checked) {
                  if (tag.value === PlaceholderValues.EMPTY_PROJECT
                    && (tasklet.tags == null || tasklet.tags.length === 0)) {
                    match = true;
                  } else if (tasklet.tags != null && tasklet.tags.length > 0) {
                    tasklet.tags.forEach(taskletTag => {
                      if (taskletTag.value === tag.value && tag.checked) {
                        match = true;
                      }
                    });
                  }
                }
              }
            );

            return match;
          })
          .filter(tasklet => {
            let match = false;

            // Filter tasklets that match selected projects
            this.projects.forEach(project => {
              if (project.checked) {
                if ((tasklet.project != null && project.value === tasklet.project.value) ||
                  (tasklet.project == null && project.value === PlaceholderValues.EMPTY_PROJECT)) {
                  match = true;
                }
              }
            });

            return match;
          })
          .sort((t1: Tasklet, t2: Tasklet) => {
            const date1 = new Date(t1.creationDate).getTime();
            const date2 = new Date(t2.creationDate).getTime();

            return date2 - date1;
          }).slice(0, this.DISPLAY_LIMIT);
      } else {
        this
          .tasklets = [];
      }
    })
    ;

    this.taskletsService.update();
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
        // this.sidenavStart.toggle();
        // this.sidenavEnd.toggle();
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
            tags: Array.from(this.tags.values()),
            projects: this.projects
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            this.taskletsService.createTasklet(result as Tasklet);
            this.snackbarService.showSnackbar('Added tasklet', '');

            // Select all tags that are contained in tasklet
            (result as Tasklet).tags.forEach(t => {
              this.tags.set(t.value, t);
            });
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
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            result.forEach(t => {
              this.tags.set(t.value, t);
            });
            this.taskletsService.update();
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
            projects: this.projects
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            this.projects = result;
            this.taskletsService.update();
            this.snackbarService.showSnackbar('Projects selected', '');
          }
        });
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
        this.taskletsService.downloadTasklets();
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
    this.taskletsService.update();
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
              if (tag.value === t.value) {
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
      return (t1.value > t2.value) ? 1 : -1;
    });
  }
}
