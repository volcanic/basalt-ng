import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Tasklet} from '../../../model/tasklet.model';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {TASKLET_TYPE} from '../../../model/tasklet-type.enum';

@Component({
  selector: 'app-tasklet-default',
  templateUrl: './tasklet-default.component.html',
  styleUrls: ['./tasklet-default.component.scss']
})
export class TaskletDefaultComponent implements OnInit {
  @Input() tasklet: Tasklet;
  @Output() onActionFired = new EventEmitter<string>();
  icon = '';

  constructor(iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('turned', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_turned_in_not_black_24px.svg'));
    iconRegistry.addSvgIcon('people', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_people_black_24px.svg'));
    iconRegistry.addSvgIcon('call', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_call_black_24px.svg'));
    iconRegistry.addSvgIcon('mail', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_mail_outline_black_24px.svg'));
    iconRegistry.addSvgIcon('chat', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_chat_bubble_outline_black_24px.svg'));
    iconRegistry.addSvgIcon('code', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_code_black_24px.svg'));
    iconRegistry.addSvgIcon('bug', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_bug_report_black_24px.svg'));
    iconRegistry.addSvgIcon('lightbulb', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_lightbulb_outline_black_24px.svg'));
    iconRegistry.addSvgIcon('timer', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_timer_black_24px.svg'));
    iconRegistry.addSvgIcon('dining', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_local_dining_black_24px.svg'));
    iconRegistry.addSvgIcon('run', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_directions_run_black_24px.svg'));
  }

  ngOnInit() {
    switch (this.tasklet.type) {
      case TASKLET_TYPE.ACTION: {
        this.icon = 'turned';
        break;
      }
      case TASKLET_TYPE.MEETING: {
        this.icon = 'people';
        break;
      }
      case TASKLET_TYPE.CALL: {
        this.icon = 'call';
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
        this.icon = 'bug';
        break;
      }
      case TASKLET_TYPE.TODO: {
        this.icon = 'timer';
        break;
      }
      case TASKLET_TYPE.IDEA: {
        this.icon = 'lightbulb';
        break;
      }
      case TASKLET_TYPE.LUNCH_BREAK: {
        this.icon = 'dining';
        break;
      }
      case TASKLET_TYPE.FINISHING_TIME: {
        this.icon = 'run';
        break;
      }
    }
  }
}
