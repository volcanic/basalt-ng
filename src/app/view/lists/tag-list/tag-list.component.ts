import {ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {FilterService} from '../../../services/entities/filter/filter.service';
import {takeUntil} from 'rxjs/internal/operators';
import {MatchService} from '../../../services/entities/filter/match.service';
import {Tag} from '../../../model/entities/tag.model';
import {TagService} from '../../../services/entities/tag.service';

/**
 * Displays tag list
 */
@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss']
})
export class TagListComponent implements OnInit, OnDestroy {

  /** Event emitter indicating menu items being clicked */
  @Output() menuItemClickedEmitter = new EventEmitter<string>();

  /** Tags to be displayed */
  tags = [];
  /** Unfiltered tags */
  tagsAll = [];

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /**
   * Constructor
   * @param {TagService} tagService
   * @param {MatchService} matchService
   * @param {FilterService} filterService
   * @param {ChangeDetectorRef} changeDetector
   */
  constructor(private tagService: TagService,
              private matchService: MatchService,
              private filterService: FilterService,
              private changeDetector: ChangeDetectorRef) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle hook
   */
  ngOnInit() {
    this.initializeTagSubscription();
    this.initializeFilterSubscription();
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
   * Initializes tag subscription
   */
  private initializeTagSubscription() {
    this.tagsAll = Array.from(this.tagService.tags.values());
    this.update();

    this.tagService.tagsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        this.tagsAll = value as Tag[];
        this.update();
      }
    });
  }

  /**
   * Initializes filter subscription
   */
  private initializeFilterSubscription() {
    this.filterService.filterSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe(() => {
      this.update();
    });
  }

  //
  // Actions
  //

  /**
   * Handles click on menu items
   * @param menuItem menu item that has been clicked
   */
  onMenuItemClicked(menuItem: string) {
    this.menuItemClickedEmitter.emit(menuItem);
  }

  /**
   * Filters original values
   */
  private update() {
    this.tags = this.tagsAll.filter(tag => {
      const matchesSearchItem = this.matchService.tagMatchesEveryItem(tag, this.filterService.searchItem);
      const matchesTags = this.matchService.tagMatchesTags(tag,
        Array.from(this.filterService.persons.values()),
        this.filterService.personsNone);

      return matchesSearchItem && matchesTags;
    }).sort((t1: Tag, t2: Tag) => {
      return t2 > t1 ? 1 : -1;
    });

    this.changeDetector.markForCheck();
  }
}
