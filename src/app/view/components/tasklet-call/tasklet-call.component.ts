import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Tasklet} from '../../../model/tasklet.model';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';

@Component({
  selector: 'app-tasklet-call',
  templateUrl: './tasklet-call.component.html',
  styleUrls: ['./tasklet-call.component.scss']
})
export class TaskletCallComponent implements OnInit {
  @Input() tasklet: Tasklet;
  @Output() onActionFired = new EventEmitter<string>();
  icon = '';

  constructor(iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('call', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_call_black_24px.svg'));
  }

  ngOnInit() {
    this.icon = 'call';
  }
}
