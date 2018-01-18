import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {SnackbarService} from '../../../services/snackbar.service';
import {MatDialog, MatIconRegistry, MatSidenav} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {Http} from '@angular/http';
import {Tasklet} from '../../../model/tasklet.model';
import {TaskletsService} from '../../../services/tasklets.service';
import {TaskletDialogComponent} from '../../dialogs/tasklet-dialog/tasklet-dialog.component';
import {TagDialogComponent} from '../../dialogs/tag-dialog/tag-dialog.component';
import {TASKLET_TYPE} from '../../../model/tasklet-type.enum';

@Component({
  selector: 'app-tasklets',
  templateUrl: './todos.component.html',
  styles: [require('./todos.component.scss')]
})
export class TodosComponent implements OnInit, OnDestroy {
  title = 'Basalt > TODO';
  tasklets: Tasklet[] = [];
  private taskletsUnsubscribeSubject = new Subject();

  @ViewChild('sidenav') sidenav: MatSidenav;

  private windowHeight = 0;
  private windowWidth = 0;

  constructor(private taskletsService: TaskletsService,
              private snackbarService: SnackbarService,
              private http: Http,
              public dialog: MatDialog,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('add', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_add_white_24px.svg'));
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.windowHeight = event.target.innerHeight;
    this.windowWidth = event.target.innerWidth;
  }

  ngOnInit() {
    this.tasklets = [];
    this.taskletsService.fetchByType(TASKLET_TYPE.TODO);

    this.taskletsService.taskletsSubject
      .takeUntil(this.taskletsUnsubscribeSubject)
      .subscribe((value) => {
        if (value != null) {
          this.tasklets = value;
        } else {
          this.tasklets = [];
        }
      });
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
        this.sidenav.toggle();
        break;
      }
      case 'settings': {
        this.snackbarService.showSnackbar('Clicked on menu item Settings', '');
        break;
      }
      case 'add': {
        let dialogRef = this.dialog.open(TaskletDialogComponent, {disableClose: false});
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
        let dialogRef = this.dialog.open(TagDialogComponent, {
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
