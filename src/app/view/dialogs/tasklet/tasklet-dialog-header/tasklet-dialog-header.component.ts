import {Component, Input, OnInit} from '@angular/core';
import {Tasklet} from '../../../../model/tasklet.model';
import {TASKLET_TYPE} from '../../../../model/tasklet-type.enum';
import {Project} from '../../../../model/project.model';

@Component({
  selector: 'app-tasklet-dialog-header',
  templateUrl: './tasklet-dialog-header.component.html',
  styleUrls: ['./tasklet-dialog-header.component.scss']
})
export class TaskletDialogHeaderComponent implements OnInit {
  @Input() tasklet: Tasklet;
  @Input() projects: Tasklet;

  taskletTypes = Object.keys(TASKLET_TYPE).map(key => TASKLET_TYPE[key]);

  constructor() {
  }

  ngOnInit() {
  }

  compareProject(p1: Project, p2: Project) {
    return p1.value === p2.value;
  }
}
