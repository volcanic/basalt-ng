import {Component, Input, OnInit} from '@angular/core';
import {TaskletWeeklyDigest} from '../../../../model/tasklet-weekly-digest.model';

@Component({
  selector: 'app-tasklet-dialog-weekly-digest',
  templateUrl: './tasklet-dialog-weekly-digest.component.html',
  styleUrls: ['./tasklet-dialog-weekly-digest.component.scss']
})
export class TaskletDialogWeeklyDigestComponent implements OnInit {
  @Input() tasklet: TaskletWeeklyDigest;

  constructor() {
  }

  ngOnInit() {
  }
}
