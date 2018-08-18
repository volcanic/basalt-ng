import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {debounceTime, map, startWith, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';
import {SuggestionService} from '../../../services/entities/filter/suggestion.service';
import {MediaService} from '../../../services/ui/media.service';
import {Media} from '../../../model/ui/media.enum';
import {Scope} from '../../../model/scope.enum';
import {ScopeService} from '../../../services/entities/scope/scope.service';

/**
 * Displays timeline toolbar
 */
@Component({
  selector: 'app-timeline-toolbar',
  templateUrl: './timeline-toolbar.component.html',
  styleUrls: ['./timeline-toolbar.component.scss']
})
export class TimelineToolbarComponent implements OnInit, OnDestroy {

  /** Title displayed in the toolbar */
  @Input() title;

  /** Event emitter indicating changes in search bar */
  @Output() searchItemChangedEmitter = new EventEmitter<string>();

  /** Event emitter indicating menu items being clicked */
  @Output() menuItemClickedEmitter = new EventEmitter<string>();

  /** Enum for media types */
  mediaType = Media;
  /** Current media */
  media: Media = Media.UNDEFINED;

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /** Debouncer for search field */
  seachFieldDebouncer = new Subject();

  /**
   * Current search item
   * @type {string}
   */
  searchItem = '';

  /**
   * Search items options for auto-complete
   * @type {any[]}
   */
  searchOptions = [];

  /**
   * Filtered search items options for auto-complete
   */
  searchOptionsFiltered: Observable<string[]>;

  /** Form control */
  formControl: FormControl = new FormControl();

  /**
   * Scope type enum
   * @type {Scope}
   */
  public scopeType = Scope;

  /**
   * Current scope
   */
  public scope: Scope;

  /**
   * Constructor
   * @param {MediaService} mediaService
   * @param {ScopeService} scopeService
   * @param {SuggestionService} suggestionService
   */
  constructor(private mediaService: MediaService,
              private scopeService: ScopeService,
              private suggestionService: SuggestionService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.initializeMediaSubscription();
    this.initializeSuggestionSubscription();
    this.initializeScopeSubscription();
  }

  /**
   * Handles on-destroy lifecycle hook
   */
  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

  //
  // Initialization
  //

  /**
   * Initializes media subscription
   */
  private initializeMediaSubscription() {
    this.media = this.mediaService.media;
    this.mediaService.mediaSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      this.media = value as Media;
    });
  }

  /**
   * Initializes suggestion subscription
   */
  private initializeSuggestionSubscription() {
    this.suggestionService.searchOptionsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        this.searchOptions = (value as string[]).reverse();
        this.formControl.setValue(this.formControl.value);
      }
    });

    this.searchOptions = Array.from(this.suggestionService.searchOptions.values()).reverse();
    this.searchOptionsFiltered = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterOptions(value))
      );

    this.seachFieldDebouncer.pipe(
      debounceTime(500)
    ).subscribe((value) => this.searchItemChangedEmitter.emit(value.toString()));
  }

  /**
   * Initializes scope subscription
   */
  private initializeScopeSubscription() {
    this.scope = this.scopeService.scope;
    this.scopeService.scopeSubject.subscribe(scope => {
      this.scope = scope;
    });
  }

  //
  // Actions
  //

  /**
   * Handles click on menu item
   * @param {string} menuItem
   */
  onMenuItemClicked(menuItem: string): void {
    this.menuItemClickedEmitter.emit(menuItem);
  }

  /**
   * Handles key up event
   */
  onKeyUp() {
    this.notifySearchItemChanged();
  }

  /**
   * Handles option selection
   */
  onOptionSelected() {
    this.notifySearchItemChanged();
  }

  /**
   * Handles click on clear button
   */
  onClearButtonClicked() {
    this.searchItem = '';
    this.notifySearchItemChanged();
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

  //
  // Notifications
  //

  /**
   * Notitfies subscribers that something has changed
   */
  private notifySearchItemChanged() {
    this.seachFieldDebouncer.next(this.searchItem);
  }
}
