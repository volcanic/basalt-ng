import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Tag} from '../../../model/entities/tag.model';
import {Observable} from 'rxjs/Observable';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/internal/operators';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operators';
import {FilterService} from '../../../services/entities/filter/filter.service';
import {SuggestionService} from '../../../services/entities/filter/suggestion.service';
import {TagService} from '../../../services/entities/tag.service';

/**
 * Displays tag chips fragment
 */
@Component({
  selector: 'app-tag-chips-fragment',
  templateUrl: './tag-chips-fragment.component.html',
  styleUrls: ['./tag-chips-fragment.component.scss']
})
export class TagChipsFragmentComponent implements OnInit {

  /** Tags to be displayed */
  @Input() tags: Tag[] = [];
  /** Whether the component is readonly */
  @Input() readonly = false;

  /** Event emitter indicating changes in tags */
  @Output() tagsChangedEmitter = new EventEmitter<Tag[]>();

  /** Debouncer for input field */
  inputFieldDebouncer = new Subject();

  /** Current inputFieldValue of input field */
  inputFieldValue = '';

  /** Array of options */
  options: string[] = [];
  /** Array of options filtered by currently typed inputFieldValue */
  filteredOptions: Observable<string[]>;

  /** Form control */
  formControl: FormControl = new FormControl();

  /**
   * Constructor
   * @param {TagService} tagService
   * @param {FilterService} filterService
   * @param {SuggestionService} suggestionService
   */
  constructor(private tagService: TagService,
              private filterService: FilterService,
              private suggestionService: SuggestionService) {
  }

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
    this.options = Array.from(this.suggestionService.tagOptions.values());

    this.filteredOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterAutocompleteOptions(value))
      );

    this.inputFieldDebouncer.pipe(
      debounceTime(500)
    ).subscribe((value: Tag[]) => this.tagsChangedEmitter.emit(value));
  }

  //
  // Actions
  //

  /**
   * Handles deletion of a tag
   * @param {Tag} value tag to be deleted
   */
  onDeleteTag(value: Tag) {
    if (!this.readonly) {
      this.tags = this.tags.filter(tag => {
        return tag.name !== value.name;
      });

      this.notify();
    }
  }

  /**
   * Handles key up event
   * @param event
   */
  onKeyUp(event: any) {
    if (!this.readonly) {
      const KEY_CODE_ENTER = 13;
      const KEY_CODE_COMMA = 188;

      if (this.inputFieldValue !== '' && this.inputFieldValue !== ',' && (event.keyCode === KEY_CODE_ENTER || event.keyCode === KEY_CODE_COMMA)) {
        this.tags.push(new Tag(this.inputFieldValue.replace(/,/, ''), true));
        this.inputFieldValue = '';
        this.notify();
      }
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
      this.tags.push(new Tag(this.inputFieldValue.replace(/,/, ''), true));
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
  filterAutocompleteOptions(value: string): string[] {
    return this.options.filter(option =>
      option.toLowerCase().includes(value.toLowerCase())
    );
  }

  //
  // Notifications
  //

  /**
   * Informs subscribers that something has changed
   */
  private notify() {
    this.inputFieldDebouncer.next(this.tags);
  }
}
