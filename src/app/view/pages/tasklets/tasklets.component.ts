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

  // private windowHeight = 0;
  // private windowWidth = 0;

  constructor(private taskletsService: TaskletsService,
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
          this.tasklets = value.sort((t1: Tasklet, t2: Tasklet) => {
            const date1 = new Date(t1.creationDate).getTime();
            const date2 = new Date(t2.creationDate).getTime();

            return date2 - date1;
          });
        } else {
          this.tasklets = [];
        }
      });
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
        // this.sidenavStart.toggle();
        // this.sidenavEnd.toggle();
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
   * Handles click on side menu items
   * @param menuItem
   */
  onSideMenuItemClicked(menuItem: string) {
    this.snackbarService.showSnackbar(`Clicked on side menu item ${menuItem}`, '');
  }
}
