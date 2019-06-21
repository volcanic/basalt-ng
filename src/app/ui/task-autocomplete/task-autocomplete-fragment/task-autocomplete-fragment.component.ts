import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
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

  /** Task name to be displayed */
  @Input() taskName: string;
  /** Readonly dialog if true */
  @Input() readonly: false;
  /** Array of taskOptions */
  @Input() taskOptions: string[];
  /** Event emitter indicating changes in task name */
  @Output() taskNameChangedEmitter = new EventEmitter<string>();

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
    this.initializeOptions();
    this.initializeDebouncer();
  }

  //
  // Initialization
  //

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
    ).subscribe((value: string) => this.taskNameChangedEmitter.emit(value));
  }

  //
  // Actions
  //

  /**
   * Handles task name changes
   * @param taskName task name
   */
  onTaskNameChanged(taskName: string) {
    this.taskName = taskName;
    this.optionsFiltered = this.filterOptions(taskName);
    this.debouncer.next(taskName);
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
    this.debouncer.next(this.taskName);
  }
}
