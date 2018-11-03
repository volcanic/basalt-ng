import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Task} from 'app/core/entity/model/task.model';
import {CloneService} from 'app/core/entity/services/clone.service';
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
  /** Readonly dialog if true */
  @Input() readonly: false;
  /** Array of taskOptions */
  @Input() taskOptions: string[];
  /** Event emitter indicating changes in task */
  @Output() taskChangedEmitter = new EventEmitter<Task>();

  /** Debouncer for input field */
  debouncer = new Subject();
  /** Array of options filtered by currently typed value */
  optionsFiltered: string[];

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeTask();
    this.initializeOptions();
    this.initializeDebouncer();
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
   * Initialize auto-complete options
   */
  private initializeOptions() {
    this.optionsFiltered = this.taskOptions;
  }

  /**
   * Initializes debouncer
   */
  private initializeDebouncer() {
    this.debouncer.pipe(
      debounceTime(500)
    ).subscribe((value: Task) => this.taskChangedEmitter.emit(value));
  }

  //
  // Actions
  //

  /**
   * Handles task name changes
   * @param taskName task name
   */
  onTaskNameChanged(taskName: string) {
    this.task.name = taskName;
    this.optionsFiltered = this.filterOptions(this.task.name);
    this.debouncer.next(this.task);
  }

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
    );
  }

  //
  // Notification
  //

  /**
   * Informs subscribers that something has changed
   */
  private notify() {
    this.debouncer.next(this.task);
  }
}
