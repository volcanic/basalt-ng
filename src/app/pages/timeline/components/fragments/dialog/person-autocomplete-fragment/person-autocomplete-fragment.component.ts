import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Person} from 'app/core/entity/model/person.model';
import {CloneService} from 'app/core/entity/services/clone.service';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

/**
 * Display person auto-complete fragment
 */
@Component({
  selector: 'app-person-autocomplete-fragment',
  templateUrl: './person-autocomplete-fragment.component.html',
  styleUrls: ['./person-autocomplete-fragment.component.scss']
})
export class PersonAutocompleteFragmentComponent implements OnInit {

  /** Person to be displayed */
  @Input() person: Person;
  /** Array of person options */
  @Input() personOptions: string[] = [];
  /** Event emitter indicating changes in person */
  @Output() personChangedEmitter = new EventEmitter<Person>();

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
    this.initializePerson();
    this.initializeOptions();
    this.initializeDebouncer();
  }

  //
  // Initialization
  //

  /**
   * Initializes person
   */
  private initializePerson() {
    if (this.person == null) {
      this.person = new Person('');
    }

    this.person = CloneService.clonePerson(this.person);
  }

  /**
   * Initialize auto-complete options
   */
  private initializeOptions() {
    this.optionsFiltered = this.personOptions;
  }

  /**
   * Initializes debouncer
   */
  private initializeDebouncer() {
    this.debouncer.pipe(
      debounceTime(500)
    ).subscribe((value: Person) => this.personChangedEmitter.emit(value));
  }

  //
  // Actions
  //

  /**
   * Handles person name changes
   * @param personName person name
   */
  onPersonNameChanged(personName: string) {
    this.person.name = personName;
    this.optionsFiltered = this.filterOptions(this.person.name);
    this.debouncer.next(this.person);
  }

  /**
   * Handles key up event
   */
  onKeyUp() {
    this.notify();
  }

  /**
   * Handles selected option
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
    return this.personOptions.filter(option =>
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
    this.personChangedEmitter.emit(this.person);
  }
}
