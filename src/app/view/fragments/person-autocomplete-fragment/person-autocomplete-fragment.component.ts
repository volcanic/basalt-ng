import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {Person} from '../../../model/entities/person.model';
import {map, startWith} from 'rxjs/internal/operators';
import {TaskletService} from '../../../services/entities/tasklet.service';
import {CloneService} from '../../../services/util/clone.service';
import {SuggestionService} from '../../../services/entities/filter/suggestion.service';

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

  /** Event emitter indicating changes in person */
  @Output() personChangedEmitter = new EventEmitter<Person>();

  /** Current value of input field */
  inputFieldValue = '';

  /** Array of options */
  options = [];
  /** Array of options filtered by currently typed inputFieldValue */
  filteredOptions: Observable<string[]>;

  /** Form control */
  formControl: FormControl = new FormControl();

  /**
   * Constructor
   * @param {TaskletService} taskletService
   * @param {CloneService} cloneService
   * @param {SuggestionService} suggestionService
   */
  constructor(private taskletService: TaskletService,
              private cloneService: CloneService,
              private suggestionService: SuggestionService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.initializePerson();
    this.initializePersonOptions();
  }

  //
  // Initialization
  //

  /**
   * Initializes person
   */
  private initializePerson() {
    if (this.person == null) {
      this.person = new Person('', true);
    }

    this.person = CloneService.clonePerson(this.person);
  }

  /**
   * Initializes person options
   */
  private initializePersonOptions() {
    this.options = Array.from(this.suggestionService.personOptions.values()).reverse();

    this.filteredOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterOptions(value))
      );
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
    return this.options.filter(option =>
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
