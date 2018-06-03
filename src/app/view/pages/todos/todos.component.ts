import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/debounceTime';
import {SnackbarService} from '../../../services/snackbar.service';
import {MatDialog, MatDialogConfig, MatIconRegistry, MatSidenav} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {Tasklet} from '../../../model/tasklet.model';
import {TaskletsService} from '../../../services/tasklets.service';
import {TaskletDialogComponent} from '../../dialogs/tasklet/tasklet-dialog/tasklet-dialog.component';
import {TagDialogComponent} from '../../dialogs/filters/tag-dialog/tag-dialog.component';
import {TASKLET_TYPE} from '../../../model/tasklet-type.enum';
import {TaskletTodo} from '../../../model/tasklet-todo.model';
import {DateService} from '../../../services/date.service';
import {TASKLET_PRIORITY} from '../../../model/tasklet-priority.enum';
import {MatchService} from '../../../services/match.service';
import {Tag} from '../../../model/tag.model';
import {DIALOG_MODE} from '../../../model/dialog-mode.enum';
import {AboutDialogComponent} from '../../dialogs/app-info/about-dialog/about-dialog.component';
import {environment} from '../../../../environments/environment';
import {takeUntil} from 'rxjs/internal/operators';

@Component({
  selector: 'app-tasklets',
  templateUrl: './todos.component.html',
  styles: [require('./todos.component.scss')]
})
export class TodosComponent implements OnInit, OnDestroy {
  title = 'Basalt > TODO';
  tasklets: TaskletTodo[] = [];
  taskletsOverdue: TaskletTodo[] = [];
  taskletsToday: TaskletTodo[] = [];
  taskletsThisWeek: TaskletTodo[] = [];
  taskletsNextWeek: TaskletTodo[] = [];
  taskletsLater: TaskletTodo[] = [];

  private taskletsUnsubscribeSubject = new Subject();

  @ViewChild('sidenavStart') sidenavStart: MatSidenav;
  @ViewChild('sidenavEnd') sidenavEnd: MatSidenav;

  priorities = [];

  // Page specific filters
  taskletType = TASKLET_TYPE.TODO;
  searchItem = '';
  tags = new Map<string, Tag>();
  projects = [];
  priority = '';

  // private windowHeight = 0;
  // private windowWidth = 0;

  constructor(private taskletsService: TaskletsService,
              private dateService: DateService,
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
    this.taskletsService.taskletsSubject.pipe(
      takeUntil(this.taskletsUnsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        // Get initial list of tags
        if (this.tags.size === 0) {
          this.tags = this.taskletsService.getTags();
          this.tags.forEach((tag: Tag, key: string) => {
            tag.checked = true;
          });
        }

        // Get initial list of projects
        if (this.projects.length === 0) {
          this.projects = Array.from(this.taskletsService.getProjects().values()).map(p => {
            p.checked = true;
            return p;
          });
        }

        this.tasklets = (value as TaskletTodo[]).filter(tasklet => {
          return tasklet.type === this.taskletType;
        }).filter(t => {
          if (this.searchItem !== '') {
            return this.matchService.taskletMatchesEveryItem(t, this.searchItem);
          } else {
            return true;
          }
        }).filter(tasklet => {
          // Filter tasklets that match selected tags
          if (tasklet.tags != null) {
            let match = false;

            if (tasklet.tags.length === 0) {
              return true;
            } else {
              tasklet.tags.forEach(taskletTag => {
                this.tags.forEach(tag => {
                  if (taskletTag.value === tag.value && tag.checked) {
                    match = true;
                  }
                });
              });

              return match;
            }
          } else {
            return true;
          }
        }).filter(tasklet => {
          return this.priority === '' || (tasklet as TaskletTodo).priority === this.priority;
        }).filter(tasklet => {
          return !(tasklet as TaskletTodo).done;
        }).sort((t1: TaskletTodo, t2: TaskletTodo) => {
          const date1 = new Date(t1.dueDate).getTime();
          const date2 = new Date(t2.dueDate).getTime();

          return date2 - date1;
        });
      } else {
        this.tasklets = [];
      }

      const now = new Date();

      this.taskletsOverdue = this.tasklets.filter(tasklet => {
        return this.dateService.isBefore(tasklet.dueDate, now);
      });
      this.taskletsToday = this.tasklets.filter(tasklet => {
        return this.dateService.isToday(tasklet.dueDate, now);
      });
      this.taskletsThisWeek = this.tasklets.filter(tasklet => {
        return this.dateService.isThisWeek(tasklet.dueDate, now) && this.dateService.isAfter(tasklet.dueDate, now);
      });
      this.taskletsNextWeek = this.tasklets.filter(tasklet => {
        return this.dateService.isNextWeek(tasklet.dueDate, now);
      });
      this.taskletsLater = this.tasklets.filter(tasklet => {
        return this.dateService.isAfterNextWeek(tasklet.dueDate, now);
      });
    });

    this.priorities = Array.from(Object.keys(TASKLET_PRIORITY).map(key => {
      return TASKLET_PRIORITY[key];
    }).filter(value => {
      return value !== '?';
    }));

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
        this.sidenavStart.toggle();
        this.sidenavEnd.toggle();
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
            tags: this.tags,
            projects: this.projects
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            this.taskletsService.createTasklet(result as Tasklet);
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
            tags: this.tags
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            this.tags = result;
            this.taskletsService.update();
            this.snackbarService.showSnackbar('Tags selected', '');
          }
        });
        break;
      }
      case 'about': {
        /* const dialogRef = */
        this.dialog.open(AboutDialogComponent, <MatDialogConfig>{
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
   * Handles search item change
   * @param searchItem
   */
  onSearchItemChanged(searchItem: string) {
    this.searchItem = searchItem;
    this.taskletsService.update();
  }

  /**
   * Handles tag selection
   */
  onTagChanged(value: string) {
    this.taskletsService.update();
  }

  /**
   * Handles priority selection
   * @param value
   */
  onPrioritySelected(value: string) {
    this.priority = value;
    this.taskletsService.update();
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
