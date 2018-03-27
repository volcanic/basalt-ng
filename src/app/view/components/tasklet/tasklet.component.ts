import {Component, Input, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig, MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {TaskletsService} from '../../../services/tasklets.service';
import {Tasklet} from '../../../model/tasklet.model';
import {SnackbarService} from '../../../services/snackbar.service';
import {TaskletDialogComponent} from '../../dialogs/tasklet-dialog/tasklet-dialog.component';
import {ConfirmationDialogComponent} from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import {DateService} from '../../../services/date.service';
import {DIALOG_MODE} from '../../../model/dialog-mode.enum';
import {Tag} from '../../../model/tag.model';
import {TimePickerDialogComponent} from '../../dialogs/time-picker-dialog/time-picker-dialog.component';
import {UUID} from '../../../model/util/uuid';
import {TASKLET_TYPE} from '../../../model/tasklet-type.enum';
import {TaskletDailyScrum} from '../../../model/tasklet-daily-scrum.model';

@Component({
  selector: 'app-tasklet',
  templateUrl: './tasklet.component.html',
  styles: [require('./tasklet.component.scss')]
})
export class TaskletComponent implements OnInit {
  @Input() tasklet: Tasklet;
  @Input() tags: Tag[];

  time = '';
  date = '';

  constructor(private taskletsService: TaskletsService,
              private snackbarService: SnackbarService,
              private dateService: DateService,
              public dialog: MatDialog,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('more_black', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_more_vert_black_18px.svg'));
    iconRegistry.addSvgIcon('play_circle_filled',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_play_circle_outline_black_36px.svg'));
    iconRegistry.addSvgIcon('edit', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_edit_black_18px.svg'));
    iconRegistry.addSvgIcon('delete', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_delete_black_18px.svg'));
  }

  ngOnInit() {
    this.time = this.dateService.getTime(new Date(this.tasklet.creationDate));
    this.date = this.dateService.getDate(new Date(this.tasklet.creationDate));
  }

  onActionFired(action: string) {
    switch (action) {
      case 'update': {
        this.updateTasklet();
        break;
      }
      case 'updateTime': {
        this.updateTaskletTime();
        break;
      }
      case 'continue': {
        this.continueTasklet();
        break;
      }
      case 'template': {
        this.templateTasklet();
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
      data: {
        mode: DIALOG_MODE.UPDATE,
        dialogTitle: 'Update tasklet',
        tasklet: this.tasklet,
        tags: this.tags.map(tag => {
          if (this.tasklet.tags != null) {
            this.tasklet.tags.forEach(t => {
              if (tag.value === t.value) {
                return (new Tag(tag.value, true));
              }
            });

            return (new Tag(tag.value, false));
          }
        })
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.taskletsService.updateTasklet(result as Tasklet);
        this.snackbarService.showSnackbar('Continued tasklet', '');
      }
    });
  }

  private continueTasklet() {
    const continueTasklet = JSON.parse(JSON.stringify(this.tasklet));
    continueTasklet._rev = null;
    continueTasklet.id = new UUID().toString();
    continueTasklet.text = '';
    continueTasklet.creationDate = new Date();
    continueTasklet.persons = [];

    if (this.tasklet.type === TASKLET_TYPE.TODO || this.tasklet.type === TASKLET_TYPE.IDEA) {
      continueTasklet.type = TASKLET_TYPE.ACTION;
    }

    const dialogRef = this.dialog.open(TaskletDialogComponent, {
      disableClose: false,
      data: {
        mode: DIALOG_MODE.CONTINUE,
        dialogTitle: 'Continue tasklet',
        tasklet: continueTasklet,
        tags: this.tags.map(t => {
          return new Tag(t.value, false);
        }),
        previousText: this.tasklet.text
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.taskletsService.createTasklet(result as Tasklet);
        this.snackbarService.showSnackbar('Added tasklet', '');
      }
    });
  }

  private templateTasklet() {
    const template = JSON.parse(JSON.stringify(this.tasklet));
    template._rev = null;
    template.id = new UUID().toString();
    template.text = '';
    template.creationDate = new Date();
    template.participants.forEach(p => {
        p.activities = [];
      }
    );

    const dialogRef = this.dialog.open(TaskletDialogComponent, {
      disableClose: false,
      data: {
        mode: DIALOG_MODE.CONTINUE,
        dialogTitle: 'Continue tasklet',
        tasklet: template,
        tags: this.tags.map(t => {
          return new Tag(t.value, false);
        })
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.taskletsService.createTasklet(result as TaskletDailyScrum);
        this.snackbarService.showSnackbar('Added tasklet', '');
      }
    });
  }

  private updateTaskletTime() {
    const dialogRef = this.dialog.open(TimePickerDialogComponent, <MatDialogConfig>{
      disableClose: true,
      data: {
        dialogTitle: 'Set creation time',
        tasklet: this.tasklet
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.taskletsService.updateTasklet(result as Tasklet);
        this.snackbarService.showSnackbar('Updated tasklet creation time', '');
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
}
