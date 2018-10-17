import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Tag} from 'app/core/entity/model/tag.model';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operators';

/**
 * Displays tag chips fragment
 */
@Component({
  selector: 'app-tag-chips-fragment',
  templateUrl: './tag-chips-fragment.component.html',
  styleUrls: ['./tag-chips-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagChipsFragmentComponent implements OnInit {

  /** Tags to be displayed */
  @Input() tags: Tag[] = [];
  /** Whether the component is readonly */
  @Input() readonly = false;
  /** Array of taskOptions */
  @Input() tagOptions: string[] = [];
  /** Event emitter indicating changes in tags */
  @Output() tagsChangedEmitter = new EventEmitter<Tag[]>();

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
    this.optionsFiltered = this.tagOptions;
  }

  /**
   * Initializes debouncer
   */
  private initializeDebouncer() {
    this.debouncer.pipe(
      debounceTime(500)
    ).subscribe((value: Tag[]) => this.tagsChangedEmitter.emit(value));
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

      if (this.value !== '' && this.value !== ','
        && (event.keyCode === KEY_CODE_ENTER || event.keyCode === KEY_CODE_COMMA)) {
        this.tags.push(new Tag(this.value.replace(/,/, ''), true));
        this.value = '';
        this.notify();
      }
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
      this.tags.push(new Tag(this.value.replace(/,/, ''), true));
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
    return this.tagOptions.filter(option =>
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
    this.debouncer.next(this.tags);
  }
}