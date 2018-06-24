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
              public dialog: MatDialog,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('add', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_add_black_24px.svg'));
    iconRegistry.addSvgIcon('turned', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_turned_in_not_black_24px.svg'));
    iconRegistry.addSvgIcon('people', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_people_black_24px.svg'));
    iconRegistry.addSvgIcon('call', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_call_black_24px.svg'));
    iconRegistry.addSvgIcon('scrum', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_scrum_black_24px.svg'));
    iconRegistry.addSvgIcon('mail', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_mail_outline_black_24px.svg'));
    iconRegistry.addSvgIcon('chat', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_chat_bubble_outline_black_24px.svg'));
    iconRegistry.addSvgIcon('code', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_code_black_24px.svg'));
    iconRegistry.addSvgIcon('bug', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_bug_report_black_24px.svg'));
    iconRegistry.addSvgIcon('lightbulb', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_lightbulb_outline_black_24px.svg'));
    iconRegistry.addSvgIcon('dining', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_local_dining_black_24px.svg'));
    iconRegistry.addSvgIcon('run', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_directions_run_black_24px.svg'));
    iconRegistry.addSvgIcon('receipt', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/outline-receipt-24px.svg'));

    this.project = this.entityService.getProjectByTasklet(this.tasklet)
  }

  ngOnInit() {
  }

  selectIcon(type: TASKLET_TYPE) {
    switch (type) {
      case TASKLET_TYPE.ACTION: {
        return 'turned';
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
        return 'bug';
      }
      case TASKLET_TYPE.IDEA: {
        return 'lightbulb';
      }
      case TASKLET_TYPE.LUNCH_BREAK: {
        return 'dining';
      }
      case TASKLET_TYPE.FINISHING_TIME: {
        return 'run';
      }
      case TASKLET_TYPE.WEEKLY_DIGEST: {
        return 'receipt';
      }
    }
  }
}
