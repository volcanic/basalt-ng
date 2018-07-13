import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Rx';
import {Task} from '../../../model/entities/task.model';
import {map, startWith} from 'rxjs/internal/operators';
import {TaskService} from '../../../services/entities/task.service';
import {TaskletService} from '../../../services/entities/tasklet.service';

@Component({
  selector: 'app-task-autocomplete-fragment',
  templateUrl: './task-autocomplete-fragment.component.html',
  styleUrls: ['./task-autocomplete-fragment.component.scss']
})
export class TaskAutocompleteFragmentComponent implements OnInit {

  @Input() task: Task;
  @Output() taskChangedEmitter = new EventEmitter<Task>();

  value = '';

  options = [];
  filteredOptions: Observable<string[]>;
  formControl: FormControl = new FormControl();

  constructor(private taskletService: TaskletService) {
  }

  ngOnInit() {
    if (this.task == null) {
      this.task = new Task('');
    }

    // Cut ties with existing entity
    this.task = JSON.parse(JSON.stringify(this.task));

    this.options = Array.from(this.taskletService.tasks.values()).map(tag => {
      return tag.name;
    }).reverse();

    this.filteredOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterSearchItems(value))
      );
  }

  onKeyUp(event: any) {
    this.notify();
  }

  onOptionSelected(event: any) {
    this.notify();
  }

  filterSearchItems(value: string): string[] {
    return this.options.filter(option =>
      option.toLowerCase().includes(value.toLowerCase())
    ).reverse();
  }

  notify() {
    this.taskChangedEmitter.emit(this.task);
  }

}
