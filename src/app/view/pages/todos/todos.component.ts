import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/debounceTime';
import {SnackbarService} from '../../../services/snackbar.service';
import {MatDialog, MatIconRegistry, MatSidenav} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {Tasklet} from '../../../model/tasklet.model';
import {TaskletsService} from '../../../services/tasklets.service';
import {TaskletDialogComponent} from '../../dialogs/tasklet-dialog/tasklet-dialog.component';
import {TagDialogComponent} from '../../dialogs/tag-dialog/tag-dialog.component';
import {TASKLET_TYPE} from '../../../model/tasklet-type.enum';
import {TaskletTodo} from '../../../model/tasklet-todo.model';
import {DateService} from '../../../services/date.service';
import {TASKLET_PRIORITY} from '../../../model/tasklet-priority.enum';

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

  // Page specific filters
  taskletType = TASKLET_TYPE.TODO;
  tags = [];
  priorities = [];
  priority = '';

  // private windowHeight = 0;
  // private windowWidth = 0;

  constructor(private taskletsService: TaskletsService,
              private dateService: DateService,
              private snackbarService: SnackbarService,
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
    this.taskletsService.taskletsSubject
      .takeUntil(this.taskletsUnsubscribeSubject)
      .subscribe((value) => {
        if (value != null) {
          this.tasklets = (value as TaskletTodo[]).filter(tasklet => {
            return tasklet.type === this.taskletType;
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

        this.tags = this.taskletsService.getAllTags();
      });

    this.priorities = Array.from(Object.keys(TASKLET_PRIORITY).map(key => {
      return TASKLET_PRIORITY[key];
    }).filter(value => {
      return value !== '?';
    }));

    this.taskletsService.taskletsSubject.next(this.taskletsService.filteredTasklets);
  }

  ngOnDestroy(): void {
    this.taskletsUnsubscribeSubject.next();
    this.taskletsUnsubscribeSubject.complete();
  }

  /**
   * Reacts on search item typed into the search box
   * @param searchItem
   */
  onSearchItemChanged(searchItem: string) {
    this.taskletsService.setSearchItem(searchItem.trim());
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
        this.snackbarService.showSnackbar('Clicked on menu item Settings', '');
        break;
      }
      case 'add': {
        const dialogRef = this.dialog.open(TaskletDialogComponent, {disableClose: false});
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            console.log(`DEBUG ${JSON.stringify(result as Tasklet)}`);
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
            tags: this.taskletsService.getAllTags()
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            this.taskletsService.update();
            this.snackbarService.showSnackbar('Tags selected', '');
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
   * Handles tag selection
   */
  onTagChanged(value: string) {
    this.taskletsService.update();
  }

  onPrioritySelected(value: string) {
    this.priority = value;
    this.taskletsService.update();
  }
}
