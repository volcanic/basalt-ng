import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {Task} from '../../../model/entities/task.model';
import {map, startWith} from 'rxjs/internal/operators';
import {CloneService} from '../../../services/util/clone.service';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operators';

/**
 * Displays task auto-complete fragment
 */
@Component({
  selector: 'app-task-autocomplete-fragment',
  templateUrl: './task-autocomplete-fragment.component.html',
  styleUrls: ['./task-autocomplete-fragment.component.scss']
})
export class TaskAutocompleteFragmentComponent implements OnInit {

  /** Task to be displayed */
  @Input() task: Task;
  /** Array of taskOptions */
  @Input() taskOptions: string[];

  /** Event emitter indicating changes in task */
  @Output() taskChangedEmitter = new EventEmitter<Task>();

  /** Debouncer for input field */
  inputFieldDebouncer = new Subject();
  /** Current value of input field */
  inputFieldValue = '';

  /** Array of options filtered by currently typed inputFieldValue */
  filteredOptions: Observable<string[]>;

  /** Form control */
  formControl: FormControl = new FormControl();

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.initializeTask();
  }

  //
  // Initialization
  //

  /**
   * Initializes task
   */
  private initializeTask() {
    if (this.task == null) {
      this.task = new Task('');
    }

    this.task = CloneService.cloneTask(this.task);
  }

  /**
   * Initializes task options
   */
  private initializeTaskOptions() {
    this.filteredOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterOptions(value))
      );

    this.inputFieldDebouncer.pipe(
      debounceTime(500)
    ).subscribe((value: Task) => this.taskChangedEmitter.emit(value));
  }

  //
  // Actions
  //

  /**
   * Handles key up event
   */
  onKeyUp() {
    this.notify();
  }

  /**
   * Handles option selection
   */
  onOptionSelected() {
    this.notify();
  }

  //
  // Helpers
  //

  /**
   * Filters options according to current value of input field
   * @param {string} value input field value
   * @returns {string[]} array of filtered options
   */
  private filterOptions(value: string): string[] {
    return this.taskOptions.filter(option =>
      option.toLowerCase().includes(value.toLowerCase())
    ).reverse();
  }

  //
  // Notification
  //

  /**
   * Informs subscribers that something has changed
   */
  private notify() {
    this.inputFieldDebouncer.next(this.task);
  }
}
