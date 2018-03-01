import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/debounceTime';
import {SnackbarService} from '../../../services/snackbar.service';
import {MatDialog, MatDialogConfig, MatIconRegistry, MatSidenav} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {Tasklet} from '../../../model/tasklet.model';
import {TaskletsService} from '../../../services/tasklets.service';
import {TaskletDialogComponent} from '../../dialogs/tasklet-dialog/tasklet-dialog.component';
import {TagDialogComponent} from '../../dialogs/tag-dialog/tag-dialog.component';
import {MatchService} from '../../../services/match.service';
import {Tag} from '../../../model/tag.model';
import {DIALOG_MODE} from '../../../model/dialog-mode.enum';
import {AboutDialogComponent} from '../../dialogs/about-dialog/about-dialog.component';
import {environment} from '../../../../environments/environment';

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
  tags = [];

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
    this.taskletsService.taskletsSubject
      .takeUntil(this.taskletsUnsubscribeSubject)
      .subscribe((value) => {
        if (value != null) {
          if (this.tags.length === 0) {
            this.tags = this.getAllTags(value as Tasklet[]);
          }

          this.tasklets = value.filter(t => {
            if (this.searchItem !== '') {
              return this.matchService.taskletMatchesEveryItem(t, this.searchItem);
            } else {
              return true;
            }
          }).filter(tasklet => {
            // Filter tasklets that match selected tags
            if (tasklet.tags != null) {
              let match = false;

              if (this.tasklets.length === 0 || tasklet.tags.length === 0) {
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
          }).sort((t1: Tasklet, t2: Tasklet) => {
            const date1 = new Date(t1.creationDate).getTime();
            const date2 = new Date(t2.creationDate).getTime();

            return date2 - date1;
          });
        } else {
          this.tasklets = [];
        }
      });

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
        this.snackbarService.showSnackbar('Clicked on menu item Settings', '');
        break;
      }
      case 'add': {
        const dialogRef = this.dialog.open(TaskletDialogComponent, {
          disableClose: false,
          data: {
            mode: DIALOG_MODE.ADD,
            dialogTitle: 'Add tasklet',
            tasklet: new Tasklet(),
            tags: this.tags.map(t => {
              return new Tag(t.value, false);
            })
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
