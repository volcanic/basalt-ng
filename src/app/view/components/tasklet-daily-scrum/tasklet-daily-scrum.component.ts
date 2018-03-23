import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskletDailyScrum} from '../../../model/tasklet-daily-scrum.model';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';

@Component({
  selector: 'app-tasklet-daily-scrum',
  templateUrl: './tasklet-daily-scrum.component.html',
  styleUrls: ['./tasklet-daily-scrum.component.scss']
})
export class TaskletDailyScrumComponent implements OnInit {
  @Input() tasklet: TaskletDailyScrum;
  @Output() onActionFired = new EventEmitter<string>();

  constructor(iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
  }

  ngOnInit() {
  }

}
