import {Component, Input, OnInit} from '@angular/core';
import {Task} from '../../../../model/entities/task.model';

@Component({
  selector: 'app-todos-list-item',
  templateUrl: './todos-list-item.component.html',
  styleUrls: ['./todos-list-item.component.scss']
})
export class TodosListItemComponent implements OnInit {
  @Input() task: Task;

  constructor() {
  }

  ngOnInit() {
  }

}
