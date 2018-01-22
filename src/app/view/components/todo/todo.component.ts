import {Component, Input, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig, MatIconRegistry} from '@angular/material';
import {Tasklet} from '../../../model/tasklet.model';
import {TaskletTodo} from '../../../model/tasklet-todo.model';
import {TaskletsService} from '../../../services/tasklets.service';
import {SnackbarService} from '../../../services/snackbar.service';
import {DateService} from '../../../services/date.service';
import {DomSanitizer} from '@angular/platform-browser';
import {TaskletDialogComponent} from '../../dialogs/tasklet-dialog/tasklet-dialog.component';
import {ConfirmationDialogComponent} from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import {TASKLET_PRIORITY} from '../../../model/tasklet-priority.enum';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  @Input() tasklet: TaskletTodo;

  time = '';
  date = '';
  dueDate = '';

  iconPriority = '';
  iconPriorityCount = [];

  constructor(private taskletsService: TaskletsService,
              private snackbarService: SnackbarService,
              private dateService: DateService,
              public dialog: MatDialog,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('more_black', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_more_vert_black_18px.svg'));
    iconRegistry.addSvgIcon('edit', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_edit_black_18px.svg'));
    iconRegistry.addSvgIcon('delete', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_delete_black_18px.svg'));
    iconRegistry.addSvgIcon('prio1', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_assistant_photo_prio1_24px.svg'));
    iconRegistry.addSvgIcon('prio2', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_assistant_photo_prio2_24px.svg'));
    iconRegistry.addSvgIcon('prio3', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_assistant_photo_prio3_24px.svg'));
    iconRegistry.addSvgIcon('prio4', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_assistant_photo_prio4_24px.svg'));
  }

  ngOnInit() {
    this.time = this.dateService.getTime(new Date(this.tasklet.creationDate));
    this.date = this.dateService.getDate(new Date(this.tasklet.creationDate));
    this.dueDate = this.dateService.getDate(new Date(this.tasklet.dueDate));

    if (this.tasklet.priority != null) {
      switch (this.tasklet.priority) {
        case TASKLET_PRIORITY.ONE: {
          this.iconPriority = 'prio1';
          this.iconPriorityCount = [''];
          break;
        }
        case TASKLET_PRIORITY.TWO: {
          this.iconPriority = 'prio2';
          this.iconPriorityCount = ['', ''];
          break;
        }
        case TASKLET_PRIORITY.THREE: {
          this.iconPriority = 'prio3';
          this.iconPriorityCount = ['', '', ''];
          break;
        }
        case TASKLET_PRIORITY.FOUR: {
          this.iconPriority = 'prio4';
          this.iconPriorityCount = ['', '', '', ''];
          break;
        }
      }
    }
  }

  onActionFired(action: string) {
    switch (action) {
      case 'update': {
        this.updateTasklet();
        break;
      }
      case 'save': {
        this.taskletsService.updateTasklet(this.tasklet);
        break;
      }
    }
  }

  private updateTasklet() {
    const dialogRef = this.dialog.open(TaskletDialogComponent, <MatDialogConfig>{
      disableClose: true,
      data: {tasklet: this.tasklet}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.taskletsService.updateTasklet(result as Tasklet);
        this.snackbarService.showSnackbar('Updated tasklet', '');
      }
    });
  }

  public deleteTasklet() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, <MatDialogConfig>{
      disableClose: true,
      data: {
        title: 'Delete tasklet',
        text: 'Do you want to delete this tasklet?',
        action: 'Delete',
        value: this.tasklet
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.taskletsService.deleteTasklet(result as Tasklet);
        this.snackbarService.showSnackbar('Deleted tasklet', '');
      }
    });
  }

  onToggledDone() {
    this.taskletsService.updateTasklet(this.tasklet);
  }
}
