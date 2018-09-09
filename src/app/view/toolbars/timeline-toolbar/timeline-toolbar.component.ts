import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {debounceTime, map, startWith} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';
import {Media} from '../../../model/ui/media.enum';
import {Scope} from '../../../model/scope.enum';

/**
 * Displays timeline toolbar
 */
@Component({
  selector: 'app-timeline-toolbar',
  templateUrl: './timeline-toolbar.component.html',
  styleUrls: ['./timeline-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineToolbarComponent implements OnInit {

  /** Title displayed in the toolbar */
  @Input() title;
  /** Current media */
  @Input() media: Media;
  /** Current scope */
  @Input() scope: Scope;
  /** Search items options for auto-complete */
  @Input() searchOptions = [];
  /** Event emitter indicating changes in search bar */
  @Output() searchItemEventEmitter = new EventEmitter<string>();
  /** Event emitter indicating menu items being clicked */
  @Output() menuItemEventEmitter = new EventEmitter<string>();

  /** Enum for media types */
  mediaType = Media;
  /** Scope type enum */
  scopeType = Scope;

  /** Filtered search items options for auto-complete */
  searchOptionsFiltered: Observable<string[]>;

  /** Debouncer for search field */
  seachFieldDebouncer = new Subject();

  /** Current search item */
  searchItem = '';

  /** Form control */
  formControl: FormControl = new FormControl();

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.initializeSearchOptionsFilter();
  }

  //
  // Initialization
  //

  /**
   * Initializes search options filter
   */
  private initializeSearchOptionsFilter() {
    this.searchOptionsFiltered = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterOptions(value))
      );

    this.seachFieldDebouncer.pipe(
      debounceTime(500)
    ).subscribe((value) => this.searchItemEventEmitter.emit(value.toString()));
  }

  //
  // Actions
  //

  /**
   * Handles click on menu item
   * @param {string} menuItem
   */
  onMenuItemClicked(menuItem: string): void {
    this.menuItemEventEmitter.emit(menuItem);
  }

  /**
   * Handles click on search field
   */
  onSearchFieldClicked() {
    this.filterOptions(this.searchItem);
  }

  /**
   * Handles key up event
   */
  onKeyUp() {
    this.seachFieldDebouncer.next(this.searchItem);
  }

  /**
   * Handles option selection
   */
  onOptionSelected() {
    this.seachFieldDebouncer.next(this.searchItem);
  }

  /**
   * Handles click on clear button
   */
  onClearButtonClicked() {
    this.searchItem = '';
    this.seachFieldDebouncer.next(this.searchItem);
  }

  //
  // Filters
  //

  /**
   * Filters options according to current value of input field
   * @param {string} value input field value
   * @returns {string[]} array of filtered options
   */
  private filterOptions(value: string): string[] {
    return this.searchOptions.filter(option =>
      option.toLowerCase().includes(value.toLowerCase())
    );
  }
}
