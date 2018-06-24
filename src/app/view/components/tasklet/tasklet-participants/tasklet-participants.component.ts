import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {Tasklet} from '../../../../model/entities/tasklet.model';

@Component({
  selector: 'app-tasklet-participants',
  templateUrl: './tasklet-participants.component.html',
  styleUrls: ['./tasklet-participants.component.scss']
})
export class TaskletParticipantsComponent implements OnInit {
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
