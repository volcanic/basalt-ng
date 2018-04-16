import {Component, Input, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig, MatIconRegistry} from '@angular/material';
import {Tasklet} from '../../../../model/tasklet.model';
import {TaskletTodo} from '../../../../model/tasklet-todo.model';
import {TaskletsService} from '../../../../services/tasklets.service';
import {SnackbarService} from '../../../../services/snackbar.service';
import {DateService} from '../../../../services/date.service';
import {DomSanitizer} from '@angular/platform-browser';
import {TaskletDialogComponent} from '../../../dialogs/tasklet/tasklet-dialog/tasklet-dialog.component';
import {ConfirmationDialogComponent} from '../../../dialogs/other/confirmation-dialog/confirmation-dialog.component';
import {TASKLET_PRIORITY} from '../../../../model/tasklet-priority.enum';
import {Tag} from '../../../../model/tag.model';
import {DIALOG_MODE} from '../../../../model/dialog-mode.enum';
import {Project} from '../../../../model/project.model';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  @Input() tasklet: TaskletTodo;
  tags: Tag[] = [];
  projects: Project[] = [];

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

    this.tags = Array.from(this.taskletsService.getTags().values());
    this.tags.forEach(t => {
      if (this.tasklet.tags != null) {
        t.checked = false;

        this.tasklet.tags.forEach(tt => {
          if (t.value === tt.value) {
            t.checked = true;
          }
        });
      }
    });

    this.projects = this.taskletsService.getProjects();

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
      data: {
        mode: DIALOG_MODE.UPDATE,
        dialogTitle: 'Update tasklet',
        tasklet: this.tasklet,
        tags: this.tags,
        projects: this.projects
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.taskletsService.updateTasklet(result as Tasklet);
        this.snackbarService.showSnackbar('Updated tasklet', '');
      }
    });
  }

  onToggledDone() {
    this.taskletsService.updateTasklet(this.tasklet);
  }
}
