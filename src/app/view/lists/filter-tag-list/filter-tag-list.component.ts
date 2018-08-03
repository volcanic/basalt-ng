import {Component, OnInit} from '@angular/core';
import {FilterService} from '../../../services/filter.service';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs/Subject';
import {Tag} from '../../../model/tag.model';
import {MatchService} from '../../../services/match.service';

@Component({
  selector: 'app-filter-tag-list',
  templateUrl: './filter-tag-list.component.html',
  styleUrls: ['./filter-tag-list.component.scss']
})
export class FilterTagListComponent implements OnInit {

  tags = [];
  tagsNone = false;

  private unsubscribeSubject = new Subject();

  constructor(private filterService: FilterService,
              private matchService: MatchService) {
  }

  ngOnInit() {

    this.initializeTagSubscription();
  }

  selectAll() {
    this.tags.forEach(t => {
      t.checked = true;
    });
    this.tagsNone = true;
    this.filterService.updateTags(this.tags, false, this.tagsNone);
  }

  selectNone() {
    this.tags.forEach(t => {
      t.checked = false;
    });
    this.tagsNone = false;
    this.filterService.updateTags(this.tags, false, this.tagsNone);
  }

  changeSpecialTag(value: boolean) {
    this.filterService.updateTags(this.tags, false, this.tagsNone);
  }

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
      }
    );
  }
}
