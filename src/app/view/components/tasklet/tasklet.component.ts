import {Component, Input, OnInit} from '@angular/core';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {TaskletsService} from '../../../services/tasklets.service';
import {Tasklet} from '../../../model/tasklet.model';
import {SnackbarService} from '../../../services/snackbar.service';
import {TaskletDialogComponent} from '../../dialogs/tasklet-dialog/tasklet-dialog.component';
import {ConfirmationDialogComponent} from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import {TASKLET_TYPE} from '../../../model/tasklet-type.enum';

@Component({
  selector: 'app-tasklet',
  templateUrl: './tasklet.component.html',
  styles: [require('./tasklet.component.scss')]
})
export class TaskletComponent implements OnInit {
  @Input() tasklet: Tasklet;
  time = '';

  taskletTypes = TASKLET_TYPE;

  constructor(private taskletsService: TaskletsService,
              private snackbarService: SnackbarService,
              public dialog: MatDialog,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('more_black', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_more_vert_black_18px.svg'));
    iconRegistry.addSvgIcon('edit', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_edit_black_18px.svg'));
    iconRegistry.addSvgIcon('delete', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_delete_black_18px.svg'));

    iconRegistry.addSvgIcon('assistant', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_assistant_photo_black_24px.svg'));
    iconRegistry.addSvgIcon('people', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_people_black_24px.svg'));
    iconRegistry.addSvgIcon('call', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_call_black_24px.svg'));
    iconRegistry.addSvgIcon('mail', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_mail_outline_black_24px.svg'));
    iconRegistry.addSvgIcon('chat', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_chat_bubble_outline_black_24px.svg'));
    iconRegistry.addSvgIcon('code', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_code_black_24px.svg'));
    iconRegistry.addSvgIcon('bug', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_bug_report_black_24px.svg'));
    iconRegistry.addSvgIcon('timer', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_timer_black_24px.svg'));
    iconRegistry.addSvgIcon('run', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_directions_run_black_24px.svg'));
  }

  ngOnInit() {
    this.time = this.getTime();
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

  getTime(): string {
    console.log(`DEBUG creationDate ${this.tasklet.creationDate}`);

    if (this.tasklet.creationDate != null) {
      let MINUTES_INTERVAL = 5;

      let hours = new Date(this.tasklet.creationDate).getHours();
      let minutes = Math.ceil(new Date(this.tasklet.creationDate).getMinutes() / MINUTES_INTERVAL) * MINUTES_INTERVAL;

      let hoursString = hours.toString();
      let minutesString = minutes.toString();

      if (hours < 10) {
        hoursString = `0${hours}`;
      }

      if (minutes < 10) {
        minutesString = `0${minutes}`;
      }

      return `${hoursString}:${minutesString}`;
    } else {
      return '';
    }
  }
}
