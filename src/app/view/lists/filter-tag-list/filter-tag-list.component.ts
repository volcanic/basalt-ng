import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FilterService} from '../../../services/entities/filter/filter.service';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs/Subject';
import {Tag} from '../../../model/entities/tag.model';
import {MatchService} from '../../../services/entities/filter/match.service';

/**
 * Displays filter tag list
 */
@Component({
  selector: 'app-filter-tag-list',
  templateUrl: './filter-tag-list.component.html',
  styleUrls: ['./filter-tag-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterTagListComponent implements OnInit {

  /** Tags to be displayed */
  tags = [];
  /** Flag indicating whether entities without tag shall be displayed */
  tagsNone = false;

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /**
   * Constructor
   * @param {FilterService} filterService
   * @param {MatchService} matchService
   * @param {ChangeDetectorRef} changeDetector
   */
  constructor(private filterService: FilterService,
              private matchService: MatchService,
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
  }

  //
  // Initialization
  //

  /**
   * Initializes tag subscription
   */
  private initializeTagSubscription() {
    this.tags = Array.from(this.filterService.tags.values()).sort((t1: Tag, t2: Tag) => {
      return MatchService.compare(t1.name, t2.name);
    });
    this.tagsNone = this.filterService.tagsNone;

    this.filterService.filterSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe(() => {
        this.tags = Array.from(this.filterService.tags.values()).sort((t1, t2) => {
          return t2.name < t1.name ? 1 : -1;
        });
        this.tagsNone = this.filterService.tagsNone;
        this.changeDetector.markForCheck();
      }
    );
  }

  //
  // Actions
  //

  /**
   * Handles click on select-all button
   */
  onSelectAll() {
    this.tags.forEach(t => {
      t.checked = true;
    });
    this.tagsNone = true;
    this.filterService.updateTags(this.tags, false, this.tagsNone);
  }

  /**
   * Handles click on select-none button
   */
  onSelectNone() {
    this.tags.forEach(t => {
      t.checked = false;
    });
    this.tagsNone = false;
    this.filterService.updateTags(this.tags, false, this.tagsNone);
  }

  /**
   * Handles changes of tag-none flag
   */
  onTagNoneFlagChanged() {
    this.filterService.updateTags(this.tags, false, this.tagsNone);
  }
}
