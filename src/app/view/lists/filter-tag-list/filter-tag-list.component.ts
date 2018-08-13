import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FilterService} from '../../../services/entities/filter/filter.service';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs/Subject';
import {Tag} from '../../../model/entities/tag.model';
import {MatchService} from '../../../services/entities/filter/match.service';

@Component({
  selector: 'app-filter-tag-list',
  templateUrl: './filter-tag-list.component.html',
  styleUrls: ['./filter-tag-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterTagListComponent implements OnInit {

  tags = [];
  tagsNone = false;

  private unsubscribeSubject = new Subject();

  constructor(private filterService: FilterService,
              private matchService: MatchService,
              private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.initializeTagSubscription();
  }

  //
  // Initialization
  //

  /**
   * Subscribes tag changes
   */
  private initializeTagSubscription() {

    this.tags = Array.from(this.filterService.tags.values()).sort((t1: Tag, t2: Tag) => {
      return this.matchService.compare(t1.name, t2.name);
    });
    this.tagsNone = this.filterService.tagsNone;

    this.filterService.filterSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe(() => {
        this.tags = Array.from(this.filterService.tags.values()).sort((t1: Tag, t2: Tag) => {
          return this.matchService.compare(t1.name, t2.name);
        });
        this.tagsNone = this.filterService.tagsNone;
        this.changeDetector.markForCheck();
      }
    );
  }

  //
  // Actions
  //

  onSelectAll() {
    this.tags.forEach(t => {
      t.checked = true;
    });
    this.tagsNone = true;
    this.filterService.updateTags(this.tags, false, this.tagsNone);
  }

  onSelectNone() {
    this.tags.forEach(t => {
      t.checked = false;
    });
    this.tagsNone = false;
    this.filterService.updateTags(this.tags, false, this.tagsNone);
  }

  onChangeSpecialTag() {
    this.filterService.updateTags(this.tags, false, this.tagsNone);
  }
}
