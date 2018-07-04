import {Component, Input, OnInit} from '@angular/core';
import {Tasklet} from '../../../../model/entities/tasklet.model';

@Component({
  selector: 'app-tasklet-dialog-content',
  templateUrl: './tasklet-dialog-content.component.html',
  styleUrls: ['./tasklet-dialog-content.component.scss']
})
export class TaskletDialogContentComponent implements OnInit {
  @Input() tasklet: Tasklet;
  @Input() previousDescription;

  constructor() {
  }

  ngOnInit() {
  }

}
