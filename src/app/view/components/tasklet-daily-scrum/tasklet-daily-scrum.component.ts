import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskletDailyScrum} from '../../../model/tasklet-daily-scrum.model';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {DAILY_SCRUM_ACTIVITY_TYPE} from '../../../model/daily-scrum-activity-type.enum';

@Component({
  selector: 'app-tasklet-daily-scrum',
  templateUrl: './tasklet-daily-scrum.component.html',
  styleUrls: ['./tasklet-daily-scrum.component.scss']
})
export class TaskletDailyScrumComponent implements OnInit {
  @Input() tasklet: TaskletDailyScrum;
  @Output() onActionFired = new EventEmitter<string>();

  type = DAILY_SCRUM_ACTIVITY_TYPE;

  iconDone = 'done';
  iconRefresh = 'refresh';
  iconToday = 'today';
  iconWarning = 'warning';

  constructor(iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(this.iconDone, sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_check_circle_green_18px.svg'));
    iconRegistry.addSvgIcon(this.iconRefresh, sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_refresh_black_18px.svg'));
    iconRegistry.addSvgIcon(this.iconToday, sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_today_black_18px.svg'));
    iconRegistry.addSvgIcon(this.iconWarning, sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_warning_black_18px.svg'));
  }

  ngOnInit() {
  }

}
