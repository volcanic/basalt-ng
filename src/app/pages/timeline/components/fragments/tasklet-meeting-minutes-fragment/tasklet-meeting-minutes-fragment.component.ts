import {Component, Input, OnInit} from '@angular/core';
import {Tasklet} from '../../../../../core/entity/model/tasklet.model';

@Component({
  selector: 'app-tasklet-meeting-minutes-fragment',
  templateUrl: './tasklet-meeting-minutes-fragment.component.html',
  styleUrls: ['./tasklet-meeting-minutes-fragment.component.scss']
})
export class TaskletMeetingMinutesFragmentComponent implements OnInit {

  /** Tasklet to be displayed */
  @Input() tasklet: Tasklet;

  constructor() {
  }

  ngOnInit() {
  }

}
