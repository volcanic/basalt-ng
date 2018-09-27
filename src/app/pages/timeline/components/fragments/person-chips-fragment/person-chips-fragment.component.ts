import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Person} from 'app/core/entity/model/person.model';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operators';

/**
 * Displays person chip fragmemt
 */
@Component({
  selector: 'app-person-chips-fragment',
  templateUrl: './person-chips-fragment.component.html',
  styleUrls: ['./person-chips-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonChipsFragmentComponent implements OnInit {

  /** Persons to be displayed */
  @Input() persons: Person[] = [];
  /** Whether the component is readonly */
  @Input() readonly = false;
  /** Array of person options */
  @Input() personOptions: string[] = [];
  /** Event emitter indicating changes in persons */
  @Output() personsChangedEmitter = new EventEmitter<Person[]>();

  /** Current value of input field */
  value = '';
  /** Debouncer for input field */
  debouncer = new Subject();
  /** Array of options filtered by currently typed value */
  optionsFiltered: string[];

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
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
    this.optionsFiltered = this.personOptions;
  }

  /**
   * Initializes debouncer
   */
  private initializeDebouncer() {
    this.debouncer.pipe(
      debounceTime(500)
    ).subscribe((value: Person[]) => this.personsChangedEmitter.emit(value));
  }

  //
  // Actions
  //

  /**
   * Handles changes in input field value
   * @param value input field value
   */
  onValueChanged(value: string) {
    this.value = value;
    this.optionsFiltered = this.filterAutoCompleteOptions(this.value);
  }

  /**
   * Handles deletion of a person
   * @param {Person} value person to be deleted
   */
  onDeletePerson(value: Person) {
    if (!this.readonly) {
      this.persons = this.persons.filter(person => {
        return person.name !== value.name;
      });

      this.notify();
    }
  }

  /**
   * Handles key up event
   * @param event
   */
  onKeyUp(event: any) {
    const KEY_CODE_ENTER = 13;
    const KEY_CODE_COMMA = 188;

    if (this.value !== ''
      && this.value !== ','
      && (event.keyCode === KEY_CODE_ENTER || event.keyCode === KEY_CODE_COMMA)) {
      this.persons.push(new Person(this.value.replace(/,/, ''), true));
      this.value = '';
      this.notify();
    }
  }

  /**
   * Handles key down event
   */
  onKeyDown() {
    this.value = this.value.replace(/,/, '');
  }

  /**
   * Handles selection of an auto-complete option
   */
  onOptionSelected() {
    if (!this.readonly) {
      this.persons.push(new Person(this.value.replace(/,/, ''), true));
      this.value = '';
      this.notify();
    }
  }

  //
  // Helpers
  //

  /**
   * Filters auto-complete options
   * @param {string} value input value
   * @returns {string[]} filtered options
   */
  filterAutoCompleteOptions(value: string): string[] {
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
    this.debouncer.next(this.persons);
  }
}
