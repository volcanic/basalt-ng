import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {debounceTime} from 'rxjs/operators';
import 'rxjs/add/observable/from';
import {Subject} from 'rxjs/Subject';
import {Media} from 'app/core/ui/model/media.enum';
import {Scope} from 'app/core/entity/model/scope.enum';

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

  /** Current search item */
  searchItem = '';
  /** Debouncer for search field */
  searchItemDebouncer = new Subject();
  /** Filtered search items options for auto-complete */
  searchOptionsFiltered: string[];

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
    this.searchOptionsFiltered = this.searchOptions;
  }

  /**
   * Initializes search options filter
   */
  private initializeDebouncer() {
    this.searchItemDebouncer.pipe(
      debounceTime(500)
    ).subscribe((value) => {
      this.searchItemEventEmitter.emit(value.toString());
    });
  }

  //
  // Actions
  //

  /** Handles click on menu item
   * @param {string} menuItem
   */
  onMenuItemClicked(menuItem: string): void {
    this.menuItemEventEmitter.emit(menuItem);
  }

  /**
   * Handles changes in search item
   * @param searchItem search item
   */
  onSearchItemChanged(searchItem: string) {
    this.searchItem = searchItem;
    this.searchOptionsFiltered = this.filterOptions(this.searchItem);
    this.searchItemDebouncer.next(this.searchItem);
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
    this.searchItemDebouncer.next(this.searchItem);
  }

  /**
   * Handles option selection
   */
  onOptionSelected() {
    this.searchItemDebouncer.next(this.searchItem);
  }

  /**
   * Handles click on clear button
   */
  onClearButtonClicked() {
    this.searchItem = '';
    this.searchItemDebouncer.next(this.searchItem);
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
