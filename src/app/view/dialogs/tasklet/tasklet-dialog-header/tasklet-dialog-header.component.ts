import {Component, Input, OnInit} from '@angular/core';
import {TASKLET_TYPE} from '../../../../model/tasklet-type.enum';
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {Project} from '../../../../model/entities/project.model';
import {Tasklet} from '../../../../model/entities/tasklet.model';
import {EntityService} from '../../../../services/entities/entity.service';

@Component({
  selector: 'app-tasklet-dialog-header',
  templateUrl: './tasklet-dialog-header.component.html',
  styleUrls: ['./tasklet-dialog-header.component.scss']
})
export class TaskletDialogHeaderComponent implements OnInit {
  @Input() tasklet: Tasklet;

  project: Project;

  taskletTypes = Object.keys(TASKLET_TYPE).map(key => TASKLET_TYPE[key]);

  constructor(private entityService: EntityService,
              public dialog: MatDialog) {

    this.project = this.entityService.getProjectByTasklet(this.tasklet)
  }

  ngOnInit() {
  }

  selectIcon(type: TASKLET_TYPE) {
    switch (type) {
      case TASKLET_TYPE.ACTION: {
        return 'turned_in_not';
      }
      case TASKLET_TYPE.MEETING: {
        return 'people';
      }
      case TASKLET_TYPE.CALL: {
        return 'call';
      }
      case TASKLET_TYPE.DAILY_SCRUM: {
        return 'scrum';
      }
      case TASKLET_TYPE.MAIL: {
        return 'mail';
      }
      case TASKLET_TYPE.CHAT: {
        return 'chat';
      }
      case TASKLET_TYPE.DEVELOPMENT: {
        return 'code';
      }
      case TASKLET_TYPE.DEBUGGING: {
        return 'bug_report';
      }
      case TASKLET_TYPE.IDEA: {
        return 'lightbulb_outline';
      }
      case TASKLET_TYPE.LUNCH_BREAK: {
        return 'local_dining';
      }
      case TASKLET_TYPE.FINISHING_TIME: {
        return 'directions_run';
      }
      case TASKLET_TYPE.WEEKLY_DIGEST: {
        return 'receipt';
      }
    }
  }
}
