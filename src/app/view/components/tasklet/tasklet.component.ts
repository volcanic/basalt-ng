import {Component, Input, OnInit} from '@angular/core';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {TaskletsService} from '../../../services/tasklets.service';
import {Tasklet} from '../../../model/tasklet.model';
import {SnackbarService} from '../../../services/snackbar.service';
import {TaskletDialogComponent} from '../../dialogs/tasklet-dialog/tasklet-dialog.component';
import {ConfirmationDialogComponent} from '../../dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-tasklet',
  templateUrl: './tasklet.component.html',
  styles: [require('./tasklet.component.scss')]
})
export class TaskletComponent implements OnInit {
  @Input() tasklet;

  constructor(private taskletsService: TaskletsService,
              private snackbarService: SnackbarService,
              public dialog: MatDialog,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('more_black', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_more_vert_black_18px.svg'));
    iconRegistry.addSvgIcon('edit', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_edit_black_18px.svg'));
    iconRegistry.addSvgIcon('delete', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_delete_black_18px.svg'));
  }

  ngOnInit() {
  }

  public updateTasklet() {
    let dialogRef = this.dialog.open(TaskletDialogComponent, {disableClose: true, data: {tasklet: this.tasklet}});
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.taskletsService.updateTasklet(result as Tasklet);
        this.snackbarService.showSnackbar('Updated tasklet', '');
      }
    });
  }

  public deleteTasklet() {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
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

}
