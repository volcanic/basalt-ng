import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskletCall} from '../../../model/tasklet-call.model';
import {DateService} from '../../../services/date.service';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';

@Component({
  selector: 'app-tasklet-call',
  templateUrl: './tasklet-call.component.html',
  styleUrls: ['./tasklet-call.component.scss']
})
export class TaskletCallComponent implements OnInit {
  @Input() tasklet: TaskletCall;
  @Output() onActionFired = new EventEmitter<string>();
  icon = '';

  constructor(private dateService: DateService,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('call', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_call_black_24px.svg'));
  }

  ngOnInit() {
    this.icon = 'call';
  }

  onToggledDone() {
    this.onActionFired.next('save');
  }
}
