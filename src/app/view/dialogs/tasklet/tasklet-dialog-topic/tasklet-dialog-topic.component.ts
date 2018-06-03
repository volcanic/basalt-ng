import {Component, Input, OnInit} from '@angular/core';
import {Tasklet} from '../../../../model/tasklet.model';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-tasklet-dialog-topic',
  templateUrl: './tasklet-dialog-topic.component.html',
  styleUrls: ['./tasklet-dialog-topic.component.scss']
})
export class TaskletDialogTopicComponent implements OnInit {
  @Input() tasklet: Tasklet;
  @Input() taskOptions = [];
  filteredTaskOptions: Observable<string[]>;

  formControl: FormControl = new FormControl();

  constructor() {
  }

  ngOnInit() {
    this.filteredTaskOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterTasks(value))
      );
  }

  filterTasks(val: string): string[] {
    return this.taskOptions.filter(option =>
      option.toLowerCase().includes(val.toLowerCase()));
  }
}
