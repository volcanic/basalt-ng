import {Component, Input, OnInit} from '@angular/core';
import {Tasklet} from '../../../model/tasklet.model';

@Component({
  selector: 'app-tasklet-dialog-default',
  templateUrl: './tasklet-dialog-default.component.html',
  styleUrls: ['./tasklet-dialog-default.component.scss']
})
export class TaskletDialogDefaultComponent implements OnInit {
  @Input() tasklet: Tasklet;

  constructor() { }

  ngOnInit() {
  }

}
