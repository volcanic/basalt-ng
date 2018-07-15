import {Component, Input, OnInit} from '@angular/core';
import {Tasklet} from '../../../model/entities/tasklet.model';

@Component({
  selector: 'app-tasklet-list',
  templateUrl: './tasklet-list.component.html',
  styleUrls: ['./tasklet-list.component.scss']
})
export class TaskletListComponent implements OnInit {

  @Input() tasklets: Tasklet[];

  constructor() {
  }

  ngOnInit() {
  }

}
