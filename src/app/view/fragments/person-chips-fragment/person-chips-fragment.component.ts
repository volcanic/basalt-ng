import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Person} from '../../../model/entities/person.model';
import {Observable} from 'rxjs/Observable';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/internal/operators';
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
  /** Array of taskOptions */
  @Input() personOptions: string[] = [];
  /** Event emitter indicating changes in persons */
  @Output() personsChangedEmitter = new EventEmitter<Person[]>();

  /** Debouncer for input field */
  inputFieldDebouncer = new Subject();

  /** Current inputFieldValue of input field */
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
    this.initializeOptions();
  }

  //
  // Initialization
  //

  /**
   * Initialize auto-complete options
   */
  private initializeOptions() {
    this.filteredOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterAutoCompleteOptions(value))
      );

    this.inputFieldDebouncer.pipe(
      debounceTime(500)
    ).subscribe((value: Person[]) => this.personsChangedEmitter.emit(value));
  }

  //
  // Actions
  //

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

    if (this.inputFieldValue !== ''
      && this.inputFieldValue !== ','
      && (event.keyCode === KEY_CODE_ENTER || event.keyCode === KEY_CODE_COMMA)) {
      this.persons.push(new Person(this.inputFieldValue.replace(/,/, ''), true));
      this.inputFieldValue = '';
      this.notify();
    }
  }

  /**
   * Handles key down event
   */
  onKeyDown() {
    this.inputFieldValue = this.inputFieldValue.replace(/,/, '');
  }

  /**
   * Handles selection of an auto-complete option
   */
  onOptionSelected() {
    if (!this.readonly) {
      this.persons.push(new Person(this.inputFieldValue.replace(/,/, ''), true));
      this.inputFieldValue = '';
      this.notify();
    }
  }

  //
  // Helpers
  //

  /**
   * Filters auto-complete options
   * @param {string} value input inputFieldValue
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
    this.inputFieldDebouncer.next(this.persons);
  }
}
