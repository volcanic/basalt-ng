import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TASKLET_TYPE} from '../../../../model/tasklet-type.enum';
import {ColorService} from '../../../../services/color.service';
import {Tasklet} from '../../../../model/entities/tasklet.model';
import {EntityService} from '../../../../services/entities/entity.service';
import {Project} from '../../../../model/entities/project.model';

@Component({
  selector: 'app-tasklet-default',
  templateUrl: './tasklet-default.component.html',
  styleUrls: ['./tasklet-default.component.scss']
})
export class TaskletDefaultComponent implements OnInit {
  @Input() tasklet: Tasklet;
  @Output() onActionFired = new EventEmitter<string>();

  topic: string;
  project: Project;
  icon = '';

  projectColor = 'transparent';

  constructor(private entityService: EntityService,
              private colorService: ColorService) {
  }

  ngOnInit() {
    // Set topic to be displayed
    switch (this.tasklet.type) {
      case TASKLET_TYPE.DAILY_SCRUM:
      case TASKLET_TYPE.LUNCH_BREAK:
      case TASKLET_TYPE.FINISHING_TIME:
      case TASKLET_TYPE.WEEKLY_DIGEST: {
        this.topic = this.tasklet.type;
        break;
      }
      default: {
        const task = this.entityService.getTaskByTasklet(this.tasklet);

        if (task != null) {
          this.topic = task.name;
        } else {
          this.topic = this.tasklet.type;
        }
      }
    }

    this.project = this.entityService.getProjectByTasklet(this.tasklet);
    this.selectIcon();

    if (this.project != null) {
      this.projectColor = this.colorService.getProjectColor(this.project.name);
    }
  }

  selectIcon() {
    switch (this.tasklet.type) {
      case TASKLET_TYPE.ACTION: {
        this.icon = 'turned_in_not';
        break;
      }
      case TASKLET_TYPE.MEETING: {
        this.icon = 'people_18';
        break;
      }
      case TASKLET_TYPE.CALL: {
        this.icon = 'call';
        break;
      }
      case TASKLET_TYPE.DAILY_SCRUM: {
        this.icon = 'scrum';
        break;
      }
      case TASKLET_TYPE.MAIL: {
        this.icon = 'mail';
        break;
      }
      case TASKLET_TYPE.CHAT: {
        this.icon = 'chat';
        break;
      }
      case TASKLET_TYPE.DEVELOPMENT: {
        this.icon = 'code';
        break;
      }
      case TASKLET_TYPE.DEBUGGING: {
        this.icon = 'bug_report';
        break;
      }
      case TASKLET_TYPE.IDEA: {
        this.icon = 'lightbulb_outline';
        break;
      }
      case TASKLET_TYPE.LUNCH_BREAK: {
        this.icon = 'local_dining';
        break;
      }
      case TASKLET_TYPE.FINISHING_TIME: {
        this.icon = 'local_run';
        break;
      }
      case TASKLET_TYPE.WEEKLY_DIGEST: {
        this.icon = 'receipt';
        break;
      }
    }
  }
}
